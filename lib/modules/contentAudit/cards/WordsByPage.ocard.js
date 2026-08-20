import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ContentAuditContent } from "../ContentAudit.content";
export const WordsByPageCard = ({ view }) => (React.createElement(ChartCard, { title: ContentAuditContent.charts.words, info: ContentAuditContent.cardInfo.words, defaultChart: "hbar", charts: ["hbar", "hbar", "bar"], span: 2, points: view.wordsByEntry }));
//# sourceMappingURL=WordsByPage.ocard.js.map