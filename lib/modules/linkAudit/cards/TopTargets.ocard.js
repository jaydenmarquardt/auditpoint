import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { LinkAuditContent } from "../LinkAudit.content";
export const TopTargetsCard = ({ view }) => (React.createElement(ChartCard, { title: LinkAuditContent.charts.topTargets, info: LinkAuditContent.cardInfo.topTargets, defaultChart: "hbar", charts: ["donut", "hbar", "bar"], span: 2, selectable: false, points: view.topTargets }));
//# sourceMappingURL=TopTargets.ocard.js.map