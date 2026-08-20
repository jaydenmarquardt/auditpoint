import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import { PublishingAuditView } from "@/modules/publishingAudit/PublishingAudit.types";

export const ItemsByAgeCard: React.FC<{ view: PublishingAuditView }> = ({ view }) => (
  <ChartCard
    title={PublishingAuditContent.charts.staleness}
    info={PublishingAuditContent.cardInfo.staleness}
    defaultChart="donut"
    charts={["donut", "hbar", "donut"]}
    points={view.stalenessSplit}
    previewCount={14}
  />
);
