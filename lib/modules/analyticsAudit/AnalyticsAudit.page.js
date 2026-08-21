import * as React from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { ReportSkeleton } from "../shared/ReportSkeleton";
import { Tabs } from "../../components/data/Tabs";
import { Badge } from "../../components/feedback/Badge";
import { Dropdown } from "../../components/inputs/Dropdown";
import { Theme } from "../../theme/Theme.api";
import { getSettings } from "../../api/Settings.api";
import { useReport } from "../../core/report/useReport";
import { ReportRunPanel } from "../shared/ReportRunPanel";
import { ReportConfigPanel } from "../shared/ReportConfigPanel";
import { ReportHistory } from "../shared/ReportHistory";
import { findModule } from "../Modules.registry";
import { ComparisonBar } from "../shared/ComparisonBar";
import { ComparisonCards } from "../shared/ComparisonCards";
import { compareTiles } from "../shared/StatSections";
import { analyticsAuditReport } from "./AnalyticsAudit.report";
import { AnalyticsAuditContent } from "./AnalyticsAudit.content";
import { buildView } from "./AnalyticsAudit.logic";
import { statTiles } from "./AnalyticsAudit.stats";
import { exportAnalyticsAudit } from "./AnalyticsAudit.csv";
import { OverviewTab } from "./tabs/Overview.tab";
import { EntriesTab } from "./tabs/Entries.tab";
const WINDOWS = ["today", "last7", "last30", "last90", "allTime"];
const AnalyticsAuditPage = () => {
    var _a, _b, _c, _d;
    const controller = useReport(analyticsAuditReport);
    const [tab, setTab] = React.useState("overview");
    const [configOpen, setConfigOpen] = React.useState(false);
    const [activeWindow, setActiveWindow] = React.useState("last30");
    const [previousData, setPreviousData] = React.useState(undefined);
    const module = findModule("analytics-audit");
    const data = (_a = controller.envelope) === null || _a === void 0 ? void 0 : _a.data;
    const updatedIso = (_b = controller.envelope) === null || _b === void 0 ? void 0 : _b.updatedIso;
    // Stages mutate data in place, so the envelope timestamp is what changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const view = React.useMemo(() => buildView(data, activeWindow), [data, activeWindow, updatedIso]);
    const previousTiles = React.useMemo(() => (previousData ? statTiles(buildView(previousData, activeWindow), activeWindow) : undefined), [previousData, activeWindow]);
    const entries = (_c = data === null || data === void 0 ? void 0 : data.entries) !== null && _c !== void 0 ? _c : [];
    const hasData = entries.length > 0;
    if (controller.loading) {
        return React.createElement(ReportSkeleton, { label: "Opening report" });
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: AnalyticsAuditContent.title, description: AnalyticsAuditContent.description, actions: module ? (React.createElement(Badge, { label: `${AnalyticsAuditContent.moduleVersion} ${module.version}`, tone: "neutral", showIcon: false })) : undefined }),
        !controller.envelope && !controller.running && (React.createElement(ReportHistory, { kind: analyticsAuditReport.kind, title: AnalyticsAuditContent.historyTitle, newLabel: AnalyticsAuditContent.run, busy: controller.running || controller.loading, onNew: () => setConfigOpen(true), onOpen: (url) => controller.open(url), onResume: (url) => controller.resumeSaved(url), onImport: (file) => void controller.importJson(file), error: controller.error, onDismissError: controller.clearError })),
        React.createElement(ReportRunPanel, { title: analyticsAuditReport.title, controller: controller, definition: analyticsAuditReport, onBack: controller.envelope ? controller.clear : undefined, backLabel: AnalyticsAuditContent.backToRuns, configOpen: configOpen, onConfigOpenChange: setConfigOpen, configPanel: React.createElement(ReportConfigPanel, { bare: true, title: AnalyticsAuditContent.configTitle, definition: analyticsAuditReport, config: Object.assign(Object.assign({}, controller.config), { 
                    // The column mapping already knows the site's area column.
                    orgUnitColumn: controller.config.orgUnitColumn || getSettings().fields.organisationalUnit }), onChange: controller.setConfig }), menuItems: hasData
                ? [
                    {
                        key: "csv",
                        label: AnalyticsAuditContent.exportCsv,
                        iconName: "ExcelDocument",
                        onClick: () => exportAnalyticsAudit(data),
                    },
                ]
                : [], runLabel: {
                run: AnalyticsAuditContent.run,
                rerun: AnalyticsAuditContent.rerun,
                pause: AnalyticsAuditContent.pause,
                resume: AnalyticsAuditContent.resume,
                cancel: AnalyticsAuditContent.cancel,
                configTitle: AnalyticsAuditContent.configTitle,
            } }),
        (controller.envelope || controller.running) && (React.createElement("div", { style: { marginTop: Theme.tokens.space.lg, minWidth: 0 } },
            React.createElement("div", { style: { maxWidth: 260, marginBottom: Theme.tokens.space.md } },
                React.createElement(Dropdown, { label: AnalyticsAuditContent.windows.label, options: WINDOWS.map((key) => ({ key, text: AnalyticsAuditContent.windows[key] })), selectedKey: activeWindow, onChange: (key) => setActiveWindow(key) })),
            React.createElement(Tabs, { ariaLabel: AnalyticsAuditContent.title, selectedKey: tab, onChange: setTab, items: [
                    {
                        key: "overview",
                        label: AnalyticsAuditContent.tabs.overview,
                        content: (React.createElement(OverviewTab, { view: view, window: activeWindow, hasData: hasData, sampled: Boolean(data === null || data === void 0 ? void 0 : data.activitySampled), onRun: () => setConfigOpen(true), previousTiles: previousTiles, comparisonCards: previousTiles ? (React.createElement(ComparisonCards, { sections: [{ title: "", tiles: compareTiles(statTiles(view, activeWindow), previousTiles) }] })) : undefined, comparison: hasData ? (React.createElement(ComparisonBar, { kind: analyticsAuditReport.kind, currentId: (_d = controller.envelope) === null || _d === void 0 ? void 0 : _d.id, onChange: (next) => setPreviousData(next) })) : undefined })),
                    },
                    {
                        key: "pages",
                        label: AnalyticsAuditContent.tabs.pages,
                        count: view.pages.length,
                        content: React.createElement(EntriesTab, { entries: view.pages, window: activeWindow }),
                    },
                    {
                        key: "files",
                        label: AnalyticsAuditContent.tabs.files,
                        count: view.files.length,
                        content: React.createElement(EntriesTab, { entries: view.files, window: activeWindow }),
                    },
                    {
                        key: "unviewed",
                        label: AnalyticsAuditContent.tabs.unviewed,
                        count: view.unviewed.length,
                        content: (React.createElement(EntriesTab, { entries: view.unviewed, window: activeWindow, emptyTitle: AnalyticsAuditContent.tabs.unviewed, emptyDescription: AnalyticsAuditContent.empty.unviewed })),
                    },
                ] })))));
};
export default AnalyticsAuditPage;
//# sourceMappingURL=AnalyticsAudit.page.js.map