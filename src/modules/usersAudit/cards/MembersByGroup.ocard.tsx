import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { UsersAuditContent } from "@/modules/usersAudit/UsersAudit.content";
import { UsersAuditView } from "@/modules/usersAudit/UsersAudit.types";

export const MembersByGroupCard: React.FC<{ view: UsersAuditView }> = ({ view }) => (
  <ChartCard
    title={UsersAuditContent.charts.members}
    info={UsersAuditContent.cardInfo.members}
    defaultChart="hbar"
    charts={["hbar", "hbar", "donut"]}
    points={view.membersByGroup}
    previewCount={14}
  />
);
