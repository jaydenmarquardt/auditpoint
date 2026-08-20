import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";
import { ListsAuditView } from "@/modules/listsAudit/ListsAudit.types";

export const GovernanceFlagsCard: React.FC<{ view: ListsAuditView }> = ({ view }) => (
  <ChartCard
    title={ListsAuditContent.charts.governance}
    info={ListsAuditContent.cardInfo.governance}
    defaultChart="stacked"
    charts={["stacked", "hbar", "donut"]}
    points={[
      {
        label: "Versioning on",
        value: view.totals.lists + view.totals.libraries - view.totals.noVersioning,
      },
      { label: "Versioning off", value: view.totals.noVersioning },
      { label: "Unique permissions", value: view.totals.uniquePermissions },
    ]}
  />
);
