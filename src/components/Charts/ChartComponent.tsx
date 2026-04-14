import { FC } from 'react';
import { Chart, ChartProps } from 'react-chartjs-2';

const ChartComponent: FC<ChartProps> = ({ data, options, type }) => {
  return <Chart type={type} data={data} options={options} />;
};

export default ChartComponent;
