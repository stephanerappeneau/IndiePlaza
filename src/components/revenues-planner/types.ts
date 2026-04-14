export type RevenueData = {
  totalNetRevenue: number[];
  studioEarnings: number[];
  publisherEarnings: number[];
  studioWeeklyRevenues: number[];
  publisherWeeklyRevenues: number[];
  ConveredUnitsPerWeekData: number[];
  CumulativeUnitsSold: number[];
  [key: string]: number[];
};
