import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Formik, Form } from 'formik';
import dynamic from 'next/dynamic';
import { fetchSimulatorParams } from '@/utils/simulator_api';
import { FormValues } from '@/components/revenues-planner/section/types';
import { AppBar } from '@/components/AppLayout/AppBar';
import SwitchButton from '@/components/switchButton/SwitchLayoutButton';
import Tabs from '@/components/tab/TabSimultor';
import TextSectionRevenues from '@/components/revenues-planner/TextSectionRevenues';
import { SimulatorTitleText } from '@/components/text/SimulatorText';
import CumulativeUnitsSold from '@/components/revenues-planner/section/CumulativeUnitsSold';
import UnitsSoldPerWeek from '@/components/revenues-planner/section/UnitsSoldPerWeek';
import CumulativeNetEarnings from '@/components/revenues-planner/section/CumulativeNetEarnings';
import WeeklyRevenues from '@/components/revenues-planner/section/WeeklyRevenues';
import NetRevenuesMultiplier from '@/components/revenues-planner/section/NetRevenuesMultiplier';
import { ResetButton } from '@/components/revenues-planner/ResetParams';
import DownloadXLSXButton from '@/components/revenues-planner/DownloadXLSXButton';
import ScrollToTop from '@/components/ScrollTopButton';

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

const tabItems = [
  {
    label: 'Cumulative units sold',
    content: (v: FormValues) => <CumulativeUnitsSold formValues={v} />,
  },
  {
    label: 'Cumulative net earnings',
    content: (v: FormValues) => <CumulativeNetEarnings formValues={v} />,
  },
  {
    label: 'Units sold per week',
    content: (v: FormValues) => <UnitsSoldPerWeek formValues={v} />,
  },
  {
    label: 'Weekly revenues',
    content: (v: FormValues) => <WeeklyRevenues formValues={v} />,
  },
];

export default function Home() {
  const [simulatorParams, setSimulatorParams] = useState<FormValues>(
    {} as FormValues,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [layoutMode, setLayoutMode] = useState(1);

  useEffect(() => {
    fetchSimulatorParams()
      .then((p) => setSimulatorParams(p as unknown as FormValues))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const update = () => setLayoutMode(window.innerWidth < 1280 ? 0 : 1);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <>
      <Head>
        <title>Indie Plaza — Revenue Planner</title>
        <meta
          name="description"
          content="Free revenue simulation tool for indie game studios. Model your game launch, wishlist conversion, discount strategy, and net earnings."
        />
        <link rel="icon" href="/favicon.ico?v=2" />
      </Head>

      <AppBar />

      {/* Hero */}
      <section className="relative w-full h-screen">
        <Image
          src="/assets/banner-desktop.webp"
          alt="Indie Plaza"
          fill
          priority
          className="object-cover hidden md:block"
        />
        <Image
          src="/assets/banner-mobile.webp"
          alt="Indie Plaza"
          fill
          priority
          className="object-cover block md:hidden"
        />
      </section>

      {/* Revenue Planner */}
      <section id="planner">
        {isLoading ? (
          <div className="w-full flex justify-center items-center py-20">
            <Image
              src="/assets/loading-simulator.gif"
              alt="loading"
              width={150}
              height={150}
            />
          </div>
        ) : (
          <Formik
            initialValues={
              {
                budget: simulatorParams?.budget || 50000,
                productionInvestment:
                  simulatorParams?.productionInvestment || 300000,
                marketingInvestment:
                  simulatorParams?.marketingInvestment || 60000,
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
                  simulatorParams?.buzzCurvePresets?.[0]?.steepnessOfDecline ||
                  50,
                weeksOfInflection:
                  simulatorParams?.buzzCurvePresets?.[0]?.weeksOfInflection ||
                  200,
                discountStrategyPresets:
                  simulatorParams?.discountStrategyPresets?.[0],
                numberOfWeeksWithoutDiscount:
                  simulatorParams?.discountStrategyPresets?.[0]
                    ?.numberOfWeeksWithoutDiscount || 10,
                durationOfDiscountInWeeks:
                  simulatorParams?.discountStrategyPresets?.[0]
                    ?.durationOfDiscountInWeeks || 1,
                minDiscount:
                  simulatorParams?.discountStrategyPresets?.[0]?.minDiscount ||
                  20,
                maxDiscount:
                  simulatorParams?.discountStrategyPresets?.[0]?.maxDiscount ||
                  50,
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
                {/* Layout toggle */}
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

                {/* Main two-column layout */}
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

                  {/* Expert parameters panel */}
                  <div
                    className={
                      layoutMode === 1 ? 'xl:w-1/2 z-0' : 'w-full mt-20'
                    }
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
        )}
      </section>

      <ScrollToTop />
    </>
  );
}
