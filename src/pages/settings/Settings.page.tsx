import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/layout/Card";
import { Toolbar } from "@/components/layout/Toolbar";
import { StatTile } from "@/components/layout/StatTile";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { Notice } from "@/components/feedback/Notice";
import { TextField } from "@/components/inputs/TextField";
import { TextArea } from "@/components/inputs/TextArea";
import { Toggle } from "@/components/inputs/Toggle";
import { NumberField } from "@/components/inputs/NumberField";
import { FieldRow } from "@/components/inputs/FieldRow";
import { Theme } from "@/theme/Theme.api";
import { useApp } from "@/core/context/App.context";
import { checkConfig, getSettings, parseSiteList, saveSettings, useSettings } from "@/api/Settings.api";
import { AppSettings } from "@/api/Settings.types";
import { Reports, reportFolderUrl } from "@/api/Reports.api";
import { ReportFolderAccess } from "@/api/Reports.types";
import { isThrottlePaused, pauseThrottle, resumeThrottle, useThrottleState } from "@/api/Throttle.api";
import { Checkbox } from "@/components/inputs/Checkbox";
import { hostModules, offeredModules } from "@/modules/Modules.registry";
import { SettingsContent } from "@/pages/settings/Settings.content";
import { formatNumber } from "@/utils/Format.util";
import { editModeUrl } from "@/utils/Url.util";

