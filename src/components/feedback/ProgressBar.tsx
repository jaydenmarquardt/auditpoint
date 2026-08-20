import * as React from "react";
import { Theme } from "@/theme/Theme.api";
import { ProgressBarProps, ProgressStatus } from "@/components/Components.types";
import { statusTone, statusText } from "@/components/feedback/StatusBadge";

const INDETERMINATE: ProgressStatus[] = ["running"];
/** Statuses where work is still happening, so the bar should not look settled. */
const ACTIVE: ProgressStatus[] = ["running", "throttled", "waiting", "queued"];

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  description,
  ratio,
  status = "running",
  compact,
  countLabel,
}) => {
  const palette = Theme.tone(statusTone(status));
  const height = compact ? 6 : 12;
  const indeterminate = ratio === undefined && INDETERMINATE.indexOf(status) !== -1;
  const active = ACTIVE.indexOf(status) !== -1;
  const width = ratio === undefined ? (indeterminate ? 40 : 0) : Math.round(ratio * 100);

  return (
    <div>
      {(label || countLabel) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: Theme.tokens.space.sm,
            fontSize: Theme.tokens.font.sm,
            marginBottom: 4,
          }}
        >
          <span>{label}</span>
          <span style={{ color: Theme.palette().textMuted }}>
            {countLabel ?? (ratio !== undefined ? `${width}%` : statusText(status))}
          </span>
        </div>
      )}

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={ratio === undefined ? undefined : width}
        aria-label={label ?? statusText(status)}
        style={{
          position: "relative",
          height,
          borderRadius: height,
          background: Theme.chart().track,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            insetBlock: 0,
            left: 0,
            width: `${width}%`,
            background: palette.solid,
            borderRadius: height,
            transition: "width 200ms ease",
            animation: indeterminate ? "auditpoint-indeterminate 1.4s ease-in-out infinite" : undefined,
          }}
        >
          {/* Stripes are slid across the fill, so a slow stage still reads as
              working rather than stalled. */}
          {active && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(115deg, rgba(255,255,255,0.38) 0 8px, transparent 8px 18px)",
                backgroundSize: "36px 100%",
                animation: "auditpoint-stripes 1s linear infinite",
              }}
            />
          )}
        </div>
      </div>

      {description && (
        <div style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted, marginTop: 4 }}>
          {description}
        </div>
      )}
    </div>
  );
};
