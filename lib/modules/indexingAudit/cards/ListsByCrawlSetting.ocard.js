import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { IndexingAuditContent } from "../IndexingAudit.content";
import { formatNumber } from "../../../utils/Format.util";
export const ListsByCrawlSettingCard = ({ view }) => (React.createElement(ChartCard, { title: IndexingAuditContent.charts.crawl, info: IndexingAuditContent.cardInfo.crawl, defaultChart: "donut", charts: ["donut", "hbar", "stacked"], centreLabel: formatNumber(view.totals.lists), points: view.crawlSplit }));
//# sourceMappingURL=ListsByCrawlSetting.ocard.js.map