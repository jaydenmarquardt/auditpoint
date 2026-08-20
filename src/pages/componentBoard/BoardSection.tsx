import * as React from "react";
import { Card } from "@/components/layout/Card";
import { Theme } from "@/theme/Theme.api";
import { BoardSectionProps } from "@/pages/componentBoard/Board.types";

export const BoardSection: React.FC<BoardSectionProps> = ({ name, summary, children }) => (
  <Card title={name} subtitle={summary}>
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        gap: Theme.tokens.space.md,
        padding: Theme.tokens.space.md,
        background: Theme.palette().surfaceAlt,
        border: `1px solid ${Theme.palette().border}`,
        borderRadius: Theme.tokens.radius.sm,
      }}
    >
      {children}
    </div>
  </Card>
);
