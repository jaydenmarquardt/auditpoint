import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ImagesAuditContent } from "@/modules/imagesAudit/ImagesAudit.content";
import { ImagesAuditView } from "@/modules/imagesAudit/ImagesAudit.types";

export const FilesByUseCard: React.FC<{ view: ImagesAuditView }> = ({ view }) => (
  <ChartCard
    title={ImagesAuditContent.charts.used}
    info={ImagesAuditContent.cardInfo.used}
    defaultChart="donut"
    charts={["donut", "hbar", "bar"]}
    points={view.usageSplit}
  />
);
