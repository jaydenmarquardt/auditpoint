import * as React from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { ReportSkeleton } from "../shared/ReportSkeleton";
import { Tabs } from "../../components/data/Tabs";
import { Badge } from "../../components/feedback/Badge";
import { Theme } from "../../theme/Theme.api";
import { useReport } from "../../core/report/useReport";
import { ReportRunPanel } from "../shared/ReportRunPanel";
import { ReportConfigPanel } from "../shared/ReportConfigPanel";
import { ReportHistory } from "../shared/ReportHistory";
import { findModule } from "../Modules.registry";
import { indexingAuditReport } from "./IndexingAudit.report";
import { IndexingAuditContent } from "./IndexingAudit.content";
import { buildView } from "./IndexingAudit.logic";
import { OverviewTab } from "./tabs/Overview.tab";
import { ListsTab } from "./tabs/Lists.tab";
import { ItemsTab } from "./tabs/Items.tab";
import { PropertiesTab } from "./tabs/Properties.tab";
import { exportIndexingAudit } from "./IndexingAudit.csv";
const IndexingAuditPage = () => {
    var _a, _b, _c, _d, _e, _f, _g;
    const controller = useReport(indexingAuditReport);
    const [tab, setTab] = React.useState("overview");
    const [configOpen, setConfigOpen] = React.useState(false);
    const module = findModule("indexing-audit");
    const data = (_a = controller.envelope) === null || _a === void 0 ? void 0 : _a.data;
    const updatedIso = (_b = controller.envelope) === null || _b === void 0 ? void 0 : _b.updatedIso;
    const config = (_d = (_c = controller.envelope) === null || _c === void 0 ? void 0 : _c.config) !== null && _d !== void 0 ? _d : controller.config;
    // Stages mutate data in place, so the envelope timestamp is what changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const view = React.useMemo(() => buildView(data, config), [data, config, updatedIso]);
    const lists = (_e = data === null || data === void 0 ? void 0 : data.lists) !== null && _e !== void 0 ? _e : [];
    const items = (_f = data === null || data === void 0 ? void 0 : data.items) !== null && _f !== void 0 ? _f : [];
    const properties = (_g = data === null || data === void 0 ? void 0 : data.managedProperties) !== null && _g !== void 0 ? _g : [];
    const hasData = lists.length > 0;
    if (controller.loading) {
        return React.createElement(ReportSkeleton, { label: "Opening report" });
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: IndexingAuditContent.title, description: IndexingAuditContent.description, actions: module ? (React.createElement(Badge, { label: `${IndexingAuditContent.moduleVersion} ${module.version}`, tone: "neutral", showIcon: false })) : undefined }),
        !controller.envelope && !controller.running && (React.createElement(ReportHistory, { kind: indexingAuditReport.kind, title: IndexingAuditContent.historyTitle, newLabel: IndexingAuditContent.run, busy: controller.running || controller.loading, onNew: () => setConfigOpen(true), onOpen: (url) => void controller.open(url), onResume: (url) => void controller.resumeSaved(url), onImport: (file) => void controller.importJson(file), error: controller.error, onDismissError: controller.clearError })),
        React.createElement(ReportRunPanel, { title: indexingAuditReport.title, controller: controller, definition: indexingAuditReport, onBack: controller.envelope ? controller.clear : undefined, backLabel: IndexingAuditContent.backToRuns, configOpen: configOpen, onConfigOpenChange: setConfigOpen, configPanel: React.createElement(ReportConfigPanel, { bare: true, title: IndexingAuditContent.configTitle, definition: indexingAuditReport, config: controller.config, onChange: controller.setConfig }), menuItems: hasData
                ? [
                    { key: "csv", label: IndexingAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportIndexingAudit(data) },
                ]
                : [], runLabel: {
                run: IndexingAuditContent.run,
                rerun: IndexingAuditContent.rerun,
                pause: IndexingAuditContent.pause,
                resume: IndexingAuditContent.resume,
                cancel: IndexingAuditContent.cancel,
                configTitle: IndexingAuditContent.configTitle,
            } }),
        (controller.envelope || controller.running) && (React.createElement("div", { style: { marginTop: Theme.tokens.space.lg, minWidth: 0 } },
            React.createElement(Tabs, { ariaLabel: IndexingAuditContent.title, selectedKey: tab, onChange: setTab, items: [
                    {
                        key: "overview",
                        label: IndexingAuditContent.tabs.overview,
                        content: (React.createElement(OverviewTab, { view: view, config: config, hasData: hasData, onRun: () => setConfigOpen(true) })),
                    },
                    {
                        key: "lists",
                        label: IndexingAuditContent.tabs.lists,
                        count: lists.length,
                        content: React.createElement(ListsTab, { rows: lists, target: config.coverageWarningPercent }),
                    },
                    {
                        key: "items",
                        label: IndexingAuditContent.tabs.items,
                        count: items.length,
                        content: React.createElement(ItemsTab, { rows: items }),
                    },
                    {
                        key: "properties",
                        label: IndexingAuditContent.tabs.properties,
                        count: properties.length,
                        content: React.createElement(PropertiesTab, { properties: properties }),
                    },
                ] })))));
};
export default IndexingAuditPage;
//# sourceMappingURL=IndexingAudit.page.js.map