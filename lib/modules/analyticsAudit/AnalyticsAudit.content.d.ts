export declare const AnalyticsAuditContent: {
    readonly title: "Analytics audit";
    readonly description: "Views, viewers and time spent for every page and file, read from the same site endpoints the SharePoint usage panel uses rather than from search.";
    readonly moduleVersion: "Version";
    readonly historyTitle: "Previous analytics runs";
    readonly configTitle: "Analytics settings";
    readonly run: "Run analytics audit";
    readonly rerun: "Run again";
    readonly pause: "Pause";
    readonly resume: "Resume";
    readonly cancel: "Cancel";
    readonly backToRuns: "Back to runs";
    readonly exportCsv: "Export analytics";
    readonly tabs: {
        readonly overview: "Overview";
        readonly pages: "Pages";
        readonly files: "Files";
        readonly days: "By day";
        readonly unviewed: "Never viewed";
    };
    readonly windows: {
        readonly today: "Today";
        readonly last7: "7 days";
        readonly last30: "30 days";
        readonly last90: "90 days";
        readonly allTime: "All time";
        readonly label: "Window";
    };
    readonly sections: {
        readonly traffic: "Traffic";
        readonly audience: "Audience";
        readonly content: "Content";
    };
    readonly stats: {
        readonly views: "Views";
        readonly unique: "Unique viewers";
        readonly visits: "Site visits";
        readonly timePerView: "Average time per view";
        readonly timePerViewer: "Average time per viewer";
        readonly pages: "Pages";
        readonly files: "Files";
        readonly viewed: "Pages viewed";
        readonly unviewed: "Pages never viewed";
        readonly busiestDay: "Busiest day";
        readonly busiestHour: "Busiest hour";
        readonly days: "Days measured";
        readonly change: "Change";
    };
    readonly tileInfo: {
        readonly views: "Every view recorded in the window. SharePoint counts a view per item, so one person reading three pages counts three times.";
        readonly unique: "Distinct viewers, counted per item and summed, so the same person on two pages counts twice.";
        readonly visits: "Days with at least one recorded view, summed across the window: the closest this data gets to a session count.";
        readonly timePerView: "Time spent divided by views.";
        readonly timePerViewer: "Time spent divided by unique viewers.";
        readonly pages: "Pages read from the Site Pages library.";
        readonly files: "Files read from document libraries, when file analytics were included.";
        readonly viewed: "Pages with at least one view in the window.";
        readonly unviewed: "Pages nobody has opened in the window. The place to start when trimming a site.";
        readonly busiestDay: "The single day with the most views in the measured period.";
        readonly busiestHour: "The hour of the day with the most views, where the tenant reports hourly data.";
        readonly days: "Days of history the run asked for.";
        readonly change: "Movement against the window immediately before this one.";
    };
    readonly charts: {
        readonly viewsByDay: "Views by day";
        readonly viewersByDay: "Viewers by day";
        readonly viewsByHour: "Views by hour of day";
        readonly viewsByWeekday: "Views by day of week";
        readonly viewsByFolder: "Views by folder";
        readonly viewsByOrgUnit: "Views by organisational unit";
        readonly viewsByFileType: "Views by file type";
        readonly topPages: "Most viewed pages";
        readonly topFiles: "Most viewed files";
        readonly timeByFolder: "Time spent by folder";
    };
    readonly cardInfo: {
        readonly viewsByDay: "Daily totals for the site over the measured period.";
        readonly viewersByDay: "Distinct viewers per day.";
        readonly viewsByHour: "When people read, in the browser's timezone. Empty where the tenant does not report hourly data.";
        readonly viewsByWeekday: "Which days of the week carry the traffic.";
        readonly viewsByFolder: "Views grouped by the folder each page sits in.";
        readonly viewsByOrgUnit: "Views grouped by the owning area, using the column named in settings.";
        readonly viewsByFileType: "Views grouped by file extension.";
        readonly topPages: "The pages carrying the traffic.";
        readonly topFiles: "The files people actually open.";
        readonly timeByFolder: "Where reading time goes, rather than where clicks go.";
    };
    readonly columns: {
        readonly title: "Title";
        readonly list: "List";
        readonly folder: "Folder";
        readonly orgUnit: "Area";
        readonly type: "Type";
        readonly views: "Views";
        readonly unique: "Viewers";
        readonly time: "Time spent";
        readonly perView: "Per view";
        readonly modified: "Modified";
        readonly open: "Open";
    };
    readonly notes: {
        readonly sampled: "This tenant does not answer the site wide activity endpoints, so the daily charts are summed from the pages that were read.";
        readonly perItem: "SharePoint reports viewers per item. Someone who reads three pages counts as three viewers, so these figures compare well against each other but are not a headcount.";
        readonly hourly: "Hourly data is only available on tenants that answer the hourly interval; the chart is empty otherwise.";
        readonly devices: "Device breakdown is not exposed by the site analytics endpoints, so it is not reported here rather than being guessed at.";
    };
    readonly empty: {
        readonly title: "No analytics yet";
        readonly description: "Run the audit to read view counts for every page and file on this site.";
        readonly entries: "Nothing was measured. Check the page and library limits.";
        readonly unviewed: "Every page has been viewed at least once in this window.";
    };
    readonly review: "Review";
};
//# sourceMappingURL=AnalyticsAudit.content.d.ts.map