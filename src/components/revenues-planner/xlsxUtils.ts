import { RevenueData } from './types';

export const generateCSV = (
  data: RevenueData,
  startDate: Date,
): (string | number)[][] => {
  const fields = [
    'totalNetRevenue',
    'studioEarnings',
    'publisherEarnings',
    'studioWeeklyRevenues',
    'publisherWeeklyRevenues',
    'ConveredUnitsPerWeekData',
    'CumulativeUnitsSold',
  ];

  const missingFields = fields.filter(
    (field) => !data[field] || data[field].length === 0,
  );
  if (missingFields.length > 0) {
    throw new Error(
      `Data is missing for the following fields: ${missingFields.join(', ')}`,
    );
  }

  const headers = [
    'Week',
    'Total Net Revenue (EUR)',
    'Studio Cumul Earnings (EUR)',
    'Publisher Cumul Earnings (EUR)',
    'Studio Weekly Earnings (EUR)',
    'Publisher Weekly Earnings (EUR)',
    'Converted Units Per Week',
    'Cumulative Units Sold',
  ];

  const rows: (string | number)[][] = [headers];

  data.totalNetRevenue.forEach((_: number, i: number) => {
    const weekDate = new Date(startDate.getTime());
    weekDate.setDate(startDate.getDate() + i * 7);

    // Format the date to YYYY/MM/DD
    const weekLabel = `${weekDate.getFullYear()}/${(weekDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${weekDate.getDate().toString().padStart(2, '0')}`;

    const row: (string | number)[] = [
      weekLabel,
      data.totalNetRevenue[i],
      data.studioEarnings[i],
      data.publisherEarnings[i],
      data.studioWeeklyRevenues[i],
      data.publisherWeeklyRevenues[i],
      data.ConveredUnitsPerWeekData[i],
      data.CumulativeUnitsSold[i],
    ];
    rows.push(row);
  });

  return rows;
};

export const generateMonthlyCSV = (
  data: RevenueData,
  startDate: Date,
): (string | number)[][] => {
  const fields = [
    'totalNetRevenue',
    'studioEarnings',
    'publisherEarnings',
    'studioWeeklyRevenues',
    'publisherWeeklyRevenues',
    'ConveredUnitsPerWeekData',
    'CumulativeUnitsSold',
  ];

  const missingFields = fields.filter(
    (field) => !data[field] || data[field].length === 0,
  );
  if (missingFields.length > 0) {
    throw new Error(
      `Data is missing for the following fields: ${missingFields.join(', ')}`,
    );
  }

  const headers = [
    'Month',
    'Total Net Revenue (EUR)',
    'Studio Cumul Earnings (EUR)',
    'Publisher Cumul Earnings (EUR)',
    'Studio Monthly Earnings (EUR)',
    'Publisher Monthly Earnings (EUR)',
    'Converted Units Per Month',
    'Cumulative Units Sold',
  ];

  const rows: (string | number)[][] = [headers];

  data.totalNetRevenue.forEach((_: number, i: number) => {
    const monthDate = new Date(startDate.getTime());
    monthDate.setMonth(startDate.getMonth() + i);

    const monthLabel = `${monthDate.getFullYear()}/${(monthDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

    const row: (string | number)[] = [
      monthLabel,
      data.totalNetRevenue[i],
      data.studioEarnings[i],
      data.publisherEarnings[i],
      data.studioWeeklyRevenues[i],
      data.publisherWeeklyRevenues[i],
      data.ConveredUnitsPerWeekData[i],
      data.CumulativeUnitsSold[i],
    ];
    rows.push(row);
  });

  return rows;
};

export const aggregateMonthlyData = (
  weeklyData: RevenueData,
  startDate: Date,
): RevenueData => {
  const monthlyData: RevenueData = {
    totalNetRevenue: [],
    studioEarnings: [],
    publisherEarnings: [],
    studioWeeklyRevenues: [],
    publisherWeeklyRevenues: [],
    ConveredUnitsPerWeekData: [],
    CumulativeUnitsSold: [],
  };

  let currentMonth = startDate.getMonth();
  let monthTotalNetRevenue = 0;
  let monthStudioEarnings = 0;
  let monthPublisherEarnings = 0;
  let monthStudioWeeklyRevenues = 0;
  let monthPublisherWeeklyRevenues = 0;
  let monthConvertedUnits = 0;
  let monthCumulativeUnits = 0;
  let weeksInMonth = 0;

  weeklyData.totalNetRevenue.forEach((_, i) => {
    const weekDate = new Date(startDate.getTime());
    weekDate.setDate(startDate.getDate() + i * 7);
    const month = weekDate.getMonth();

    if (month !== currentMonth && weeksInMonth > 0) {
      monthlyData.totalNetRevenue.push(monthTotalNetRevenue);
      monthlyData.studioEarnings.push(monthStudioEarnings);
      monthlyData.publisherEarnings.push(monthPublisherEarnings);
      monthlyData.studioWeeklyRevenues.push(monthStudioWeeklyRevenues);
      monthlyData.publisherWeeklyRevenues.push(monthPublisherWeeklyRevenues);
      monthlyData.ConveredUnitsPerWeekData.push(
        monthConvertedUnits / weeksInMonth,
      );
      monthlyData.CumulativeUnitsSold.push(monthCumulativeUnits);

      currentMonth = month;
      monthTotalNetRevenue = 0;
      monthStudioEarnings = 0;
      monthPublisherEarnings = 0;
      monthStudioWeeklyRevenues = 0;
      monthPublisherWeeklyRevenues = 0;
      monthConvertedUnits = 0;
      monthCumulativeUnits = 0;
      weeksInMonth = 0;
    }

    monthTotalNetRevenue += weeklyData.totalNetRevenue[i];
    monthStudioEarnings += weeklyData.studioEarnings[i];
    monthPublisherEarnings += weeklyData.publisherEarnings[i];
    monthStudioWeeklyRevenues += weeklyData.studioWeeklyRevenues[i];
    monthPublisherWeeklyRevenues += weeklyData.publisherWeeklyRevenues[i];
    monthConvertedUnits += weeklyData.ConveredUnitsPerWeekData[i] ?? 0;
    monthCumulativeUnits = weeklyData.CumulativeUnitsSold[i];

    weeksInMonth++;
  });

  if (weeksInMonth > 0) {
    monthlyData.totalNetRevenue.push(monthTotalNetRevenue);
    monthlyData.studioEarnings.push(monthStudioEarnings);
    monthlyData.publisherEarnings.push(monthPublisherEarnings);
    monthlyData.studioWeeklyRevenues.push(monthStudioWeeklyRevenues);
    monthlyData.publisherWeeklyRevenues.push(monthPublisherWeeklyRevenues);
    monthlyData.ConveredUnitsPerWeekData.push(
      monthConvertedUnits / weeksInMonth,
    );
    monthlyData.CumulativeUnitsSold.push(monthCumulativeUnits);
  }

  return monthlyData;
};
