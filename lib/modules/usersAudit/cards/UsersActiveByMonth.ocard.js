import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { UsersAuditContent } from "../UsersAudit.content";
export const UsersActiveByMonthCard = ({ view }) => (React.createElement(ChartCard, { title: UsersAuditContent.charts.active, info: UsersAuditContent.cardInfo.active, defaultChart: "bar", charts: ["bar", "hbar", "donut"], points: view.activeByMonth, previewCount: 14 }));
//# sourceMappingURL=UsersActiveByMonth.ocard.js.map