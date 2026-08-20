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
import { imagesAuditReport } from "./ImagesAudit.report";
import { ImagesAuditContent } from "./ImagesAudit.content";
import { buildView } from "./ImagesAudit.logic";
import { exportFiles } from "./ImagesAudit.csv";
import { OverviewTab } from "./tabs/Overview.tab";
import { FilesTab } from "./tabs/Files.tab";
import { UsagesTab } from "./tabs/Usages.tab";
const ImagesAuditPage = () => {
    var _a, _b, _c, _d, _e;
    const controller = useReport(imagesAuditReport);
    const [tab, setTab] = React.useState("overview");
    const [configOpen, setConfigOpen] = React.useState(false);
    const module = findModule("images-audit");
    const data = (_a = controller.envelope) === null || _a === void 0 ? void 0 : _a.data;
    const updatedIso = (_b = controller.envelope) === null || _b === void 0 ? void 0 : _b.updatedIso;
    const config = (_d = (_c = controller.envelope) === null || _c === void 0 ? void 0 : _c.config) !== null && _d !== void 0 ? _d : controller.config;
    // Stages mutate data in place, so the envelope timestamp is what changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const view = React.useMemo(() => buildView(data, config), [data, config, updatedIso]);
    const usages = (_e = data === null || data === void 0 ? void 0 : data.usages) !== null && _e !== void 0 ? _e : [];
    const hasData = view.files.length > 0 || usages.length > 0;
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: ImagesAuditContent.title, description: ImagesAuditContent.description, actions: module ? (React.createElement(Badge, { label: `${ImagesAuditContent.moduleVersion} ${module.version}`, tone: "neutral", showIcon: false })) : undefined }),
        !controller.envelope && !controller.running && (React.createElement(ReportHistory, { kind: imagesAuditReport.kind, title: ImagesAuditContent.historyTitle, newLabel: ImagesAuditContent.run, busy: controller.running, onNew: () => setConfigOpen(true), onOpen: (url) => void controller.open(url), onResume: (url) => void controller.resumeSaved(url), onImport: (file) => void controller.importJson(file), error: controller.error, onDismissError: controller.clearError })),
        React.createElement(ReportRunPanel, { title: imagesAuditReport.title, controller: controller, definition: imagesAuditReport, onBack: controller.envelope ? controller.clear : undefined, backLabel: ImagesAuditContent.backToRuns, configOpen: configOpen, onConfigOpenChange: setConfigOpen, configPanel: React.createElement(ReportConfigPanel, { bare: true, title: ImagesAuditContent.configTitle, definition: imagesAuditReport, config: controller.config, onChange: controller.setConfig }), extraControls: hasData ? (React.createElement(Button, { label: ImagesAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportFiles(view) })) : undefined, runLabel: {
                run: ImagesAuditContent.run,
                rerun: ImagesAuditContent.rerun,
                pause: ImagesAuditContent.pause,
                resume: ImagesAuditContent.resume,
                cancel: ImagesAuditContent.cancel,
                configTitle: ImagesAuditContent.configTitle,
            } }),
        (controller.envelope || controller.running) && (React.createElement("div", { style: { marginTop: Theme.tokens.space.lg, minWidth: 0 } },
            React.createElement(Tabs, { ariaLabel: ImagesAuditContent.title, selectedKey: tab, onChange: setTab, items: [
                    {
                        key: "overview",
                        label: ImagesAuditContent.tabs.overview,
                        content: React.createElement(OverviewTab, { view: view, hasData: hasData, onRun: () => setConfigOpen(true) }),
                    },
                    {
                        key: "files",
                        label: ImagesAuditContent.tabs.files,
                        count: view.files.length,
                        content: React.createElement(FilesTab, { files: view.files }),
                    },
                    {
                        key: "usages",
                        label: ImagesAuditContent.tabs.usages,
                        count: usages.length,
                        content: React.createElement(UsagesTab, { usages: usages }),
                    },
                    {
                        key: "duplicates",
                        label: ImagesAuditContent.tabs.duplicates,
                        count: view.duplicates.length,
                        content: (React.createElement(FilesTab, { files: view.duplicates, emptyTitle: ImagesAuditContent.noDuplicates.title, emptyDescription: ImagesAuditContent.noDuplicates.description })),
                    },
                    {
                        key: "unused",
                        label: ImagesAuditContent.tabs.unused,
                        count: view.unused.length,
                        content: (React.createElement(FilesTab, { files: view.unused, emptyTitle: ImagesAuditContent.noUnused.title, emptyDescription: ImagesAuditContent.noUnused.description })),
                    },
                ] })))));
};
export default ImagesAuditPage;
//# sourceMappingURL=ImagesAudit.page.js.map