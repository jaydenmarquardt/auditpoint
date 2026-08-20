export declare const LinkAuditContent: {
    readonly title: "Link audit";
    readonly description: "Finds every link written on a page, in a list item, in a navigation menu or inside a document, resolves what each one points at, and reports what is broken, legacy, external or insecure.";
    readonly moduleVersion: "Version";
    readonly historyTitle: "Previous link audits";
    readonly backToRuns: "Back to runs";
    readonly configTitle: "Link audit settings";
    readonly run: "Run link audit";
    readonly rerun: "Run again";
    readonly pause: "Pause";
    readonly resume: "Resume";
    readonly cancel: "Cancel";
    readonly exportCsv: "Export link audit";
    readonly exportExternal: "Export external only";
    readonly exportBroken: "Export broken only";
    readonly exportReferences: "Export items";
    readonly exportLinks: "Export links";
    readonly exportUsages: "Export usages";
    readonly openLink: "Open link";
    readonly openItem: "Open item";
    readonly tabs: {
        readonly overview: "Overview";
        readonly references: "Items";
        readonly links: "Links";
        readonly broken: "Broken";
    };
    readonly search: {
        readonly references: "Search items, urls and links";
        readonly links: "Search links, text and targets";
        readonly broken: "Search broken links";
    };
    readonly columns: {
        readonly list: "List";
        readonly title: "Title";
        readonly kind: "Kind";
        readonly incoming: "Incoming";
        readonly outgoing: "Outgoing";
        readonly broken: "Broken";
        readonly link: "Link";
        readonly source: "Source";
        readonly foundIn: "Found in";
        readonly type: "Type";
        readonly status: "Status";
        readonly uses: "Uses";
        readonly spellings: "Spellings";
        readonly resolvesTo: "Resolves to";
        readonly text: "Text";
        readonly url: "URL";
        readonly item: "Item";
        readonly id: "ID";
        readonly usedIn: "Used in";
        readonly modified: "Modified";
        readonly flags: "Flags";
    };
    readonly stats: {
        readonly items: "Items";
        readonly pages: "Pages";
        readonly listItems: "List items";
        readonly documents: "Documents";
        readonly pdfs: "PDFs";
        readonly docx: "Word docs";
        readonly scanned: "Scanned";
        readonly documentsRead: "Files read";
        readonly outgoing: "Outgoing links";
        readonly incoming: "Incoming links";
        readonly destinations: "Destinations";
        readonly webpart: "In web parts";
        readonly navigation: "In navigation";
        readonly documentLinks: "In documents";
        readonly external: "External";
        readonly broken: "Broken";
        readonly untested: "Untested";
        readonly orphans: "Nothing links here";
    };
    readonly tileInfo: {
        readonly items: "Everything scanned: pages, list items, documents and the navigation menus.";
        readonly pages: "Site pages read from the Site Pages library.";
        readonly listItems: "List items carrying rich text columns.";
        readonly documents: "Files inventoried in document libraries.";
        readonly pdfs: "PDF files found in libraries.";
        readonly docx: "Word files found in libraries.";
        readonly scanned: "Items whose content was read for links.";
        readonly documentsRead: "Documents whose file content was parsed for links.";
        readonly outgoing: "Every link found, counted once per placement.";
        readonly incoming: "Links resolved back to a scanned item.";
        readonly destinations: "Distinct destinations once every spelling of a url is collapsed.";
        readonly webpart: "Links saved in web part properties rather than body text.";
        readonly navigation: "Links held in the quick launch and top navigation menus.";
        readonly documentLinks: "Links read out of docx and pdf file content.";
        readonly external: "Links pointing off this tenancy. They cannot be tested from the browser.";
        readonly broken: "Links proven dead, either legacy or answered with an error status.";
        readonly untested: "Links that could not be proven either way.";
        readonly orphans: "Scanned items that nothing else links to.";
    };
    readonly charts: {
        readonly type: "Links by type";
        readonly source: "Links by where they were written";
        readonly status: "Links by status";
        readonly brokenByList: "Broken links by list";
        readonly topTargets: "Most linked destinations";
    };
    readonly cardInfo: {
        readonly type: "Classification of every link found, first match wins.";
        readonly source: "Body content, web part properties, navigation menus or document files.";
        readonly status: "Broken, working or untested after the index and the broken link check.";
        readonly brokenByList: "Where the dead links are written, so the fixing can be handed out.";
        readonly topTargets: "Destinations by how many places link to them.";
    };
    readonly status: {
        readonly yes: "Broken";
        readonly no: "Working";
        readonly unsure: "Untested";
        readonly matched: "Matched";
        readonly unmapped: "Unmapped";
    };
    readonly sources: {
        readonly content: "Content";
        readonly webpart: "Web part";
        readonly navigation: "Navigation";
        readonly document: "Document";
    };
    readonly kinds: {
        readonly page: "Page";
        readonly item: "List item";
        readonly document: "Document";
        readonly navigation: "Navigation";
    };
    readonly navigationTitle: "Navigation menus";
    readonly navigationList: "Navigation";
    readonly notes: {
        readonly external: "External links cannot be tested from the browser, so they stay untested however often they are checked.";
        readonly documents: "Document content is downloaded and parsed in the browser, two files at a time, and files over the size limit are skipped.";
        readonly broken: "Only unresolved links on this tenancy are requested. Everything that matched a scanned item is already known good.";
    };
    readonly empty: {
        readonly title: "No link audit yet";
        readonly description: "Run the audit to read every page, list item, menu and document, then resolve what each link points at.";
        readonly references: "Nothing was scanned. Check the site list and the page and item limits.";
        readonly links: "No links were found in anything that was scanned.";
        readonly broken: "No broken links. Nothing pointed at a legacy host and nothing answered with an error.";
    };
    readonly flags: {
        readonly broken: "Broken links";
        readonly legacy: "Legacy";
        readonly insecure: "Insecure";
        readonly emptyText: "No link text";
        readonly unmapped: "Unmapped";
        readonly orphan: "No incoming";
    };
    readonly dialog: {
        readonly outgoing: "Outgoing links";
        readonly incoming: "Incoming links";
        readonly brokenLinks: "Broken links";
        readonly variants: "Written as";
        readonly usedIn: "Linked from";
        readonly noBroken: "No broken links on this item.";
        readonly noOutgoing: "This item links to nothing.";
        readonly noIncoming: "Nothing links to this item.";
    };
    readonly review: "Review";
};
//# sourceMappingURL=LinkAudit.content.d.ts.map