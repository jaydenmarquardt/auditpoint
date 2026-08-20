import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import { PermissionsAuditView } from "@/modules/permissionsAudit/PermissionsAudit.types";
import { formatNumber } from "@/utils/Format.util";

export const GrantsByPrincipalTypeCard: React.FC<{ view: PermissionsAuditView }> = ({ view }) => (
  <ChartCard
    title={PermissionsAuditContent.charts.kind}
    info={PermissionsAuditContent.cardInfo.kind}
    defaultChart="donut"
    charts={["donut", "hbar", "stacked"]}
    centreLabel={formatNumber(view.totals.grants)}
    points={view.grantsByKind}
  />
);
