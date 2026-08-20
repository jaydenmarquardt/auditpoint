import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ContentAuditContent } from "@/modules/contentAudit/ContentAudit.content";
import { ContentAuditView } from "@/modules/contentAudit/ContentAudit.types";

export const HeadingsByLevelCard: React.FC<{ view: ContentAuditView }> = ({ view }) => (
  <ChartCard
    title={ContentAuditContent.charts.headings}
    info={ContentAuditContent.cardInfo.headings}
    defaultChart="bar"
    charts={["bar", "hbar", "bar"]}
    points={view.headingsByLevel}
  />
);
