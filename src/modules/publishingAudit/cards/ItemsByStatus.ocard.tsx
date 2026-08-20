import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import { PublishingAuditView } from "@/modules/publishingAudit/PublishingAudit.types";

export const ItemsByStatusCard: React.FC<{ view: PublishingAuditView }> = ({ view }) => (
  <ChartCard
    title={PublishingAuditContent.charts.status}
    info={PublishingAuditContent.cardInfo.status}
    defaultChart="donut"
    charts={["donut", "hbar", "donut"]}
    points={view.statusSplit}
    previewCount={14}
  />
);
