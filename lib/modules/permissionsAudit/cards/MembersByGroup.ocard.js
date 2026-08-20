import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { PermissionsAuditContent } from "../PermissionsAudit.content";
export const MembersByGroupCard = ({ view }) => (React.createElement(ChartCard, { title: PermissionsAuditContent.charts.members, info: PermissionsAuditContent.cardInfo.members, points: view.membersByGroup, charts: ["hbar", "bar"] }));
//# sourceMappingURL=MembersByGroup.ocard.js.map