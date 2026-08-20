import { ReportEnvelope, ReportFolderAccess, ReportIndexEntry, ReportLocation, ReportSummary } from "./Reports.types";
export declare function reportLocation(overrides?: Partial<ReportLocation>): ReportLocation;
export declare function reportFolderUrl(location?: ReportLocation): string;
export declare function Reports(location?: ReportLocation): {
    folderUrl(): string;
    checkFolder(): Promise<ReportFolderAccess>;
    ensureFolder(): Promise<ReportFolderAccess>;
    list(): Promise<ReportSummary[]>;
    index(): Promise<ReportIndexEntry[]>;
    read<TData, TConfig = Record<string, unknown>>(serverRelativeUrl: string): Promise<ReportEnvelope<TData, TConfig>>;
    save<TData, TConfig = Record<string, unknown>>(envelope: ReportEnvelope<TData, TConfig>): Promise<ReportSummary>;
    remove(serverRelativeUrl: string): Promise<void>;
};
//# sourceMappingURL=Reports.api.d.ts.map