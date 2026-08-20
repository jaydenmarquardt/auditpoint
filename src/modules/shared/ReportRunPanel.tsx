import * as React from "react";
import { Button } from "@/components/actions/Button";
import { ProgressGroup } from "@/components/feedback/ProgressGroup";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { Notice } from "@/components/feedback/Notice";
import { Toolbar } from "@/components/layout/Toolbar";
import { Modal } from "@/components/actions/Modal";
import { ReportDetails } from "@/modules/shared/ReportDetails";
import { getSettings, useSettings } from "@/api/Settings.api";
import { Dropdown } from "@/components/inputs/Dropdown";
import { NumberField } from "@/components/inputs/NumberField";
import { FieldRow } from "@/components/inputs/FieldRow";
import { configureThrottle } from "@/api/Throttle.api";
import { ProgressStatus, ProgressStep } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { ReportEnvelope } from "@/api/Reports.types";
import { useThrottleState } from "@/api/Throttle.api";
import { durationBetween, estimateRemaining, formatDateTime } from "@/utils/Format.util";
import { downloadJson } from "@/utils/Export.util";
import { ReportRunPanelProps } from "@/modules/shared/Shared.types";

export const ReportRunPanel: React.FC<ReportRunPanelProps> = ({
  title,
  controller,
  runLabel,
  extraControls,
  runDisabled,
  configPanel,
  configOpen,
  onConfigOpenChange,
  onBack,
  backLabel = "All runs",
  definition,
}) => {
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const logsEnabled = useSettings((settings) => settings.captureReportLogs);
  const throttle = useThrottleState();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const fileInput = React.useRef<HTMLInputElement>(null);
  const sites = useSettings((settings) => settings.sites);
  // A run reads one site: several at once made every count ambiguous.
  const [site, setSite] = React.useState<string>(() => getSettings().sites[0]?.url ?? "");
  const [concurrency, setConcurrency] = React.useState<number>(() => getSettings().concurrency);
  const [saved, setSaved] = React.useState(false);

  const startRun = (): void => {
    configureThrottle({ concurrency });
    controller.start(site ? [site] : undefined);
  };
  const open = configOpen ?? internalOpen;

  const setOpen = (next: boolean): void => {
    setInternalOpen(next);
    if (onConfigOpenChange) onConfigOpenChange(next);
  };
  const envelope = controller.envelope as ReportEnvelope | undefined;
  const steps: ProgressStep[] = (envelope?.stages ?? []).map((stage) => ({
    key: stage.key,
    label: stage.label,
    work: definition?.stages.find((entry) => entry.key === stage.key)?.work,
    status: stage.status as ProgressStatus,
    ratio: stage.total ? stage.processed / stage.total : undefined,
    countLabel: countLabel(stage),
    message: stage.error,
  }));

  const done = steps.filter((step) => step.status === "succeeded").length;
  const overall = steps.length === 0 ? undefined : done / steps.length;

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.md }}>
      {(envelope || controller.running) && (
      <Toolbar ariaLabel={`${title} controls`}>
        {onBack && <Button label={backLabel} iconName="ChevronLeft" onClick={onBack} />}

        {!controller.running && (
          <Button
            label={envelope ? runLabel.rerun : runLabel.run}
            variant="primary"
            iconName="Play"
            onClick={() => (configPanel ? setOpen(true) : controller.start())}
            disabled={runDisabled}
          />
        )}
        {controller.running && <Button label={runLabel.pause} iconName="Pause" onClick={controller.pause} />}
        {controller.paused && <Button label={runLabel.resume} iconName="Play" onClick={controller.resume} />}
        {(controller.running || controller.paused) && (
          <Button label={runLabel.cancel} variant="subtle" iconName="Cancel" onClick={controller.cancel} />
        )}
        {envelope && envelope.status === "failed" && (
          <Button label={runLabel.resume} variant="primary" iconName="Refresh" onClick={controller.resume} />
        )}
        {envelope && (
          <Button
            label="Export JSON"
            iconName="Download"
            onClick={() => downloadJson(`${envelope.kind}-${envelope.id}`, envelope)}
          />
        )}
        <Button label="Import JSON" iconName="Upload" onClick={() => fileInput.current?.click()} />
        {extraControls}
        {envelope && definition && (
          <Button label="Run details" iconName="Info" onClick={() => setDetailsOpen(true)} />
        )}

        {envelope && <StatusBadge status={mapRunStatus(envelope.status)} />}

        {envelope && (
          <span style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>
            {formatDateTime(envelope.updatedIso)} · v{envelope.version} · {envelope.createdBy}
          </span>
        )}
      </Toolbar>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Clearing the value lets the same file be picked twice in a row.
          event.target.value = "";
          if (file) void controller.importJson(file);
        }}
      />

      {controller.error && (
        <Notice tone="error" message={controller.error} onDismiss={controller.clearError} />
      )}

      {throttle.status === "throttled" && (
        <Notice tone="warning" message="SharePoint is throttling requests. Backing off and retrying automatically." />
      )}

      {definition && (
        <ReportDetails
          open={detailsOpen}
          onDismiss={() => setDetailsOpen(false)}
          envelope={envelope}
          definition={definition}
          logsEnabled={logsEnabled}
        />
      )}

      {configPanel && (
        <Modal
          open={open}
          title={runLabel.configTitle ?? "Audit settings"}
          width="large"
          onDismiss={() => setOpen(false)}
          footer={
            <>
              <Button
                label={runLabel.run}
                variant="primary"
                iconName="Play"
                onClick={() => {
                  setOpen(false);
                  setSaved(false);
                  startRun();
                }}
              />
              <Button
                label={saved ? "Saved" : "Save as default"}
                iconName="Save"
                onClick={() => {
                  controller.saveConfigAsDefault();
                  setSaved(true);
                }}
              />
              <Button label="Reset" iconName="Undo" onClick={() => { controller.resetConfig(); setSaved(false); }} />
              <Button label={runLabel.cancel} onClick={() => setOpen(false)} />
            </>
          }
        >
          <div style={{ display: "grid", gap: Theme.tokens.space.md }}>
            <FieldRow>
              <Dropdown
                label="Site to audit"
                options={sites.map((target) => ({ key: target.url, text: target.title || target.url }))}
                selectedKey={site}
                onChange={setSite}
              />
              <NumberField
                label="Parallel requests"
                value={concurrency}
                min={1}
                max={12}
                onChange={setConcurrency}
              />
            </FieldRow>

            {/* The fields scroll; the actions below them do not. */}
            <div style={{ maxHeight: "52vh", overflowY: "auto", paddingRight: Theme.tokens.space.xs }}>
              {configPanel}
            </div>
          </div>
        </Modal>
      )}

      {envelope && (
        <ProgressGroup
          label={title}
          status={mapRunStatus(envelope.status)}
          ratio={overall}
          steps={steps}
          description={`Updated ${formatDateTime(envelope.updatedIso)} · ${envelope.issues.length} issues · ${
            throttle.inFlight
          } in flight`}
        />
      )}
    </div>
  );
};

function countLabel(stage: {
  processed: number;
  total?: number;
  status: string;
  startedIso?: string;
  finishedIso?: string;
}): string | undefined {
  if (!stage.total) return stage.status === "succeeded" ? durationBetween(stage.startedIso, stage.finishedIso) : undefined;

  const counts = `${stage.processed.toLocaleString()}/${stage.total.toLocaleString()}`;

  if (stage.status === "running") {
    const eta = estimateRemaining(stage.startedIso, stage.processed, stage.total);
    return eta ? `${counts} · ${eta} left` : counts;
  }

  if (stage.status === "succeeded") return `${counts} · ${durationBetween(stage.startedIso, stage.finishedIso)}`;
  return counts;
}

function mapRunStatus(status: ReportEnvelope["status"]): ProgressStatus {
  if (status === "complete") return "succeeded";
  if (status === "failed") return "failed";
  if (status === "paused") return "paused";
  if (status === "cancelled") return "cancelled";
  if (status === "running") return "running";
  return "pending";
}
