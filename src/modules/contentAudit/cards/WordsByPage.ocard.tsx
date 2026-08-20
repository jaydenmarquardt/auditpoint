import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ContentAuditContent } from "@/modules/contentAudit/ContentAudit.content";
import { ContentAuditView } from "@/modules/contentAudit/ContentAudit.types";

export const WordsByPageCard: React.FC<{ view: ContentAuditView }> = ({ view }) => (
  <ChartCard
    title={ContentAuditContent.charts.words}
    info={ContentAuditContent.cardInfo.words}
    defaultChart="hbar"
    charts={["hbar", "hbar", "bar"]}
    span={2}
    points={view.wordsByEntry}
  />
);
