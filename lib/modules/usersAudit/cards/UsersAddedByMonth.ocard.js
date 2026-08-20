import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { UsersAuditContent } from "../UsersAudit.content";
export const UsersAddedByMonthCard = ({ view }) => (React.createElement(ChartCard, { title: UsersAuditContent.charts.added, info: UsersAuditContent.cardInfo.added, defaultChart: "bar", charts: ["bar", "hbar", "donut"], points: view.addedByMonth, previewCount: 14 }));
//# sourceMappingURL=UsersAddedByMonth.ocard.js.map