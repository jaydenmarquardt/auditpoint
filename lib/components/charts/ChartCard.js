import * as React from "react";
import { TooltipHost } from "@fluentui/react/lib/Tooltip";
import { IconButton } from "../actions/IconButton";
import { PreviewDialog } from "../actions/PreviewDialog";
import { BarChart } from "./BarChart";
import { DonutChart } from "./DonutChart";
import { StackedBar } from "./StackedBar";
import { Theme } from "../../theme/Theme.api";
const ICONS = {
    bar: "BarChartVertical",
    hbar: "BarChartHorizontal",
    donut: "DonutChart",
    stacked: "StackedBarChart",
};
const LABELS = {
    bar: "Column chart",
    hbar: "Bar chart",
    donut: "Donut chart",
    stacked: "Stacked bar",
};
export const ChartCard = ({ title, info, points, charts: requestedCharts = ["hbar", "bar", "donut"], defaultChart, valueFormatter, centreLabel, emptyLabel, footer, previewCount = 10, height = 410, span = 1, }) => {
    const charts = React.useMemo(() => [...new Set(requestedCharts)], [requestedCharts]);
    const [kind, setKind] = React.useState(defaultChart !== null && defaultChart !== void 0 ? defaultChart : charts[0]);
    const [expanded, setExpanded] = React.useState(false);
    const [full, setFull] = React.useState(false);
    const preview = points.slice(0, previewCount);
    const hidden = points.length - preview.length;
    const chart = (data, mode) => {
        const segments = data.map((point) => ({ key: point.label, label: point.label, value: point.value }));
        const chartHeight = mode === "card" ? height - 110 : mode === "dialog" ? 460 : Math.round(window.innerHeight * 0.66);
        if (kind === "donut") {
            return (React.createElement(DonutChart, { ariaLabel: title, segments: segments, centreLabel: centreLabel, size: mode === "card" ? 190 : mode === "dialog" ? 320 : Math.round(window.innerHeight * 0.5), valueFormatter: valueFormatter, emptyLabel: emptyLabel }));
        }
        if (kind === "stacked") {
            return (React.createElement(StackedBar, { ariaLabel: title, segments: segments, valueFormatter: valueFormatter, emptyLabel: emptyLabel }));
        }
        return (React.createElement(BarChart, { ariaLabel: title, points: data, horizontal: kind === "hbar", height: chartHeight, valueFormatter: valueFormatter, emptyLabel: emptyLabel }));
    };
    return (React.createElement("section", { style: {
            // A card with long labels earns more of the row rather than truncating.
            gridColumn: `span ${span}`,
            display: "flex",
            flexDirection: "column",
            background: Theme.palette().surface,
            border: `1px solid ${Theme.palette().border}`,
            borderRadius: Theme.tokens.radius.md,
            boxShadow: Theme.tokens.shadow.sm,
            minWidth: 0,
            height,
            overflow: "hidden",
        } },
        React.createElement("header", { style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: Theme.tokens.space.sm,
                padding: `${Theme.tokens.space.sm} ${Theme.tokens.space.md}`,
                borderBottom: `1px solid ${Theme.palette().border}`,
                background: Theme.palette().surfaceAlt,
            } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, minWidth: 0 } },
                React.createElement("strong", { style: { fontSize: Theme.tokens.font.md, overflow: "hidden", textOverflow: "ellipsis" } }, title),
                info && (React.createElement(TooltipHost, { content: info },
                    React.createElement("i", { className: "ms-Icon ms-Icon--Info", "aria-label": info, tabIndex: 0, style: { color: Theme.palette().textMuted, cursor: "help" } })))),
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 2, flex: "0 0 auto" } },
                charts.length > 1 &&
                    charts.map((option) => (React.createElement(IconButton, { key: option, iconName: ICONS[option], ariaLabel: `${title}: ${LABELS[option]}`, tooltip: LABELS[option], toggled: kind === option, onClick: () => setKind(option) }))),
                React.createElement(IconButton, { iconName: "ScaleVolume", ariaLabel: `${title}: open larger`, tooltip: "Open larger", onClick: () => setExpanded(true) }))),
        React.createElement("div", { style: {
                flex: "1 1 auto",
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
                padding: Theme.tokens.space.md,
            } }, chart(preview, "card")),
        (hidden > 0 || footer) && (React.createElement("footer", { style: {
                padding: `${Theme.tokens.space.xs} ${Theme.tokens.space.md} ${Theme.tokens.space.sm}`,
                fontSize: Theme.tokens.font.sm,
                color: Theme.palette().textMuted,
            } }, hidden > 0 ? `${hidden.toLocaleString()} more, open larger to see them all` : footer)),
        React.createElement(PreviewDialog, { open: expanded, onDismiss: () => {
                setExpanded(false);
                setFull(false);
            }, title: title, description: info, width: full ? "full" : "large", headerActions: React.createElement(React.Fragment, null,
                charts.length > 1 &&
                    charts.map((option) => (React.createElement(IconButton, { key: option, iconName: ICONS[option], ariaLabel: `${title}: ${LABELS[option]}`, tooltip: LABELS[option], toggled: kind === option, onClick: () => setKind(option) }))),
                React.createElement(IconButton, { iconName: full ? "BackToWindow" : "FullScreen", ariaLabel: full ? "Shrink" : "Fill the screen", tooltip: full ? "Shrink" : "Fill the screen", toggled: full, onClick: () => setFull(!full) })) },
            React.createElement("div", { style: { minHeight: full ? "70vh" : undefined } }, chart(points, full ? "fill" : "dialog")))));
};
//# sourceMappingURL=ChartCard.js.map