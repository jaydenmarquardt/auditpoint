import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ListsAuditContent } from "../ListsAudit.content";
export const ContentTypesCard = ({ contentTypes, itemCount }) => (React.createElement(ChartCard, { title: ListsAuditContent.columns.contentTypes, info: ListsAuditContent.cardInfo.listContentTypes, charts: ["hbar", "donut"], emptyLabel: ListsAuditContent.dialog.noContentTypes, points: contentTypes.map((type) => ({
        label: type,
        value: Math.max(1, Math.round(itemCount / Math.max(1, contentTypes.length))),
    })), footer: ListsAuditContent.cardInfo.listContentTypesFooter }));
//# sourceMappingURL=ContentTypes.ocard.js.map