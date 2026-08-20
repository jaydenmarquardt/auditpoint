import "@pnp/sp/attachments";
import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { SiteList } from "@/api/Lists.types";
import { LinkPlacement } from "@/api/Links.types";
import { LinkScanner, originOf, placement } from "@/api/Links.api";
import { DocumentFile, DocumentKind, DocumentScan, DocumentScanOptions } from "@/api/Documents.types";

/** Extensions treated as a document when classifying a link. */
export const DOCUMENT_EXTENSIONS = [
  "pdf",
  "html",
  "htm",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "csv",
  "zip",
  "msg",
  "vsd",
  "vsdx",
  "one",
];

const DEFAULT_MAX_BYTES = 12 * 1024 * 1024;
// A malformed file can look like thousands of streams, so the pdf sweep is bounded.
const MAX_PDF_STREAMS = 500;

const ZIP_EOCD = 0x06054b50;
const ZIP_CENTRAL = 0x02014b50;
const ZIP_LOCAL = 0x04034b50;

const RELATIONSHIP_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const HYPERLINK_REL = "/relationships/hyperlink";
const DOCX_RELS = /^word\/_rels\/.+\.rels$/;
const DOCX_TEXT_PARTS = /^word\/(document|header\d*|footer\d*|footnotes|endnotes)\.xml$/;

