import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import { PermissionsAuditView } from "@/modules/permissionsAudit/PermissionsAudit.types";

export const GrantsByLevelCard: React.FC<{ view: PermissionsAuditView }> = ({ view }) => (
  <ChartCard
    title={PermissionsAuditContent.charts.level}
    info={PermissionsAuditContent.cardInfo.level}
    points={view.grantsByLevel}
    charts={["hbar", "bar", "donut"]}
  />
);
