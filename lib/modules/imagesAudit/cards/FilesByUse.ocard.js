import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ImagesAuditContent } from "../ImagesAudit.content";
export const FilesByUseCard = ({ view }) => (React.createElement(ChartCard, { title: ImagesAuditContent.charts.used, info: ImagesAuditContent.cardInfo.used, defaultChart: "donut", charts: ["donut", "hbar", "bar"], points: view.usageSplit }));
//# sourceMappingURL=FilesByUse.ocard.js.map