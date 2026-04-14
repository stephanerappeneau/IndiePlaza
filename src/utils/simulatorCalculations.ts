import { FormValues } from '@/components/revenues-planner/section/types';

export const calculateSteepnessFromPercentage = (
  percentage: number,
): number => {
  const modifiedPercentage = 1 + (percentage / 100) * 0.9;
  const ratio = modifiedPercentage / 2 / (1 - modifiedPercentage / 2);
  if (ratio <= 0) {
    return 0;
  }
  const logResult = Math.log10(ratio);
  if (isNaN(logResult)) {
    return 0;
  }
  return -(logResult ** 5);
};

/**
 * Generates data for the buzz curve over 200 weeks.
 *
 * @param steepnessOfDecline The steepness of the decline in the buzz curve.
 * @param weeksOfInflection The week number at which the inflection point occurs.
 * @param playerReviews The player reviews impact as a whole number (e.g., 90 for 90%).
 * @returns Array<number> The generated buzz curve data adjusted by player reviews impact.
 */
export const generateBuzzCurveData = (
  steepnessOfDecline: number,
  weeksOfInflection: number,
  playerReviews: number,
): Array<number> => {
  if (
    steepnessOfDecline === undefined ||
    weeksOfInflection === undefined ||
    playerReviews === undefined
  ) {
    throw new Error('All input values must be provided');
  }

  const calculatedSteepnessOfDecline =
    calculateSteepnessFromPercentage(steepnessOfDecline);
  const weeks = 156;
  const data: Array<number> = [];
  const reviewImpact = playerReviews / 100;
  for (let week = 1; week <= weeks; week++) {
    const exponent = -calculatedSteepnessOfDecline * (week - weeksOfInflection);
    const buzz = 1 - 1 / (1 + Math.exp(exponent));
    const adjustedBuzz = buzz * reviewImpact;
    data.push(adjustedBuzz);
  }
  return data;
};

/**
 * Generates data for the discount cuvre over 200 weeks.
 *
 * @param gamesFullPrice The original price of the game.
 * @param maxDiscount The maximum discount percentage that can be applied.
 * @param numberOfWeeksWithoutDiscount The number of weeks at the beginning without any discount applied.
 * @param minDiscount The initial discount percentage applied to the game price.
 * @param yearForMaxDiscount The year when the maximum discount is reached.
 * @param durationOfDiscountInWeeks The duration, in weeks, for which the discount is applied before it changes.
 * @returns Array<number> The generated discount cuvre data and slope .
 */
interface DiscountStrategyParams {
  gamesFullPrice: number;
  numberOfWeeksWithoutDiscount: number;
  durationOfDiscountInWeeks: number;
  yearForMaxDiscount: number;
  minDiscount: number;
  maxDiscount: number;
}

export function calculateDiscountData({
  gamesFullPrice,
  numberOfWeeksWithoutDiscount,
  durationOfDiscountInWeeks,
  yearForMaxDiscount,
  minDiscount,
  maxDiscount,
}: DiscountStrategyParams & { gamesFullPrice: number }): {
  week: number;
  slope: number;
  pricePercentage: number;
  e: number; // discountedPrice
  isDiscounted: boolean;
}[] {
  if (
    gamesFullPrice === undefined ||
    numberOfWeeksWithoutDiscount === undefined ||
    durationOfDiscountInWeeks === undefined ||
    yearForMaxDiscount === undefined ||
    minDiscount === undefined ||
    maxDiscount === undefined
  ) {
    throw new Error('All input values must be provided');
  }

  const weeks = 156; // 3 years timeline
  const discountCycleLength =
    numberOfWeeksWithoutDiscount + durationOfDiscountInWeeks;
  const weeksToReachMaxDiscount = yearForMaxDiscount * 52;
  const results = [];

  for (let week = 1; week <= weeks; week++) {
    const cycleProgress = week % discountCycleLength;
    const isDiscounted =
      cycleProgress >= numberOfWeeksWithoutDiscount &&
      cycleProgress < discountCycleLength;
    const slope = Math.min(
      (week * (maxDiscount - minDiscount)) / weeksToReachMaxDiscount +
        minDiscount,
      maxDiscount,
    );
    const discountPercentage = isDiscounted ? slope : 0;
    const discountedPrice = gamesFullPrice * (1 - discountPercentage / 100);
    const pricePercentage = (1 - discountPercentage / 100) * 100;

    results.push({
      week,
      slope,
      pricePercentage,
      e: discountedPrice,
      isDiscounted,
    });
  }

  return results;
}

