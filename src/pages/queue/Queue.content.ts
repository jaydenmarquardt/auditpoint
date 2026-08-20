export const QueueContent = {
  title: "Task queue",
  description:
    "Long jobs run here, so a dashboard can be left without losing work. Concurrency is capped to keep the tenant from throttling us.",
  clear: "Clear finished",
  activeTitle: "Active",
  historyTitle: "Finished",
  settingsTitle: "Queue settings",
  concurrency: "Parallel tasks",
  demoTitle: "Page inventory",
  demoSubtitle: "A small built in job, useful for checking the queue end to end.",
  demoLabel: "Run page inventory",
  maxPages: "Page limit",
  saveReport: "Save report",
  throttledNotice: "SharePoint is throttling requests. Tasks keep running, with backoff between calls.",
  stats: {
    active: "Active tasks",
    finished: "Finished",
    inFlight: "Requests in flight",
    queuedRequests: "Requests queued",
    retries: "Retries",
    running: "Running",
    throttled: "Throttled",
  },
  empty: {
    title: "Nothing running",
    description: "Start an audit from a module and it will appear here.",
  },
} as const;
