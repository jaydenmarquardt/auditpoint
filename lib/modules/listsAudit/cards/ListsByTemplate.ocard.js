import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ListsAuditContent } from "../ListsAudit.content";
export const ListsByTemplateCard = ({ view }) => (React.createElement(ChartCard, { title: ListsAuditContent.charts.byTemplate, info: ListsAuditContent.cardInfo.templates, points: view.byTemplate.map((entry) => ({ label: entry.label, value: entry.value })), charts: ["hbar", "bar", "donut"] }));
//# sourceMappingURL=ListsByTemplate.ocard.js.map