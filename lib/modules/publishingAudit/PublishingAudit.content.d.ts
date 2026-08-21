export declare const PublishingAuditContent: {
    readonly title: "Publishing";
    readonly description: "What has been published, by whom and when: approval status, edit and creation frequency, version depth, review and expiry dates, and content nobody has touched or opened for a long time.";
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
    readonly people: {
        readonly title: "People";
        readonly description: "Everyone who created or last edited something in this scan.";
        readonly empty: "No creators or editors were recorded for the scanned items.";
        readonly columns: {
            readonly name: "Person";
            readonly created: "Created";
            readonly edited: "Last editor of";
            readonly touched: "Items";
            readonly unpublished: "Unpublished";
            readonly stale: "Stale";
            readonly lists: "Lists";
            readonly lastEdit: "Last edit";
        };
        readonly dialog: {
            readonly items: "Everything they touched";
            readonly stats: "Their share of the scan";
        };
    };
    readonly unpublishedTab: "Unpublished";
    readonly unpublishedEmpty: "Everything scanned has a published version.";
    readonly tabs: {
        readonly overview: "Overview";
        readonly items: "Items";
        readonly review: "Review dates";
        readonly stale: "Stale";
        readonly people: "People";
        readonly unpublished: "Unpublished";
    };
    readonly stats: {
        readonly items: "Items read";
        readonly approved: "Approved";
        readonly pending: "Pending approval";
        readonly draft: "Draft";
        readonly rejected: "Rejected";
        readonly created: "Created in window";
        readonly modified: "Modified in window";
        readonly stale: "Stale";
        readonly never: "Never edited";
        readonly due: "Past review date";
        readonly expired: "Past expiry date";
        readonly versions: "Average versions";
        readonly maxVersions: "Deepest version history";
        readonly editors: "Distinct editors";
        readonly authors: "Creators";
        readonly unpublished: "Unpublished";
        readonly versionsScanned: "Versions scanned";
        readonly lists: "Lists read";
    };
    readonly tileInfo: {
        readonly items: "Items read across the lists in scope, newest changes first.";
        readonly approved: "Items whose moderation status is approved. Lists without approval report everything as approved.";
        readonly pending: "Items waiting for someone to approve them.";
        readonly draft: "Items saved as a draft and never published.";
        readonly rejected: "Items an approver rejected.";
        readonly created: "Items created inside the timeframe set for this run.";
        readonly modified: "Items changed inside the timeframe.";
        readonly stale: "Items not modified inside the stale window.";
        readonly never: "Items whose modified date matches their created date, so nobody has edited them since.";
        readonly due: "Items with a review date in the past.";
        readonly expired: "Items with an expiry date in the past.";
        readonly versions: "Mean version count across the sampled items.";
        readonly maxVersions: "The deepest version history found, which is where storage tends to hide.";
        readonly editors: "People who last edited at least one item.";
        readonly authors: "Distinct people who created something in the scan.";
        readonly unpublished: "Items with no published version: held by moderation, or sitting on a 0.x draft version.";
        readonly versionsScanned: "Total versions read across the sampled items.";
        readonly lists: "Lists and libraries included in this run.";
    };
    readonly charts: {
        readonly created: "Items created by month";
        readonly modified: "Items modified by month";
        readonly weekday: "Edits by weekday";
        readonly status: "Items by approval status";
        readonly editors: "Items by last editor";
        readonly staleness: "Items by age since edit";
        readonly list: "Items by list";
    };
    readonly cardInfo: {
        readonly created: "When content was added, month by month.";
        readonly modified: "When content was last touched, month by month.";
        readonly weekday: "Which days edits land on, which says a lot about how a site is maintained.";
        readonly status: "Approval state across everything read.";
        readonly editors: "Who last touched the most items.";
        readonly staleness: "How long since each item was edited, bucketed.";
        readonly list: "Where the items read actually live.";
    };
    readonly columns: {
        readonly title: "Item";
        readonly list: "List";
        readonly status: "Status";
        readonly author: "Created by";
        readonly editor: "Last edited by";
        readonly created: "Created";
        readonly modified: "Modified";
        readonly age: "Age since edit";
        readonly version: "Version";
        readonly versions: "Versions";
        readonly review: "Review date";
        readonly expiry: "Expiry date";
        readonly actions: "Actions";
    };
    readonly status: {
        readonly approved: "Approved";
        readonly rejected: "Rejected";
        readonly pending: "Pending";
        readonly draft: "Draft";
        readonly scheduled: "Scheduled";
        readonly unknown: "No approval";
    };
    readonly buckets: {
        readonly month: "Under a month";
        readonly quarter: "1 to 3 months";
        readonly year: "3 to 12 months";
        readonly older: "Over a year";
    };
    readonly open: "Open";
    readonly dialog: {
        readonly dates: "Date columns";
        readonly noDates: "No configured date column has a value on this item.";
        readonly versions: "Version history";
        readonly loadVersions: "Load version history";
        readonly versionsRead: "versions read, most recent first";
    };
    readonly versionsNote: "Version counts come from a sample of the most recently changed items.";
    readonly empty: {
        readonly title: "No audit yet";
        readonly description: "Run the audit to read publishing state and edit history.";
    };
    readonly noReview: {
        readonly title: "No review or expiry dates";
        readonly description: "None of the items read carry the date columns configured for this run.";
    };
    readonly noStale: {
        readonly title: "Nothing stale";
        readonly description: "Every item was edited inside the stale window.";
    };
    readonly search: "Search items";
};
//# sourceMappingURL=PublishingAudit.content.d.ts.map