const SettingsPage: React.FC = () => {
  const settings = useSettings();
  const throttle = useThrottleState();
  const { editMode } = useApp();

  const [draft, setDraft] = React.useState<AppSettings>(settings);
  const [applied, setApplied] = React.useState(false);
  const [paused, setPaused] = React.useState(isThrottlePaused());
  const [folder, setFolder] = React.useState<ReportFolderAccess | undefined>(undefined);
  const [checking, setChecking] = React.useState(false);

  const config = checkConfig(settings);
  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);

  const runCheck = React.useCallback((ensure: boolean) => {
    setChecking(true);
    const operation = ensure ? Reports().ensureFolder() : Reports().checkFolder();
    operation
      .then(setFolder)
      .catch(() => setFolder(undefined))
      .then(() => setChecking(false))
      .catch(() => setChecking(false));
  }, []);

  React.useEffect(() => {
    if (config.configured) runCheck(false);
  }, [config.configured, settings.reportLibrary, settings.reportFolder, runCheck]);

  const apply = (): void => {
    saveSettings(draft);
    setApplied(true);
  };

  const set = <TKey extends keyof AppSettings>(key: TKey, value: AppSettings[TKey]): void =>
    setDraft((current) => ({ ...current, [key]: value }));

  return (
    <>
      <PageHeader
        title={SettingsContent.title}
        description={SettingsContent.description}
        actions={
          editMode ? (
            <>
              <Button label={SettingsContent.reset} onClick={() => setDraft(getSettings())} disabled={!dirty} />
              <Button label={SettingsContent.save} variant="primary" iconName="Save" onClick={apply} disabled={!dirty} />
            </>
          ) : (
            <Button
              label={SettingsContent.enterEditMode}
              variant="primary"
              iconName="Edit"
              onClick={() => window.location.assign(editModeUrl())}
            />
          )
        }
      />

      <div style={{ display: "grid", gap: Theme.tokens.space.md }}>
        {!editMode && <Notice tone="info" message={SettingsContent.readOnlyNotice} />}
        {applied && editMode && <Notice tone="success" message={SettingsContent.unsavedNotice} onDismiss={() => setApplied(false)} />}
        {!config.configured && (
          <Notice tone="warning" message={`${SettingsContent.configWarning} ${config.missing.join(", ")}`} />
        )}

        <Card title={SettingsContent.branding}>
          <FieldRow>
            <TextField
              label={SettingsContent.fields.appName}
              value={draft.appName}
              onChange={(value) => set("appName", value)}
              disabled={!editMode}
            />
            <TextField
              label={SettingsContent.fields.appTagline}
              value={draft.appTagline}
              onChange={(value) => set("appTagline", value)}
              disabled={!editMode}
            />
            <TextField
              label={SettingsContent.fields.defaultRoute}
              value={draft.defaultRoute}
              onChange={(value) => set("defaultRoute", value)}
              disabled={!editMode}
            />
          </FieldRow>
        </Card>

        <Card title={SettingsContent.reports}>
          <FieldRow>
            <TextField
              label={SettingsContent.fields.reportLibrary}
              value={draft.reportLibrary}
              onChange={(value) => set("reportLibrary", value)}
              placeholder="SiteAssets"
              required
              disabled={!editMode}
            />
            <TextField
              label={SettingsContent.fields.reportFolder}
              value={draft.reportFolder}
              onChange={(value) => set("reportFolder", value)}
              placeholder="Audit/Reports"
              required
              disabled={!editMode}
            />
          </FieldRow>
          <p style={{ margin: `${Theme.tokens.space.sm} 0 0`, color: Theme.palette().textMuted }}>
            {SettingsContent.fields.path}: <code>{config.configured ? reportFolderUrl() : "-"}</code>
          </p>
        </Card>

        <Card
          title={SettingsContent.folder.title}
          actions={
            <Toolbar ariaLabel={SettingsContent.folder.title}>
              <Button label={SettingsContent.folder.check} iconName="Refresh" onClick={() => runCheck(false)} disabled={!config.configured || checking} />
              <Button
                label={SettingsContent.folder.ensure}
                variant="primary"
                iconName="FabricNewFolder"
                onClick={() => runCheck(true)}
                disabled={!config.configured || checking}
                busy={checking}
              />
            </Toolbar>
          }
        >
          {checking && <span>{SettingsContent.folder.checking}</span>}
          {!checking && folder && (
            <div style={{ display: "flex", gap: Theme.tokens.space.sm, flexWrap: "wrap", alignItems: "center" }}>
              <Badge
                label={folder.exists ? SettingsContent.folder.exists : SettingsContent.folder.missing}
                tone={folder.exists ? "success" : "warning"}
              />
              <Badge label={`${SettingsContent.folder.view}: ${folder.canView ? "yes" : "no"}`} tone={folder.canView ? "success" : "danger"} />
              <Badge label={`${SettingsContent.folder.edit}: ${folder.canEdit ? "yes" : "no"}`} tone={folder.canEdit ? "success" : "danger"} />
              <code style={{ color: Theme.palette().textMuted }}>{folder.url}</code>
              {folder.exists && !folder.canEdit && <Notice tone="warning" message={SettingsContent.folder.noEdit} />}
              {!folder.canView && <Notice tone="error" message={SettingsContent.folder.noView} />}
            </div>
          )}
        </Card>

        <Card
          title={SettingsContent.modules.title}
          subtitle={SettingsContent.modules.description}
          actions={
            <Toolbar ariaLabel={SettingsContent.modules.title}>
              <Button
                label={SettingsContent.modules.enableAll}
                onClick={() => set("disabledModules", [])}
                disabled={!editMode || draft.disabledModules.length === 0}
              />
              <Button
                label={SettingsContent.modules.disableAll}
                onClick={() => set("disabledModules", offeredModules().map((module) => module.key))}
                disabled={!editMode || draft.disabledModules.length === offeredModules().length}
              />
            </Toolbar>
          }
        >
          {hostModules() && <Notice tone="info" message={SettingsContent.modules.hostLimited} />}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
              gap: Theme.tokens.space.sm,
              marginTop: Theme.tokens.space.sm,
            }}
          >
            {offeredModules().map((module) => (
              <div key={module.key} style={{ minWidth: 0 }}>
                <Checkbox
                  label={module.label}
                  checked={draft.disabledModules.indexOf(module.key) === -1}
                  disabled={!editMode}
                  onChange={(checked) =>
                    set(
                      "disabledModules",
                      checked
                        ? draft.disabledModules.filter((key) => key !== module.key)
                        : [...draft.disabledModules, module.key]
                    )
                  }
                />
                <p
                  style={{
                    margin: "2px 0 0 26px",
                    fontSize: Theme.tokens.font.sm,
                    color: Theme.palette().textMuted,
                  }}
                >
                  {module.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card title={SettingsContent.sites}>
          <TextArea
            label={SettingsContent.fields.additionalSites}
            description={SettingsContent.fields.additionalSitesHint}
            value={draft.sites.slice(1).map((site) => site.url).join("\n")}
            onChange={(value) => set("sites", [draft.sites[0], ...parseSiteList(value)].filter(Boolean))}
            rows={4}
            disabled={!editMode}
          />
          <ul style={{ margin: `${Theme.tokens.space.sm} 0 0`, paddingLeft: Theme.tokens.space.lg }}>
            {settings.sites.map((site, index) => (
              <li key={site.url}>
                {site.url}{" "}
                <Badge label={index === 0 ? SettingsContent.host : SettingsContent.additional} tone={index === 0 ? "info" : "neutral"} />
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title={SettingsContent.throttle.title}
          actions={
            <Button
              label={paused ? SettingsContent.throttle.resume : SettingsContent.throttle.pause}
              iconName={paused ? "Play" : "Pause"}
              onClick={() => {
                if (paused) resumeThrottle();
                else pauseThrottle();
                setPaused(!paused);
              }}
            />
          }
        >
          <FieldRow>
            <Toggle
              label={SettingsContent.fields.captureReportLogs}
              checked={draft.captureReportLogs}
              onChange={(value) => set("captureReportLogs", value)}
              disabled={!editMode}
              inlineLabel
            />
            <NumberField
              label={SettingsContent.fields.concurrency}
              value={draft.concurrency}
              onChange={(value) => set("concurrency", value)}
              min={1}
              max={12}
              disabled={!editMode}
            />
          </FieldRow>

          <div style={{ display: "flex", gap: Theme.tokens.space.md, flexWrap: "wrap", marginTop: Theme.tokens.space.md }}>
            <StatTile label={SettingsContent.throttle.inFlight} value={formatNumber(throttle.inFlight)} />
            <StatTile label={SettingsContent.throttle.queued} value={formatNumber(throttle.queued)} />
            <StatTile label={SettingsContent.throttle.completed} value={formatNumber(throttle.completed)} />
            <StatTile
              label={SettingsContent.throttle.retries}
              value={formatNumber(throttle.retries)}
              tone="warning"
              badge={throttle.status === "throttled" ? "Throttled" : undefined}
            />
            <StatTile label={SettingsContent.throttle.failed} value={formatNumber(throttle.failed)} tone="danger" />
          </div>
        </Card>
      </div>
    </>
  );
};

export default SettingsPage;
