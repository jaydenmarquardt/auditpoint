import * as React from "react";
import { Tokens } from "@/theme/Tokens";
import { TooltipHost } from "@fluentui/react/lib/Tooltip";
import { Badge } from "@/components/feedback/Badge";
import { StatTileProps } from "@/components/Components.types";

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  hint,
  tone = "neutral",
  badge,
  info,
  width = 160,
}) => (
  <div
    style={{
      background: Tokens.colour.surface,
      border: `1px solid ${Tokens.colour.border}`,
      borderRadius: Tokens.radius.md,
      padding: Tokens.space.md,
      minWidth: width,
      flex: `1 1 ${width}px`,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", gap: Tokens.space.sm }}>
      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: Tokens.font.sm, color: Tokens.colour.textMuted }}>
        {label}
        {info && (
          <TooltipHost content={info}>
            <i className="ms-Icon ms-Icon--Info" aria-label={info} tabIndex={0} style={{ cursor: "help" }} />
          </TooltipHost>
        )}
      </span>
      {badge ? <Badge label={badge} tone={tone} /> : undefined}
    </div>
    <div style={{ fontSize: Tokens.font.xl, fontWeight: 600, marginTop: Tokens.space.xs }}>{value}</div>
    {hint && (
      <div style={{ fontSize: Tokens.font.sm, color: Tokens.colour.textMuted, marginTop: 2 }}>{hint}</div>
    )}
  </div>
);
