export declare const ContentAuditContent: {
    readonly title: "Content";
    readonly description: "How much writing lives on this site and how it is put together: word counts, headings, images and their alt text, links, tables and embeds, across page canvases and rich text columns.";
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
        readonly entries: "Content";
        readonly issues: "Issues";
    };
    readonly stats: {
        readonly entries: "Content blocks";
        readonly pages: "Pages";
        readonly items: "List items";
        readonly words: "Words";
        readonly average: "Average words";
        readonly averageReading: "Average reading time";
        readonly reading: "Reading time";
        readonly headings: "Headings";
        readonly images: "Images";
        readonly links: "Links";
        readonly external: "External links";
        readonly empty: "Empty links";
        readonly tables: "Tables";
        readonly embeds: "Embeds";
        readonly thin: "Thin content";
        readonly noHeadings: "No headings";
    };
    readonly tileInfo: {
        readonly entries: "Each page canvas and each rich text column value counts as one block.";
        readonly pages: "Modern pages read from the Site Pages library.";
        readonly items: "List items carrying rich text, such as an event description.";
        readonly words: "Words across every block measured.";
        readonly average: "Mean words per block.";
        readonly averageReading: "Mean reading time per block at 220 words a minute.";
        readonly reading: "Rough reading time at 220 words a minute.";
        readonly headings: "Heading elements found, across all levels.";
        readonly images: "Image elements found in the content.";
        readonly links: "Anchor elements found.";
        readonly external: "Links pointing at another host.";
        readonly empty: "Links with no destination, a hash, or javascript, which usually means broken markup.";
        readonly tables: "Table elements, worth checking for header rows.";
        readonly embeds: "Iframes, videos and embeds.";
        readonly thin: "Blocks under the word count set for this run.";
        readonly noHeadings: "Blocks with body text but no heading, which are hard to scan and skim.";
    };
    readonly charts: {
        readonly words: "Words by page";
        readonly headings: "Headings by level";
        readonly contentType: "Blocks by content type";
        readonly list: "Words by list";
        readonly source: "Blocks by source";
    };
    readonly cardInfo: {
        readonly words: "The longest content on the site, which is usually where reviews should start.";
        readonly headings: "Heading levels in use. A healthy page leads with one h1 or h2 then nests.";
        readonly contentType: "Content types behind the blocks measured.";
        readonly list: "Where the words live, by list.";
        readonly source: "Where the content lives: page canvases against rich text columns on lists.";
    };
    readonly columns: {
        readonly title: "Content";
        readonly source: "Source";
        readonly list: "List";
        readonly column: "Column";
        readonly words: "Words";
        readonly reading: "Reading";
        readonly headings: "Headings";
        readonly images: "Images";
        readonly links: "Links";
        readonly tables: "Tables";
        readonly modified: "Modified";
        readonly issues: "Issues";
        readonly actions: "Actions";
    };
    readonly sources: {
        readonly page: "Page";
        readonly item: "List item";
    };
    readonly issues: {
        readonly thin: "Thin";
        readonly noHeadings: "No headings";
        readonly emptyLinks: "Empty links";
        readonly none: "None";
    };
    readonly open: "Open";
    readonly dialog: {
        readonly metrics: "Measurements";
        readonly headings: "Heading structure";
        readonly noHeadings: "No headings were found in this block.";
    };
    readonly empty: {
        readonly title: "No audit yet";
        readonly description: "Run the audit to measure page content and rich text columns.";
    };
    readonly noIssues: {
        readonly title: "Nothing flagged";
        readonly description: "No block is thin, missing headings, missing alt text or carrying empty links.";
    };
    readonly search: "Search content";
};
//# sourceMappingURL=ContentAudit.content.d.ts.map