const BARE_URL = /(https?:\/\/[^\s<>"'()[\]{}]+|mailto:[^\s<>"'()[\]{}]+)/gi;
const PDF_URI = /\/URI\s*\(((?:\\.|[^\\)])*)\)/g;
const PDF_FLATE_STREAM = /\/FlateDecode[\s\S]{0,512}?stream\r?\n/g;
const PDF_ESCAPES: Record<string, string> = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f" };

interface FileRow {
  Id: number;
  FileLeafRef?: string;
  FileRef?: string;
  Modified?: string;
  File?: { Length?: string | number };
}

export function DocumentFiles(webUrl?: string): {
  inLibrary(list: SiteList, max: number): Promise<DocumentFile[]>;
} {
  const site = webUrl ?? "";

  return {
    async inLibrary(list: SiteList, max: number): Promise<DocumentFile[]> {
      const rows = (await throttled(
        () =>
          getSp(webUrl)
            .web.lists.getById(list.id)
            .items.select("Id", "FileLeafRef", "FileRef", "Modified", "File/Length")
            .expand("File")
            .top(max)(),
        { label: "Documents.inLibrary" }
      )) as FileRow[];

      return rows
        .map((row) => ({
          siteUrl: site,
          listTitle: list.title,
          itemId: Number(row.Id),
          name: String(row.FileLeafRef ?? ""),
          url: String(row.FileRef ?? ""),
          extension: extensionOf(String(row.FileLeafRef ?? "")),
          sizeBytes: Number(row.File?.Length ?? 0),
          modified: String(row.Modified ?? ""),
        }))
        .filter((file) => file.name.length > 0 && DOCUMENT_EXTENSIONS.indexOf(file.extension) !== -1);
    },
  };
}

interface AttachmentRow {
  FileName: string;
  ServerRelativeUrl: string;
}

interface AttachmentItemRow {
  Id: number;
  Title?: string;
  FileRef?: string;
  Modified?: string;
}

export function ItemAttachments(webUrl?: string): {
  inList(list: SiteList, max: number): Promise<DocumentFile[]>;
} {
  const site = webUrl ?? "";

  return {
    /**
     * Attachments hang off list items rather than a library, so they are read per
     * item. Only items flagged as having one are asked for, which keeps a list of
     * thousands to a handful of requests.
     */
    async inList(list: SiteList, max: number): Promise<DocumentFile[]> {
      const items = (await throttled(
        () =>
          getSp(webUrl)
            .web.lists.getById(list.id)
            .items.select("Id", "Title", "FileRef", "Modified")
            .filter("Attachments eq 1")
            .top(max)(),
        { label: "Attachments.items" }
      )) as AttachmentItemRow[];

      const files = await Promise.all(
        items.map(async (item) => {
          const attachments = (await throttled(
            () => getSp(webUrl).web.lists.getById(list.id).items.getById(item.Id).attachmentFiles(),
            { label: "Attachments.files" }
          )) as AttachmentRow[];

          return attachments.map((attachment) => ({
            siteUrl: site,
            listTitle: list.title,
            itemId: item.Id,
            name: attachment.FileName,
            url: attachment.ServerRelativeUrl,
            extension: extensionOf(attachment.FileName),
            sizeBytes: 0,
            modified: String(item.Modified ?? ""),
          }));
        })
      );

      return files.flat();
    },
  };
}

export function extensionOf(name: string): string {
  return `${name || ""}`.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
}

export function documentKindFromName(name: string): DocumentKind {
  const extension = extensionOf(name);
  if (extension === "docx") return "docx";
  if (extension === "pdf") return "pdf";
  if (extension === "html" || extension === "htm") return "html";
  return "unsupported";
}

export function isScannableDocument(name: string): boolean {
  return documentKindFromName(name) !== "unsupported";
}

/**
 * Reads every hyperlink out of a document in the browser, with no third party
 * parser. Pass a url to fetch it, or the bytes when they are already to hand.
 */
export async function scanDocumentForLinks(
  source: string | ArrayBuffer,
  options: DocumentScanOptions = {}
): Promise<DocumentScan> {
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const url = typeof source === "string" ? source : options.fileName ?? "";
  const result: DocumentScan = { url, kind: "unsupported", bytes: 0, links: [] };

  let buffer: ArrayBuffer;

  if (typeof source === "string") {
    if (!isScannableDocument(source)) {
      result.skipped = "Not a docx, pdf or html file";
      return result;
    }

    const response = await fetch(source, { credentials: "same-origin" });
    result.status = response.status;

    // A file request answers with a status rather than throwing, so a throttle is
    // re-raised for the layer that owns the backoff.
    if (response.status === 429 || response.status === 503) {
      throw Object.assign(new Error(`Throttled (${response.status})`), {
        status: response.status,
        headers: response.headers,
      });
    }

    if (!response.ok) {
      result.skipped = `Request failed (${response.status})`;
      return result;
    }

    const declared = Number(response.headers.get("content-length") ?? 0);
    if (declared > maxBytes) {
      result.skipped = `Larger than the ${formatMb(maxBytes)} limit`;
      return result;
    }

    buffer = await response.arrayBuffer();
  } else {
    buffer = source;
  }

  result.bytes = buffer.byteLength;
  if (buffer.byteLength > maxBytes) {
    result.skipped = `Larger than the ${formatMb(maxBytes)} limit`;
    return result;
  }

  result.kind = documentKind(buffer, url);
  if (result.kind === "unsupported") {
    result.skipped = "Not a docx, pdf or html file";
    return result;
  }

  const label = options.fileName ?? url;

  if (result.kind === "html") {
    // An html file is markup, so it is read with the same anchor scan as a page.
    result.links = LinkScanner().fromHtml(new TextDecoder().decode(new Uint8Array(buffer)), {
      source: "document",
      sourceLabel: label,
    });
    return result;
  }

  result.links =
    result.kind === "docx" ? await extractDocxLinks(buffer, label) : await extractPdfLinks(buffer, label);

  return result;
}

export async function extractDocxLinks(buffer: ArrayBuffer, label: string): Promise<LinkPlacement[]> {
  const entries = readZipEntries(buffer);
  const found = new Map<string, LinkPlacement>();

  // Hyperlink targets live in the relationship file belonging to each document part.
  for (const entry of entries.filter((candidate) => DOCX_RELS.test(candidate.name))) {
    const part = entry.name.replace("_rels/", "").replace(/\.rels$/, "");
    const labels = await hyperlinkLabels(buffer, entries, part);
    const xml = parseXml(await readZipEntry(buffer, entry));

    for (const relationship of tags(xml, "Relationship")) {
      if (!relationship.getAttribute("Type")?.endsWith(HYPERLINK_REL)) continue;

      const target = relationship.getAttribute("Target");
      if (!target) continue;

      addLink(found, target, labels.get(relationship.getAttribute("Id") ?? "") ?? "", label);
    }
  }

  // Urls typed straight into the body are never relationships, so the text is swept too.
  for (const entry of entries.filter((candidate) => DOCX_TEXT_PARTS.test(candidate.name))) {
    const text = parseXml(await readZipEntry(buffer, entry))?.textContent ?? "";
    (text.match(BARE_URL) ?? []).forEach((url) => addLink(found, url, "", label));
  }

  return [...found.values()];
}

export async function extractPdfLinks(buffer: ArrayBuffer, label: string): Promise<LinkPlacement[]> {
  const found = new Map<string, LinkPlacement>();
  // Latin1 keeps one character per byte, so string offsets stay usable as byte offsets.
  const raw = new TextDecoder("latin1").decode(new Uint8Array(buffer));

  collectPdfUris(raw, found, label);
  // Newer writers pack the annotation objects into compressed object streams.
  for (const stream of await inflatePdfStreams(buffer, raw)) collectPdfUris(stream, found, label);

  return [...found.values()];
}

function documentKind(buffer: ArrayBuffer, name: string): DocumentKind {
  const head = new Uint8Array(buffer, 0, Math.min(4, buffer.byteLength));
  if (head[0] === 0x50 && head[1] === 0x4b) return "docx";
  if (head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44) return "pdf";
  return documentKindFromName(name);
}

function addLink(found: Map<string, LinkPlacement>, url: string, text: string, label: string): void {
  const cleaned = `${url ?? ""}`.trim().replace(/[.,;:]+$/, "");
  if (cleaned.length === 0 || cleaned.startsWith("#") || found.has(cleaned)) return;

  found.set(cleaned, placement(cleaned, text, { source: "document", sourceLabel: label }, originOf()));
}

async function hyperlinkLabels(
  buffer: ArrayBuffer,
  entries: ZipEntry[],
  part: string
): Promise<Map<string, string>> {
  const labels = new Map<string, string>();
  const entry = entries.filter((candidate) => candidate.name === part)[0];
  if (!entry) return labels;

  const xml = parseXml(await readZipEntry(buffer, entry));

  for (const node of tags(xml, "w:hyperlink")) {
    const id = node.getAttribute("r:id") ?? node.getAttributeNS(RELATIONSHIP_NS, "id");
    if (id) labels.set(id, node.textContent?.trim() ?? "");
  }

  return labels;
}

function collectPdfUris(source: string, found: Map<string, LinkPlacement>, label: string): void {
  PDF_URI.lastIndex = 0;
  let match = PDF_URI.exec(source);

  while (match) {
    addLink(found, unescapePdfString(match[1]), "", label);
    match = PDF_URI.exec(source);
  }
}

async function inflatePdfStreams(buffer: ArrayBuffer, raw: string): Promise<string[]> {
  const bytes = new Uint8Array(buffer);
  const streams: string[] = [];

  PDF_FLATE_STREAM.lastIndex = 0;
  let match = PDF_FLATE_STREAM.exec(raw);

  while (match && streams.length < MAX_PDF_STREAMS) {
    const start = match.index + match[0].length;
    const end = raw.indexOf("endstream", start);

    if (end > start) {
      try {
        streams.push(decodeText(await inflate(bytes.slice(start, end))));
      } catch {
        // Not every match is a real stream, so a failure just means skip it.
      }
    }

    match = PDF_FLATE_STREAM.exec(raw);
  }

  return streams;
}

function unescapePdfString(value: string): string {
  return value.replace(/\\(.)/g, (all, char: string) => PDF_ESCAPES[char] ?? char);
}

interface ZipEntry {
  name: string;
  method: number;
  compressedSize: number;
  localOffset: number;
}

function readZipEntries(buffer: ArrayBuffer): ZipEntry[] {
  const view = new DataView(buffer);
  const directory = findCentralDirectory(view);
  if (directory < 0) throw new Error("File is not a zip archive");

  const count = view.getUint16(directory + 10, true);
  const entries: ZipEntry[] = [];
  let offset = view.getUint32(directory + 16, true);

  for (let index = 0; index < count; index = index + 1) {
    if (offset + 46 > view.byteLength) break;
    if (view.getUint32(offset, true) !== ZIP_CENTRAL) break;

    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);

    entries.push({
      name: decodeText(new Uint8Array(buffer, offset + 46, nameLength)),
      method: view.getUint16(offset + 10, true),
      compressedSize: view.getUint32(offset + 20, true),
      localOffset: view.getUint32(offset + 42, true),
    });

    offset = offset + 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

/** The trailing comment is variable length, so the record is found by scanning back. */
function findCentralDirectory(view: DataView): number {
  const limit = Math.max(0, view.byteLength - 0xffff - 22);

  for (let offset = view.byteLength - 22; offset >= limit; offset = offset - 1) {
    if (view.getUint32(offset, true) === ZIP_EOCD) return offset;
  }

  return -1;
}

async function readZipEntry(buffer: ArrayBuffer, entry: ZipEntry): Promise<string> {
  const view = new DataView(buffer);
  if (view.getUint32(entry.localOffset, true) !== ZIP_LOCAL) return "";

  // The local header repeats the name and extra field lengths, and they can differ
  // from the central directory copy, so the data offset is worked out from here.
  const nameLength = view.getUint16(entry.localOffset + 26, true);
  const extraLength = view.getUint16(entry.localOffset + 28, true);
  const start = entry.localOffset + 30 + nameLength + extraLength;
  const bytes = new Uint8Array(buffer, start, entry.compressedSize);

  if (entry.method === 0) return decodeText(bytes);
  if (entry.method !== 8) throw new Error(`Unsupported zip compression method ${entry.method}`);

  return decodeText(await inflate(bytes, "deflate-raw"));
}

async function inflate(bytes: Uint8Array, format: "deflate" | "deflate-raw" = "deflate"): Promise<Uint8Array> {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(format));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function decodeText(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

function parseXml(xml: string): Document | undefined {
  if (!xml) return undefined;
  return new DOMParser().parseFromString(xml, "application/xml");
}

function tags(document: Document | undefined, name: string): Element[] {
  if (!document) return [];
  return Array.from(document.getElementsByTagName(name));
}

function formatMb(bytes: number): string {
  return `${Math.round(bytes / 1024 / 1024)}MB`;
}
