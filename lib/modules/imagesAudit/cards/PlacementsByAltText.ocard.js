import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ImagesAuditContent } from "../ImagesAudit.content";
export const PlacementsByAltTextCard = ({ view }) => (React.createElement(ChartCard, { title: ImagesAuditContent.charts.alt, info: ImagesAuditContent.cardInfo.alt, defaultChart: "donut", charts: ["donut", "hbar", "bar"], points: view.altSplit }));
//# sourceMappingURL=PlacementsByAltText.ocard.js.map