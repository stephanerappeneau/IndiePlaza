import React, { useState } from 'react';
import simulatorParams from '@/data/simulator_params.json';
import { useFormikContext } from 'formik';
import TextField from '@/components/Inputs/formik/input';
import DateField from '@/components/Inputs/formik/DateField';
import SelectField from '@/components/Inputs/formik/select';
import Collapsible from '@/components/collapsible';
import { SimulatorBodyText } from '@/components/text/SimulatorText';
import BuzzCurveChart from './BuzzCurveChart';
import DiscountStrategyChart from './DiscountStrategyChart';
import WishlistChart from './WishListChart';
import NetWishlistVaraitionChart from './NetWishlistVariation';

interface GameLaunchProps {
  displaySteamWishlistsAtLaunch: boolean;
  displayRefundRate: boolean;
  displayPlayerReviews: boolean;
  displayBuzzCurveStrategy: boolean;
  displayDiscountStrategy: boolean;
  displayWishlistIncreaseDecrease: boolean;
  displayFirstWeekWishlistConversionRatio: boolean;
  formValues: any;
}

const GameLaunch: React.FC<GameLaunchProps> = ({
  formValues,
  displaySteamWishlistsAtLaunch,
  displayRefundRate,
  displayPlayerReviews,
  displayBuzzCurveStrategy,
  displayDiscountStrategy,
  displayWishlistIncreaseDecrease,
  displayFirstWeekWishlistConversionRatio,
}) => {
  const [buzzCurvePresets] = useState(simulatorParams.buzzCurvePresets);
  const [discountStrategyPresets] = useState(
    simulatorParams.discountStrategyPresets,
  );
  const [playerReviews] = useState(
    simulatorParams.playerReviews.map((r) => ({
      ...r,
      value: String(r.value),
    })),
  );
  const [wishlistPresets] = useState(simulatorParams.wishlistPresets);
  const { setFieldValue } = useFormikContext();

  const handleSelectChange = (
    fieldName: string,
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedIndex = event.target.selectedIndex;
    const presets = simulatorParams[
      fieldName as keyof typeof simulatorParams
    ] as any[];
    const selectedPreset = presets?.[selectedIndex];
    if (!selectedPreset) return;

    setFieldValue(fieldName, selectedPreset);
    switch (fieldName) {
      case 'buzzCurvePresets':
        setFieldValue('steepnessOfDecline', selectedPreset.steepnessOfDecline);
        setFieldValue('weeksOfInflection', selectedPreset.weeksOfInflection);
        break;
      case 'discountStrategyPresets':
        setFieldValue(
          'numberOfWeeksWithoutDiscount',
          selectedPreset.numberOfWeeksWithoutDiscount,
        );
        setFieldValue(
          'durationOfDiscountInWeeks',
          selectedPreset.durationOfDiscountInWeeks,
        );
        setFieldValue('minDiscount', selectedPreset.minDiscount);
        setFieldValue('maxDiscount', selectedPreset.maxDiscount);
        setFieldValue('yearForMaxDiscount', selectedPreset.yearForMaxDiscount);
        break;
      case 'wishlistPresets':
        setFieldValue(
          'grossWishlistIncreasePerWeek',
          selectedPreset.grossWishlistIncreasePerWeek,
        );
        setFieldValue(
          'viralityMultiplierDueToDiscounting',
          selectedPreset.viralityMultiplierDueToDiscounting,
        );
        break;
    }
  };

  const renderSection = (
    title: string,
    description: string,
    children: React.ReactNode,
  ) => (
    <Collapsible title={title} defaultOpen>
      <div>
        <div className="flex gap-1 items-center">
          <SimulatorBodyText text={title} className="font-semibold" />
        </div>
        <SimulatorBodyText text={description} />
        {children}
      </div>
    </Collapsible>
  );

  return (
    <div>
      {displaySteamWishlistsAtLaunch &&
        renderSection(
          'Wishlists at launch',
          'These information refer to your game’s performance once it’s available in the stores...',
          <>
            <DateField
              name="launchDate"
              label="Launch Date"
              tooltipText="Select the launch date for the game"
              className="max-w-xs"
            />
            <TextField
              className="max-w-xs"
              name="steamWishlistsAtLaunch"
              label="Wishlists at launch"
              placeholder="Ex: 100 %"
              tooltipText="Number of wishlists recorded at game launch."
              type="number"
              min={0}
              steps={1000}
              allowNegative={false}
            />
            {displayRefundRate && (
              <TextField
                className="max-w-xs"
                name="refundRate"
                label="Refund Rate (%)"
                placeholder="5"
                tooltipText="The average refund rate on platform, usually less than 5% but can go up for very short games or buggy games"
                type="number"
                min={0}
                max={100}
                allowNegative={false}
              />
            )}
            {displayPlayerReviews && (
              <SelectField
                className="max-w-xs"
                name="playerReviews"
                options={playerReviews}
                tooltipText="Select an option."
                label="Player Reviews"
              />
            )}
            {displayFirstWeekWishlistConversionRatio && (
              <TextField
                className="max-w-xs"
                name="firstWeekWishlistConversionRatio"
                label="First week wishlist conversion ratio (%)"
                placeholder="Ex: 100 %"
                tooltipText="First week wishlist conversion ratio"
                type="number"
                min={0}
                max={100}
                allowNegative={false}
              />
            )}
          </>,
        )}

      {displayBuzzCurveStrategy &&
        renderSection(
          'Buzz Curve Strategy',
          'The Buzz Curve is the evolution of the interest around your game over time...',
          <>
            <SelectField
              className="max-w-xs"
              name="buzzCurvePresets"
              options={buzzCurvePresets}
              tooltipText="Select an option."
              label="Buzz Curve Presets"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleSelectChange('buzzCurvePresets', e)
              }
            />
            <TextField
              className="max-w-xs"
              name="steepnessOfDecline"
              placeholder="Ex: 100%"
              type="number"
              label="Steepness of Decline (%)"
              tooltipText="Rate at which interest decreases over time."
              min={-100}
              max={100}
              steps={5}
              allowNegative
            />
            <TextField
              className="max-w-xs"
              name="weeksOfInflection"
              placeholder="Ex: 12"
              type="number"
              label="Week of buzz dropoff"
              tooltipText="Timeframe when interest changes significantly."
              min={1}
              max={200}
              allowNegative={false}
            />
            <div className="h-[600px] w-full">
              <BuzzCurveChart
                key={formValues.buzzCurvePresets}
                formValues={formValues}
              />
            </div>
          </>,
        )}

      {displayDiscountStrategy &&
        renderSection(
          'Discount Strategy',
          'Your discount strategy includes both the frequency of sales and the reduction rate...',
          <>
            <SelectField
              className="max-w-xs"
              name="discountStrategyPresets"
              options={discountStrategyPresets}
              tooltipText="Select an option."
              label="Discount Strategy Presets"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleSelectChange('discountStrategyPresets', e)
              }
            />
            <TextField
              className="max-w-xs"
              name="numberOfWeeksWithoutDiscount"
              placeholder="10"
              type="number"
              label="Number of weeks without discount"
              tooltipText="The duration of time during which the game remains at its original price without any discounts applied."
              min={1}
              max={200}
              allowNegative={false}
            />
            <TextField
              className="max-w-xs"
              name="durationOfDiscountInWeeks"
              placeholder="Ex: 1"
              type="number"
              label="Duration of discount in weeks"
              tooltipText="The period of time for a discount"
              min={1}
              max={200}
              allowNegative={false}
            />
            <TextField
              className="max-w-xs"
              name="minDiscount"
              placeholder="Ex: 20"
              type="number"
              label="Minimum discount amount (%)"
              tooltipText="Minimum discount amount"
              min={0}
              max={90}
              allowNegative={false}
            />
            <TextField
              className="max-w-xs"
              name="maxDiscount"
              placeholder="Ex: 50"
              type="number"
              label="Max Discount (%)"
              tooltipText="Max Discount (%)"
              min={0}
              max={100}
              allowNegative={false}
              steps={10}
            />
            <TextField
              className="max-w-xs"
              name="yearForMaxDiscount"
              placeholder="Ex: 4"
              type="number"
              label="Year for max discount"
              tooltipText="The amount of years for a game to reach its maximun discount"
              min={1}
              max={4}
              allowNegative={false}
            />
            <div className="w-full">
              <DiscountStrategyChart
                key={formValues.discountStrategyPresets}
                formValues={formValues}
              />
            </div>
          </>,
        )}

      {displayWishlistIncreaseDecrease &&
        renderSection(
          'Wishlist variations',
          'Weekly increase or decrease of outstanding wishlist, modelling the lifespan of your game in its genre',
          <>
            <SelectField
              className="max-w-xs"
              name="wishlistPresets"
              options={wishlistPresets}
              tooltipText="Select an option."
              label="Wishlist increase/decrease Presets"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleSelectChange('wishlistPresets', e)
              }
            />
            <TextField
              className="max-w-xs"
              name="grossWishlistIncreasePerWeek"
              placeholder="400"
              type="number"
              label="Weekly gross wishlist variation"
              tooltipText="The rate at which the game spreads among players"
              min={-1000000}
              max={1000000}
              steps={1}
              allowNegative
            />
            <TextField
              className="max-w-xs"
              name="viralityMultiplierDueToDiscounting"
              placeholder="10"
              type="number"
              label="Virality multiplier due to discounting"
              tooltipText="The rate at which the game spreads among players"
              min={0}
              max={1000000}
              allowNegative={false}
            />
            <div className="w-full">
              <WishlistChart formValues={formValues} />
              <NetWishlistVaraitionChart formValues={formValues} />
            </div>
          </>,
        )}
    </div>
  );
};

export default GameLaunch;
