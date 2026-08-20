import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { IndexingAuditContent } from "@/modules/indexingAudit/IndexingAudit.content";
import { IndexingAuditView } from "@/modules/indexingAudit/IndexingAudit.types";
import { formatNumber } from "@/utils/Format.util";

export const ItemsByIndexStateCard: React.FC<{ view: IndexingAuditView }> = ({ view }) => (
  <ChartCard
    title={IndexingAuditContent.charts.items}
    info={IndexingAuditContent.cardInfo.items}
    defaultChart="donut"
    charts={["donut", "hbar", "stacked"]}
    centreLabel={formatNumber(view.totals.itemsChecked)}
    points={view.itemSplit}
    emptyLabel={IndexingAuditContent.itemsOff}
  />
);
