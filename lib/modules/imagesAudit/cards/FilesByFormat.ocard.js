import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ImagesAuditContent } from "../ImagesAudit.content";
export const FilesByFormatCard = ({ view }) => (React.createElement(ChartCard, { title: ImagesAuditContent.charts.format, info: ImagesAuditContent.cardInfo.format, defaultChart: "donut", charts: ["donut", "hbar", "bar"], points: view.filesByFormat }));
//# sourceMappingURL=FilesByFormat.ocard.js.map