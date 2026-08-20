import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ContentAuditContent } from "@/modules/contentAudit/ContentAudit.content";
import { ContentAuditView } from "@/modules/contentAudit/ContentAudit.types";

export const BlocksByContentTypeCard: React.FC<{ view: ContentAuditView }> = ({ view }) => (
  <ChartCard
    title={ContentAuditContent.charts.contentType}
    info={ContentAuditContent.cardInfo.contentType}
    defaultChart="hbar"
    charts={["hbar", "donut", "bar"]}
    points={view.byContentType}
  />
);
