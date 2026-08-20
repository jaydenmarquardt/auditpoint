import * as React from "react";
import { Sparkline as FluentSparkline } from "@fluentui/react-charting";
import { Theme } from "../../theme/Theme.api";
const DAY = 24 * 60 * 60 * 1000;
export const Sparkline = ({ ariaLabel, values, width = 120, height = 24, colour, }) => {
    const base = Date.now() - values.length * DAY;
    const data = {
        chartTitle: ariaLabel,
        lineChartData: [
            {
                legend: ariaLabel,
                color: colour !== null && colour !== void 0 ? colour : Theme.seriesColour(0),
                data: values.map((value, index) => ({ x: new Date(base + index * DAY), y: value })),
            },
        ],
    };
    return React.createElement(FluentSparkline, { data: data, width: width, height: height, showLegend: false });
};
//# sourceMappingURL=Sparkline.js.map