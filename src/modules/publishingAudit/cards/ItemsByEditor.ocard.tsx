import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import { PublishingAuditView } from "@/modules/publishingAudit/PublishingAudit.types";

export const ItemsByEditorCard: React.FC<{ view: PublishingAuditView }> = ({ view }) => (
  <ChartCard
    title={PublishingAuditContent.charts.editors}
    info={PublishingAuditContent.cardInfo.editors}
    defaultChart="hbar"
    charts={["hbar", "hbar", "donut"]}
    selectable={false}
    points={view.topEditors}
    previewCount={14}
  />
);
