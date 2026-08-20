import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ListsAuditContent } from "../ListsAudit.content";
import { formatBytes } from "../../../utils/Format.util";
export const StorageByListCard = ({ view }) => (React.createElement(ChartCard, { title: ListsAuditContent.charts.largest, info: ListsAuditContent.cardInfo.largest, valueFormatter: formatBytes, emptyLabel: ListsAuditContent.storageUnavailableShort, points: view.largest.map((list) => { var _a; return ({ label: list.title, value: (_a = list.storageBytes) !== null && _a !== void 0 ? _a : 0 }); }), charts: ["hbar", "donut"] }));
//# sourceMappingURL=StorageByList.ocard.js.map