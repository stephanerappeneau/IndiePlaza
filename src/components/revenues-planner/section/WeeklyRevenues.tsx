import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import 'chartjs-adapter-moment';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart, ChartData, ChartOptions, TimeScale } from 'chart.js';
import ChartComponent from '@/components/Charts/ChartComponent';
import { FormValues } from './types';
import { calculateRevenues } from '@/utils/simulatorCalculations';
import { fetchSimulatorParams } from '@/utils/simulator_api';

Chart.register(TimeScale);
interface WeeklyRevenuesProps {
  formValues: FormValues;
}

Chart.register(annotationPlugin);

const WeeklyRevenues: FC<WeeklyRevenuesProps> = ({ formValues }) => {
  const [weeksNumber, setWeeksNumber] = useState(156);
  const [chartLoaded, setChartLoaded] = useState(false);
  const [conversionRateTable, setConversionRateTable] = useState<any>({});

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const params = await fetchSimulatorParams();
        setConversionRateTable(params.conversionRateTable);
      } catch (error) {
        console.error('Failed to fetch parameters:', error);
      }
    };
    fetchParams();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Promise.all([
        import('chartjs-plugin-zoom'),
        import('chartjs-plugin-annotation'),
      ]).then(([zoomModule, annotationModule]) => {
        Chart.register(zoomModule.default, annotationModule.default);
        setChartLoaded(true);
      });
    }
  }, []);

  const { publisherWeeklyRevenues, studioWeeklyRevenues } = calculateRevenues(
    formValues,
    weeksNumber,
    conversionRateTable,
  );

  const publisherRevenues: number[] = publisherWeeklyRevenues;
  const studioRevenues: number[] = studioWeeklyRevenues;

  const startDate = moment(formValues.launchDate).startOf('day');
  const labels = publisherRevenues.map((_, i) =>
    startDate.clone().add(i, 'weeks').format('MMM YY'),
  );

  const lineChartData: ChartData<'line', number[], string> = {
    labels: labels,
    datasets: [
      {
        label: 'Studio Weekly Earnings(€)',
        data: studioRevenues,
        fill: false,
        borderWidth: 3,
        borderColor: '#F6AA1C',
        backgroundColor: '#F6AA1C',
        tension: 0.1,
        pointRadius: 1,
      },
    ],
  };

  if (publisherRevenues.some((value) => value !== 0)) {
    lineChartData.datasets.push({
      label: 'Publisher Weekly Earnings(€)',
      data: publisherRevenues,
      fill: false,
      borderWidth: 3,
      borderColor: '#BC3908',
      backgroundColor: '#BC3908',
      tension: 0.1,
      pointRadius: 1,
    });
  }

  const options: ChartOptions<'line'> = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `€${value.toLocaleString('en-US')}`,
        },
        title: {
          display: true,
          text: 'Weekly Earnings',
        },
      },
      x: {
        grid: {
          display: true,
        },
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

export default WeeklyRevenues;
