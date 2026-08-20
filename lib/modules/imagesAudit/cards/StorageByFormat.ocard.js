import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ImagesAuditContent } from "../ImagesAudit.content";
import { formatBytes } from "../../../utils/Format.util";
export const StorageByFormatCard = ({ view }) => (React.createElement(ChartCard, { title: ImagesAuditContent.charts.storageFormat, info: ImagesAuditContent.cardInfo.storageFormat, defaultChart: "donut", charts: ["donut", "hbar", "bar"], valueFormatter: formatBytes, points: view.storageByFormat }));
//# sourceMappingURL=StorageByFormat.ocard.js.map