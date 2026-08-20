import * as React from "react";
import { HorizontalBarChart, HorizontalBarChartVariant, VerticalBarChart, } from "@fluentui/react-charting";
import { Theme } from "../../theme/Theme.api";
import { ChartFrame } from "./ChartFrame";
import { ChartEmpty } from "./ChartEmpty";
import { useElementWidth } from "../../core/hooks/useElementWidth";
export const BarChart = ({ ariaLabel, points, title, height = 220, horizontal, valueFormatter = (value) => value.toLocaleString(), colour, emptyLabel, }) => {
    const [ref, width] = useElementWidth();
    const max = Math.max(...points.map((point) => point.value), 0);
    if (points.length === 0 || max === 0) {
        return (React.createElement(ChartFrame, { title: title, ariaLabel: ariaLabel },
            React.createElement(ChartEmpty, { label: emptyLabel })));
    }
    if (horizontal) {
        const data = points.map((point, index) => {
            var _a, _b;
            return ({
                chartTitle: point.label,
                chartData: [
                    {
                        legend: point.label,
                        horizontalBarChartdata: { x: point.value, y: max },
                        color: (_b = (_a = point.colour) !== null && _a !== void 0 ? _a : colour) !== null && _b !== void 0 ? _b : Theme.seriesColour(index),
                        xAxisCalloutData: point.label,
                        yAxisCalloutData: valueFormatter(point.value),
                    },
                ],
            });
        });
        return (React.createElement(ChartFrame, { title: title, ariaLabel: ariaLabel },
            React.createElement("div", { ref: ref, style: { width: "100%", minWidth: 0 } },
                React.createElement(HorizontalBarChart, { data: data, width: width, barHeight: 12, variant: HorizontalBarChartVariant.AbsoluteScale, chartDataMode: "default", hideTooltip: false }))));
    }
    const bars = points.map((point, index) => {
        var _a, _b;
        return ({
            x: point.label,
            y: point.value,
            color: (_b = (_a = point.colour) !== null && _a !== void 0 ? _a : colour) !== null && _b !== void 0 ? _b : Theme.seriesColour(index),
            yAxisCalloutData: valueFormatter(point.value),
        });
    });
    return (React.createElement(ChartFrame, { title: title, ariaLabel: ariaLabel },
        React.createElement("div", { ref: ref, style: { width: "100%", minWidth: 0, height } },
            React.createElement(VerticalBarChart, { data: bars, width: width, height: height, hideLegend: true, barWidth: "auto", yAxisTickCount: 4, culture: undefined }))));
};
//# sourceMappingURL=BarChart.js.map