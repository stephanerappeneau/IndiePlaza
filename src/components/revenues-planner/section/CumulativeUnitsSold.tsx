import React, { FC, useEffect, useState } from 'react';
import { Chart, ChartData, ChartOptions, TimeScale } from 'chart.js';
import annotationPlugin, {
  AnnotationPluginOptions,
} from 'chartjs-plugin-annotation';
import ChartComponent from '@/components/Charts/ChartComponent';
import { FormValues } from './types';
import { calculateRevenues } from '@/utils/simulatorCalculations';
import { fetchSimulatorParams } from '@/utils/simulator_api';

import 'chartjs-adapter-moment';
import moment from 'moment';
Chart.register(TimeScale);

interface CumulativeUnitsSoldProps {
  formValues: FormValues;
}

Chart.register(annotationPlugin);

const CumulativeUnitsSold: FC<CumulativeUnitsSoldProps> = ({ formValues }) => {
  const [weeksNumber, setWeeksNumber] = useState(156);
  const [chartLoaded, setChartLoaded] = useState(false);
  const [conversionRateTable, setConversionRateTable] = useState<any>({});
  const [RecoupVisible, setRecoupVisible] = useState(true);
  const [titleFontSize, setTitleFontSize] = useState<number>(12);
  const [titleFontColor, setTitleFontColor] = useState<string>('#FFFFFF');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Promise.all([
        import('chartjs-plugin-zoom'),
        import('chartjs-plugin-annotation'),
      ]).then(([zoomModule, annotationModule]) => {
        Chart.register(zoomModule.default, annotationModule.default);
        Chart.register(annotationModule.default);

        setChartLoaded(true);
      });
    }
  }, []);

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

  const target =
    formValues.productionInvestment + formValues.marketingInvestment;
  const data = calculateRevenues(formValues, weeksNumber, conversionRateTable)
    ?.publisherEarnings;
  const weekIndex = data?.findIndex((value) => value >= target);

  const publisherEarningsData: number[] = calculateRevenues(
    formValues,
    weeksNumber,
    conversionRateTable,
  )?.publisherEarnings;
  const StudioData = calculateRevenues(
    formValues,
    weeksNumber,
    conversionRateTable,
  )?.studioEarnings;
  const StudioWeekIndex = StudioData?.findIndex(
    (value) => value >= formValues.budget,
  );

  const CumulativeUnitsSold = calculateRevenues(
    formValues,
    weeksNumber,
    conversionRateTable,
  )?.CumulativeUnitsSold;
  const CumulativeUnitsSoldData: any = CumulativeUnitsSold;

  const startDate = moment(formValues.launchDate).startOf('day');
  const labels = CumulativeUnitsSold.map((_, i) =>
    startDate.clone().add(i, 'weeks').format('MMM YY'),
  );

  const lineChartData: ChartData<'line', number[], string> = {
    labels,
    datasets: [
      {
        label: 'Cumulative units sold',
        data: CumulativeUnitsSoldData,
        fill: false,
        borderWidth: 3,
        borderColor: '#BC3908',
        backgroundColor: '#BC3908',
        tension: 0.1,
        pointRadius: 1,
      },
    ],
  };

  const options: ChartOptions<'line'> & {
    plugins: { annotation: AnnotationPluginOptions };
  } = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `${value.toLocaleString('en-US')}`,
        },
        title: {
          display: true,
          text: 'Cumulative units sold',
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
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex!;
          const ci = legend.chart;

          if (ci.isDatasetVisible(index)) {
            ci.hide(index);
            legendItem.hidden = true;

            setRecoupVisible(false);
          } else {
            ci.show(index);
            legendItem.hidden = false;
            setRecoupVisible(true);
          }
        },
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
      annotation: {
        annotations: {
          targetLine: {
            display:
              RecoupVisible &&
              publisherEarningsData.some((value) => value !== 0),
            type: 'point',
            xValue: weekIndex,
            yValue: CumulativeUnitsSold[weekIndex],
            borderColor: '#BC3908',
            z: 0,
            radius: 8,
            borderWidth: 2,
            backgroundColor: 'transparent',
            pointStyle: 'rectRounded',
          },
          publisherRecoupPoint: {
            display:
              RecoupVisible &&
              publisherEarningsData.some((value) => value !== 0),
            type: 'point',
            xValue: weekIndex,
            yValue: CumulativeUnitsSold[weekIndex],
            borderColor: '#BC3908',
            borderWidth: 2,
            radius: 4,
            backgroundColor: '#BC3908',
          },
          StudioTargetLine: {
            display:
              RecoupVisible && CumulativeUnitsSold.some((value) => value !== 0),
            type: 'point',
            xValue: StudioWeekIndex,
            yValue: CumulativeUnitsSold[StudioWeekIndex],
            borderColor: '#F6AA1C',
            borderWidth: 2,
            radius: 8,
            backgroundColor: 'transparent',
            pointStyle: 'rectRounded',
          },
          StudioRecoupPoint: {
            display:
              RecoupVisible && CumulativeUnitsSold.some((value) => value !== 0),
            type: 'point',
            xValue: StudioWeekIndex,
            yValue: CumulativeUnitsSold[StudioWeekIndex],
            borderColor: '#F6AA1C',
            borderWidth: 2,
            radius: 4,
            backgroundColor: '#F6AA1C',
          },
        },
      },
      tooltip: {
        titleFont: {
          size: titleFontSize,
          weight: 'bold',
        },
        titleColor: titleFontColor,
        intersect: false,
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex;
            const date = startDate.clone().add(index, 'weeks');
            let additionalText = '';

            if (
              index === weekIndex &&
              publisherEarningsData.some((value) => value !== 0)
            ) {
              additionalText = 'Publisher recoup ';
              setTitleFontColor('#BC3908');
            } else if (index === StudioWeekIndex) {
              additionalText = 'Studio recoup';
              setTitleFontColor('#F6AA1C');
            }
            if (additionalText) {
              setTitleFontSize(20);
              return `Date: ${date.format(
                'DD MMMM YYYY',
              )} \n(${additionalText})`;
            } else {
              setTitleFontSize(12);
              setTitleFontColor('#FFFFFF');
              return `Date: ${date.format('DD MMMM YYYY')}`;
            }
          },
        },
      },
    },
    interaction: {
      mode: 'index',
    },
  };

  return (
    <>
      <ChartComponent type="line" data={lineChartData} options={options} />
    </>
  );
};

export default CumulativeUnitsSold;
