import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { WebPartAuditContent } from "../WebPartAudit.content";
import { dedupeLabels } from "../WebPartAudit.logic";
export const WebPartsByPageCard = ({ view }) => (React.createElement(ChartCard, { title: WebPartAuditContent.charts.busiest, info: WebPartAuditContent.cardInfo.busiest, span: 2, selectable: false, points: dedupeLabels(view.busiestPages.map((page) => ({ label: page.title, value: page.webPartCount }))), charts: ["hbar", "bar"] }));
//# sourceMappingURL=WebPartsByPage.ocard.js.map