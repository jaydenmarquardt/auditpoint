import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { UsersAuditContent } from "@/modules/usersAudit/UsersAudit.content";
import { UsersAuditView } from "@/modules/usersAudit/UsersAudit.types";

export const PrincipalsByTypeCard: React.FC<{ view: UsersAuditView }> = ({ view }) => (
  <ChartCard
    title={UsersAuditContent.charts.kind}
    info={UsersAuditContent.cardInfo.kind}
    defaultChart="donut"
    charts={["donut", "hbar", "donut"]}
    points={view.usersByKind}
    previewCount={14}
  />
);
