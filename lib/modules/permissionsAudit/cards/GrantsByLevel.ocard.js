import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { PermissionsAuditContent } from "../PermissionsAudit.content";
export const GrantsByLevelCard = ({ view }) => (React.createElement(ChartCard, { title: PermissionsAuditContent.charts.level, info: PermissionsAuditContent.cardInfo.level, points: view.grantsByLevel, charts: ["hbar", "bar", "donut"] }));
//# sourceMappingURL=GrantsByLevel.ocard.js.map