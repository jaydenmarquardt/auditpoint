export declare const ImagesAuditContent: {
    readonly title: "Images";
    readonly description: "Every image the site stores and every image its content points at: formats, sizes, duplicates, files nobody uses, missing alt text and images loaded from other hosts.";
    readonly configTitle: "Audit settings";
    readonly historyTitle: "Previous runs";
    readonly moduleVersion: "Module";
    readonly backToRuns: "All runs";
    readonly run: "Run audit";
    readonly rerun: "Run again";
    readonly pause: "Pause";
    readonly resume: "Resume";
    readonly cancel: "Cancel";
    readonly exportCsv: "Export CSV";
    readonly review: "Review";
    readonly tabs: {
        readonly overview: "Overview";
        readonly files: "Files";
        readonly usages: "Usages";
        readonly duplicates: "Duplicates";
        readonly unused: "Unused";
    };
    readonly stats: {
        readonly files: "Image files";
        readonly storage: "Image storage";
        readonly average: "Average size";
        readonly usages: "Image placements";
        readonly used: "Files in use";
        readonly unused: "Unused files";
        readonly unusedBytes: "Unused storage";
        readonly duplicates: "Duplicate files";
        readonly duplicateBytes: "Duplicate storage";
        readonly alt: "Placements without alt text";
        readonly external: "Images from other hosts";
        readonly oversized: "Oversized files";
        readonly legacy: "Legacy formats";
        readonly formats: "Formats in use";
    };
    readonly tileInfo: {
        readonly files: "Image files found in the libraries that were scanned.";
        readonly storage: "Total size of those files.";
        readonly average: "Mean file size, useful for spotting a library full of camera originals.";
        readonly usages: "Image tags found in page canvases and rich text columns.";
        readonly used: "Files matched to at least one placement.";
        readonly unused: "Files no scanned content points at. Check before deleting, since other sites may use them.";
        readonly unusedBytes: "Storage held by files nothing points at.";
        readonly duplicates: "Files sharing a name and size with another file, so the same picture is stored twice.";
        readonly duplicateBytes: "Storage that duplicates hold.";
        readonly alt: "Image placements with no alt text. Each is a WCAG 1.1.1 failure for screen reader users.";
        readonly external: "Images loaded from a host outside this tenant, which can break or leak referrers.";
        readonly oversized: "Files over the size threshold set for this run.";
        readonly legacy: "Formats the web handles poorly: bmp, tiff and ico.";
        readonly formats: "Distinct file extensions found.";
    };
    readonly charts: {
        readonly format: "Files by format";
        readonly storageFormat: "Storage by format";
        readonly usage: "Placements by page";
        readonly alt: "Placements by alt text";
        readonly size: "Files by size";
        readonly used: "Files by use";
    };
    readonly cardInfo: {
        readonly format: "Which image formats the site stores. Modern formats compress far better.";
        readonly storageFormat: "Where the image storage actually goes.";
        readonly usage: "Pages and items carrying the most images.";
        readonly alt: "Placements with alt text against those missing it.";
        readonly size: "File sizes bucketed, so heavy originals stand out.";
        readonly used: "Files matched to content against files nothing points at.";
    };
    readonly columns: {
        readonly name: "File";
        readonly list: "Library";
        readonly format: "Format";
        readonly size: "Size";
        readonly modified: "Modified";
        readonly uses: "Uses";
        readonly flags: "Flags";
        readonly page: "Used on";
        readonly src: "Source";
        readonly alt: "Alt text";
        readonly dimensions: "Width and height";
        readonly actions: "Actions";
        readonly duplicateOf: "Duplicate key";
    };
    readonly flags: {
        readonly unused: "Unused";
        readonly duplicate: "Duplicate";
        readonly oversized: "Oversized";
        readonly legacy: "Legacy format";
        readonly missingAlt: "No alt text";
        readonly external: "External host";
    };
    readonly buckets: {
        readonly small: "Under 100 KB";
        readonly medium: "100 KB to 500 KB";
        readonly large: "500 KB to 2 MB";
        readonly huge: "Over 2 MB";
    };
    readonly used: "In use";
    readonly unused: "Unused";
    readonly withAlt: "With alt text";
    readonly withoutAlt: "Missing alt text";
    readonly open: "Open";
    readonly matchNote: "Usage matching compares the file path to the image source, so images referenced from another site collection or by an absolute CDN URL count as external rather than used.";
    readonly empty: {
        readonly title: "No audit yet";
        readonly description: "Run the audit to inventory image files and where they are used.";
    };
    readonly noDuplicates: {
        readonly title: "No duplicates";
        readonly description: "No two files share a name and size.";
    };
    readonly noUnused: {
        readonly title: "Everything is used";
        readonly description: "Every image file was matched to at least one placement.";
    };
    readonly search: {
        readonly files: "Search files";
        readonly usages: "Search placements";
    };
};
//# sourceMappingURL=ImagesAudit.content.d.ts.map