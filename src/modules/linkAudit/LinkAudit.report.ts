import { SiteLists } from "@/api/Lists.api";
import { PageCanvas } from "@/api/WebParts.api";
import { ContentSource } from "@/api/Content.api";
import { DocumentFiles, ItemAttachments, scanDocumentForLinks } from "@/api/Documents.api";
import { ConfigFiles, splitPaths } from "@/api/ConfigFiles.api";
import { LinkChecker, LinkScanner, originOf } from "@/api/Links.api";
import { SiteNavigation } from "@/api/Navigation.api";
import { LinkPlacement } from "@/api/Links.types";
import { ReportDefinition, StageContext } from "@/core/report/Report.types";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import {
  applyBrokenResults,
  brokenCheckCandidates,
  classifyReferences,
  indexReferences,
  legacyHostsOf,
} from "@/modules/linkAudit/LinkAudit.logic";
import {
  LinkAuditConfig,
  LinkAuditData,
  OutgoingLink,
  Reference,
  ReferenceKind,
} from "@/modules/linkAudit/LinkAudit.types";
import { toErrorMessage } from "@/utils/Guard.util";

export const LINK_AUDIT_KIND = "link-audit";

/** A large pdf parse blocks the main thread, so files are read two at a time. */
const DOCUMENT_CONCURRENCY = 2;
/** Checks run against this tenancy only, so a small pool is plenty and stays polite. */
const BROKEN_CHECK_BATCH = 4;

