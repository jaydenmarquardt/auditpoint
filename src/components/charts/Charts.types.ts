import * as React from "react";

export interface ChartPoint {
  label: string;
  value: number;
  colour?: string;
}

export interface ChartSeriesPoint {
  label: string;
  value: number;
  /** Line and area charts plot against time; omit to synthesise even spacing. */
  date?: Date;
}

export interface ChartSeries {
  key: string;
  label: string;
  colour?: string;
  points: ChartSeriesPoint[];
}

export interface ChartSegment {
  key: string;
  label: string;
  value: number;
  colour?: string;
}

export interface ChartFrameProps {
  title?: string;
  ariaLabel: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export interface BarChartProps {
  ariaLabel: string;
  points: ChartPoint[];
  title?: string;
  height?: number;
  horizontal?: boolean;
  valueFormatter?: (value: number) => string;
  colour?: string;
  emptyLabel?: string;
}

export interface StackedBarProps {
  ariaLabel: string;
  title?: string;
  segments: ChartSegment[];
  height?: number;
  valueFormatter?: (value: number) => string;
  emptyLabel?: string;
}

export interface LineChartProps {
  ariaLabel: string;
  series: ChartSeries[];
  title?: string;
  height?: number;
  area?: boolean;
  valueFormatter?: (value: number) => string;
  emptyLabel?: string;
}

export interface DonutChartProps {
  ariaLabel: string;
  title?: string;
  segments: ChartSegment[];
  size?: number;
  centreLabel?: string;
  valueFormatter?: (value: number) => string;
  emptyLabel?: string;
}

export interface SparklineProps {
  ariaLabel: string;
  values: number[];
  width?: number;
  height?: number;
  colour?: string;
}

export type ChartKind = "bar" | "hbar" | "donut" | "stacked";

export interface ChartCardProps {
  title: string;
  info?: string;
  points: ChartPoint[];
  charts?: ChartKind[];
  defaultChart?: ChartKind;
  valueFormatter?: (value: number) => string;
  centreLabel?: string;
  emptyLabel?: string;
  footer?: React.ReactNode;
  /** Points shown before the card offers "open larger". */
  previewCount?: number;
  height?: number;
}

export interface LegendItem {
  key: string;
  label: string;
  colour: string;
  value?: string;
}

export interface LegendProps {
  items: LegendItem[];
}
