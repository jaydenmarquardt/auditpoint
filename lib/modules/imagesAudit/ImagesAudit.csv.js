import { flagsFor } from "./ImagesAudit.logic";
import { downloadCsv } from "../../utils/Export.util";
export function fileRow(file) {
    return {
        site: file.siteUrl,
        library: file.listTitle,
        name: file.name,
        url: file.url,
        format: file.extension,
        sizeBytes: file.sizeBytes,
        uses: file.useCount,
        modified: file.modified,
        flags: flagsFor(file).join("|"),
    };
}
export function usageRow(usage) {
    return {
        site: usage.siteUrl,
        source: usage.source,
        list: usage.listTitle,
        itemId: usage.itemId,
        title: usage.title,
        pageUrl: usage.pageUrl,
        src: usage.src,
        alt: usage.alt,
        hasAlt: usage.hasAlt,
        width: usage.width,
        height: usage.height,
        external: usage.isExternal,
    };
}
export function exportFiles(view) {
    downloadCsv("images-files", view.files.map(fileRow));
}
export function exportUsages(usages) {
    downloadCsv("images-usages", usages.map(usageRow));
}
//# sourceMappingURL=ImagesAudit.csv.js.map