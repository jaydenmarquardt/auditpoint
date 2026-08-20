import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { PublishingAuditContent } from "../PublishingAudit.content";
export const ItemsByEditorCard = ({ view }) => (React.createElement(ChartCard, { title: PublishingAuditContent.charts.editors, info: PublishingAuditContent.cardInfo.editors, defaultChart: "hbar", charts: ["hbar", "hbar", "donut"], points: view.topEditors, previewCount: 14 }));
//# sourceMappingURL=ItemsByEditor.ocard.js.map