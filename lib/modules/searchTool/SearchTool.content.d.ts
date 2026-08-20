export declare const SearchToolContent: {
    readonly title: "Search";
    readonly description: "Query the SharePoint search index directly: build a KQL query from filters or write your own, inspect the managed properties returned, and check whether an item is indexed.";
    readonly moduleVersion: "Module";
    readonly tabs: {
        readonly search: "Search";
        readonly index: "Index check";
        readonly history: "History";
    };
    readonly form: {
        readonly title: "Query";
        readonly keywords: "Keywords";
        readonly keywordsHint: "Free text. Leave empty to match everything.";
        readonly fileTypes: "File types";
        readonly fileTypesHint: "Comma separated, for example docx,pdf";
        readonly contentClass: "Content class";
        readonly contentClassHint: "STS_ListItem, STS_Document, STS_Site, STS_Web";
        readonly path: "Path starts with";
        readonly author: "Author";
        readonly modifiedAfter: "Modified after";
        readonly modifiedBefore: "Modified before";
        readonly extraKql: "Extra KQL";
        readonly extraKqlHint: "Appended with AND, for example IsDocument:true";
        readonly useRawQuery: "Write the query myself";
        readonly rawQuery: "KQL query";
        readonly queryTemplate: "Query template";
        readonly sourceId: "Result source";
        readonly selectProperties: "Managed properties to return";
        readonly refiners: "Refiners";
        readonly refinersHint: "Comma separated managed properties, for example FileType,contentclass";
        readonly sortProperty: "Sort by";
        readonly sortDescending: "Sort descending";
        readonly rowLimit: "Rows per page";
        readonly trimDuplicates: "Trim duplicates";
        readonly enableStemming: "Enable stemming";
        readonly run: "Run search";
        readonly reset: "Reset";
        readonly copyQuery: "Copy KQL";
        readonly copied: "Copied";
        readonly exportCsv: "Export CSV";
        readonly preview: "Query sent to search";
        readonly moreFilters: "More filters";
        readonly moreFiltersHint: "Content class, author, dates, extra KQL";
        readonly moreOptions: "Query options";
        readonly moreOptionsHint: "Properties, refiners, sorting, source, ranking";
        readonly xrankTerms: "XRANK boost terms";
        readonly xrankBoost: "Boost (cb)";
        readonly xrankHint: "Boosts results matching these terms without excluding anything else.";
    };
    readonly results: {
        readonly title: "Results";
        readonly summary: "results";
        readonly elapsed: "in";
        readonly empty: {
            readonly title: "No results";
            readonly description: "Nothing in the index matched this query. Loosen the filters or check the path.";
        };
        readonly idle: {
            readonly title: "No search yet";
            readonly description: "Build a query on the left, then run the search.";
        };
        readonly next: "Next page";
        readonly previous: "Previous page";
        readonly page: "Page";
        readonly refiners: "Refiners";
        readonly refinersHint: "Narrow these results by a returned property";
        readonly refinedBy: "Refined by";
        readonly clearRefiners: "Clear refinements";
        readonly failed: "The search request failed. The detail below comes straight from SharePoint.";
        readonly open: "Open item";
        readonly details: "Details";
    };
    readonly index: {
        readonly title: "Is this item indexed?";
        readonly description: "Paste a full URL or a server relative path. The check runs a Path query, which is how search itself resolves an item.";
        readonly target: "Item URL or path";
        readonly check: "Check index";
        readonly indexed: "Found in the index";
        readonly notIndexed: "Not found in the index";
        readonly notIndexedHint: "A missing item usually means it was changed very recently, is in a library excluded from search, or the crawl has not run yet.";
        readonly lastModified: "Last modified";
        readonly fileType: "File type";
        readonly contentClass: "Content class";
        readonly web: "Site";
        readonly queryUsed: "Query used";
        readonly mode: "Choose the item";
        readonly modeUrl: "Paste a URL";
        readonly modeList: "Pick from a list";
        readonly list: "List";
        readonly listPlaceholder: "Type to find a list";
        readonly item: "Item";
        readonly itemPlaceholder: "Type to find an item";
        readonly loadingLists: "Loading lists";
        readonly loadingItems: "Loading items";
        readonly checkTime: "Check time";
        readonly failed: "The index check failed";
    };
    readonly history: {
        readonly title: "Recent queries";
        readonly empty: {
            readonly title: "No queries yet";
            readonly description: "Searches you run are listed here for this browser.";
        };
        readonly rerun: "Run again";
        readonly clear: "Clear history";
        readonly when: "When";
        readonly query: "Query";
        readonly rows: "Rows";
        readonly time: "Time";
    };
    readonly sourceIds: {
        readonly default: "Default";
        readonly documents: "Local SharePoint documents";
        readonly items: "Local SharePoint items";
        readonly pages: "Pages";
        readonly people: "Local people";
    };
};
//# sourceMappingURL=SearchTool.content.d.ts.map