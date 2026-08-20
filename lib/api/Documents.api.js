import { __awaiter } from "tslib";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
import { originOf, placement } from "./Links.api";
/** Extensions treated as a document when classifying a link. */
export const DOCUMENT_EXTENSIONS = [
    "pdf",
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
const PDF_ESCAPES = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f" };
export function DocumentFiles(webUrl) {
    const site = webUrl !== null && webUrl !== void 0 ? webUrl : "";
    return {
        inLibrary(list, max) {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = (yield throttled(() => getSp(webUrl)
                    .web.lists.getById(list.id)
                    .items.select("Id", "FileLeafRef", "FileRef", "Modified", "File/Length")
                    .expand("File")
                    .top(max)(), { label: "Documents.inLibrary" }));
                return rows
                    .map((row) => {
                    var _a, _b, _c, _d, _e, _f;
                    return ({
                        siteUrl: site,
                        listTitle: list.title,
                        itemId: Number(row.Id),
                        name: String((_a = row.FileLeafRef) !== null && _a !== void 0 ? _a : ""),
                        url: String((_b = row.FileRef) !== null && _b !== void 0 ? _b : ""),
                        extension: extensionOf(String((_c = row.FileLeafRef) !== null && _c !== void 0 ? _c : "")),
                        sizeBytes: Number((_e = (_d = row.File) === null || _d === void 0 ? void 0 : _d.Length) !== null && _e !== void 0 ? _e : 0),
                        modified: String((_f = row.Modified) !== null && _f !== void 0 ? _f : ""),
                    });
                })
                    .filter((file) => file.name.length > 0 && DOCUMENT_EXTENSIONS.indexOf(file.extension) !== -1);
            });
        },
    };
}
export function extensionOf(name) {
    var _a, _b;
    return (_b = (_a = `${name || ""}`.split("?")[0].split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : "";
}
export function documentKindFromName(name) {
    const extension = extensionOf(name);
    if (extension === "docx")
        return "docx";
    if (extension === "pdf")
        return "pdf";
    return "unsupported";
}
export function isScannableDocument(name) {
    return documentKindFromName(name) !== "unsupported";
}
/**
 * Reads every hyperlink out of a document in the browser, with no third party
 * parser. Pass a url to fetch it, or the bytes when they are already to hand.
 */
export function scanDocumentForLinks(source_1) {
    return __awaiter(this, arguments, void 0, function* (source, options = {}) {
        var _a, _b, _c, _d;
        const maxBytes = (_a = options.maxBytes) !== null && _a !== void 0 ? _a : DEFAULT_MAX_BYTES;
        const url = typeof source === "string" ? source : (_b = options.fileName) !== null && _b !== void 0 ? _b : "";
        const result = { url, kind: "unsupported", bytes: 0, links: [] };
        let buffer;
        if (typeof source === "string") {
            if (!isScannableDocument(source)) {
                result.skipped = "Not a docx or pdf";
                return result;
            }
            const response = yield fetch(source, { credentials: "same-origin" });
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
            const declared = Number((_c = response.headers.get("content-length")) !== null && _c !== void 0 ? _c : 0);
            if (declared > maxBytes) {
                result.skipped = `Larger than the ${formatMb(maxBytes)} limit`;
                return result;
            }
            buffer = yield response.arrayBuffer();
        }
        else {
            buffer = source;
        }
        result.bytes = buffer.byteLength;
        if (buffer.byteLength > maxBytes) {
            result.skipped = `Larger than the ${formatMb(maxBytes)} limit`;
            return result;
        }
        result.kind = documentKind(buffer, url);
        if (result.kind === "unsupported") {
            result.skipped = "Not a docx or pdf";
            return result;
        }
        const label = (_d = options.fileName) !== null && _d !== void 0 ? _d : url;
        result.links =
            result.kind === "docx" ? yield extractDocxLinks(buffer, label) : yield extractPdfLinks(buffer, label);
        return result;
    });
}
export function extractDocxLinks(buffer, label) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const entries = readZipEntries(buffer);
        const found = new Map();
        // Hyperlink targets live in the relationship file belonging to each document part.
        for (const entry of entries.filter((candidate) => DOCX_RELS.test(candidate.name))) {
            const part = entry.name.replace("_rels/", "").replace(/\.rels$/, "");
            const labels = yield hyperlinkLabels(buffer, entries, part);
            const xml = parseXml(yield readZipEntry(buffer, entry));
            for (const relationship of tags(xml, "Relationship")) {
                if (!((_a = relationship.getAttribute("Type")) === null || _a === void 0 ? void 0 : _a.endsWith(HYPERLINK_REL)))
                    continue;
                const target = relationship.getAttribute("Target");
                if (!target)
                    continue;
                addLink(found, target, (_c = labels.get((_b = relationship.getAttribute("Id")) !== null && _b !== void 0 ? _b : "")) !== null && _c !== void 0 ? _c : "", label);
            }
        }
        // Urls typed straight into the body are never relationships, so the text is swept too.
        for (const entry of entries.filter((candidate) => DOCX_TEXT_PARTS.test(candidate.name))) {
            const text = (_e = (_d = parseXml(yield readZipEntry(buffer, entry))) === null || _d === void 0 ? void 0 : _d.textContent) !== null && _e !== void 0 ? _e : "";
            ((_f = text.match(BARE_URL)) !== null && _f !== void 0 ? _f : []).forEach((url) => addLink(found, url, "", label));
        }
        return [...found.values()];
    });
}
export function extractPdfLinks(buffer, label) {
    return __awaiter(this, void 0, void 0, function* () {
        const found = new Map();
        // Latin1 keeps one character per byte, so string offsets stay usable as byte offsets.
        const raw = new TextDecoder("latin1").decode(new Uint8Array(buffer));
        collectPdfUris(raw, found, label);
        // Newer writers pack the annotation objects into compressed object streams.
        for (const stream of yield inflatePdfStreams(buffer, raw))
            collectPdfUris(stream, found, label);
        return [...found.values()];
    });
}
function documentKind(buffer, name) {
    const head = new Uint8Array(buffer, 0, Math.min(4, buffer.byteLength));
    if (head[0] === 0x50 && head[1] === 0x4b)
        return "docx";
    if (head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44)
        return "pdf";
    return documentKindFromName(name);
}
function addLink(found, url, text, label) {
    const cleaned = `${url !== null && url !== void 0 ? url : ""}`.trim().replace(/[.,;:]+$/, "");
    if (cleaned.length === 0 || cleaned.startsWith("#") || found.has(cleaned))
        return;
    found.set(cleaned, placement(cleaned, text, { source: "document", sourceLabel: label }, originOf()));
}
function hyperlinkLabels(buffer, entries, part) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const labels = new Map();
        const entry = entries.filter((candidate) => candidate.name === part)[0];
        if (!entry)
            return labels;
        const xml = parseXml(yield readZipEntry(buffer, entry));
        for (const node of tags(xml, "w:hyperlink")) {
            const id = (_a = node.getAttribute("r:id")) !== null && _a !== void 0 ? _a : node.getAttributeNS(RELATIONSHIP_NS, "id");
            if (id)
                labels.set(id, (_c = (_b = node.textContent) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "");
        }
        return labels;
    });
}
function collectPdfUris(source, found, label) {
    PDF_URI.lastIndex = 0;
    let match = PDF_URI.exec(source);
    while (match) {
        addLink(found, unescapePdfString(match[1]), "", label);
        match = PDF_URI.exec(source);
    }
}
function inflatePdfStreams(buffer, raw) {
    return __awaiter(this, void 0, void 0, function* () {
        const bytes = new Uint8Array(buffer);
        const streams = [];
        PDF_FLATE_STREAM.lastIndex = 0;
        let match = PDF_FLATE_STREAM.exec(raw);
        while (match && streams.length < MAX_PDF_STREAMS) {
            const start = match.index + match[0].length;
            const end = raw.indexOf("endstream", start);
            if (end > start) {
                try {
                    streams.push(decodeText(yield inflate(bytes.slice(start, end))));
                }
                catch (_a) {
                    // Not every match is a real stream, so a failure just means skip it.
                }
            }
            match = PDF_FLATE_STREAM.exec(raw);
        }
        return streams;
    });
}
function unescapePdfString(value) {
    return value.replace(/\\(.)/g, (all, char) => { var _a; return (_a = PDF_ESCAPES[char]) !== null && _a !== void 0 ? _a : char; });
}
function readZipEntries(buffer) {
    const view = new DataView(buffer);
    const directory = findCentralDirectory(view);
    if (directory < 0)
        throw new Error("File is not a zip archive");
    const count = view.getUint16(directory + 10, true);
    const entries = [];
    let offset = view.getUint32(directory + 16, true);
    for (let index = 0; index < count; index = index + 1) {
        if (offset + 46 > view.byteLength)
            break;
        if (view.getUint32(offset, true) !== ZIP_CENTRAL)
            break;
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
function findCentralDirectory(view) {
    const limit = Math.max(0, view.byteLength - 0xffff - 22);
    for (let offset = view.byteLength - 22; offset >= limit; offset = offset - 1) {
        if (view.getUint32(offset, true) === ZIP_EOCD)
            return offset;
    }
    return -1;
}
function readZipEntry(buffer, entry) {
    return __awaiter(this, void 0, void 0, function* () {
        const view = new DataView(buffer);
        if (view.getUint32(entry.localOffset, true) !== ZIP_LOCAL)
            return "";
        // The local header repeats the name and extra field lengths, and they can differ
        // from the central directory copy, so the data offset is worked out from here.
        const nameLength = view.getUint16(entry.localOffset + 26, true);
        const extraLength = view.getUint16(entry.localOffset + 28, true);
        const start = entry.localOffset + 30 + nameLength + extraLength;
        const bytes = new Uint8Array(buffer, start, entry.compressedSize);
        if (entry.method === 0)
            return decodeText(bytes);
        if (entry.method !== 8)
            throw new Error(`Unsupported zip compression method ${entry.method}`);
        return decodeText(yield inflate(bytes, "deflate-raw"));
    });
}
function inflate(bytes_1) {
    return __awaiter(this, arguments, void 0, function* (bytes, format = "deflate") {
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(format));
        return new Uint8Array(yield new Response(stream).arrayBuffer());
    });
}
function decodeText(bytes) {
    return new TextDecoder().decode(bytes);
}
function parseXml(xml) {
    if (!xml)
        return undefined;
    return new DOMParser().parseFromString(xml, "application/xml");
}
function tags(document, name) {
    if (!document)
        return [];
    return Array.from(document.getElementsByTagName(name));
}
function formatMb(bytes) {
    return `${Math.round(bytes / 1024 / 1024)}MB`;
}
//# sourceMappingURL=Documents.api.js.map