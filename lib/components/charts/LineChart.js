import * as React from "react";
import { AreaChart, LineChart as FluentLineChart } from "@fluentui/react-charting";
import { Theme } from "../../theme/Theme.api";
import { ChartFrame } from "./ChartFrame";
import { ChartEmpty } from "./ChartEmpty";
import { useElementWidth } from "../../core/hooks/useElementWidth";
const DAY = 24 * 60 * 60 * 1000;
export const LineChart = ({ ariaLabel, series, title, height = 240, area, valueFormatter = (value) => value.toLocaleString(), emptyLabel, }) => {
    const [ref, width] = useElementWidth();
    const hasPoints = series.some((entry) => entry.points.length > 0);
    if (!hasPoints) {
        return (React.createElement(ChartFrame, { title: title, ariaLabel: ariaLabel },
            React.createElement(ChartEmpty, { label: emptyLabel })));
    }
    const base = Date.now() - series[0].points.length * DAY;
    const lineChartData = series.map((entry, index) => {
        var _a;
        return ({
            legend: entry.label,
            color: (_a = entry.colour) !== null && _a !== void 0 ? _a : Theme.seriesColour(index),
            data: entry.points.map((point, pointIndex) => {
                var _a;
                return ({
                    x: (_a = point.date) !== null && _a !== void 0 ? _a : new Date(base + pointIndex * DAY),
                    y: point.value,
                    xAxisCalloutData: point.label,
                    yAxisCalloutData: valueFormatter(point.value),
                });
            }),
        });
    });
    const data = { chartTitle: title !== null && title !== void 0 ? title : ariaLabel, lineChartData };
    return (React.createElement(ChartFrame, { title: title, ariaLabel: ariaLabel },
        React.createElement("div", { ref: ref, style: { width: "100%", minWidth: 0, height } }, area ? (React.createElement(AreaChart, { data: data, height: height, width: width, enablePerfOptimization: true })) : (React.createElement(FluentLineChart, { data: data, height: height, width: width, enablePerfOptimization: true })))));
};
//# sourceMappingURL=LineChart.js.map