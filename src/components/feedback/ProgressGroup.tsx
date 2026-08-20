import * as React from "react";
import { Theme } from "@/theme/Theme.api";
import { ProgressBar } from "@/components/feedback/ProgressBar";
import { statusTone, statusText } from "@/components/feedback/StatusBadge";
import { ProgressGroupProps, ProgressStatus, ProgressStep } from "@/components/Components.types";

const ICONS: Record<ProgressStatus, string> = {
  pending: "CircleRing",
  queued: "Clock",
  waiting: "Clock",
  running: "SyncOccurence",
  throttled: "Hourglass",
  paused: "CirclePause",
  succeeded: "CompletedSolid",
  failed: "StatusErrorFull",
  cancelled: "Cancel",
  skipped: "Blocked",
};

export const ProgressGroup: React.FC<ProgressGroupProps> = ({
  label,
  status = "running",
  ratio,
  steps,
  description,
  collapsible = true,
  defaultOpen = false,
  stepsLabel = "steps",
}) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
  <section
    style={{
      border: `1px solid ${Theme.palette().border}`,
      borderRadius: Theme.tokens.radius.md,
      background: Theme.palette().surface,
      overflow: "hidden",
      minWidth: 0,
    }}
  >
    <header style={{ padding: Theme.tokens.space.md, display: "grid", gap: Theme.tokens.space.sm }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: Theme.tokens.space.sm }}>
        <strong>{label}</strong>

        <div style={{ display: "flex", alignItems: "center", gap: Theme.tokens.space.sm }}>
          <span style={{ fontSize: Theme.tokens.font.sm, color: Theme.tone(statusTone(status)).fg, fontWeight: 600 }}>
            {statusText(status)}
          </span>

          {collapsible && steps.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                minHeight: 32,
                padding: `0 ${Theme.tokens.space.sm}`,
                border: `1px solid ${Theme.palette().border}`,
                borderRadius: Theme.tokens.radius.sm,
                background: Theme.palette().surface,
                color: Theme.palette().text,
                font: "inherit",
                fontSize: Theme.tokens.font.sm,
                cursor: "pointer",
              }}
            >
              <i className={`ms-Icon ms-Icon--${open ? "ChevronUp" : "ChevronDown"}`} aria-hidden="true" />
              {open ? `Hide ${stepsLabel}` : `Show ${steps.length} ${stepsLabel}`}
            </button>
          )}
        </div>
      </div>

      <ProgressBar ratio={ratio} status={status} />

      {description && (
        <span style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>{description}</span>
      )}
    </header>

    {open && (
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          borderTop: `1px solid ${Theme.palette().border}`,
          background: Theme.palette().surfaceAlt,
        }}
      >
        {steps.map((step) => (
          <StepRow key={step.key} step={step} />
        ))}
      </ul>
    )}
  </section>
  );
};

const StepRow: React.FC<{ step: ProgressStep }> = ({ step }) => {
  const tone = Theme.tone(statusTone(step.status));
  const active = step.status === "running" || step.status === "throttled";

  return (
    <li
      style={{
        display: "grid",
        gridTemplateColumns: "24px minmax(0, 1fr) auto",
        alignItems: "center",
        columnGap: Theme.tokens.space.sm,
        padding: `${Theme.tokens.space.md} ${Theme.tokens.space.md}`,
        borderBottom: `1px solid ${Theme.palette().border}`,
        background: active ? Theme.palette().surface : "transparent",
      }}
    >
      <i
        className={`ms-Icon ms-Icon--${ICONS[step.status]}`}
        aria-hidden="true"
        style={{ color: tone.solid, fontSize: 16 }}
      />

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: Theme.tokens.font.md,
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {step.label}
        </div>

        {(active || step.ratio !== undefined) && (
          <div
            style={{
              marginTop: 8,
              height: 10,
              borderRadius: 10,
              background: Theme.chart().track,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.round((step.ratio ?? 0) * 100)}%`,
                height: "100%",
                background: tone.solid,
                transition: "width 200ms ease",
              }}
            />
          </div>
        )}

        {step.message && (
          <div style={{ marginTop: 4, fontSize: Theme.tokens.font.sm, color: tone.fg }}>{step.message}</div>
        )}
      </div>

      <span
        style={{
          fontSize: Theme.tokens.font.sm,
          color: Theme.palette().textMuted,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {step.countLabel ?? statusText(step.status)}
      </span>
    </li>
  );
};
