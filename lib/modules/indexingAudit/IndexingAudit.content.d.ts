export declare const IndexingAuditContent: {
    readonly title: "Indexing";
    readonly description: "Checks what search actually knows about this site: which lists are excluded from the index, how much of each list is indexed, whether sampled items are findable and up to date, and which managed properties come back.";
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
        readonly lists: "Lists";
        readonly items: "Item checks";
        readonly properties: "Managed properties";
    };
    readonly stats: {
        readonly lists: "Lists checked";
        readonly excluded: "Excluded from search";
        readonly coverage: "Index coverage";
        readonly indexed: "Indexed items";
        readonly expected: "Items in lists";
        readonly below: "Lists below target";
        readonly missing: "Sampled items missing";
        readonly stale: "Sampled items stale";
        readonly properties: "Managed properties";
    };
    readonly tileInfo: {
        readonly lists: "Lists and libraries included in this run.";
        readonly excluded: "Lists with search indexing turned off in list settings, so their items never appear in results.";
        readonly coverage: "Indexed items as a share of the items reported by the lists.";
        readonly indexed: "Items search reports under each list path.";
        readonly expected: "Item counts reported by SharePoint for the same lists.";
        readonly below: "Lists whose coverage is under the target set for this run.";
        readonly missing: "Sampled items that returned nothing for a Path query.";
        readonly stale: "Sampled items whose indexed copy is older than the item itself, so a crawl is pending.";
        readonly properties: "Managed properties returned on a sample result, a quick view of what is retrievable.";
    };
    readonly charts: {
        readonly coverage: "Coverage by list";
        readonly indexed: "Indexed items by list";
        readonly crawl: "Lists by crawl setting";
        readonly items: "Sampled items by index state";
    };
    readonly cardInfo: {
        readonly coverage: "Percentage of each list that search can see. Anything well under 100% needs a look.";
        readonly indexed: "Indexed item counts per list, so you can see where the bulk of the index sits.";
        readonly crawl: "Lists allowed in search against lists excluded in list settings.";
        readonly items: "Result of the per item spot check: found, missing, or found but out of date.";
    };
    readonly columns: {
        readonly title: "List";
        readonly template: "Template";
        readonly crawl: "Search";
        readonly permissions: "Permissions";
        readonly items: "Items";
        readonly indexed: "Indexed";
        readonly coverage: "Coverage";
        readonly modified: "Last item modified";
        readonly item: "Item";
        readonly list: "List";
        readonly state: "State";
        readonly itemModified: "Item modified";
        readonly indexedModified: "Indexed copy";
        readonly property: "Managed property";
        readonly actions: "Actions";
    };
    readonly crawl: {
        readonly on: "Indexed";
        readonly off: "Excluded";
    };
    readonly actions: {
        readonly searchSettings: "Search settings (advanced settings)";
        readonly permissions: "List permissions";
        readonly settings: "List settings";
    };
    readonly state: {
        readonly indexed: "Indexed";
        readonly missing: "Missing";
        readonly stale: "Stale";
    };
    readonly unique: "Unique";
    readonly inherited: "Inherited";
    readonly siteExcluded: "This site is set not to appear in search results, so nothing under it will be indexed until that is turned back on.";
    readonly coverageHint: "Coverage compares the item count SharePoint reports with the number of items search returns for the list path. Folders, versions and security trimming can make the two differ slightly.";
    readonly empty: {
        readonly title: "No audit yet";
        readonly description: "Run the audit to check crawl settings, index coverage and sampled items.";
    };
    readonly itemsOff: "Item checks were off for this run.";
    readonly coverageOff: "Coverage checks were off for this run.";
    readonly search: "Search lists";
    readonly searchItems: "Search items";
    readonly searchProperties: "Search properties";
};
//# sourceMappingURL=IndexingAudit.content.d.ts.map