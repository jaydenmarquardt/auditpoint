import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { IndexingAuditContent } from "@/modules/indexingAudit/IndexingAudit.content";
import { IndexingAuditView } from "@/modules/indexingAudit/IndexingAudit.types";
import { formatNumber } from "@/utils/Format.util";

export const ListsByCrawlSettingCard: React.FC<{ view: IndexingAuditView }> = ({ view }) => (
  <ChartCard
    title={IndexingAuditContent.charts.crawl}
    info={IndexingAuditContent.cardInfo.crawl}
    defaultChart="donut"
    charts={["donut", "hbar", "stacked"]}
    centreLabel={formatNumber(view.totals.lists)}
    points={view.crawlSplit}
  />
);
