import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ListsAuditContent } from "../ListsAudit.content";
export const ListsByContentTypeCard = ({ view }) => (React.createElement(ChartCard, { title: ListsAuditContent.charts.contentTypes, info: ListsAuditContent.cardInfo.contentTypes, points: view.byContentType.map((entry) => ({ label: entry.label, value: entry.value })), charts: ["hbar", "bar", "donut"] }));
//# sourceMappingURL=ListsByContentType.ocard.js.map