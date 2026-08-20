import { SiteLists } from "@/api/Lists.api";
import { PageCanvas } from "@/api/WebParts.api";
import { ContentSource } from "@/api/Content.api";
import { ImageFiles } from "@/api/Images.api";
import { ReportDefinition } from "@/core/report/Report.types";
import { ImagesAuditConfig, ImagesAuditData } from "@/modules/imagesAudit/ImagesAudit.types";
import { toErrorMessage } from "@/utils/Guard.util";

export const IMAGES_AUDIT_KIND = "images-audit";

export const imagesAuditReport: ReportDefinition<ImagesAuditData, ImagesAuditConfig> = {
  kind: IMAGES_AUDIT_KIND,
  title: "Images audit",
  description:
    "Finds image files in libraries and image placements in page canvases and rich text columns, then matches the two to report duplicates, unused files, oversized originals and missing alt text.",
  iconName: "Photo2",
  version: "1.0.0",
  schemaVersion: 1,

  defaultConfig: {
    maxPages: 5000,
    scanListItems: true,
    columnNames: "Body,PageBody,Description,Comments,Content",
    autoDetectColumns: true,
    maxItemsPerList: 5000,
    maxLists: 100,
    scanLibraries: true,
    maxFilesPerLibrary: 5000,
    largeImageKb: 500,
  },

  configFields: [
    {
      key: "maxPages",
      label: "Maximum pages per site",
      type: "number",
      min: 10,
      max: 20000,
      step: 50,
      description: "Pages are read in one request, then parsed for image tags locally.",
    },
    {
      key: "scanListItems",
      label: "Scan rich text columns on lists",
      type: "toggle",
      description: "Finds images inside list item HTML, such as a news body or event description.",
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
      description: "Upper bound on lists inspected for rich text columns.",
    },
    {
      key: "scanLibraries",
      label: "Inventory image files in libraries",
      type: "toggle",
      description: "Needed for duplicate, unused and storage numbers.",
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
      key: "largeImageKb",
      label: "Oversized above (KB)",
      type: "number",
      min: 50,
      max: 10000,
      step: 50,
      description: "Files over this size are flagged as oversized.",
    },
  ],

  stages: [
    {
      key: "pages",
      label: "Read image use on pages",
      async run(context) {
        const images = ImageFiles(context.siteUrl);
        const source = ContentSource(context.siteUrl);
        const pages = await PageCanvas(context.siteUrl).getPages(context.config.maxPages);

        const usages = context.data.usages ?? [];

        pages.forEach((page) =>
          usages.push(
            ...images.fromHtml(source.pageHtml(page), {
              siteUrl: context.siteUrl,
              source: "page",
              listTitle: "Site Pages",
              itemId: page.id,
              title: page.title,
              pageUrl: page.serverRelativeUrl,
            })
          )
        );

        context.data.usages = usages;
        context.data.scannedSites = [...(context.data.scannedSites ?? []), context.siteUrl];
        context.progress(pages.length, pages.length);
      },
    },
    {
      key: "items",
      label: "Read image use in list content",
      async run(context) {
        if (!context.config.scanListItems) {
          context.progress(0, 0);
          return;
        }

        const images = ImageFiles(context.siteUrl);
        const source = ContentSource(context.siteUrl);
        const named = splitNames(context.config.columnNames);

        const lists = (await SiteLists(context.siteUrl).getAll(false))
          .filter((list) => list.title !== "Site Pages" && list.itemCount > 0)
          .slice(0, context.config.maxLists);

        const start = typeof context.cursor === "number" ? context.cursor : 0;
        const usages = context.data.usages ?? [];

        for (let index = start; index < lists.length; index = index + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            context.data.usages = usages;
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

              records.forEach((record) =>
                usages.push(
                  ...images.fromHtml(record.html, {
                    siteUrl: record.siteUrl,
                    source: "item",
                    listTitle: record.listTitle,
                    itemId: record.itemId,
                    title: record.title,
                    pageUrl: record.url,
                  })
                )
              );
            }
          } catch (error) {
            context.issue({ target: list.title, code: statusOf(error) ?? "error", message: toErrorMessage(error) });
          }

          context.setCursor(index + 1);
          context.progress(index + 1, lists.length);
        }

        context.data.usages = usages;
      },
    },
    {
      key: "files",
      label: "Inventory image files",
      async run(context) {
        if (!context.config.scanLibraries) {
          context.progress(0, 0);
          return;
        }

        const images = ImageFiles(context.siteUrl);
        const libraries = (await SiteLists(context.siteUrl).getAll(false))
          .filter((list) => list.kind === "library" && list.itemCount > 0)
          .slice(0, context.config.maxLists);

        const start = typeof context.cursor === "number" ? context.cursor : 0;
        const files = context.data.files ?? [];

        for (let index = start; index < libraries.length; index = index + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            context.data.files = files;
            return;
          }

          try {
            files.push(...(await images.inLibrary(libraries[index], context.config.maxFilesPerLibrary)));
          } catch (error) {
            context.issue({
              target: libraries[index].title,
              code: statusOf(error) ?? "error",
              message: toErrorMessage(error),
            });
          }

          context.setCursor(index + 1);
          context.progress(index + 1, libraries.length);
        }

        context.data.files = files;
        context.log(`${files.length} image files, ${(context.data.usages ?? []).length} placements`);
      },
    },
  ],
};

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
