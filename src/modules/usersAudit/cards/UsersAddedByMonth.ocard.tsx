import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { UsersAuditContent } from "@/modules/usersAudit/UsersAudit.content";
import { UsersAuditView } from "@/modules/usersAudit/UsersAudit.types";

export const UsersAddedByMonthCard: React.FC<{ view: UsersAuditView }> = ({ view }) => (
  <ChartCard
    title={UsersAuditContent.charts.added}
    info={UsersAuditContent.cardInfo.added}
    defaultChart="bar"
    charts={["bar", "hbar", "donut"]}
    points={view.addedByMonth}
    previewCount={14}
  />
);
