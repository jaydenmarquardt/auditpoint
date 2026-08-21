import * as React from "react";
import { Spinner } from "@/components/feedback/Spinner";
import { Theme } from "@/theme/Theme.api";

const BAR: React.CSSProperties = {
  background: Theme.palette().surfaceAlt,
  borderRadius: Theme.tokens.radius.sm,
  animation: "auditpoint-pulse 1.4s ease-in-out infinite",
};

/** Stands in for the report while it is read, in roughly the shape it will take. */
export const ReportSkeleton: React.FC<{ label: string }> = ({ label }) => (
  <section
    aria-busy="true"
    aria-label={label}
    style={{
      border: `1px solid ${Theme.palette().border}`,
      borderRadius: Theme.tokens.radius.md,
      background: Theme.palette().surface,
      padding: Theme.tokens.space.lg,
      display: "grid",
      gap: Theme.tokens.space.md,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: Theme.tokens.space.sm }}>
      <Spinner size="small" />
      <strong>{label}</strong>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(170px, 100%), 1fr))",
        gap: Theme.tokens.space.md,
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((tile) => (
        <div key={tile} style={{ ...BAR, height: 78, animationDelay: `${tile * 90}ms` }} />
      ))}
    </div>

    <div style={{ display: "grid", gap: 8 }}>
      {[0, 1, 2, 3].map((row) => (
        <div key={row} style={{ ...BAR, height: 14, width: `${90 - row * 12}%`, animationDelay: `${row * 120}ms` }} />
      ))}
    </div>
  </section>
);
