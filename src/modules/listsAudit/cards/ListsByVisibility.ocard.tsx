import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";
import { ListsAuditView } from "@/modules/listsAudit/ListsAudit.types";
import { formatNumber } from "@/utils/Format.util";

export const ListsByVisibilityCard: React.FC<{ view: ListsAuditView }> = ({ view }) => (
  <ChartCard
    title={ListsAuditContent.charts.split}
    info={ListsAuditContent.cardInfo.split}
    defaultChart="donut"
    charts={["donut", "hbar", "stacked"]}
    centreLabel={formatNumber(view.totals.lists + view.totals.libraries)}
    points={[
      { label: "Libraries", value: view.totals.libraries },
      { label: "Lists", value: view.totals.lists },
      { label: "Hidden", value: view.totals.hidden },
    ]}
  />
);
