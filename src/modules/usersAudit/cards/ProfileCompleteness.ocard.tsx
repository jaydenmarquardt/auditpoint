import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { UsersAuditContent } from "@/modules/usersAudit/UsersAudit.content";
import { UsersAuditView } from "@/modules/usersAudit/UsersAudit.types";

export const ProfileCompletenessCard: React.FC<{ view: UsersAuditView }> = ({ view }) => (
  <ChartCard
    title={UsersAuditContent.charts.completeness}
    info={UsersAuditContent.cardInfo.completeness}
    defaultChart="stacked"
    charts={["stacked", "hbar", "donut"]}
    points={view.profileCompleteness}
    previewCount={14}
  />
);
