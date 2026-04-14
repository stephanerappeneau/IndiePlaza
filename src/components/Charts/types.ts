import {
  BubbleDataPoint,
  ChartData,
  ChartOptions,
  ChartTypeRegistry,
  ScatterDataPoint,
} from 'chart.js';

type AllChartTypes = keyof ChartTypeRegistry;
type GenericChartData = ChartData<
  AllChartTypes,
  number[] | BubbleDataPoint[] | ScatterDataPoint[],
  unknown
>;
interface ChartProps {
  data: GenericChartData;
  options?: ChartOptions<AllChartTypes>;
  type: AllChartTypes;
}
