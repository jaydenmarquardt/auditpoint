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
import { listsAuditReport } from "./ListsAudit.report";
import { ListsAuditContent } from "./ListsAudit.content";
import { buildView } from "./ListsAudit.logic";
import { listColumns } from "./ListsAudit.columns";
import { OverviewTab } from "./tabs/Overview.tab";
import { AllListsTab } from "./tabs/AllLists.tab";
import { ListDialog } from "./List.dialog";
import { exportListsAudit } from "./ListsAudit.csv";
const ListsAuditPage = () => {
    var _a, _b, _c, _d, _e;
    const controller = useReport(listsAuditReport);
    const [tab, setTab] = React.useState("overview");
    const [configOpen, setConfigOpen] = React.useState(false);
    const [selectedList, setSelectedList] = React.useState(undefined);
    const module = findModule("lists-audit");
    const data = (_a = controller.envelope) === null || _a === void 0 ? void 0 : _a.data;
    const updatedIso = (_b = controller.envelope) === null || _b === void 0 ? void 0 : _b.updatedIso;
    const config = (_d = (_c = controller.envelope) === null || _c === void 0 ? void 0 : _c.config) !== null && _d !== void 0 ? _d : controller.config;
    // Stages mutate data in place, so the envelope timestamp is what changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const view = React.useMemo(() => buildView(data, config), [data, config, updatedIso]);
    const rows = (_e = data === null || data === void 0 ? void 0 : data.lists) !== null && _e !== void 0 ? _e : [];
    const hasData = rows.length > 0;
    const columns = React.useMemo(() => listColumns(setSelectedList), []);
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: ListsAuditContent.title, description: ListsAuditContent.description, actions: module ? (React.createElement(Badge, { label: `${ListsAuditContent.moduleVersion} ${module.version}`, tone: "neutral", showIcon: false })) : undefined }),
        !controller.envelope && !controller.running && (React.createElement(ReportHistory, { kind: listsAuditReport.kind, title: ListsAuditContent.historyTitle, newLabel: ListsAuditContent.run, busy: controller.running, onNew: () => setConfigOpen(true), onOpen: (url) => void controller.open(url), onResume: (url) => void controller.resumeSaved(url), onImport: (file) => void controller.importJson(file), error: controller.error, onDismissError: controller.clearError })),
        React.createElement(ReportRunPanel, { title: listsAuditReport.title, controller: controller, definition: listsAuditReport, onBack: controller.envelope ? controller.clear : undefined, backLabel: ListsAuditContent.backToRuns, configOpen: configOpen, onConfigOpenChange: setConfigOpen, configPanel: React.createElement(ReportConfigPanel, { bare: true, title: ListsAuditContent.configTitle, definition: listsAuditReport, config: controller.config, onChange: controller.setConfig }), extraControls: hasData ? (React.createElement(Button, { label: ListsAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportListsAudit(data) })) : undefined, runLabel: {
                run: ListsAuditContent.run,
                rerun: ListsAuditContent.rerun,
                pause: ListsAuditContent.pause,
                resume: ListsAuditContent.resume,
                cancel: ListsAuditContent.cancel,
                configTitle: ListsAuditContent.configTitle,
            } }),
        (controller.envelope || controller.running) && (React.createElement("div", { style: { marginTop: Theme.tokens.space.lg, minWidth: 0 } },
            React.createElement(Tabs, { ariaLabel: ListsAuditContent.title, selectedKey: tab, onChange: setTab, items: [
                    {
                        key: "overview",
                        label: ListsAuditContent.tabs.overview,
                        content: (React.createElement(OverviewTab, { view: view, config: config, hasData: hasData, onRun: () => setConfigOpen(true) })),
                    },
                    {
                        key: "lists",
                        label: ListsAuditContent.tabs.lists,
                        count: rows.length,
                        content: React.createElement(AllListsTab, { rows: rows, columns: columns, onSelect: setSelectedList }),
                    },
                ] }))),
        React.createElement(ListDialog, { list: selectedList, onDismiss: () => setSelectedList(undefined) })));
};
export default ListsAuditPage;
//# sourceMappingURL=ListsAudit.page.js.map