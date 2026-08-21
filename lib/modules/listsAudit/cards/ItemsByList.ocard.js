import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ListsAuditContent } from "../ListsAudit.content";
export const ItemsByListCard = ({ view }) => (React.createElement(ChartCard, { title: ListsAuditContent.charts.largestItems, info: ListsAuditContent.cardInfo.largestItems, span: 2, selectable: false, points: view.largestByItems.map((list) => ({ label: list.title, value: list.itemCount })), charts: ["hbar", "bar"] }));
//# sourceMappingURL=ItemsByList.ocard.js.map