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
import { webPartAuditReport } from "./WebPartAudit.report";
import { WebPartAuditContent } from "./WebPartAudit.content";
import { buildView } from "./WebPartAudit.logic";
import { OverviewTab } from "./tabs/Overview.tab";
import { TypesTab } from "./tabs/Types.tab";
import { InstancesTab } from "./tabs/Instances.tab";
import { PagesTab } from "./tabs/Pages.tab";
import { CatalogueTab } from "./tabs/Catalogue.tab";
import { WebPartTypeDialog } from "./WebPartType.dialog";
import { PageDialog } from "./Page.dialog";
import { exportWebPartAudit } from "./WebPartAudit.csv";
const WebPartAuditPage = () => {
    var _a, _b, _c;
    const controller = useReport(webPartAuditReport);
    const [tab, setTab] = React.useState("overview");
    const [configOpen, setConfigOpen] = React.useState(false);
    const [selectedType, setSelectedType] = React.useState(undefined);
    const [selectedPage, setSelectedPage] = React.useState(undefined);
    const module = findModule("webpart-audit");
    const data = (_a = controller.envelope) === null || _a === void 0 ? void 0 : _a.data;
    const updatedIso = (_b = controller.envelope) === null || _b === void 0 ? void 0 : _b.updatedIso;
    // Stages mutate data in place, so the envelope timestamp is what changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const view = React.useMemo(() => buildView(data), [data, updatedIso]);
    const instances = (_c = data === null || data === void 0 ? void 0 : data.instances) !== null && _c !== void 0 ? _c : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const pages = React.useMemo(() => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.pages) !== null && _a !== void 0 ? _a : []; }, [data, updatedIso]);
    const hasData = instances.length > 0 || pages.length > 0;
    const openPageFor = React.useCallback((instance) => setSelectedPage(pages.find((page) => page.pageId === instance.pageId && page.siteUrl === instance.siteUrl)), [pages]);
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: WebPartAuditContent.title, description: WebPartAuditContent.description, actions: module ? (React.createElement(Badge, { label: `${WebPartAuditContent.moduleVersion} ${module.version}`, tone: "neutral", showIcon: false })) : undefined }),
        !controller.envelope && !controller.running && (React.createElement(ReportHistory, { kind: webPartAuditReport.kind, title: WebPartAuditContent.historyTitle, newLabel: WebPartAuditContent.run, busy: controller.running, onNew: () => setConfigOpen(true), onOpen: (url) => void controller.open(url), onResume: (url) => void controller.resumeSaved(url), onImport: (file) => void controller.importJson(file), error: controller.error, onDismissError: controller.clearError })),
        React.createElement(ReportRunPanel, { title: webPartAuditReport.title, controller: controller, definition: webPartAuditReport, onBack: controller.envelope ? controller.clear : undefined, backLabel: WebPartAuditContent.backToRuns, configOpen: configOpen, onConfigOpenChange: setConfigOpen, configPanel: React.createElement(ReportConfigPanel, { bare: true, title: WebPartAuditContent.configTitle, definition: webPartAuditReport, config: controller.config, onChange: controller.setConfig }), extraControls: hasData ? (React.createElement(Button, { label: WebPartAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportWebPartAudit(data) })) : undefined, runLabel: {
                run: WebPartAuditContent.run,
                rerun: WebPartAuditContent.rerun,
                pause: WebPartAuditContent.pause,
                resume: WebPartAuditContent.resume,
                cancel: WebPartAuditContent.cancel,
                configTitle: WebPartAuditContent.configTitle,
            } }),
        (controller.envelope || controller.running) && (React.createElement("div", { style: { marginTop: Theme.tokens.space.lg, minWidth: 0 } },
            React.createElement(Tabs, { ariaLabel: WebPartAuditContent.title, selectedKey: tab, onChange: setTab, items: [
                    {
                        key: "overview",
                        label: WebPartAuditContent.tabs.overview,
                        content: React.createElement(OverviewTab, { view: view, hasData: hasData, onRun: () => setConfigOpen(true) }),
                    },
                    {
                        key: "types",
                        label: WebPartAuditContent.tabs.types,
                        count: view.types.length,
                        content: React.createElement(TypesTab, { types: view.types, onSelect: setSelectedType }),
                    },
                    {
                        key: "instances",
                        label: WebPartAuditContent.tabs.instances,
                        count: instances.length,
                        content: React.createElement(InstancesTab, { instances: instances, onOpenPage: openPageFor }),
                    },
                    {
                        key: "pages",
                        label: WebPartAuditContent.tabs.pages,
                        count: pages.length,
                        content: React.createElement(PagesTab, { pages: pages, onSelect: setSelectedPage }),
                    },
                    {
                        key: "catalogue",
                        label: WebPartAuditContent.tabs.catalogue,
                        count: view.catalogueOnly.length,
                        content: React.createElement(CatalogueTab, { rows: view.catalogueOnly }),
                    },
                ] }))),
        React.createElement(WebPartTypeDialog, { type: selectedType, instances: instances, onDismiss: () => setSelectedType(undefined), onOpenPage: openPageFor }),
        React.createElement(PageDialog, { page: selectedPage, instances: instances, onDismiss: () => setSelectedPage(undefined) })));
};
export default WebPartAuditPage;
//# sourceMappingURL=WebPartAudit.page.js.map