import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { WebPartAuditContent } from "@/modules/webPartAudit/WebPartAudit.content";
import { WebPartAuditView } from "@/modules/webPartAudit/WebPartAudit.types";
import { dedupeLabels } from "@/modules/webPartAudit/WebPartAudit.logic";

export const InstancesByWebPartCard: React.FC<{ view: WebPartAuditView }> = ({ view }) => (
  <ChartCard
    title={WebPartAuditContent.charts.topTypes}
    info={WebPartAuditContent.cardInfo.topTypes}
    points={dedupeLabels(view.topTypes)}
    charts={["hbar", "bar", "donut"]}
  />
);
