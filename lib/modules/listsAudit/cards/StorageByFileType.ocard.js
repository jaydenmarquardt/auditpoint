import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ListsAuditContent } from "../ListsAudit.content";
import { formatBytes } from "../../../utils/Format.util";
export const StorageByFileTypeCard = ({ view }) => (React.createElement(ChartCard, { title: ListsAuditContent.charts.extensionSize, info: ListsAuditContent.cardInfo.extensionSize, defaultChart: "donut", charts: ["donut", "hbar"], valueFormatter: formatBytes, emptyLabel: ListsAuditContent.storageUnavailableShort, points: view.byExtensionSize.map((entry) => ({ label: entry.label, value: entry.value })) }));
//# sourceMappingURL=StorageByFileType.ocard.js.map