import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout/AppLayout';
import SwitchButton from '@/components/switchButton/SwitchLayoutButton';
import Tabs from '@/components/tab/TabSimultor';
import TextSectionRevenues from '@/components/revenues-planner/TextSectionRevenues';
import { SimulatorTitleText } from '@/components/text/SimulatorText';
import { Formik, Form } from 'formik';
import ScrollToTop from '@/components/ScrollTopButton';
import CumulativeUnitsSold from '@/components/revenues-planner/section/CumulativeUnitsSold';
import UnitsSoldPerWeek from '@/components/revenues-planner/section/UnitsSoldPerWeek';
import CumulativeNetEarnings from '@/components/revenues-planner/section/CumulativeNetEarnings';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ResetButton } from '@/components/revenues-planner/ResetParams';
import { fetchSimulatorParams } from '@/utils/simulator_api';
import DownloadXLSXButton from '@/components/revenues-planner/DownloadXLSXButton';
import WeeklyRevenues from '@/components/revenues-planner/section/WeeklyRevenues';
import NetRevenuesMultiplier from '@/components/revenues-planner/section/NetRevenuesMultiplier';
import { FormValues } from '@/components/revenues-planner/section/types';

const StudioFunds = dynamic(
  () => import('@/components/revenues-planner/section/studioFunds'),
  { ssr: false },
);
const GameLaunche = dynamic(
  () => import('@/components/revenues-planner/section/gameLaunche'),
  { ssr: false },
);
const Publisher = dynamic(
  () => import('@/components/revenues-planner/section/publisher'),
  { ssr: false },
);
const GameDistribution = dynamic(
  () => import('@/components/revenues-planner/section/gameDistribution'),
  { ssr: false },
);

const path = [
  { label: 'Revenues Planner', href: '/tools/revenues-planner/', last: false },
];

const tabItems = [
  {
    label: 'Cumulative units sold',
    content: (formValues: FormValues) => (
      <CumulativeUnitsSold formValues={formValues} />
    ),
  },
  {
    label: 'Cumulative net earnings',
    content: (formValues: FormValues) => (
      <CumulativeNetEarnings formValues={formValues} />
    ),
  },
  {
    label: 'Units sold per week',
    content: (formValues: FormValues) => (
      <UnitsSoldPerWeek formValues={formValues} />
    ),
  },
  {
    label: 'Weekly revenues',
    content: (formValues: FormValues) => (
      <WeeklyRevenues formValues={formValues} />
    ),
  },
];

