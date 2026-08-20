import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ContentAuditContent } from "@/modules/contentAudit/ContentAudit.content";
import { ContentAuditView } from "@/modules/contentAudit/ContentAudit.types";

export const BlocksBySourceCard: React.FC<{ view: ContentAuditView }> = ({ view }) => (
  <ChartCard
    title={ContentAuditContent.charts.source}
    info={ContentAuditContent.cardInfo.source}
    defaultChart="donut"
    charts={["donut", "hbar", "bar"]}
    points={view.sourceSplit}
  />
);
