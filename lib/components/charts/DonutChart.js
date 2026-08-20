import * as React from "react";
import { DonutChart as FluentDonutChart } from "@fluentui/react-charting";
import { Theme } from "../../theme/Theme.api";
import { ChartFrame } from "./ChartFrame";
import { ChartEmpty } from "./ChartEmpty";
import { useElementWidth } from "../../core/hooks/useElementWidth";
export const DonutChart = ({ ariaLabel, title, segments, size = 200, centreLabel, valueFormatter = (value) => value.toLocaleString(), emptyLabel, }) => {
    const [ref, width] = useElementWidth();
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    if (total === 0) {
        return (React.createElement(ChartFrame, { title: title, ariaLabel: ariaLabel },
            React.createElement(ChartEmpty, { label: emptyLabel })));
    }
    const data = {
        chartTitle: title !== null && title !== void 0 ? title : ariaLabel,
        chartData: segments.map((segment, index) => {
            var _a;
            return ({
                legend: segment.label,
                data: segment.value,
                color: (_a = segment.colour) !== null && _a !== void 0 ? _a : Theme.seriesColour(index),
                xAxisCalloutData: segment.label,
                yAxisCalloutData: valueFormatter(segment.value),
            });
        }),
    };
    return (React.createElement(ChartFrame, { title: title, ariaLabel: ariaLabel },
        React.createElement("div", { ref: ref, style: { width: "100%", minWidth: 0 } },
            React.createElement(FluentDonutChart, { data: data, innerRadius: Math.round(size / 4), height: size, width: width, valueInsideDonut: centreLabel, hideLegend: false }))));
};
//# sourceMappingURL=DonutChart.js.map