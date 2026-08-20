import * as React from "react";
import { Theme } from "@/theme/Theme.api";
import { ProgressBarProps, ProgressStatus } from "@/components/Components.types";
import { statusTone, statusText } from "@/components/feedback/StatusBadge";

const INDETERMINATE: ProgressStatus[] = ["running"];

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
        />
      </div>

      {description && (
        <div style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted, marginTop: 4 }}>
          {description}
        </div>
      )}
    </div>
  );
};
