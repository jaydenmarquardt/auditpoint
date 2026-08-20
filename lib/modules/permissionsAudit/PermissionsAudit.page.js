import * as React from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Tabs } from "../../components/data/Tabs";
import { Badge } from "../../components/feedback/Badge";
import { Theme } from "../../theme/Theme.api";
import { useReport } from "../../core/report/useReport";
import { ReportRunPanel } from "../shared/ReportRunPanel";
import { ReportConfigPanel } from "../shared/ReportConfigPanel";
import { ReportHistory } from "../shared/ReportHistory";
import { findModule } from "../Modules.registry";
import { permissionsAuditReport } from "./PermissionsAudit.report";
import { PermissionsAuditContent } from "./PermissionsAudit.content";
import { buildView } from "./PermissionsAudit.logic";
import { OverviewTab } from "./tabs/Overview.tab";
import { GroupsTab } from "./tabs/Groups.tab";
import { LevelsTab } from "./tabs/Levels.tab";
import { GrantsTab } from "./tabs/Grants.tab";
import { UniqueTab } from "./tabs/Unique.tab";
import { GroupDialog } from "./Group.dialog";
import { LevelDialog } from "./Level.dialog";
import { BrokenItemsTab } from "./tabs/BrokenItems.tab";
import { exportPermissionsAudit } from "./PermissionsAudit.csv";
const PermissionsAuditPage = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const controller = useReport(permissionsAuditReport);
    const [tab, setTab] = React.useState("overview");
    const [configOpen, setConfigOpen] = React.useState(false);
    const [selectedGroup, setSelectedGroup] = React.useState(undefined);
    const [selectedLevel, setSelectedLevel] = React.useState(undefined);
    const module = findModule("permissions-audit");
    const data = (_a = controller.envelope) === null || _a === void 0 ? void 0 : _a.data;
    const updatedIso = (_b = controller.envelope) === null || _b === void 0 ? void 0 : _b.updatedIso;
    const config = (_d = (_c = controller.envelope) === null || _c === void 0 ? void 0 : _c.config) !== null && _d !== void 0 ? _d : controller.config;
    // Stages mutate data in place, so the envelope timestamp is what changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const view = React.useMemo(() => buildView(data), [data, updatedIso]);
    const groups = (_e = data === null || data === void 0 ? void 0 : data.groups) !== null && _e !== void 0 ? _e : [];
    const levels = (_f = data === null || data === void 0 ? void 0 : data.levels) !== null && _f !== void 0 ? _f : [];
    const grants = (_g = data === null || data === void 0 ? void 0 : data.grants) !== null && _g !== void 0 ? _g : [];
    const scopes = (_h = data === null || data === void 0 ? void 0 : data.scopes) !== null && _h !== void 0 ? _h : [];
    const hasData = grants.length > 0 || groups.length > 0;
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: PermissionsAuditContent.title, description: PermissionsAuditContent.description, actions: module ? (React.createElement(Badge, { label: `${PermissionsAuditContent.moduleVersion} ${module.version}`, tone: "neutral", showIcon: false })) : undefined }),
        !controller.envelope && !controller.running && (React.createElement(ReportHistory, { kind: permissionsAuditReport.kind, title: PermissionsAuditContent.historyTitle, newLabel: PermissionsAuditContent.run, busy: controller.running, onNew: () => setConfigOpen(true), onOpen: (url) => void controller.open(url), onResume: (url) => void controller.resumeSaved(url), onImport: (file) => void controller.importJson(file), error: controller.error, onDismissError: controller.clearError })),
        React.createElement(ReportRunPanel, { title: permissionsAuditReport.title, controller: controller, definition: permissionsAuditReport, onBack: controller.envelope ? controller.clear : undefined, backLabel: PermissionsAuditContent.backToRuns, configOpen: configOpen, onConfigOpenChange: setConfigOpen, configPanel: React.createElement(ReportConfigPanel, { bare: true, title: PermissionsAuditContent.configTitle, definition: permissionsAuditReport, config: controller.config, onChange: controller.setConfig }), menuItems: hasData
                ? [
                    { key: "csv", label: PermissionsAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportPermissionsAudit(data) },
                ]
                : [], runLabel: {
                run: PermissionsAuditContent.run,
                rerun: PermissionsAuditContent.rerun,
                pause: PermissionsAuditContent.pause,
                resume: PermissionsAuditContent.resume,
                cancel: PermissionsAuditContent.cancel,
                configTitle: PermissionsAuditContent.configTitle,
            } }),
        (controller.envelope || controller.running) && (React.createElement("div", { style: { marginTop: Theme.tokens.space.lg, minWidth: 0 } },
            React.createElement(Tabs, { ariaLabel: PermissionsAuditContent.title, selectedKey: tab, onChange: setTab, items: [
                    {
                        key: "overview",
                        label: PermissionsAuditContent.tabs.overview,
                        content: (React.createElement(OverviewTab, { view: view, config: config, hasData: hasData, onRun: () => setConfigOpen(true) })),
                    },
                    {
                        key: "groups",
                        label: PermissionsAuditContent.tabs.groups,
                        count: groups.length,
                        content: React.createElement(GroupsTab, { groups: groups, onSelect: setSelectedGroup }),
                    },
                    {
                        key: "levels",
                        label: PermissionsAuditContent.tabs.levels,
                        count: levels.length,
                        content: React.createElement(LevelsTab, { levels: levels, onSelect: setSelectedLevel }),
                    },
                    {
                        key: "grants",
                        label: PermissionsAuditContent.tabs.grants,
                        count: grants.length,
                        content: React.createElement(GrantsTab, { grants: grants }),
                    },
                    {
                        key: "items",
                        label: PermissionsAuditContent.tabs.items,
                        count: ((_j = data === null || data === void 0 ? void 0 : data.brokenItems) !== null && _j !== void 0 ? _j : []).length,
                        content: (React.createElement(BrokenItemsTab, { items: (_k = data === null || data === void 0 ? void 0 : data.brokenItems) !== null && _k !== void 0 ? _k : [], enabled: config.checkItemBreaks })),
                    },
                    {
                        key: "unique",
                        label: PermissionsAuditContent.tabs.unique,
                        count: scopes.length,
                        content: React.createElement(UniqueTab, { scopes: scopes }),
                    },
                ] }))),
        React.createElement(GroupDialog, { group: selectedGroup, grants: grants, onDismiss: () => setSelectedGroup(undefined) }),
        React.createElement(LevelDialog, { level: selectedLevel, grants: grants, onDismiss: () => setSelectedLevel(undefined) })));
};
export default PermissionsAuditPage;
//# sourceMappingURL=PermissionsAudit.page.js.map