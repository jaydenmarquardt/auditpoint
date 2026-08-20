import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";

export interface ContentTypesCardProps {
  /** Content types attached to a single list. */
  contentTypes: string[];
  itemCount: number;
}

export const ContentTypesCard: React.FC<ContentTypesCardProps> = ({ contentTypes, itemCount }) => (
  <ChartCard
    title={ListsAuditContent.columns.contentTypes}
    info={ListsAuditContent.cardInfo.listContentTypes}
    charts={["hbar", "donut"]}
    emptyLabel={ListsAuditContent.dialog.noContentTypes}
    points={contentTypes.map((type) => ({
      label: type,
      value: Math.max(1, Math.round(itemCount / Math.max(1, contentTypes.length))),
    }))}
    footer={ListsAuditContent.cardInfo.listContentTypesFooter}
  />
);
