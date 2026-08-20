export declare const QueueContent: {
    readonly title: "Task queue";
    readonly description: "Long jobs run here, so a dashboard can be left without losing work. Concurrency is capped to keep the tenant from throttling us.";
    readonly clear: "Clear finished";
    readonly activeTitle: "Active";
    readonly historyTitle: "Finished";
    readonly settingsTitle: "Queue settings";
    readonly concurrency: "Parallel tasks";
    readonly demoTitle: "Page inventory";
    readonly demoSubtitle: "A small built in job, useful for checking the queue end to end.";
    readonly demoLabel: "Run page inventory";
    readonly maxPages: "Page limit";
    readonly saveReport: "Save report";
    readonly throttledNotice: "SharePoint is throttling requests. Tasks keep running, with backoff between calls.";
    readonly stats: {
        readonly active: "Active tasks";
        readonly finished: "Finished";
        readonly inFlight: "Requests in flight";
        readonly queuedRequests: "Requests queued";
        readonly retries: "Retries";
        readonly running: "Running";
        readonly throttled: "Throttled";
    };
    readonly empty: {
        readonly title: "Nothing running";
        readonly description: "Start an audit from a module and it will appear here.";
    };
};
//# sourceMappingURL=Queue.content.d.ts.map