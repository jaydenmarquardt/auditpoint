import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import { LinkAuditView } from "@/modules/linkAudit/LinkAudit.types";

export const LinksByTypeCard: React.FC<{ view: LinkAuditView }> = ({ view }) => (
  <ChartCard
    title={LinkAuditContent.charts.type}
    info={LinkAuditContent.cardInfo.type}
    defaultChart="donut"
    charts={["donut", "hbar", "bar"]}
    points={view.byType}
  />
);
