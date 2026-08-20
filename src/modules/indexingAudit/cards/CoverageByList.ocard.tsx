import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { IndexingAuditContent } from "@/modules/indexingAudit/IndexingAudit.content";
import { IndexingAuditView } from "@/modules/indexingAudit/IndexingAudit.types";

export const CoverageByListCard: React.FC<{ view: IndexingAuditView }> = ({ view }) => (
  <ChartCard
    title={IndexingAuditContent.charts.coverage}
    info={IndexingAuditContent.cardInfo.coverage}
    points={view.coverageByList}
    charts={["hbar", "bar"]}
    valueFormatter={(value) => `${value}%`}
    emptyLabel={IndexingAuditContent.coverageOff}
  />
);
