import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { UsersAuditContent } from "@/modules/usersAudit/UsersAudit.content";
import { UsersAuditView } from "@/modules/usersAudit/UsersAudit.types";

export const UsersActiveByMonthCard: React.FC<{ view: UsersAuditView }> = ({ view }) => (
  <ChartCard
    title={UsersAuditContent.charts.active}
    info={UsersAuditContent.cardInfo.active}
    defaultChart="bar"
    charts={["bar", "hbar", "donut"]}
    points={view.activeByMonth}
    previewCount={14}
  />
);
