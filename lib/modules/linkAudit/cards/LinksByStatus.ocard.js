import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { LinkAuditContent } from "../LinkAudit.content";
export const LinksByStatusCard = ({ view }) => (React.createElement(ChartCard, { title: LinkAuditContent.charts.status, info: LinkAuditContent.cardInfo.status, defaultChart: "donut", charts: ["donut", "hbar", "bar"], points: view.byStatus }));
//# sourceMappingURL=LinksByStatus.ocard.js.map