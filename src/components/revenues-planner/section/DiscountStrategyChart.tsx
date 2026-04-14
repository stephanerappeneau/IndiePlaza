import React, { FC, useEffect, useState } from 'react';
import { Chart, ChartData, ChartOptions, TimeScale } from 'chart.js';
import ChartComponent from '@/components/Charts/ChartComponent';
import { calculateDiscountData } from '@/utils/simulatorCalculations';

import 'chartjs-adapter-moment';
import moment from 'moment';

Chart.register(TimeScale);

interface FormValues {
  gamesFullPrice: number;
  maxDiscount: number;
  numberOfWeeksWithoutDiscount: number;
  durationOfDiscountInWeeks: number;
  minDiscount: number;
  yearForMaxDiscount: number;
  launchDate: Date;
}

interface DiscountStrategyChartProps {
  formValues: FormValues;
}

const DiscountStrategyChart: FC<DiscountStrategyChartProps> = ({
  formValues,
}) => {
  const [chartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('chartjs-plugin-zoom').then((module) => {
        Chart.register(module.default);
        setChartLoaded(true);
      });
    }
  }, []);

  const monthlyRevenueData = calculateDiscountData(formValues);
  const startDate = moment(formValues.launchDate).startOf('day');
  const labels = monthlyRevenueData.map((_, i) =>
    startDate.clone().add(i, 'weeks').format('MMM YY'),
  );

  const lineChartData: ChartData<'line', number[], string> = {
    labels,
    datasets: [
      {
        label: 'Game Price',
        data: monthlyRevenueData.map((data) =>
          Math.round(parseFloat(Number(data.pricePercentage).toFixed(2))),
        ),
        borderColor: '#BC3908',
        backgroundColor: '#BC3908',
        tension: 0,
        pointRadius: 2,
        pointHoverRadius: 2,
        pointBorderWidth: 1,
        pointBackgroundColor: '#BC3908',
        pointBorderColor: '#BC3908',
        stepped: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `%${value}`,
        },
        title: {
          display: true,
          text: 'Price %', // Name of y-axis
        },
      },
      x: {
        beginAtZero: true,
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkipPadding: 50,
        },
        title: {
          display: true,
          text: 'Weeks', // Name of x-axis
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'rgba(0, 0, 0, 0.5)',
        },
      },
      tooltip: {
        intersect: false,
        callbacks: {
          title: (context) => {
            const date = startDate.clone().add(context[0].dataIndex, 'weeks');
            return `Date: ${date.format('DD MMMM YYYY')}`;
          },
          label: (context) => {
            return `Price Percentage: %${context.parsed.y}`;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: false,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
    interaction: {
      mode: 'index',
    },
  };

  return (
    <div>
      <div className="h-[400px] w-full">
        <ChartComponent type="line" data={lineChartData} options={options} />
      </div>
    </div>
  );
};

export default DiscountStrategyChart;
