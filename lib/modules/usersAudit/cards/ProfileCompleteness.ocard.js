import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { UsersAuditContent } from "../UsersAudit.content";
export const ProfileCompletenessCard = ({ view }) => (React.createElement(ChartCard, { title: UsersAuditContent.charts.completeness, info: UsersAuditContent.cardInfo.completeness, defaultChart: "stacked", charts: ["stacked", "hbar", "donut"], points: view.profileCompleteness, previewCount: 14 }));
//# sourceMappingURL=ProfileCompleteness.ocard.js.map