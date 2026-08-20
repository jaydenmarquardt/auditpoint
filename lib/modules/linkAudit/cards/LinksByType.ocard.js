import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { LinkAuditContent } from "../LinkAudit.content";
export const LinksByTypeCard = ({ view }) => (React.createElement(ChartCard, { title: LinkAuditContent.charts.type, info: LinkAuditContent.cardInfo.type, defaultChart: "donut", charts: ["donut", "hbar", "bar"], points: view.byType }));
//# sourceMappingURL=LinksByType.ocard.js.map