/**
 * Generates data for the discount curve over 200 weeks.
 *
 * @param viralityMultiplierDueToDiscounting The rate at which the game spreads among players due to discounting.
 * @param grossWishlistIncreasePerWeek The number of new wishlists per week before any adjustments.
 * @param steamWishlistsAtLaunch The number of wishlists at the game's launch.
 * @returns An object containing wishlist and new additions data over the specified weeks.
 */

export function generateWishlistChartData(
  formValues: any,
  totalWeeks: any,
  conversionRateTable: { [key: number]: number },
) {
  if (formValues === undefined || totalWeeks === undefined) {
    throw new Error('An input is missing.');
  }

  const buzzCurveData = generateBuzzCurveData(
    formValues.steepnessOfDecline,
    formValues.weeksOfInflection,
    formValues.playerReviews,
  );

  const discountStrategyData = calculateDiscountData(formValues);

  const {
    viralityMultiplierDueToDiscounting,
    grossWishlistIncreasePerWeek,
    steamWishlistsAtLaunch,
    firstWeekWishlistConversionRatio,
  } = formValues;

  let wishlistData = [steamWishlistsAtLaunch];
  let newAdditionsData = [];
  let convertedUnitsData = [];

  // Conversion rate table mapping price discounts to conversion rates.

  for (let week = 1; week <= totalWeeks; week++) {
    let discount = discountStrategyData[week - 1]?.isDiscounted; // Adjusting index to be 0-based
    let priceDiscount = 100 - discountStrategyData[week - 1]?.pricePercentage; // Adjusting index
    priceDiscount = Math.floor(priceDiscount / 10) * 10;

    let conversionRate = conversionRateTable[priceDiscount];

    // Calculate new additions to wishlist based on various factors.
    let newAdditions = Math.round(
      grossWishlistIncreasePerWeek *
        buzzCurveData[week - 1] *
        (1 +
          conversionRate * (discount ? viralityMultiplierDueToDiscounting : 0)),
    );

    //  first week new additions calculation has a different conversionRate so we are passing it independently
    if (week === 1) {
      newAdditions = Math.round(
        grossWishlistIncreasePerWeek *
          buzzCurveData[week - 1] *
          (1 +
            (firstWeekWishlistConversionRatio / 100) *
              (discount ? viralityMultiplierDueToDiscounting : 0)),
      );
    }

    let previousWishlist = wishlistData[wishlistData.length - 1];
    let convertedUnits =
      previousWishlist *
      (week === 1 ? firstWeekWishlistConversionRatio / 100 : conversionRate);

    let outstandingWishlist = previousWishlist + newAdditions - convertedUnits;
    let floorOutstandingWishlist = Math.max(outstandingWishlist, 0);

    wishlistData.push(Math.trunc(floorOutstandingWishlist));
    newAdditionsData.push(newAdditions);
    convertedUnitsData.push(Math.trunc(convertedUnits));
  }

  // Remove the initial launch state entry from wishlistData to align its length with 156 weeks
  wishlistData.shift(); // This adjusts the array to start from week 1 to 156

  return { wishlistData, newAdditionsData, convertedUnitsData };
}

/**
 * Generates data for the discount cuvre over 200 weeks.
 *
 * @param gamesFullPrice The original price of the game.
 * @param distributionFee  The percentage of revenue that is paid as a fee for distribution.
 * @param taxes The tax rate applicable to the game's sales revenue.
 * @param productionInvestment  The amount of money invested in the production of the game.
 * @param marketingInvestment The amount of money invested in marketing the game.
 * @param studioShareUntilRecoup The percentage of revenue the studio earns from game sales until it recoups its investment (usually production and marketing costs).
 * @param studioShareAfterRecoup  The percentage of revenue the studio earns from game sales after recouping its investment.
 * @param refundRate The percentage of customers who refund the game after purchase.
 * @param budget The percentage of customers who refund the game after purchase.
 * @returns RevenueCalculationResult Object containing calculated revenue data.
 */

