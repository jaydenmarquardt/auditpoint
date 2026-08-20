import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { LinkAuditContent } from "../LinkAudit.content";
export const BrokenByListCard = ({ view }) => (React.createElement(ChartCard, { title: LinkAuditContent.charts.brokenByList, info: LinkAuditContent.cardInfo.brokenByList, defaultChart: "hbar", charts: ["donut", "hbar", "bar"], span: 2, points: view.brokenByList }));
//# sourceMappingURL=BrokenByList.ocard.js.map