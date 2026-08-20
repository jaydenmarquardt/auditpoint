import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { WebPartAuditContent } from "../WebPartAudit.content";
import { dedupeLabels } from "../WebPartAudit.logic";
export const InstancesByWebPartCard = ({ view }) => (React.createElement(ChartCard, { title: WebPartAuditContent.charts.topTypes, info: WebPartAuditContent.cardInfo.topTypes, points: dedupeLabels(view.topTypes), charts: ["hbar", "bar", "donut"] }));
//# sourceMappingURL=InstancesByWebPart.ocard.js.map