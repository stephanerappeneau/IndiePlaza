interface FormValues {
  budget: number;
  productionInvestment: number;
  marketingInvestment: number;
  studioShareUntilRecoup: number;
  studioShareAfterRecoup: number;
  gamesFullPrice: number;
  distributionFee: number;
  taxes: number;
  firstWeekWishlistConversionRatio: number;
  steamWishlistsAtLaunch: number;
  refundRate: number;
  playerReviews: {
    value: number;
  };
  buzzCurvePresets: {
    value: string;
    label: string;
    steepnessOfDecline: number;
    weeksOfInflection: number;
  }[];
  discountStrategyPresets: {
    value: string;
    label: string;
    numberOfWeeksWithoutDiscount: number;
    durationOfDiscountInWeeks: number;
    minDiscount: number;
    maxDiscount: number;
    yearForMaxDiscount: number;
  }[];
  wishlistPresets: {
    value: string;
    label: string;
    grossWishlistIncreasePerWeek: number;
    viralityMultiplierDueToDiscounting: number;
  }[];
  wishlistDecreasePresets: string;
  launchDate: string;
}

export type { FormValues };
