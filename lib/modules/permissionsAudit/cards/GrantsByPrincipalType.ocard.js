import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { PermissionsAuditContent } from "../PermissionsAudit.content";
import { formatNumber } from "../../../utils/Format.util";
export const GrantsByPrincipalTypeCard = ({ view }) => (React.createElement(ChartCard, { title: PermissionsAuditContent.charts.kind, info: PermissionsAuditContent.cardInfo.kind, defaultChart: "donut", charts: ["donut", "hbar", "stacked"], centreLabel: formatNumber(view.totals.grants), points: view.grantsByKind }));
//# sourceMappingURL=GrantsByPrincipalType.ocard.js.map