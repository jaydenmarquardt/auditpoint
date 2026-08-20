import * as React from "react";
import { ReportController } from "../../core/report/useReport";
import { ReportDefinition } from "../../core/report/Report.types";
export interface RunLabels {
    run: string;
    rerun: string;
    pause: string;
    resume: string;
    cancel: string;
    configTitle?: string;
}
export interface ReportRunPanelProps {
    title: string;
    controller: ReportController<any, any>;
    runLabel: RunLabels;
    extraControls?: React.ReactNode;
    /** Module actions folded into the More menu, such as CSV exports. */
    menuItems?: {
        key: string;
        label: string;
        iconName?: string;
        disabled?: boolean;
        onClick: () => void;
    }[];
    /** Blocks the run button until the module reports its config is usable. */
    runDisabled?: boolean;
    /** Rendered inside the run dialog, so config is only asked for on run. */
    configPanel?: React.ReactNode;
    configOpen?: boolean;
    onConfigOpenChange?: (open: boolean) => void;
    /** Shown when a saved run is open, to go back to the run list. */
    onBack?: () => void;
    backLabel?: string;
    /** Enables the run details dialog: settings used, stages, issues and log. */
    definition?: ReportDefinition<any, any>;
}
export interface ReportHistoryProps {
    kind: string;
    title: string;
    newLabel: string;
    onNew: () => void;
    onOpen: (serverRelativeUrl: string) => void;
    onResume: (serverRelativeUrl: string) => void;
    busy?: boolean;
    /** Loads a run exported earlier, so results can be shared as a file. */
    onImport?: (file: File) => void;
    /** Surfaced above the table, so a failed open says why rather than doing nothing. */
    error?: string;
    onDismissError?: () => void;
}
export interface ReportDetailsProps {
    open: boolean;
    onDismiss: () => void;
    /** Opens straight onto a tab, so a running report can go to its log. */
    initialTab?: string;
    envelope?: any;
    definition: ReportDefinition<any, any>;
    logsEnabled: boolean;
}
export interface ReportConfigPanelProps<TConfig> {
    title: string;
    definition: ReportDefinition<any, TConfig>;
    config: TConfig;
    onChange: (config: TConfig) => void;
    disabled?: boolean;
    /** Renders just the fields, for use inside a dialog. */
    bare?: boolean;
}
export interface ReportIssuesProps {
    issues: {
        iso: string;
        stage: string;
        target: string;
        code: number | "error";
        message: string;
    }[];
    emptyTitle: string;
    emptyDescription: string;
}
//# sourceMappingURL=Shared.types.d.ts.map