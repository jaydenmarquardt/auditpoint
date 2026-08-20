export declare const SettingsContent: {
    readonly title: "Settings";
    readonly description: "Settings are edited here and stored as JSON on the web part. The property pane only exposes the raw JSON.";
    readonly readOnlyNotice: "The page is in read mode, so settings cannot be saved. Switch to edit mode to change them.";
    readonly enterEditMode: "Enter edit mode";
    readonly unsavedNotice: "Settings applied. Save the page to keep them.";
    readonly save: "Apply settings";
    readonly reset: "Reset changes";
    readonly branding: "Branding";
    readonly reports: "Report storage";
    readonly sites: "Sites in scope";
    readonly performance: "Performance";
    readonly fields: {
        readonly appName: "App name";
        readonly appTagline: "Tagline";
        readonly reportLibrary: "Library";
        readonly reportFolder: "Folder";
        readonly path: "Full path";
        readonly concurrency: "Parallel requests";
        readonly defaultRoute: "Landing page";
        readonly captureReportLogs: "Capture report logs";
        readonly captureReportLogsHint: "Keeps a run log on each report for debugging. Turn off to keep reports small.";
        readonly additionalSites: "Additional site URLs";
        readonly additionalSitesHint: "One absolute URL per line. The host site is always included.";
    };
    readonly folder: {
        readonly title: "Report folder";
        readonly ensure: "Create or repair folder";
        readonly check: "Re-check";
        readonly exists: "Folder ready";
        readonly missing: "Folder missing";
        readonly noEdit: "You can view this folder but not write to it";
        readonly noView: "No access to this location";
        readonly checking: "Checking folder…";
        readonly permissions: "Permissions";
        readonly view: "View";
        readonly edit: "Edit";
    };
    readonly throttle: {
        readonly title: "Live request state";
        readonly inFlight: "In flight";
        readonly queued: "Queued";
        readonly completed: "Completed";
        readonly retries: "Retries";
        readonly failed: "Failed";
        readonly pause: "Pause requests";
        readonly resume: "Resume requests";
    };
    readonly configWarning: "Modules stay disabled until these settings are complete:";
    readonly mapping: {
        readonly title: "Column mapping";
        readonly description: "Which columns this site uses for the things the audits look for. Leave one empty and the audits skip that measure rather than guessing at a name.";
        readonly organisationalUnit: "Organisational unit column";
        readonly organisationalUnitHint: "Internal name of the column holding the owning area, such as OrgUnit.";
        readonly organisationalUnitList: "Organisational unit list";
        readonly organisationalUnitListHint: "Title of the list the column looks up, when it is a lookup.";
        readonly expiryDate: "Expiry date column";
        readonly reviewDate: "Review date column";
        readonly publishDate: "Publish date column";
        readonly htmlFields: "Rich text columns";
        readonly htmlFieldsHint: "Comma separated internal names read for content, image and link audits, on top of anything detected automatically.";
    };
    readonly legacy: {
        readonly title: "Retired hosts";
        readonly description: "Hosts that have been switched off, one per line. Every link pointing at one is reported as dead without being requested.";
        readonly label: "Retired hosts and urls";
    };
    readonly modules: {
        readonly title: "Modules";
        readonly description: "Switch off anything this site does not need. A module switched off here is hidden from the sidebar, the dashboard and routing; its saved reports stay readable.";
        readonly hostLimited: "The page hosting this app offers only the modules listed here.";
        readonly enableAll: "Enable all";
        readonly disableAll: "Disable all";
        readonly enabled: "On";
        readonly disabled: "Off";
    };
    readonly host: "Host site";
    readonly additional: "Additional site";
};
//# sourceMappingURL=Settings.content.d.ts.map