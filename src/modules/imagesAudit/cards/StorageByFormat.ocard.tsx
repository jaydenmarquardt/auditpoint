import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ImagesAuditContent } from "@/modules/imagesAudit/ImagesAudit.content";
import { ImagesAuditView } from "@/modules/imagesAudit/ImagesAudit.types";
import { formatBytes } from "@/utils/Format.util";

export const StorageByFormatCard: React.FC<{ view: ImagesAuditView }> = ({ view }) => (
  <ChartCard
    title={ImagesAuditContent.charts.storageFormat}
    info={ImagesAuditContent.cardInfo.storageFormat}
    defaultChart="donut"
    charts={["donut", "hbar", "bar"]}
    valueFormatter={formatBytes}
    points={view.storageByFormat}
  />
);