const Simulator = () => {
  const [simulatorParams, setSimulatorParams] = useState<FormValues>(
    {} as FormValues,
  );
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [layoutMode, setLayoutMode] = useState(1);

  useEffect(() => {
    fetchSimulatorParams()
      .then((params) => setSimulatorParams(params as unknown as FormValues))
      .finally(() => setIsPageLoading(false));
  }, []);

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth < 1280;
      setLayoutMode(isMobile ? 0 : 1);
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  if (isPageLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center fixed top-0 left-0">
        <Image
          src="/assets/loading-simulator.gif"
          alt="loading"
          width={150}
          height={150}
        />
      </div>
    );
  }

  return (
    <AppLayout
      title="Revenues Planner"
      description="Elevate Your Ideas with Indie Plaza Project! 🌟 Discover bespoke financing solutions and expert advice for European indies. Propel your game studio to new heights with our innovative, Creative Europe-backed platform. Let's create extraordinary! 🚀"
      path={path}
    >
      <Formik
        initialValues={
          {
            budget: simulatorParams?.budget || 50000,
            productionInvestment:
              simulatorParams?.productionInvestment || 300000,
            marketingInvestment: simulatorParams?.marketingInvestment || 60000,
            studioShareUntilRecoup:
              simulatorParams?.studioShareUntilRecoup || 20,
            studioShareAfterRecoup:
              simulatorParams?.studioShareAfterRecoup || 50,
            gamesFullPrice: simulatorParams?.gamesFullPrice || 19.99,
            distributionFee: simulatorParams?.distributionFee || 30,
            firstWeekWishlistConversionRatio:
              simulatorParams?.firstWeekWishlistConversionRatio || 15,
            taxes: simulatorParams?.taxes || 20,
            steamWishlistsAtLaunch:
              simulatorParams?.steamWishlistsAtLaunch || 100000,
            refundRate: simulatorParams?.refundRate || 5,
            playerReviews: simulatorParams?.playerReviews?.value || 100,
            buzzCurvePresets:
              simulatorParams?.buzzCurvePresets?.[0] || 'liveGame',
            steepnessOfDecline:
              simulatorParams?.buzzCurvePresets?.[0]?.steepnessOfDecline || 50,
            weeksOfInflection:
              simulatorParams?.buzzCurvePresets?.[0]?.weeksOfInflection || 200,
            discountStrategyPresets:
              simulatorParams?.discountStrategyPresets?.[0],
            numberOfWeeksWithoutDiscount:
              simulatorParams?.discountStrategyPresets?.[0]
                ?.numberOfWeeksWithoutDiscount || 10,
            durationOfDiscountInWeeks:
              simulatorParams?.discountStrategyPresets?.[0]
                ?.durationOfDiscountInWeeks || 1,
            minDiscount:
              simulatorParams?.discountStrategyPresets?.[0]?.minDiscount || 20,
            maxDiscount:
              simulatorParams?.discountStrategyPresets?.[0]?.maxDiscount || 50,
            yearForMaxDiscount:
              simulatorParams?.discountStrategyPresets?.[0]
                ?.yearForMaxDiscount || 4,
            wishlistDecreasePresets: 'liveGame',
            launchDate: new Date().toISOString().split('T')[0],
            wishlistPresets: simulatorParams?.wishlistPresets?.[0]?.label,
            grossWishlistIncreasePerWeek:
              simulatorParams?.wishlistPresets?.[0]
                ?.grossWishlistIncreasePerWeek,
            viralityMultiplierDueToDiscounting:
              simulatorParams?.wishlistPresets?.[0]
                ?.viralityMultiplierDueToDiscounting,
          } as unknown as FormValues
        }
        onSubmit={() => {}}
      >
        {({ values }) => (
          <Form>
            <div className="flex justify-end mx-4 mt-2">
              <div className="hidden xl:block">
                <SwitchButton
                  defaultValue={layoutMode}
                  firstElementLabel="Inline mode"
                  secondElementLabel="Grid mode"
                  onChange={setLayoutMode}
                />
              </div>
            </div>

            <div
              className={`flex items-start gap-2 p-2 mx-2 ${
                layoutMode === 0 ? 'flex-col' : 'flex-row-reverse'
              }`}
            >
              {/* Charts panel */}
              <div
                className={
                  layoutMode === 1 ? 'sticky top-14 w-1/2 z-10' : 'w-full'
                }
              >
                <div className="flex flex-col">
                  <div className="flex justify-between items-end flex-wrap">
                    <TextSectionRevenues />
                    <div className="min-w-fit">
                      <DownloadXLSXButton
                        formValues={values}
                        weeksNumber={156}
                      />
                    </div>
                  </div>
                  <div className="h-[calc(100vh-230px)] space-y-5">
                    <div className="mt-1 h-[82%]">
                      <Tabs
                        tabs={tabItems.map((tab) => ({
                          ...tab,
                          content: tab.content(values),
                        }))}
                      />
                    </div>
                    <div className="h-[15%]">
                      <NetRevenuesMultiplier formValues={values} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expert parameters — always visible */}
              <div
                className={layoutMode === 1 ? 'xl:w-1/2 z-0' : 'w-full mt-20'}
              >
                <SimulatorTitleText text="Parameters" />
                <StudioFunds />
                <Publisher
                  displayProductionInvestment
                  displayMarketingInvestment
                  displayStudioShareUntilRecoup
                  displayStudioShareAfterRecoup
                />
                <GameDistribution
                  displayGamesFullPrice
                  displayDistributionFee
                  displayTaxes
                />
                <GameLaunche
                  formValues={values}
                  displaySteamWishlistsAtLaunch
                  displayRefundRate
                  displayPlayerReviews
                  displayBuzzCurveStrategy
                  displayDiscountStrategy
                  displayWishlistIncreaseDecrease
                  displayFirstWeekWishlistConversionRatio
                />
              </div>

              <ResetButton />
            </div>
          </Form>
        )}
      </Formik>
      <ScrollToTop />
    </AppLayout>
  );
};

export default Simulator;
