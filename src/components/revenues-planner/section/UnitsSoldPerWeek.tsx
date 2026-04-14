import React, { FC, useEffect, useState } from 'react';
import { Chart, ChartData, ChartOptions, TimeScale } from 'chart.js';
import 'chartjs-adapter-moment';
import moment from 'moment';
import ChartComponent from '@/components/Charts/ChartComponent';
import { FormValues } from './types';
import { calculateRevenues } from '@/utils/simulatorCalculations';
import { fetchSimulatorParams } from '@/utils/simulator_api';

Chart.register(TimeScale);
interface UnitsSoldPerWeekProps {
  formValues: FormValues;
}

const UnitsSoldPerWeek: FC<UnitsSoldPerWeekProps> = ({ formValues }) => {
  const [weeksNumber, setWeeksNumber] = useState(156);
  const [chartLoaded, setChartLoaded] = useState(false);
  const [conversionRateTable, setConversionRateTable] = useState<any>({});
  useEffect(() => {
    const fetchParams = async () => {
      try {
        const params = await fetchSimulatorParams();
        const { conversionRateTable } = params;
        setConversionRateTable(conversionRateTable);
      } catch (error) {
        console.error('Failed to fetch parameters:', error);
      }
    };
    fetchParams();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('chartjs-plugin-zoom').then((module) => {
        Chart.register(module.default);
        setChartLoaded(true);
      });
    }
  }, []);

  const UnitsSold = calculateRevenues(
    formValues,
    weeksNumber,
    conversionRateTable,
  )?.ConveredUnitsPerWeekData;
  const ConveredUnitsPerWeekData: number[] = UnitsSold;

  const startDate = moment(formValues.launchDate).startOf('day');
  const labels = UnitsSold.map((_, i) =>
    startDate.clone().add(i, 'weeks').format('MMM YY'),
  );

  const lineChartData: ChartData<'line', number[], string> = {
    labels: labels,
    datasets: [
      {
        label: 'Units Sold during this week',
        data: ConveredUnitsPerWeekData,
        fill: false,
        borderWidth: 3,
        borderColor: '#BC3908',
        backgroundColor: '#BC3908',
        tension: 0.1,
        pointRadius: 1,
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
          callback: (value: any) => `${value.toLocaleString('en-US')}`,
        },
        title: {
          display: true,
          text: 'Cumulative unit sold',
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
      tooltip: {
        intersect: false,
        callbacks: {
          title: (context) => {
            const date = startDate.clone().add(context[0].dataIndex, 'weeks');
            return `Date: ${date.format('DD MMMM YYYY')}`;
          },
        },
      },
    },
    interaction: {
      mode: 'index',
    },
  };

  return <ChartComponent type="line" data={lineChartData} options={options} />;
};

export default UnitsSoldPerWeek;
