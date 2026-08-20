import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ListsAuditContent } from "../ListsAudit.content";
import { formatNumber } from "../../../utils/Format.util";
export const ListsByVisibilityCard = ({ view }) => (React.createElement(ChartCard, { title: ListsAuditContent.charts.split, info: ListsAuditContent.cardInfo.split, defaultChart: "donut", charts: ["donut", "hbar", "stacked"], centreLabel: formatNumber(view.totals.lists + view.totals.libraries), points: [
        { label: "Libraries", value: view.totals.libraries },
        { label: "Lists", value: view.totals.lists },
        { label: "Hidden", value: view.totals.hidden },
    ] }));
//# sourceMappingURL=ListsByVisibility.ocard.js.map