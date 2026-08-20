import * as React from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Tabs } from "../../components/data/Tabs";
import { Button } from "../../components/actions/Button";
import { Badge } from "../../components/feedback/Badge";
import { Theme } from "../../theme/Theme.api";
import { useReport } from "../../core/report/useReport";
import { ReportRunPanel } from "../shared/ReportRunPanel";
import { ReportConfigPanel } from "../shared/ReportConfigPanel";
import { ReportHistory } from "../shared/ReportHistory";
import { findModule } from "../Modules.registry";
import { statTiles } from "./ContentAudit.stats";
import { ComparisonBar } from "../shared/ComparisonBar";
import { contentAuditReport } from "./ContentAudit.report";
import { ContentAuditContent } from "./ContentAudit.content";
import { buildView } from "./ContentAudit.logic";
import { exportContentAudit } from "./ContentAudit.csv";
import { OverviewTab } from "./tabs/Overview.tab";
import { EntriesTab } from "./tabs/Entries.tab";
import { ContentDialog } from "./Content.dialog";
const ContentAuditPage = () => {
    var _a, _b, _c, _d, _e, _f;
    const controller = useReport(contentAuditReport);
    const [tab, setTab] = React.useState("overview");
    const [configOpen, setConfigOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(undefined);
    const module = findModule("content-audit");
    const data = (_a = controller.envelope) === null || _a === void 0 ? void 0 : _a.data;
    const updatedIso = (_b = controller.envelope) === null || _b === void 0 ? void 0 : _b.updatedIso;
    const config = (_d = (_c = controller.envelope) === null || _c === void 0 ? void 0 : _c.config) !== null && _d !== void 0 ? _d : controller.config;
    // Stages mutate data in place, so the envelope timestamp is what changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const view = React.useMemo(() => buildView(data, config), [data, config, updatedIso]);
    const [previousData, setPreviousData] = React.useState(undefined);
    // The earlier run is rebuilt through the same view, so every tile compares like for like.
    const previousTiles = React.useMemo(() => {
        if (!previousData)
            return undefined;
        const previousView = buildView(previousData, config);
        return statTiles(previousView);
    }, [previousData, config]);
    const entries = (_e = data === null || data === void 0 ? void 0 : data.entries) !== null && _e !== void 0 ? _e : [];
    const hasData = entries.length > 0;
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: ContentAuditContent.title, description: ContentAuditContent.description, actions: module ? (React.createElement(Badge, { label: `${ContentAuditContent.moduleVersion} ${module.version}`, tone: "neutral", showIcon: false })) : undefined }),
        !controller.envelope && !controller.running && (React.createElement(ReportHistory, { kind: contentAuditReport.kind, title: ContentAuditContent.historyTitle, newLabel: ContentAuditContent.run, busy: controller.running, onNew: () => setConfigOpen(true), onOpen: (url) => void controller.open(url), onResume: (url) => void controller.resumeSaved(url), onImport: (file) => void controller.importJson(file), error: controller.error, onDismissError: controller.clearError })),
        React.createElement(ReportRunPanel, { title: contentAuditReport.title, controller: controller, definition: contentAuditReport, onBack: controller.envelope ? controller.clear : undefined, backLabel: ContentAuditContent.backToRuns, configOpen: configOpen, onConfigOpenChange: setConfigOpen, configPanel: React.createElement(ReportConfigPanel, { bare: true, title: ContentAuditContent.configTitle, definition: contentAuditReport, config: controller.config, onChange: controller.setConfig }), extraControls: hasData ? (React.createElement(Button, { label: ContentAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportContentAudit(data) })) : undefined, runLabel: {
                run: ContentAuditContent.run,
                rerun: ContentAuditContent.rerun,
                pause: ContentAuditContent.pause,
                resume: ContentAuditContent.resume,
                cancel: ContentAuditContent.cancel,
                configTitle: ContentAuditContent.configTitle,
            } }),
        (controller.envelope || controller.running) && (React.createElement("div", { style: { marginTop: Theme.tokens.space.lg, minWidth: 0 } },
            React.createElement(Tabs, { ariaLabel: ContentAuditContent.title, selectedKey: tab, onChange: setTab, items: [
                    {
                        key: "overview",
                        label: ContentAuditContent.tabs.overview,
                        content: React.createElement(OverviewTab, { view: view, hasData: hasData, onRun: () => setConfigOpen(true), previousTiles: previousTiles, comparison: hasData ? (React.createElement(ComparisonBar, { kind: contentAuditReport.kind, currentId: (_f = controller.envelope) === null || _f === void 0 ? void 0 : _f.id, onChange: (next) => setPreviousData(next) })) : undefined }),
                    },
                    {
                        key: "entries",
                        label: ContentAuditContent.tabs.entries,
                        count: entries.length,
                        content: (React.createElement(EntriesTab, { entries: entries, thinWordCount: config.thinWordCount, onSelect: setSelected })),
                    },
                    {
                        key: "issues",
                        label: ContentAuditContent.tabs.issues,
                        count: view.issues.length,
                        content: (React.createElement(EntriesTab, { entries: view.issues, thinWordCount: config.thinWordCount, emptyTitle: ContentAuditContent.noIssues.title, onSelect: setSelected })),
                    },
                ] }))),
        React.createElement(ContentDialog, { entry: selected, thinWordCount: config.thinWordCount, onDismiss: () => setSelected(undefined) })));
};
export default ContentAuditPage;
//# sourceMappingURL=ContentAudit.page.js.map