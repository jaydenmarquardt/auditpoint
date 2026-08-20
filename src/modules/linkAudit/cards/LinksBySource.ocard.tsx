import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import { LinkAuditView } from "@/modules/linkAudit/LinkAudit.types";

export const LinksBySourceCard: React.FC<{ view: LinkAuditView }> = ({ view }) => (
  <ChartCard
    title={LinkAuditContent.charts.source}
    info={LinkAuditContent.cardInfo.source}
    defaultChart="donut"
    charts={["donut", "hbar", "bar"]}
    points={view.bySource}
  />
);
