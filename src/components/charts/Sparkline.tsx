import * as React from "react";
import { Sparkline as FluentSparkline, IChartProps } from "@fluentui/react-charting";
import { Theme } from "@/theme/Theme.api";
import { SparklineProps } from "@/components/charts/Charts.types";

const DAY = 24 * 60 * 60 * 1000;

export const Sparkline: React.FC<SparklineProps> = ({
  ariaLabel,
  values,
  width = 120,
  height = 24,
  colour,
}) => {
  const base = Date.now() - values.length * DAY;

  const data: IChartProps = {
    chartTitle: ariaLabel,
    lineChartData: [
      {
        legend: ariaLabel,
        color: colour ?? Theme.seriesColour(0),
        data: values.map((value, index) => ({ x: new Date(base + index * DAY), y: value })),
      },
    ],
  };

  return <FluentSparkline data={data} width={width} height={height} showLegend={false} />;
};
