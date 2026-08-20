import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { WebPartAuditContent } from "../WebPartAudit.content";
import { formatNumber } from "../../../utils/Format.util";
export const WebPartsBySourceCard = ({ view }) => (React.createElement(ChartCard, { title: WebPartAuditContent.charts.source, info: WebPartAuditContent.cardInfo.source, defaultChart: "donut", charts: ["donut", "hbar", "stacked"], centreLabel: formatNumber(view.totals.types), points: [
        { label: WebPartAuditContent.outOfBox, value: view.totals.outOfBox },
        { label: WebPartAuditContent.thirdParty, value: view.totals.thirdParty },
        {
            label: WebPartAuditContent.text,
            value: Math.max(0, view.totals.types - view.totals.outOfBox - view.totals.thirdParty),
        },
    ] }));
//# sourceMappingURL=WebPartsBySource.ocard.js.map