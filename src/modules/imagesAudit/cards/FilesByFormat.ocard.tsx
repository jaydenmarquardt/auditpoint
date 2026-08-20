import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ImagesAuditContent } from "@/modules/imagesAudit/ImagesAudit.content";
import { ImagesAuditView } from "@/modules/imagesAudit/ImagesAudit.types";

export const FilesByFormatCard: React.FC<{ view: ImagesAuditView }> = ({ view }) => (
  <ChartCard
    title={ImagesAuditContent.charts.format}
    info={ImagesAuditContent.cardInfo.format}
    defaultChart="donut"
    charts={["donut", "hbar", "bar"]}
    points={view.filesByFormat}
  />
);
