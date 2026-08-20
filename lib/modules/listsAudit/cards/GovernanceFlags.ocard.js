import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ListsAuditContent } from "../ListsAudit.content";
export const GovernanceFlagsCard = ({ view }) => (React.createElement(ChartCard, { title: ListsAuditContent.charts.governance, info: ListsAuditContent.cardInfo.governance, defaultChart: "stacked", charts: ["stacked", "hbar", "donut"], points: [
        {
            label: "Versioning on",
            value: view.totals.lists + view.totals.libraries - view.totals.noVersioning,
        },
        { label: "Versioning off", value: view.totals.noVersioning },
        { label: "Unique permissions", value: view.totals.uniquePermissions },
    ] }));
//# sourceMappingURL=GovernanceFlags.ocard.js.map