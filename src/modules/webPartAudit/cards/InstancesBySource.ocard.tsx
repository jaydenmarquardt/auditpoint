import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { WebPartAuditContent } from "@/modules/webPartAudit/WebPartAudit.content";
import { WebPartAuditView } from "@/modules/webPartAudit/WebPartAudit.types";
import { formatNumber } from "@/utils/Format.util";

export const InstancesBySourceCard: React.FC<{ view: WebPartAuditView }> = ({ view }) => (
  <ChartCard
    title={WebPartAuditContent.charts.instanceSource}
    info={WebPartAuditContent.cardInfo.instanceSource}
    defaultChart="donut"
    charts={["donut", "hbar", "stacked"]}
    centreLabel={formatNumber(view.totals.instances)}
    points={[
      { label: WebPartAuditContent.outOfBox, value: view.totals.instancesOutOfBox },
      { label: WebPartAuditContent.thirdParty, value: view.totals.instancesThirdParty },
      { label: WebPartAuditContent.text, value: view.totals.instancesStock },
    ]}
  />
);
