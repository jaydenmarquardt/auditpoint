import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { UsersAuditContent } from "../UsersAudit.content";
export const MembersByGroupCard = ({ view }) => (React.createElement(ChartCard, { title: UsersAuditContent.charts.members, info: UsersAuditContent.cardInfo.members, defaultChart: "hbar", charts: ["hbar", "hbar", "donut"], points: view.membersByGroup, previewCount: 14 }));
//# sourceMappingURL=MembersByGroup.ocard.js.map