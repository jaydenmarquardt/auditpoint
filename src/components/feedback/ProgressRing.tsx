import * as React from "react";
import { Theme } from "@/theme/Theme.api";
import { ProgressRingProps } from "@/components/Components.types";
import { statusTone, statusText } from "@/components/feedback/StatusBadge";

export const ProgressRing: React.FC<ProgressRingProps> = ({
  ratio,
  size = 72,
  thickness = 8,
  label,
  status = "running",
}) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = ratio === undefined ? 0.25 : Math.max(0, Math.min(1, ratio));
  const colour = Theme.tone(statusTone(status)).solid;

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size} role="img" aria-label={label ?? statusText(status)}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={Theme.chart().track}
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colour}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${circumference * filled} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fontSize={size / 4.5}
          fill={Theme.palette().text}
          fontWeight={600}
        >
          {ratio === undefined ? "…" : `${Math.round(filled * 100)}%`}
        </text>
      </svg>
      {label && <span style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>{label}</span>}
    </div>
  );
};
