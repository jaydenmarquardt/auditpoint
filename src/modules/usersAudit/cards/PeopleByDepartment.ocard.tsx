import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { UsersAuditContent } from "@/modules/usersAudit/UsersAudit.content";
import { UsersAuditView } from "@/modules/usersAudit/UsersAudit.types";

export const PeopleByDepartmentCard: React.FC<{ view: UsersAuditView }> = ({ view }) => (
  <ChartCard
    title={UsersAuditContent.charts.department}
    info={UsersAuditContent.cardInfo.department}
    defaultChart="hbar"
    charts={["hbar", "hbar", "donut"]}
    points={view.byDepartment}
    previewCount={14}
  />
);
