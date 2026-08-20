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
import { usersAuditReport } from "./UsersAudit.report";
import { UsersAuditContent } from "./UsersAudit.content";
import { buildView } from "./UsersAudit.logic";
import { exportUsers } from "./UsersAudit.csv";
import { OverviewTab } from "./tabs/Overview.tab";
import { UsersTab } from "./tabs/Users.tab";
import { GroupsTab } from "./tabs/Groups.tab";
import { UserDialog } from "./User.dialog";
import { groupsByLogin } from "./UsersAudit.logic";
const UsersAuditPage = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const controller = useReport(usersAuditReport);
    const [tab, setTab] = React.useState("overview");
    const [configOpen, setConfigOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState(undefined);
    const [extraProfiles, setExtraProfiles] = React.useState([]);
    const module = findModule("users-audit");
    const data = (_a = controller.envelope) === null || _a === void 0 ? void 0 : _a.data;
    const updatedIso = (_b = controller.envelope) === null || _b === void 0 ? void 0 : _b.updatedIso;
    const config = (_d = (_c = controller.envelope) === null || _c === void 0 ? void 0 : _c.config) !== null && _d !== void 0 ? _d : controller.config;
    // Stages mutate data in place, so the envelope timestamp is what changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const view = React.useMemo(() => buildView(data, config), [data, config, updatedIso]);
    const users = (_e = data === null || data === void 0 ? void 0 : data.users) !== null && _e !== void 0 ? _e : [];
    const groups = (_f = data === null || data === void 0 ? void 0 : data.groups) !== null && _f !== void 0 ? _f : [];
    const profiles = [...((_g = data === null || data === void 0 ? void 0 : data.profiles) !== null && _g !== void 0 ? _g : []), ...extraProfiles];
    const hasData = users.length > 0;
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: UsersAuditContent.title, description: UsersAuditContent.description, actions: module ? (React.createElement(Badge, { label: `${UsersAuditContent.moduleVersion} ${module.version}`, tone: "neutral", showIcon: false })) : undefined }),
        !controller.envelope && !controller.running && (React.createElement(ReportHistory, { kind: usersAuditReport.kind, title: UsersAuditContent.historyTitle, newLabel: UsersAuditContent.run, busy: controller.running, onNew: () => setConfigOpen(true), onOpen: (url) => void controller.open(url), onResume: (url) => void controller.resumeSaved(url), onImport: (file) => void controller.importJson(file), error: controller.error, onDismissError: controller.clearError })),
        React.createElement(ReportRunPanel, { title: usersAuditReport.title, controller: controller, definition: usersAuditReport, onBack: controller.envelope ? controller.clear : undefined, backLabel: UsersAuditContent.backToRuns, configOpen: configOpen, onConfigOpenChange: setConfigOpen, configPanel: React.createElement(ReportConfigPanel, { bare: true, title: UsersAuditContent.configTitle, definition: usersAuditReport, config: controller.config, onChange: controller.setConfig }), menuItems: hasData
                ? [
                    { key: "csv", label: UsersAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportUsers(data) },
                ]
                : [], runLabel: {
                run: UsersAuditContent.run,
                rerun: UsersAuditContent.rerun,
                pause: UsersAuditContent.pause,
                resume: UsersAuditContent.resume,
                cancel: UsersAuditContent.cancel,
                configTitle: UsersAuditContent.configTitle,
            } }),
        (controller.envelope || controller.running) && (React.createElement("div", { style: { marginTop: Theme.tokens.space.lg, minWidth: 0 } },
            React.createElement(Tabs, { ariaLabel: UsersAuditContent.title, selectedKey: tab, onChange: setTab, items: [
                    {
                        key: "overview",
                        label: UsersAuditContent.tabs.overview,
                        content: (React.createElement(OverviewTab, { view: view, config: config, hasData: hasData, onRun: () => setConfigOpen(true) })),
                    },
                    {
                        key: "users",
                        label: UsersAuditContent.tabs.users,
                        count: users.length,
                        content: (React.createElement(UsersTab, { users: users, groups: groups, recentDays: config.recentDays, onSelect: setSelectedUser })),
                    },
                    {
                        key: "groups",
                        label: UsersAuditContent.tabs.groups,
                        count: groups.length,
                        content: React.createElement(GroupsTab, { groups: groups }),
                    },
                ] }))),
        React.createElement(UserDialog, { user: selectedUser, profiles: profiles, groups: selectedUser
                ? (_h = groupsByLogin(groups).get(selectedUser.loginName.toLowerCase())) !== null && _h !== void 0 ? _h : []
                : [], onLoaded: (profile) => setExtraProfiles((current) => [...current, profile]), onDismiss: () => setSelectedUser(undefined) })));
};
export default UsersAuditPage;
//# sourceMappingURL=UsersAudit.page.js.map