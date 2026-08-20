import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ImagesAuditContent } from "@/modules/imagesAudit/ImagesAudit.content";
import { ImagesAuditView } from "@/modules/imagesAudit/ImagesAudit.types";

export const PlacementsByAltTextCard: React.FC<{ view: ImagesAuditView }> = ({ view }) => (
  <ChartCard
    title={ImagesAuditContent.charts.alt}
    info={ImagesAuditContent.cardInfo.alt}
    defaultChart="donut"
    charts={["donut", "hbar", "bar"]}
    points={view.altSplit}
  />
);
