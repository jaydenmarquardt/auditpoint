import * as React from "react";
import { AreaChart, LineChart as FluentLineChart, IChartProps, ILineChartPoints } from "@fluentui/react-charting";
import { Theme } from "@/theme/Theme.api";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { ChartEmpty } from "@/components/charts/ChartEmpty";
import { useElementWidth } from "@/core/hooks/useElementWidth";
import { LineChartProps } from "@/components/charts/Charts.types";

const DAY = 24 * 60 * 60 * 1000;

export const LineChart: React.FC<LineChartProps> = ({
  ariaLabel,
  series,
  title,
  height = 240,
  area,
  valueFormatter = (value) => value.toLocaleString(),
  emptyLabel,
}) => {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const hasPoints = series.some((entry) => entry.points.length > 0);

  if (!hasPoints) {
    return (
      <ChartFrame title={title} ariaLabel={ariaLabel}>
        <ChartEmpty label={emptyLabel} />
      </ChartFrame>
    );
  }

  const base = Date.now() - series[0].points.length * DAY;

  const lineChartData: ILineChartPoints[] = series.map((entry, index) => ({
    legend: entry.label,
    color: entry.colour ?? Theme.seriesColour(index),
    data: entry.points.map((point, pointIndex) => ({
      x: point.date ?? new Date(base + pointIndex * DAY),
      y: point.value,
      xAxisCalloutData: point.label,
      yAxisCalloutData: valueFormatter(point.value),
    })),
  }));

  const data: IChartProps = { chartTitle: title ?? ariaLabel, lineChartData };

  return (
    <ChartFrame title={title} ariaLabel={ariaLabel}>
      <div ref={ref} style={{ width: "100%", minWidth: 0, height }}>
        {area ? (
          <AreaChart data={data} height={height} width={width} enablePerfOptimization />
        ) : (
          <FluentLineChart data={data} height={height} width={width} enablePerfOptimization />
        )}
      </div>
    </ChartFrame>
  );
};
