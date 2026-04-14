import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import 'chartjs-adapter-moment';
import annotationPlugin, {
  AnnotationPluginOptions,
} from 'chartjs-plugin-annotation';
import { Chart, ChartData, ChartOptions, TimeScale } from 'chart.js';
import ChartComponent from '@/components/Charts/ChartComponent';
import { FormValues } from './types';
import { calculateRevenues } from '@/utils/simulatorCalculations';
import { fetchSimulatorParams } from '@/utils/simulator_api';

Chart.register(TimeScale);
interface CumulativeNetEarningsProps {
  formValues: FormValues;
}

Chart.register(annotationPlugin);

const CumulativeNetEarnings: FC<CumulativeNetEarningsProps> = ({
  formValues,
}) => {
  const [weeksNumber, setWeeksNumber] = useState(156);
  const [chartLoaded, setChartLoaded] = useState(false);
  const [conversionRateTable, setConversionRateTable] = useState<any>({});
  const [publisherRecoupVisible, setPublisherRecoupVisible] = useState(true);
  const [StudioRecoupVisible, setStudioRecoupVisible] = useState(true);
  const [titleFontSize, setTitleFontSize] = useState<number>(12);
  const [titleFontColor, setTitleFontColor] = useState<string>('#FFFFFF');

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

  const StudioRevenues = calculateRevenues(
    formValues,
    weeksNumber,
    conversionRateTable,
  )?.studioEarnings;
  const studioEarningsData: number[] = StudioRevenues;

  const publisherEarningsData: number[] = calculateRevenues(
    formValues,
    weeksNumber,
    conversionRateTable,
  )?.publisherEarnings;

  const targetEarnings =
    formValues.marketingInvestment + formValues.productionInvestment;
  const StudiotargetWeek = formValues.budget;
  const targetWeekIndex = publisherEarningsData.findIndex(
    (earnings) => earnings >= targetEarnings,
  );
  const StudiotargetWeekIndex = studioEarningsData.findIndex(
    (earnings) => earnings >= StudiotargetWeek,
  );

  const startDate = moment(formValues.launchDate).startOf('day');
  const labels = StudioRevenues.map((_, i) =>
    startDate.clone().add(i, 'weeks').format('MMM YY'),
  );

  const lineChartData: ChartData<'line' | 'bar', (number | null)[], string> = {
    labels: labels,
    datasets: [
      {
        type: 'line',
        label: 'Net earnings for studio(€)',
        data: studioEarningsData,
        fill: false,
        borderWidth: 3,
        borderColor: '#F6AA1C',
        backgroundColor: '#F6AA1C',
        tension: 0.1,
        pointRadius: 1,
      },
    ],
  };

  if (publisherEarningsData.some((value) => value !== 0)) {
    lineChartData.datasets.push({
      label: 'Net earnings for publisher(€)',
      data: publisherEarningsData,
      fill: false,
      borderWidth: 3,
      borderColor: '#BC3908',
      backgroundColor: '#BC3908',
      tension: 0.1,
      pointRadius: 1,
    });
  }

  const options: ChartOptions<'line'> & {
    plugins: { annotation: AnnotationPluginOptions };
  } = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `€${value.toLocaleString('en-US')}`,
        },
        title: {
          display: true,
          text: 'Cumulative Net Earnings',
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
            if (index === 1) {
              setPublisherRecoupVisible(false);
            } else if (index === 0) {
              setStudioRecoupVisible(false);
            }
          } else {
            ci.show(index);
            legendItem.hidden = false;
            if (index === 1) {
              setPublisherRecoupVisible(true);
            } else if (index === 0) {
              setStudioRecoupVisible(true);
            }
          }
        },
        labels: {
          color: 'rgba(0, 0, 0, 0.5)',
        },
      },
      tooltip: {
        intersect: false,
        mode: 'index',
        titleFont: {
          size: titleFontSize,
          weight: 'bold',
        },
        titleColor: titleFontColor,
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex;
            const date = startDate.clone().add(index, 'weeks');
            let additionalText = '';

            if (
              index === targetWeekIndex &&
              publisherRecoupVisible &&
              publisherEarningsData.some((value) => value !== 0)
            ) {
              additionalText = 'Publisher recoup ';
              setTitleFontColor('#BC3908');
            } else if (index === StudiotargetWeekIndex && StudioRecoupVisible) {
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
          publisherTargetPoint: {
            display:
              publisherRecoupVisible &&
              publisherEarningsData.some((value) => value !== 0),
            type: 'point',
            xValue: targetWeekIndex,
            yValue: publisherEarningsData[targetWeekIndex],
            borderColor: '#BC3908',
            borderWidth: 2,
            pointStyle: 'rectRounded',
            radius: 8,
            backgroundColor: 'transparent',
          },
          publisherTarget: {
            display:
              publisherRecoupVisible &&
              publisherEarningsData.some((value) => value !== 0),
            type: 'point',
            xValue: targetWeekIndex,
            yValue: publisherEarningsData[targetWeekIndex],
            borderColor: '#BC3908',
            borderWidth: 2,
            radius: 4,
            backgroundColor: '#BC3908',
          },
          studioTargetPoint: {
            display:
              StudioRecoupVisible &&
              studioEarningsData.some((value) => value !== 0),
            type: 'point',
            xValue: StudiotargetWeekIndex,
            yValue: studioEarningsData[StudiotargetWeekIndex],
            borderColor: '#F6AA1C',
            borderWidth: 2,
            pointStyle: 'rectRounded',
            radius: 8,
            backgroundColor: 'transparent',
          },
          studioTarget: {
            display:
              StudioRecoupVisible &&
              studioEarningsData.some((value) => value !== 0),
            type: 'point',
            xValue: StudiotargetWeekIndex,
            yValue: studioEarningsData[StudiotargetWeekIndex],
            borderColor: '#F6AA1C',
            borderWidth: 2,
            radius: 4,
            backgroundColor: '#F6AA1C',
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

export default CumulativeNetEarnings;
