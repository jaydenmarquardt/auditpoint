import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ImagesAuditContent } from "../ImagesAudit.content";
export const PlacementsByPageCard = ({ view }) => (React.createElement(ChartCard, { title: ImagesAuditContent.charts.usage, info: ImagesAuditContent.cardInfo.usage, defaultChart: "hbar", charts: ["hbar", "hbar", "bar"], span: 2, points: view.usageByPage }));
//# sourceMappingURL=PlacementsByPage.ocard.js.map