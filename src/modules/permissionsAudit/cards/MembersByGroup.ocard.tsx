import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import { PermissionsAuditView } from "@/modules/permissionsAudit/PermissionsAudit.types";

export const MembersByGroupCard: React.FC<{ view: PermissionsAuditView }> = ({ view }) => (
  <ChartCard
    title={PermissionsAuditContent.charts.members}
    info={PermissionsAuditContent.cardInfo.members}
    points={view.membersByGroup}
    charts={["hbar", "bar"]}
  />
);
