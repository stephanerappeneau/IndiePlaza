import React, { FC, useEffect, useState } from 'react';
import { ChartData, ChartOptions, Chart, TimeScale } from 'chart.js';
import ChartComponent from '@/components/Charts/ChartComponent';
import { generateBuzzCurveData } from '@/utils/simulatorCalculations';

import 'chartjs-adapter-moment';
import moment from 'moment';

Chart.register(TimeScale);

interface FormValues {
  steepnessOfDecline: number;
  weeksOfInflection: number;
  playerReviews: number;
  launchDate: Date;
}

interface BuzzCurveChartProps {
  formValues: FormValues;
}

const BuzzCurveChart: FC<BuzzCurveChartProps> = ({ formValues }) => {
  const [chartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('chartjs-plugin-zoom').then((module) => {
        Chart.register(module.default);
        setChartLoaded(true);
      });
    }
  }, []);

  const { steepnessOfDecline, weeksOfInflection, playerReviews } = formValues;
  const buzzCurveData = generateBuzzCurveData(
    steepnessOfDecline,
    weeksOfInflection,
    playerReviews,
  );

  const startDate = moment(formValues.launchDate).startOf('day');
  const labels = Array.from({ length: buzzCurveData.length }, (_, i) =>
    startDate.clone().add(i, 'weeks').format('MMM YY'),
  );

  const lineChartData: ChartData<'line', number[], string> = {
    labels,
    datasets: [
      {
        label: 'Buzz Curve',
        data: buzzCurveData,
        fill: false,
        borderColor: '#BC3908',
        backgroundColor: '#BC3908',
        tension: 0.1,
        borderWidth: 1,
        pointRadius: 2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          callback: (value) => `${((value as number) * 100).toFixed(0)}%`,
        },
        title: {
          display: true,
          text: 'Buzz Curve Impacted By User Review',
        },
        min: 0,
        max: 1,
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
          text: 'Weeks',
        },
      },
    },
    plugins: {
      tooltip: {
        intersect: false,
        callbacks: {
          title: (context) => {
            const date = startDate.clone().add(context[0].dataIndex, 'weeks');
            return `Date: ${date.format('DD MMMM YYYY')}`;
          },
          label: (context) =>
            `Buzz Curve: ${Math.round(context.parsed.y * 100)}%`,
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

  return <ChartComponent type="line" data={lineChartData} options={options} />;
};

export default BuzzCurveChart;
