import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { UsersAuditContent } from "../UsersAudit.content";
export const PeopleByDepartmentCard = ({ view }) => (React.createElement(ChartCard, { title: UsersAuditContent.charts.department, info: UsersAuditContent.cardInfo.department, defaultChart: "hbar", charts: ["hbar", "hbar", "donut"], points: view.byDepartment, previewCount: 14 }));
//# sourceMappingURL=PeopleByDepartment.ocard.js.map