import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ImagesAuditContent } from "@/modules/imagesAudit/ImagesAudit.content";
import { ImagesAuditView } from "@/modules/imagesAudit/ImagesAudit.types";

export const PlacementsByPageCard: React.FC<{ view: ImagesAuditView }> = ({ view }) => (
  <ChartCard
    title={ImagesAuditContent.charts.usage}
    info={ImagesAuditContent.cardInfo.usage}
    defaultChart="hbar"
    charts={["hbar", "hbar", "bar"]}
    points={view.usageByPage}
  />
);
