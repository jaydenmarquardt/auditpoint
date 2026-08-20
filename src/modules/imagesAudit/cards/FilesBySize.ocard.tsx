import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ImagesAuditContent } from "@/modules/imagesAudit/ImagesAudit.content";
import { ImagesAuditView } from "@/modules/imagesAudit/ImagesAudit.types";

export const FilesBySizeCard: React.FC<{ view: ImagesAuditView }> = ({ view }) => (
  <ChartCard
    title={ImagesAuditContent.charts.size}
    info={ImagesAuditContent.cardInfo.size}
    defaultChart="bar"
    charts={["bar", "hbar", "bar"]}
    points={view.sizeBuckets}
  />
);
