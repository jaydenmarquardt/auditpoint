import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { PermissionsAuditContent } from "../PermissionsAudit.content";
import { formatNumber } from "../../../utils/Format.util";
export const ListsByInheritanceCard = ({ view }) => (React.createElement(ChartCard, { title: PermissionsAuditContent.charts.inheritance, info: PermissionsAuditContent.cardInfo.inheritance, defaultChart: "donut", charts: ["donut", "hbar", "stacked"], centreLabel: formatNumber(view.totals.lists), points: view.inheritanceSplit }));
//# sourceMappingURL=ListsByInheritance.ocard.js.map