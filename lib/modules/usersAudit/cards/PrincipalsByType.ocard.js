import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { UsersAuditContent } from "../UsersAudit.content";
export const PrincipalsByTypeCard = ({ view }) => (React.createElement(ChartCard, { title: UsersAuditContent.charts.kind, info: UsersAuditContent.cardInfo.kind, defaultChart: "donut", charts: ["donut", "hbar", "donut"], points: view.usersByKind, previewCount: 14 }));
//# sourceMappingURL=PrincipalsByType.ocard.js.map