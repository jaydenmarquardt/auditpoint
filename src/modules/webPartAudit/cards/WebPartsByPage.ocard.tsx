import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { WebPartAuditContent } from "@/modules/webPartAudit/WebPartAudit.content";
import { WebPartAuditView } from "@/modules/webPartAudit/WebPartAudit.types";
import { dedupeLabels } from "@/modules/webPartAudit/WebPartAudit.logic";

export const WebPartsByPageCard: React.FC<{ view: WebPartAuditView }> = ({ view }) => (
  <ChartCard
    title={WebPartAuditContent.charts.busiest}
    info={WebPartAuditContent.cardInfo.busiest}
    points={dedupeLabels(view.busiestPages.map((page) => ({ label: page.title, value: page.webPartCount })))}
    charts={["hbar", "bar"]}
  />
);
