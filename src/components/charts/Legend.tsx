import * as React from "react";
import { Legends, ILegend } from "@fluentui/react-charting";
import { LegendProps } from "@/components/charts/Charts.types";

export const Legend: React.FC<LegendProps> = ({ items }) => {
  const legends: ILegend[] = items.map((item) => ({
    title: item.value ? `${item.label} (${item.value})` : item.label,
    color: item.colour,
  }));

  return <Legends legends={legends} enabledWrapLines centerLegends={false} />;
};