export const linkAuditReport: ReportDefinition<LinkAuditData, LinkAuditConfig> = {
  kind: LINK_AUDIT_KIND,
  title: LinkAuditContent.title,
  description: LinkAuditContent.description,
  iconName: "Link",
  version: "1.0.0",
  schemaVersion: 1,

  defaultConfig: {
    maxPages: 5000,
    scanWebParts: true,
    scanListItems: true,
    columnNames: "Body,PageBody,Description,Comments,Content",
    autoDetectColumns: true,
    maxItemsPerList: 5000,
    maxLists: 100,
    scanNavigation: true,
    scanAttachments: false,
    configPaths: "",
    megaMenuPath: "",
    includeDocuments: true,
    maxFilesPerLibrary: 5000,
    scanDocx: false,
    scanPdf: false,
    scanHtmlFiles: true,
    maxDocumentMb: 12,
    checkBrokenLinks: false,
    legacyHosts: "",
  },

  configFields: [
    {
      key: "maxPages",
      label: "Maximum pages per site",
      type: "number",
      min: 10,
      max: 20000,
      step: 50,
      description: "Pages are read in one request, then parsed for links locally.",
    },
    {
      key: "scanWebParts",
      label: "Scan web part properties",
      type: "toggle",
      description: "Finds links saved in web part settings, such as a quick links or hero tile.",
    },
    {
      key: "scanListItems",
      label: "Scan rich text columns on lists",
      type: "toggle",
      description: "Reads list items carrying HTML, such as an event description or a news body.",
    },
    {
      key: "autoDetectColumns",
      label: "Detect rich text columns automatically",
      type: "toggle",
      description: "Reads each list's fields rather than relying on column names alone.",
    },
    {
      key: "columnNames",
      label: "Column names to include",
      type: "text",
      description: "Comma separated internal names, always checked when present on the list.",
    },
    {
      key: "maxItemsPerList",
      label: "Maximum items per list",
      type: "number",
      min: 50,
      max: 5000,
      step: 50,
      description: "Caps how many items are read from each list carrying rich text.",
    },
    {
      key: "maxLists",
      label: "Maximum lists per site",
      type: "number",
      min: 5,
      max: 500,
      step: 5,
      description: "Upper bound on lists inspected for rich text columns and documents.",
    },
    {
      key: "scanNavigation",
      label: "Scan navigation menus",
      type: "toggle",
      description: "Adds the quick launch and top navigation as one item, so menu links resolve like any other.",
    },
    {
      key: "scanAttachments",
      label: "Scan list item attachments",
      type: "toggle",
      description:
        "Reads the attachments hanging off list items, so a link inside an attached document counts like any other.",
    },
    {
      key: "configPaths",
      label: "Configuration files to scan",
      type: "text",
      description:
        "Comma separated server relative paths to JSON files, such as /sites/intranet/SiteAssets/config.json. Every url shaped value inside is read as a link.",
    },
    {
      key: "megaMenuPath",
      label: "Mega menu configuration file",
      type: "text",
      description:
        "Server relative path to a config file holding a megamenu.items tree. Its links are read with the trail through the menu as the label.",
    },
    {
      key: "includeDocuments",
      label: "Inventory documents in libraries",
      type: "toggle",
      description: "Needed for links that point at a file to resolve to something.",
    },
    {
      key: "maxFilesPerLibrary",
      label: "Maximum files per library",
      type: "number",
      min: 100,
      max: 20000,
      step: 100,
      description: "Caps how many files are read from each library before moving on.",
    },
    {
      key: "scanDocx",
      label: "Read links inside Word files",
      type: "toggle",
      description: "Downloads each .docx and reads its hyperlinks in the browser. Slow on a large library.",
    },
    {
      key: "scanPdf",
      label: "Read links inside PDF files",
      type: "toggle",
      description: "Downloads each .pdf and reads its link annotations in the browser. Slow on a large library.",
    },
    {
      key: "scanHtmlFiles",
      label: "Read links inside .html and .htm files",
      type: "toggle",
      description:
        "Reads html files held in libraries or attached to items, which is where a migrated page usually ends up.",
    },
    {
      key: "maxDocumentMb",
      label: "Skip documents larger than (MB)",
      type: "number",
      min: 1,
      max: 100,
      step: 1,
      description: "Files above this size are recorded as skipped rather than downloaded.",
    },
    {
      key: "checkBrokenLinks",
      label: "Request unresolved links on this tenancy",
      type: "toggle",
      description:
        "Asks the server for every link that matched nothing, to tell a typo from a page that simply was not scanned. External links cannot be tested from the browser.",
    },
    {
      key: "legacyHosts",
      label: "Retired hosts",
      type: "text",
      description:
        "Comma separated hosts that have been switched off, such as an old intranet. Every link to one is reported as broken without being requested.",
    },
  ],

  stages: [
    {
      key: "pages",
      label: "Read links on pages",
      async run(context) {
        const scanner = LinkScanner(context.siteUrl);
        const source = ContentSource(context.siteUrl);
        const canvas = PageCanvas(context.siteUrl);
        const pages = await canvas.getPages(context.config.maxPages);

        const references = keep(context, "page");

        pages.forEach((page) => {
          const links: LinkPlacement[] = scanner.fromHtml(source.pageHtml(page), {
            source: "content",
            sourceLabel: "",
          });

          if (context.config.scanWebParts) {
            canvas.parse(page, context.siteUrl, true).instances.forEach((instance) =>
              links.push(
                ...scanner.fromProperties(instance.properties, {
                  source: "webpart",
                  sourceLabel: instance.title || instance.name,
                })
              )
            );
          }

          references.push({
            key: `${context.siteUrl}|Site Pages|${page.id}`,
            siteUrl: context.siteUrl,
            kind: "page",
            listTitle: "Site Pages",
            title: page.title || page.fileName,
            url: page.serverRelativeUrl,
            itemId: page.id,
            modified: page.modified,
            scanned: true,
            outgoing: links.map(toOutgoing),
            incoming: [],
            brokenCount: 0,
          });
        });

        context.data.references = references;
        context.data.scannedSites = [...new Set([...(context.data.scannedSites ?? []), context.siteUrl])];
        context.progress(pages.length, pages.length);
      },
    },

    {
      key: "items",
      label: "Read links in list content",
      async run(context) {
        if (!context.config.scanListItems) {
          context.progress(0, 0);
          return;
        }

        const scanner = LinkScanner(context.siteUrl);
        const source = ContentSource(context.siteUrl);
        const named = splitNames(context.config.columnNames);

        const lists = (await SiteLists(context.siteUrl).getAll(false))
          .filter((list) => list.title !== "Site Pages" && list.itemCount > 0)
          .slice(0, context.config.maxLists);

        const start = typeof context.cursor === "number" ? context.cursor : 0;
        const references = start === 0 ? keep(context, "item") : context.data.references ?? [];
        const columnsSeen = new Set(context.data.columnsScanned ?? []);

        for (let index = start; index < lists.length; index = index + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            context.data.references = references;
            return;
          }

          const list = lists[index];

          try {
            const available = new Set(await source.fieldNames(list));
            const detected = context.config.autoDetectColumns
              ? (await source.richTextColumns(list)).map((column) => column.internalName)
              : [];

            const columns = [...new Set([...named, ...detected])].filter((column) => available.has(column));

            if (columns.length > 0) {
              const records = await source.items(list, columns, context.config.maxItemsPerList);
              const byItem = new Map<string, Reference>();

              records.forEach((record) => {
                columnsSeen.add(record.column);
                const key = `${context.siteUrl}|${record.listTitle}|${record.itemId}`;
                let reference = byItem.get(key);

                if (!reference) {
                  reference = {
                    key,
                    siteUrl: context.siteUrl,
                    kind: "item",
                    listTitle: record.listTitle,
                    title: record.title,
                    url: record.url,
                    itemId: record.itemId,
                    modified: record.modified,
                    scanned: true,
                    outgoing: [],
                    incoming: [],
                    brokenCount: 0,
                  };
                  byItem.set(key, reference);
                }

                // One item can carry several rich text columns, so the column names the placement.
                reference.outgoing.push(
                  ...scanner
                    .fromHtml(record.html, { source: "content", sourceLabel: record.column })
                    .map(toOutgoing)
                );
              });

              references.push(...byItem.values());
            }
          } catch (error) {
            context.issue({ target: list.title, code: statusOf(error) ?? "error", message: toErrorMessage(error) });
          }

          context.setCursor(index + 1);
          context.progress(index + 1, lists.length);
        }

        context.data.references = references;
        context.data.columnsScanned = [...columnsSeen];
      },
    },

    {
      key: "navigation",
      label: "Read links in navigation",
      async run(context) {
        if (!context.config.scanNavigation) {
          context.progress(0, 0);
          return;
        }

        const scanner = LinkScanner(context.siteUrl);
        const references = keep(context, "navigation");
        const links = await SiteNavigation(context.siteUrl).links();

        references.push({
          key: `${context.siteUrl}|navigation`,
          siteUrl: context.siteUrl,
          kind: "navigation",
          listTitle: LinkAuditContent.navigationList,
          title: LinkAuditContent.navigationTitle,
          // Navigation has no page of its own, so nothing can ever link to it.
          url: "",
          itemId: 0,
          modified: "",
          scanned: true,
          outgoing: links.map((link) =>
            toOutgoing(
              scanner.fromUrl(link.url, link.text, {
                source: "navigation",
                sourceLabel: `${link.menu} > ${link.path}`,
              })
            )
          ),
          incoming: [],
          brokenCount: 0,
        });

        context.data.references = references;
        context.progress(links.length, links.length);
      },
    },

    {
      key: "config",
      label: "Read links in configuration files",
      async run(context) {
        const paths = splitPaths(context.config.configPaths);
        const menuPath = context.config.megaMenuPath.trim();
        const all = [...paths, ...(menuPath ? [menuPath] : [])];

        if (all.length === 0) {
          context.progress(0, 0);
          return;
        }

        const files = ConfigFiles(context.siteUrl);
        const references = keep(context, "config").filter(
          (reference) => !(reference.siteUrl === context.siteUrl && reference.kind === "megamenu")
        );

        for (let index = 0; index < all.length; index = index + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) break;

          const path = all[index];
          const name = path.split("/").pop() ?? path;

          try {
            const json = await files.read(path);
            const isMenu = path === menuPath;
            const menuLinks = isMenu ? files.megaMenuLinks(json, name) : [];

            references.push({
              key: `${context.siteUrl}|config|${path}`,
              siteUrl: context.siteUrl,
              // A menu is its own kind of source, so it reads as one in the table.
              kind: isMenu && menuLinks.length > 0 ? "megamenu" : "config",
              listTitle: isMenu && menuLinks.length > 0 ? LinkAuditContent.megaMenuList : LinkAuditContent.configList,
              title: name,
              // The file has a url of its own, so a link to it still resolves.
              url: path,
              itemId: 0,
              modified: "",
              fileUrl: path,
              scanned: true,
              outgoing: [...menuLinks, ...files.links(json, name)].map(toOutgoing),
              incoming: [],
              brokenCount: 0,
            });
          } catch (error) {
            context.issue({ target: path, code: statusOf(error) ?? "error", message: toErrorMessage(error) });
          }

          context.progress(index + 1, all.length);
        }

        context.data.references = references;
      },
    },

    {
      key: "attachments",
      label: "Inventory item attachments",
      async run(context) {
        if (!context.config.scanAttachments) {
          context.progress(0, 0);
          return;
        }

        const lists = (await SiteLists(context.siteUrl).getAll(false))
          .filter((list) => list.kind === "list" && list.itemCount > 0)
          .slice(0, context.config.maxLists);

        const start = typeof context.cursor === "number" ? context.cursor : 0;
        const references = start === 0 ? keep(context, "attachment") : context.data.references ?? [];

        for (let index = start; index < lists.length; index = index + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            context.data.references = references;
            return;
          }

          const list = lists[index];

          try {
            const files = await ItemAttachments(context.siteUrl).inList(list, context.config.maxItemsPerList);

            files.forEach((file) =>
              references.push({
                key: `${context.siteUrl}|${file.listTitle}|${file.itemId}|${file.name}`,
                siteUrl: context.siteUrl,
                kind: "attachment",
                listTitle: file.listTitle,
                title: file.name,
                url: file.url,
                itemId: file.itemId,
                modified: file.modified,
                fileUrl: file.url,
                extension: file.extension,
                sizeBytes: file.sizeBytes,
                // An attachment is a link target until its content has been read.
                scanned: false,
                outgoing: [],
                incoming: [],
                brokenCount: 0,
              })
            );
          } catch (error) {
            context.issue({ target: list.title, code: statusOf(error) ?? "error", message: toErrorMessage(error) });
          }

          context.setCursor(index + 1);
          context.progress(index + 1, lists.length);
        }

        context.data.references = references;
      },
    },

    {
      key: "documents",
      label: "Inventory documents",
      async run(context) {
        if (!context.config.includeDocuments) {
          context.progress(0, 0);
          return;
        }

        const libraries = (await SiteLists(context.siteUrl).getAll(false))
          .filter((list) => list.kind === "library" && list.itemCount > 0)
          .slice(0, context.config.maxLists);

        const start = typeof context.cursor === "number" ? context.cursor : 0;
        const references = start === 0 ? keep(context, "document") : context.data.references ?? [];

        for (let index = start; index < libraries.length; index = index + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            context.data.references = references;
            return;
          }

          const library = libraries[index];

          try {
            const files = await DocumentFiles(context.siteUrl).inLibrary(library, context.config.maxFilesPerLibrary);

            files.forEach((file) =>
              references.push({
                key: `${context.siteUrl}|${file.listTitle}|${file.itemId}`,
                siteUrl: context.siteUrl,
                kind: "document",
                listTitle: file.listTitle,
                title: file.name,
                url: file.url,
                itemId: file.itemId,
                modified: file.modified,
                fileUrl: file.url,
                extension: file.extension,
                sizeBytes: file.sizeBytes,
                // A file is a link target until its content has been read.
                scanned: false,
                outgoing: [],
                incoming: [],
                brokenCount: 0,
              })
            );
          } catch (error) {
            context.issue({
              target: library.title,
              code: statusOf(error) ?? "error",
              message: toErrorMessage(error),
            });
          }

          context.setCursor(index + 1);
          context.progress(index + 1, libraries.length);
        }

        context.data.references = references;
      },
    },

    {
      key: "files",
      label: "Read links inside documents",
      async run(context) {
        const kinds = [
          context.config.scanDocx ? "docx" : "",
          context.config.scanPdf ? "pdf" : "",
          ...(context.config.scanHtmlFiles ? ["html", "htm"] : []),
        ].filter(Boolean);

        if (kinds.length === 0) {
          context.progress(0, 0);
          return;
        }

        const references = context.data.references ?? [];
        const targets = references.filter(
          (reference) =>
            reference.siteUrl === context.siteUrl &&
            (reference.kind === "document" || reference.kind === "attachment") &&
            kinds.indexOf(reference.extension ?? "") !== -1 &&
            !reference.documentScanned
        );

        const maxBytes = context.config.maxDocumentMb * 1024 * 1024;
        const start = typeof context.cursor === "number" ? context.cursor : 0;

        for (let index = start; index < targets.length; index = index + DOCUMENT_CONCURRENCY) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            context.data.references = references;
            return;
          }

          const batch = targets.slice(index, index + DOCUMENT_CONCURRENCY);

          await Promise.all(
            batch.map(async (reference) => {
              try {
                const scan = await scanDocumentForLinks(reference.fileUrl ?? reference.url, {
                  maxBytes,
                  fileName: reference.title,
                });

                reference.documentScanned = true;
                reference.scanned = true;
                reference.skipped = scan.skipped;
                reference.outgoing.push(
                  ...scan.links
                    .map((link) => ({
                      ...link,
                      // The placement says where it came from, and an attachment is
                      // not the same thing as a document in a library.
                      source: reference.kind === "attachment" ? ("attachment" as const) : link.source,
                    }))
                    .map(toOutgoing)
                );
              } catch (error) {
                context.issue({
                  target: reference.title,
                  code: statusOf(error) ?? "error",
                  message: toErrorMessage(error),
                });
              }
            })
          );

          // Parsing holds the main thread, so the browser gets a turn between batches.
          await new Promise((resolve) => setTimeout(resolve, 0));

          context.setCursor(index + DOCUMENT_CONCURRENCY);
          context.progress(Math.min(index + DOCUMENT_CONCURRENCY, targets.length), targets.length);
        }

        context.data.references = references;
      },
    },

    {
      key: "resolve",
      label: "Resolve and classify links",
      async run(context) {
        const references = context.data.references ?? [];

        // Index first: a link that matched a real item is known good, which the
        // classification then reads when it settles the resting broken state.
        indexReferences(references);
        classifyReferences(references, {
          origin: originOf(context.siteUrl),
          sitePath: sitePathOf(context.siteUrl),
          legacyHosts: legacyHostsOf(context.config),
        });

        context.data.references = references;
        context.log(
          `${references.length} items, ${references.reduce((total, reference) => total + reference.outgoing.length, 0)} links`
        );
        context.progress(references.length, references.length);
      },
    },

    {
      key: "broken",
      label: "Check unresolved links",
      async run(context) {
        if (!context.config.checkBrokenLinks) {
          context.progress(0, 0);
          return;
        }

        const references = context.data.references ?? [];
        const urls = brokenCheckCandidates(references);
        const checker = LinkChecker();
        const results = new Map<string, number>();
        const start = typeof context.cursor === "number" ? context.cursor : 0;

        for (let index = start; index < urls.length; index = index + BROKEN_CHECK_BATCH) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            applyBrokenResults(references, results);
            context.data.references = references;
            return;
          }

          const batch = urls.slice(index, index + BROKEN_CHECK_BATCH);
          const checks = await Promise.all(batch.map((url) => checker.check(url)));
          checks.forEach((check) => results.set(check.url, check.status));

          context.setCursor(index + BROKEN_CHECK_BATCH);
          context.progress(Math.min(index + BROKEN_CHECK_BATCH, urls.length), urls.length);
        }

        const broken = applyBrokenResults(references, results);
        context.data.references = references;
        context.data.checkedUrls = (context.data.checkedUrls ?? 0) + results.size;
        context.log(`${results.size} urls requested, ${broken} broken`);
      },
    },

    {
      key: "summarise",
      label: "Summarise",
      async run(context) {
        const references = context.data.references ?? [];
        const links = references.flatMap((reference) => reference.outgoing ?? []);

        context.log(
          `${links.filter((link) => link.broken === "yes").length} broken, ${
            links.filter((link) => link.broken === "unsure").length
          } untested`
        );
        context.progress(references.length, references.length);
      },
    },
  ],
};

/**
 * A stage that restarts rather than resumes would otherwise add its references a
 * second time, so anything it owns for this site is dropped before it runs.
 */
function keep(context: StageContext<LinkAuditData, LinkAuditConfig>, kind: ReferenceKind): Reference[] {
  return (context.data.references ?? []).filter(
    (reference) => !(reference.siteUrl === context.siteUrl && reference.kind === kind)
  );
}

function toOutgoing(link: LinkPlacement): OutgoingLink {
  return {
    ...link,
    linkType: "unknown",
    isDisplayForm: false,
    isIntranet: false,
    isLegacy: false,
    broken: "unsure",
    status: 0,
    targetKey: "",
    targetTitle: "",
    targetList: "",
    targetUrl: "",
    targetId: 0,
  };
}

/** Server relative path of the audited site, which separates it from its neighbours. */
function sitePathOf(siteUrl: string): string {
  try {
    return new URL(siteUrl || window.location.href).pathname.replace(/\/$/, "");
  } catch {
    return "";
  }
}

function splitNames(value: string): string[] {
  return value
    .split(/[,;\s]+/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function statusOf(error: unknown): number | undefined {
  const candidate = error as { status?: number; httpStatus?: number };
  return candidate?.status ?? candidate?.httpStatus;
}
