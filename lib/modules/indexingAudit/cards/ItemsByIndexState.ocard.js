import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { IndexingAuditContent } from "../IndexingAudit.content";
import { formatNumber } from "../../../utils/Format.util";
export const ItemsByIndexStateCard = ({ view }) => (React.createElement(ChartCard, { title: IndexingAuditContent.charts.items, info: IndexingAuditContent.cardInfo.items, defaultChart: "donut", charts: ["donut", "hbar", "stacked"], centreLabel: formatNumber(view.totals.itemsChecked), points: view.itemSplit, emptyLabel: IndexingAuditContent.itemsOff }));
//# sourceMappingURL=ItemsByIndexState.ocard.js.map