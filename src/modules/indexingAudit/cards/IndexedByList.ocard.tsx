import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { IndexingAuditContent } from "@/modules/indexingAudit/IndexingAudit.content";
import { IndexingAuditView } from "@/modules/indexingAudit/IndexingAudit.types";

export const IndexedByListCard: React.FC<{ view: IndexingAuditView }> = ({ view }) => (
  <ChartCard
    title={IndexingAuditContent.charts.indexed}
    info={IndexingAuditContent.cardInfo.indexed}
    points={view.indexedByList}
    charts={["hbar", "bar", "donut"]}
    emptyLabel={IndexingAuditContent.coverageOff}
  />
);
