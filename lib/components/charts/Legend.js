import * as React from "react";
import { Legends } from "@fluentui/react-charting";
export const Legend = ({ items }) => {
    const legends = items.map((item) => ({
        title: item.value ? `${item.label} (${item.value})` : item.label,
        color: item.colour,
    }));
    return React.createElement(Legends, { legends: legends, enabledWrapLines: true, centerLegends: false });
};
//# sourceMappingURL=Legend.js.map