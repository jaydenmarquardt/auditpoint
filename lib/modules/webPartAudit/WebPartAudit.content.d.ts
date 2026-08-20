export declare const WebPartAuditContent: {
    readonly title: "Web parts";
    readonly description: "Reads the canvas of every page and extracts the web parts in use, where they sit, and the properties they were saved with.";
    readonly configTitle: "Audit settings";
    readonly historyTitle: "Previous runs";
    readonly backToRuns: "All runs";
    readonly moduleVersion: "Module";
    readonly run: "Run audit";
    readonly rerun: "Run again";
    readonly pause: "Pause";
    readonly resume: "Resume";
    readonly cancel: "Cancel";
    readonly exportCsv: "Export CSV";
    readonly viewProperties: "Properties";
    readonly searchInstances: "Search web parts, pages and titles";
    readonly searchTypes: "Search web parts";
    readonly searchPages: "Search pages";
    readonly titled: "Titled";
    readonly untitled: "No title";
    readonly density: {
        readonly empty: "Empty";
        readonly light: "1 to 5";
        readonly medium: "6 to 15";
        readonly heavy: "16 or more";
    };
    readonly tabs: {
        readonly overview: "Overview";
        readonly types: "Web part types";
        readonly instances: "Instances";
        readonly pages: "Pages";
        readonly catalogue: "Installed, unused";
        readonly logs: "Log";
        readonly issues: "Issues";
    };
    readonly stats: {
        readonly pages: "Pages scanned";
        readonly instances: "Web parts placed";
        readonly types: "Distinct types";
        readonly thirdParty: "Custom or third party";
        readonly average: "Average per page";
        readonly empty: "Pages with no web parts";
        readonly text: "Stock text blocks";
    };
    readonly charts: {
        readonly topTypes: "Instances by web part";
        readonly source: "Web parts by source";
        readonly layouts: "Pages by layout";
        readonly busiest: "Web parts by page";
        readonly instanceSource: "Instances by source";
    };
    readonly tileInfo: {
        readonly pages: "Pages read from the Site Pages library on the scanned sites.";
        readonly instances: "Every web part placed on those pages, title area included when that option was on.";
        readonly types: "Distinct web parts and stock controls in use.";
        readonly thirdParty: "Web parts that are not stock controls, worth checking for support and ownership.";
        readonly average: "Web parts per page, a rough measure of page complexity.";
        readonly empty: "Pages with no web parts at all, often stubs or redirects.";
        readonly text: "Rich text blocks placed directly on the canvas rather than a web part.";
    };
    readonly cardInfo: {
        readonly topTypes: "How many times each web part is placed across the scanned pages.";
        readonly source: "Split of stock controls, catalogue web parts and anything not installed on this site.";
        readonly layouts: "Page layout used by the scanned pages, for example Article or Home.";
        readonly busiest: "Pages carrying the most web parts. Heavy pages are the usual performance suspects.";
        readonly instanceSource: "Every placement counted by source, so a single custom web part used 40 times shows its real weight.";
    };
    readonly columns: {
        readonly actions: "Actions";
        readonly hasTitle: "Title set";
        readonly density: "Density";
        readonly icon: "";
        readonly group: "Group";
        readonly common: "Common properties";
        readonly shared: "Shared values";
        readonly catalogue: "Catalogue";
        readonly name: "Web part";
        readonly id: "Component id";
        readonly instances: "Instances";
        readonly pages: "Pages";
        readonly source: "Source";
        readonly properties: "Properties";
        readonly page: "Page";
        readonly section: "Section";
        readonly title: "Instance title";
        readonly layout: "Layout";
        readonly count: "Web parts";
        readonly sections: "Sections";
        readonly modified: "Modified";
    };
    readonly inCatalogue: "Installed";
    readonly notInCatalogue: "Not installed";
    readonly catalogueEmpty: {
        readonly title: "Every installed web part is in use";
        readonly description: "No component in the catalogue is missing from the scanned pages.";
    };
    readonly none: "None";
    readonly dialog: {
        readonly close: "Close";
        readonly property: "Property";
        readonly usedOn: "Used on";
        readonly commonValues: "Most common values";
        readonly propertyUsage: "Property usage across the site";
        readonly sharedValues: "Values identical on every instance";
        readonly noShared: "No property has the same value on every instance.";
        readonly whereUsed: "Where it is used";
        readonly commonProperties: "Common properties";
        readonly openPage: "Open page";
        readonly hideProperties: "Hide properties";
        readonly viewDetails: "Details";
    };
    readonly outOfBox: "Out of the box";
    readonly thirdParty: "Custom";
    readonly text: "Text or layout";
    readonly titleArea: "Title area";
    readonly body: "Body";
    readonly empty: {
        readonly title: "No audit yet";
        readonly description: "Run the audit to read every page canvas and extract the web parts in use.";
    };
    readonly issuesEmpty: {
        readonly title: "No issues recorded";
        readonly description: "Pages that could not be read or parsed appear here.";
    };
    readonly propertiesTitle: "Saved properties";
    readonly noProperties: "This instance has no saved properties, or properties were not kept for this run.";
};
//# sourceMappingURL=WebPartAudit.content.d.ts.map