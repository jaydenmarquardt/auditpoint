import * as React from "react";
import { StackedBarChart, IChartProps } from "@fluentui/react-charting";
import { Theme } from "@/theme/Theme.api";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { ChartEmpty } from "@/components/charts/ChartEmpty";
import { useElementWidth } from "@/core/hooks/useElementWidth";
import { StackedBarProps } from "@/components/charts/Charts.types";

export const StackedBar: React.FC<StackedBarProps> = ({
  ariaLabel,
  title,
  segments,
  height = 16,
  valueFormatter = (value) => value.toLocaleString(),
  emptyLabel,
}) => {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  if (total === 0) {
    return (
      <ChartFrame title={title} ariaLabel={ariaLabel}>
        <ChartEmpty label={emptyLabel} />
      </ChartFrame>
    );
  }

  const data: IChartProps = {
    chartTitle: title ?? ariaLabel,
    chartData: segments.map((segment, index) => ({
      legend: segment.label,
      data: segment.value,
      color: segment.colour ?? Theme.seriesColour(index),
      xAxisCalloutData: segment.label,
      yAxisCalloutData: valueFormatter(segment.value),
    })),
  };

  return (
    <ChartFrame title={title} ariaLabel={ariaLabel}>
      <div ref={ref} style={{ width: "100%", minWidth: 0 }}>
        <StackedBarChart data={data} width={width} barHeight={height} hideDenominator ignoreFixStyle />
      </div>
    </ChartFrame>
  );
};
