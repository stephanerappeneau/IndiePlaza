import React, { FC, useEffect, useState } from 'react';
import { Chart, ChartData, ChartOptions, TimeScale } from 'chart.js';
import ChartComponent from '@/components/Charts/ChartComponent';
import { generateWishlistChartData } from '@/utils/simulatorCalculations';
import { fetchSimulatorParams } from '@/utils/simulator_api';

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
  steepnessOfDecline: number;
  weeksOfInflection: number;
  playerReviews: number;
  viralityMultiplierDueToDiscounting: number;
  grossWishlistIncreasePerWeek: number;
  steamWishlistsAtLaunch: number;
  launchDate: Date;
}
interface WishlistChartProps {
  formValues: FormValues;
}

const NetWishlistVaraitionChart: FC<WishlistChartProps> = ({ formValues }) => {
  const [totalWeeks, setTotalWeeks] = useState(156);
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

  const wishlistChartData = generateWishlistChartData(
    formValues,
    totalWeeks,
    conversionRateTable,
  );

  const formatNumber = (value: number) => value.toLocaleString('en-US');

  const startDate = moment(formValues.launchDate).startOf('day');
  const labels = wishlistChartData.wishlistData.map((_, i) =>
    startDate.clone().add(i, 'weeks').format('MMM YY'),
  );

  const lineChartData: ChartData<'line', number[], string> = {
    labels,
    datasets: [
      {
        label: 'Net wishlist variation',
        data: wishlistChartData.newAdditionsData,
        borderColor: '#F6AA1C',
        backgroundColor: '#F6AA1C',
        tension: 0.1,
        borderWidth: 1,
        pointRadius: 2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Number of Whislists',
        },
        ticks: {
          callback: (value: any) => formatNumber(value), // Format Y axis ticks
        },
      },
      x: {
        title: {
          display: true,
          text: 'Weeks',
        },
      },
    },
    plugins: {
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
  };

  return (
    <div>
      <div className="h-[400px] w-full">
        <ChartComponent
          key={totalWeeks}
          type="line"
          data={lineChartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default NetWishlistVaraitionChart;
