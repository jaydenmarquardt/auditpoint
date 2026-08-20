export declare const TASK_PAGE_INVENTORY = "page-inventory";
export interface PageInventoryPayload {
    maxPages: number;
    saveReport: boolean;
}
export interface PageInventoryResult {
    pageCount: number;
    reportUrl?: string;
}
export declare function registerBuiltInTasks(): void;
//# sourceMappingURL=Queue.tasks.d.ts.map