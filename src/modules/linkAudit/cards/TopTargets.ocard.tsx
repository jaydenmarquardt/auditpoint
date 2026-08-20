import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import { LinkAuditView } from "@/modules/linkAudit/LinkAudit.types";

export const TopTargetsCard: React.FC<{ view: LinkAuditView }> = ({ view }) => (
  <ChartCard
    title={LinkAuditContent.charts.topTargets}
    info={LinkAuditContent.cardInfo.topTargets}
    defaultChart="hbar"
    charts={["donut", "hbar", "bar"]}
    points={view.topTargets}
  />
);
