import * as React from "react";
import {
  HorizontalBarChart,
  HorizontalBarChartVariant,
  VerticalBarChart,
  IChartProps,
  IVerticalBarChartDataPoint,
} from "@fluentui/react-charting";
import { Theme } from "@/theme/Theme.api";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { ChartEmpty } from "@/components/charts/ChartEmpty";
import { useElementWidth } from "@/core/hooks/useElementWidth";
import { BarChartProps } from "@/components/charts/Charts.types";

export const BarChart: React.FC<BarChartProps> = ({
  ariaLabel,
  points,
  title,
  height = 220,
  horizontal,
  valueFormatter = (value) => value.toLocaleString(),
  colour,
  emptyLabel,
}) => {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const max = Math.max(...points.map((point) => point.value), 0);

  if (points.length === 0 || max === 0) {
    return (
      <ChartFrame title={title} ariaLabel={ariaLabel}>
        <ChartEmpty label={emptyLabel} />
      </ChartFrame>
    );
  }

  if (horizontal) {
    const data: IChartProps[] = points.map((point, index) => ({
      chartTitle: point.label,
      chartData: [
        {
          legend: point.label,
          horizontalBarChartdata: { x: point.value, y: max },
          color: point.colour ?? colour ?? Theme.seriesColour(index),
          xAxisCalloutData: point.label,
          yAxisCalloutData: valueFormatter(point.value),
        },
      ],
    }));

    return (
      <ChartFrame title={title} ariaLabel={ariaLabel}>
        <div ref={ref} style={{ width: "100%", minWidth: 0 }}>
          <HorizontalBarChart
            data={data}
            width={width}
            barHeight={12}
            variant={HorizontalBarChartVariant.AbsoluteScale}
            chartDataMode="default"
            hideTooltip={false}
          />
        </div>
      </ChartFrame>
    );
  }

  const bars: IVerticalBarChartDataPoint[] = points.map((point, index) => ({
    x: point.label,
    y: point.value,
    color: point.colour ?? colour ?? Theme.seriesColour(index),
    yAxisCalloutData: valueFormatter(point.value),
  }));

  return (
    <ChartFrame title={title} ariaLabel={ariaLabel}>
      <div ref={ref} style={{ width: "100%", minWidth: 0, height }}>
        <VerticalBarChart
          data={bars}
          width={width}
          height={height}
          hideLegend
          barWidth="auto"
          yAxisTickCount={4}
          culture={undefined}
        />
      </div>
    </ChartFrame>
  );
};
