import * as React from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Tabs } from "../../components/data/Tabs";
import { Badge } from "../../components/feedback/Badge";
import { Theme } from "../../theme/Theme.api";
import { originOf } from "../../api/Links.api";
import { useReport } from "../../core/report/useReport";
import { ReportRunPanel } from "../shared/ReportRunPanel";
import { ReportConfigPanel } from "../shared/ReportConfigPanel";
import { ReportHistory } from "../shared/ReportHistory";
import { findModule } from "../Modules.registry";
import { linkAuditReport } from "./LinkAudit.report";
import { LinkAuditContent } from "./LinkAudit.content";
import { buildView } from "./LinkAudit.logic";
import { OverviewTab } from "./tabs/Overview.tab";
import { ReferencesTab } from "./tabs/References.tab";
import { LinksTab } from "./tabs/Links.tab";
import { BrokenTab } from "./tabs/Broken.tab";
import { ExternalTab } from "./tabs/External.tab";
import { ActionsTab } from "./tabs/Actions.tab";
import { ReferenceDialog } from "./Reference.dialog";
import { LinkDialog } from "./Link.dialog";
const LinkAuditPage = () => {
    var _a, _b, _c, _d;
    const controller = useReport(linkAuditReport);
    const [tab, setTab] = React.useState("overview");
    const [configOpen, setConfigOpen] = React.useState(false);
    const [reference, setReference] = React.useState(undefined);
    const [link, setLink] = React.useState(undefined);
    const module = findModule("link-audit");
    const data = (_a = controller.envelope) === null || _a === void 0 ? void 0 : _a.data;
    const updatedIso = (_b = controller.envelope) === null || _b === void 0 ? void 0 : _b.updatedIso;
    const origin = React.useMemo(() => { var _a, _b; return originOf((_b = (_a = controller.envelope) === null || _a === void 0 ? void 0 : _a.sites) === null || _b === void 0 ? void 0 : _b[0]); }, [(_c = controller.envelope) === null || _c === void 0 ? void 0 : _c.sites]);
    // Stages mutate data in place, so the envelope timestamp is what changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const view = React.useMemo(() => buildView(data, origin), [data, origin, updatedIso]);
    const references = (_d = data === null || data === void 0 ? void 0 : data.references) !== null && _d !== void 0 ? _d : [];
    const hasData = references.length > 0;
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: LinkAuditContent.title, description: LinkAuditContent.description, actions: module ? (React.createElement(Badge, { label: `${LinkAuditContent.moduleVersion} ${module.version}`, tone: "neutral", showIcon: false })) : undefined }),
        !controller.envelope && !controller.running && (React.createElement(ReportHistory, { kind: linkAuditReport.kind, title: LinkAuditContent.historyTitle, newLabel: LinkAuditContent.run, busy: controller.running, onNew: () => setConfigOpen(true), onOpen: (url) => void controller.open(url), onResume: (url) => void controller.resumeSaved(url), onImport: (file) => void controller.importJson(file), error: controller.error, onDismissError: controller.clearError })),
        React.createElement(ReportRunPanel, { title: linkAuditReport.title, controller: controller, definition: linkAuditReport, onBack: controller.envelope ? controller.clear : undefined, backLabel: LinkAuditContent.backToRuns, configOpen: configOpen, onConfigOpenChange: setConfigOpen, configPanel: React.createElement(ReportConfigPanel, { bare: true, title: LinkAuditContent.configTitle, definition: linkAuditReport, config: controller.config, onChange: controller.setConfig }), runLabel: {
                run: LinkAuditContent.run,
                rerun: LinkAuditContent.rerun,
                pause: LinkAuditContent.pause,
                resume: LinkAuditContent.resume,
                cancel: LinkAuditContent.cancel,
                configTitle: LinkAuditContent.configTitle,
            } }),
        (controller.envelope || controller.running) && (React.createElement("div", { style: { marginTop: Theme.tokens.space.lg, minWidth: 0 } },
            React.createElement(Tabs, { ariaLabel: LinkAuditContent.title, selectedKey: tab, onChange: setTab, items: [
                    {
                        key: "overview",
                        label: LinkAuditContent.tabs.overview,
                        content: React.createElement(OverviewTab, { view: view, hasData: hasData, onRun: () => setConfigOpen(true) }),
                    },
                    {
                        key: "references",
                        label: LinkAuditContent.tabs.references,
                        count: references.length,
                        content: React.createElement(ReferencesTab, { references: references, onSelect: setReference }),
                    },
                    {
                        key: "links",
                        label: LinkAuditContent.tabs.links,
                        count: view.links.length,
                        content: React.createElement(LinksTab, { links: view.links, onSelect: setLink }),
                    },
                    {
                        key: "broken",
                        label: LinkAuditContent.tabs.broken,
                        count: view.broken.length,
                        content: React.createElement(BrokenTab, { usages: view.broken }),
                    },
                    {
                        key: "external",
                        label: LinkAuditContent.tabs.external,
                        count: view.external.length,
                        content: React.createElement(ExternalTab, { usages: view.external }),
                    },
                    {
                        key: "actions",
                        label: LinkAuditContent.tabs.actions,
                        content: React.createElement(ActionsTab, { view: view }),
                    },
                ] }))),
        React.createElement(ReferenceDialog, { reference: reference, onDismiss: () => setReference(undefined) }),
        React.createElement(LinkDialog, { link: link, origin: origin, onDismiss: () => setLink(undefined) })));
};
export default LinkAuditPage;
//# sourceMappingURL=LinkAudit.page.js.map