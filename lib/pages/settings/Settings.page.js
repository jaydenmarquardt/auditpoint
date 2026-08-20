import * as React from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/layout/Card";
import { Toolbar } from "../../components/layout/Toolbar";
import { StatTile } from "../../components/layout/StatTile";
import { Button } from "../../components/actions/Button";
import { Badge } from "../../components/feedback/Badge";
import { Notice } from "../../components/feedback/Notice";
import { TextField } from "../../components/inputs/TextField";
import { TextArea } from "../../components/inputs/TextArea";
import { Toggle } from "../../components/inputs/Toggle";
import { NumberField } from "../../components/inputs/NumberField";
import { FieldRow } from "../../components/inputs/FieldRow";
import { Theme } from "../../theme/Theme.api";
import { useApp } from "../../core/context/App.context";
import { checkConfig, getSettings, parseSiteList, saveSettings, useSettings } from "../../api/Settings.api";
import { Reports, reportFolderUrl } from "../../api/Reports.api";
import { isThrottlePaused, pauseThrottle, resumeThrottle, useThrottleState } from "../../api/Throttle.api";
import { Checkbox } from "../../components/inputs/Checkbox";
import { hostModules, offeredModules } from "../../modules/Modules.registry";
import { SettingsContent } from "./Settings.content";
import { formatNumber } from "../../utils/Format.util";
import { editModeUrl } from "../../utils/Url.util";
const SettingsPage = () => {
    const settings = useSettings();
    const throttle = useThrottleState();
    const { editMode } = useApp();
    const [draft, setDraft] = React.useState(settings);
    const [applied, setApplied] = React.useState(false);
    const [paused, setPaused] = React.useState(isThrottlePaused());
    const [folder, setFolder] = React.useState(undefined);
    const [checking, setChecking] = React.useState(false);
    const config = checkConfig(settings);
    const dirty = JSON.stringify(draft) !== JSON.stringify(settings);
    const runCheck = React.useCallback((ensure) => {
        setChecking(true);
        const operation = ensure ? Reports().ensureFolder() : Reports().checkFolder();
        operation
            .then(setFolder)
            .catch(() => setFolder(undefined))
            .then(() => setChecking(false))
            .catch(() => setChecking(false));
    }, []);
    React.useEffect(() => {
        if (config.configured)
            runCheck(false);
    }, [config.configured, settings.reportLibrary, settings.reportFolder, runCheck]);
    const apply = () => {
        saveSettings(draft);
        setApplied(true);
    };
    const set = (key, value) => setDraft((current) => (Object.assign(Object.assign({}, current), { [key]: value })));
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: SettingsContent.title, description: SettingsContent.description, actions: editMode ? (React.createElement(React.Fragment, null,
                React.createElement(Button, { label: SettingsContent.reset, onClick: () => setDraft(getSettings()), disabled: !dirty }),
                React.createElement(Button, { label: SettingsContent.save, variant: "primary", iconName: "Save", onClick: apply, disabled: !dirty }))) : (React.createElement(Button, { label: SettingsContent.enterEditMode, variant: "primary", iconName: "Edit", onClick: () => window.location.assign(editModeUrl()) })) }),
        React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } },
            !editMode && React.createElement(Notice, { tone: "info", message: SettingsContent.readOnlyNotice }),
            applied && editMode && React.createElement(Notice, { tone: "success", message: SettingsContent.unsavedNotice, onDismiss: () => setApplied(false) }),
            !config.configured && (React.createElement(Notice, { tone: "warning", message: `${SettingsContent.configWarning} ${config.missing.join(", ")}` })),
            React.createElement(Card, { title: SettingsContent.branding },
                React.createElement(FieldRow, null,
                    React.createElement(TextField, { label: SettingsContent.fields.appName, value: draft.appName, onChange: (value) => set("appName", value), disabled: !editMode }),
                    React.createElement(TextField, { label: SettingsContent.fields.appTagline, value: draft.appTagline, onChange: (value) => set("appTagline", value), disabled: !editMode }),
                    React.createElement(TextField, { label: SettingsContent.fields.defaultRoute, value: draft.defaultRoute, onChange: (value) => set("defaultRoute", value), disabled: !editMode }))),
            React.createElement(Card, { title: SettingsContent.reports },
                React.createElement(FieldRow, null,
                    React.createElement(TextField, { label: SettingsContent.fields.reportLibrary, value: draft.reportLibrary, onChange: (value) => set("reportLibrary", value), placeholder: "SiteAssets", required: true, disabled: !editMode }),
                    React.createElement(TextField, { label: SettingsContent.fields.reportFolder, value: draft.reportFolder, onChange: (value) => set("reportFolder", value), placeholder: "Audit/Reports", required: true, disabled: !editMode })),
                React.createElement("p", { style: { margin: `${Theme.tokens.space.sm} 0 0`, color: Theme.palette().textMuted } },
                    SettingsContent.fields.path,
                    ": ",
                    React.createElement("code", null, config.configured ? reportFolderUrl() : "-"))),
            React.createElement(Card, { title: SettingsContent.folder.title, actions: React.createElement(Toolbar, { ariaLabel: SettingsContent.folder.title },
                    React.createElement(Button, { label: SettingsContent.folder.check, iconName: "Refresh", onClick: () => runCheck(false), disabled: !config.configured || checking }),
                    React.createElement(Button, { label: SettingsContent.folder.ensure, variant: "primary", iconName: "FabricNewFolder", onClick: () => runCheck(true), disabled: !config.configured || checking, busy: checking })) },
                checking && React.createElement("span", null, SettingsContent.folder.checking),
                !checking && folder && (React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.sm, flexWrap: "wrap", alignItems: "center" } },
                    React.createElement(Badge, { label: folder.exists ? SettingsContent.folder.exists : SettingsContent.folder.missing, tone: folder.exists ? "success" : "warning" }),
                    React.createElement(Badge, { label: `${SettingsContent.folder.view}: ${folder.canView ? "yes" : "no"}`, tone: folder.canView ? "success" : "danger" }),
                    React.createElement(Badge, { label: `${SettingsContent.folder.edit}: ${folder.canEdit ? "yes" : "no"}`, tone: folder.canEdit ? "success" : "danger" }),
                    React.createElement("code", { style: { color: Theme.palette().textMuted } }, folder.url),
                    folder.exists && !folder.canEdit && React.createElement(Notice, { tone: "warning", message: SettingsContent.folder.noEdit }),
                    !folder.canView && React.createElement(Notice, { tone: "error", message: SettingsContent.folder.noView })))),
            React.createElement(Card, { title: SettingsContent.modules.title, subtitle: SettingsContent.modules.description, actions: React.createElement(Toolbar, { ariaLabel: SettingsContent.modules.title },
                    React.createElement(Button, { label: SettingsContent.modules.enableAll, onClick: () => set("disabledModules", []), disabled: !editMode || draft.disabledModules.length === 0 }),
                    React.createElement(Button, { label: SettingsContent.modules.disableAll, onClick: () => set("disabledModules", offeredModules().map((module) => module.key)), disabled: !editMode || draft.disabledModules.length === offeredModules().length })) },
                hostModules() && React.createElement(Notice, { tone: "info", message: SettingsContent.modules.hostLimited }),
                React.createElement("div", { style: {
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
                        gap: Theme.tokens.space.sm,
                        marginTop: Theme.tokens.space.sm,
                    } }, offeredModules().map((module) => (React.createElement("div", { key: module.key, style: { minWidth: 0 } },
                    React.createElement(Checkbox, { label: module.label, checked: draft.disabledModules.indexOf(module.key) === -1, disabled: !editMode, onChange: (checked) => set("disabledModules", checked
                            ? draft.disabledModules.filter((key) => key !== module.key)
                            : [...draft.disabledModules, module.key]) }),
                    React.createElement("p", { style: {
                            margin: "2px 0 0 26px",
                            fontSize: Theme.tokens.font.sm,
                            color: Theme.palette().textMuted,
                        } }, module.description)))))),
            React.createElement(Card, { title: SettingsContent.sites },
                React.createElement(TextArea, { label: SettingsContent.fields.additionalSites, description: SettingsContent.fields.additionalSitesHint, value: draft.sites.slice(1).map((site) => site.url).join("\n"), onChange: (value) => set("sites", [draft.sites[0], ...parseSiteList(value)].filter(Boolean)), rows: 4, disabled: !editMode }),
                React.createElement("ul", { style: { margin: `${Theme.tokens.space.sm} 0 0`, paddingLeft: Theme.tokens.space.lg } }, settings.sites.map((site, index) => (React.createElement("li", { key: site.url },
                    site.url,
                    " ",
                    React.createElement(Badge, { label: index === 0 ? SettingsContent.host : SettingsContent.additional, tone: index === 0 ? "info" : "neutral" })))))),
            React.createElement(Card, { title: SettingsContent.throttle.title, actions: React.createElement(Button, { label: paused ? SettingsContent.throttle.resume : SettingsContent.throttle.pause, iconName: paused ? "Play" : "Pause", onClick: () => {
                        if (paused)
                            resumeThrottle();
                        else
                            pauseThrottle();
                        setPaused(!paused);
                    } }) },
                React.createElement(FieldRow, null,
                    React.createElement(Toggle, { label: SettingsContent.fields.captureReportLogs, checked: draft.captureReportLogs, onChange: (value) => set("captureReportLogs", value), disabled: !editMode, inlineLabel: true }),
                    React.createElement(NumberField, { label: SettingsContent.fields.concurrency, value: draft.concurrency, onChange: (value) => set("concurrency", value), min: 1, max: 12, disabled: !editMode })),
                React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.md, flexWrap: "wrap", marginTop: Theme.tokens.space.md } },
                    React.createElement(StatTile, { label: SettingsContent.throttle.inFlight, value: formatNumber(throttle.inFlight) }),
                    React.createElement(StatTile, { label: SettingsContent.throttle.queued, value: formatNumber(throttle.queued) }),
                    React.createElement(StatTile, { label: SettingsContent.throttle.completed, value: formatNumber(throttle.completed) }),
                    React.createElement(StatTile, { label: SettingsContent.throttle.retries, value: formatNumber(throttle.retries), tone: "warning", badge: throttle.status === "throttled" ? "Throttled" : undefined }),
                    React.createElement(StatTile, { label: SettingsContent.throttle.failed, value: formatNumber(throttle.failed), tone: "danger" }))))));
};
export default SettingsPage;
//# sourceMappingURL=Settings.page.js.map