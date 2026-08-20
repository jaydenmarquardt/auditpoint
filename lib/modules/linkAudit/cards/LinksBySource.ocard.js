import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { LinkAuditContent } from "../LinkAudit.content";
export const LinksBySourceCard = ({ view }) => (React.createElement(ChartCard, { title: LinkAuditContent.charts.source, info: LinkAuditContent.cardInfo.source, defaultChart: "donut", charts: ["donut", "hbar", "bar"], points: view.bySource }));
//# sourceMappingURL=LinksBySource.ocard.js.map