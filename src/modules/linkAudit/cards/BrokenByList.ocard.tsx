import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import { LinkAuditView } from "@/modules/linkAudit/LinkAudit.types";

export const BrokenByListCard: React.FC<{ view: LinkAuditView }> = ({ view }) => (
  <ChartCard
    title={LinkAuditContent.charts.brokenByList}
    info={LinkAuditContent.cardInfo.brokenByList}
    defaultChart="hbar"
    charts={["donut", "hbar", "bar"]}
    span={2}
    points={view.brokenByList}
  />
);