export function calculateRevenues(
  formValues: FormValues,
  totalWeeks: number,
  conversionRateTable: { [key: number]: number },
) {
  const wishlistChartData = generateWishlistChartData(
    formValues,
    totalWeeks,
    conversionRateTable,
  );
  const {
    gamesFullPrice,
    distributionFee,
    taxes,
    productionInvestment,
    marketingInvestment,
    studioShareUntilRecoup,
    studioShareAfterRecoup,
    refundRate,
  } = formValues;
  const recoupableCosts = productionInvestment + marketingInvestment;
  let cumulativeNetRevenue = 0;
  let cumulativePublisherRevenues = 0;
  let cumulativeStudioRevenues = 0;
  let cumulativeUnitsSold = 0;
  const totalNetRevenue: number[] = [];
  const studioEarnings: number[] = [];
  const publisherEarnings: number[] = [];
  const studioWeeklyRevenues: number[] = [];
  const publisherWeeklyRevenues: number[] = [];
  const ConveredUnitsPerWeekData: any[] = [];
  const CumulativeUnitsSold: any[] = [];
  const GrossRevenuesPerWeek: number[] = [];
  for (let week = 1; week <= 156; week++) {
    const index = week - 1;

    const ConveredUnitsPerWeekAfterRefund =
      wishlistChartData.convertedUnitsData[index] * (1 - refundRate / 100);

    const grossRevenuePerWeek =
      ConveredUnitsPerWeekAfterRefund * gamesFullPrice;
    //calculate the net revenues
    const revenueAfterTVA = grossRevenuePerWeek * (1 / (1 + taxes / 100));
    const netRevenue = revenueAfterTVA * (1 - distributionFee / 100);
    const publisherRatio =
      cumulativePublisherRevenues > recoupableCosts
        ? 1 - studioShareAfterRecoup / 100
        : 1 - studioShareUntilRecoup / 100;
    const publisherRevenue = netRevenue * publisherRatio;
    const studioRevenue = netRevenue - publisherRevenue;
    cumulativeNetRevenue += netRevenue;
    cumulativePublisherRevenues += publisherRevenue;
    cumulativeStudioRevenues += studioRevenue;

    totalNetRevenue.push(Math.trunc(cumulativeNetRevenue));
    studioEarnings.push(Math.trunc(cumulativeStudioRevenues));
    publisherEarnings.push(Math.trunc(cumulativePublisherRevenues));
    studioWeeklyRevenues.push(Math.trunc(studioRevenue));
    publisherWeeklyRevenues.push(Math.trunc(publisherRevenue));
    ConveredUnitsPerWeekData.push(Math.trunc(ConveredUnitsPerWeekAfterRefund));
    cumulativeUnitsSold += ConveredUnitsPerWeekAfterRefund;
    CumulativeUnitsSold.push(Math.trunc(cumulativeUnitsSold));
    GrossRevenuesPerWeek.push(grossRevenuePerWeek);
  }

  return {
    totalNetRevenue,
    studioEarnings,
    publisherEarnings,
    studioWeeklyRevenues,
    publisherWeeklyRevenues,
    ConveredUnitsPerWeekData,
    CumulativeUnitsSold,
  };
}

export const extractRevenueRatios = (
  formValues: FormValues,
  totalWeeks: number,
  conversionRateTable: { [key: number]: number },
) => {
  const revenueData = calculateRevenues(
    formValues,
    totalWeeks,
    conversionRateTable,
  );
  const { totalNetRevenue } = revenueData;

  const firstWeekRevenue = totalNetRevenue[0];
  const firstMonthRevenue = totalNetRevenue[3];
  const firstYearRevenue = totalNetRevenue[51];
  const secondYearRevenue = totalNetRevenue[103];
  const thirdYearRevenue = totalNetRevenue[totalNetRevenue.length - 1];

  const ratioMonthToWeek1 = firstMonthRevenue / firstWeekRevenue;
  const ratioYear1ToWeek1 = firstYearRevenue / firstWeekRevenue;
  const ratioYear2ToWeek1 = secondYearRevenue / firstWeekRevenue;
  const ratioYear3ToWeek1 = thirdYearRevenue / firstWeekRevenue;

  return {
    firstWeekRevenue,
    firstMonthRevenue,
    firstYearRevenue,
    secondYearRevenue,
    thirdYearRevenue,
    ratioMonthToWeek1,
    ratioYear1ToWeek1,
    ratioYear2ToWeek1,
    ratioYear3ToWeek1,
  };
};
