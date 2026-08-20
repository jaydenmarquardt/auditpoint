import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ImagesAuditContent } from "../ImagesAudit.content";
export const FilesBySizeCard = ({ view }) => (React.createElement(ChartCard, { title: ImagesAuditContent.charts.size, info: ImagesAuditContent.cardInfo.size, defaultChart: "bar", charts: ["bar", "hbar", "bar"], points: view.sizeBuckets }));
//# sourceMappingURL=FilesBySize.ocard.js.map