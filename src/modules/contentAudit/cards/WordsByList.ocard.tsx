import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ContentAuditContent } from "@/modules/contentAudit/ContentAudit.content";
import { ContentAuditView } from "@/modules/contentAudit/ContentAudit.types";

export const WordsByListCard: React.FC<{ view: ContentAuditView }> = ({ view }) => (
  <ChartCard
    title={ContentAuditContent.charts.list}
    info={ContentAuditContent.cardInfo.list}
    defaultChart="hbar"
    charts={["hbar", "donut", "bar"]}
    points={view.wordsByList}
  />
);
