import React from 'react';
import TextField from '@/components/Inputs/formik/input';
import Collapsible from '@/components/collapsible';
import { SimulatorBodyText } from '@/components/text/SimulatorText';

interface GameDistributionProps {
  displayGamesFullPrice: boolean;
  displayDistributionFee: boolean;
  displayTaxes: boolean;
}

const GameDistribution: React.FC<GameDistributionProps> = ({
  displayGamesFullPrice,
  displayDistributionFee,
  displayTaxes,
}) => {
  return (
    <Collapsible
      tooltipText="Utilize industry average data for sales strategy."
      title="Game Distribution"
      defaultOpen
    >
      <SimulatorBodyText
        text="The information refer to your pricing strategy and various taxes and distribution fees"
        className="max-w-[800px]"
      />
      {displayGamesFullPrice && (
        <TextField
          className="max-w-xs"
          name="gamesFullPrice"
          label="Game Price, VAT included (€)"
          placeholder="Ex: 100"
          tooltipText="The weighted average worldwide price, taking into account regional pricing disparities. If you are located in western Europe, taking 75% of your local price should be enough."
          type="number"
          min={1}
          max={100}
          allowNegative={false}
        />
      )}
      {displayDistributionFee && (
        <TextField
          className="max-w-xs"
          name="distributionFee"
          label="Distribution Fee (%)"
          placeholder="Ex: 100"
          tooltipText="Cut of sales that is given to distributor : steam, retailer, etc. Usually 30% on most digital stores"
          type="number"
          min={0}
          max={100}
          allowNegative={false}
        />
      )}
      {displayTaxes && (
        <TextField
          className="max-w-xs"
          name="taxes"
          label="Taxes (VAT, %)"
          placeholder="Ex: 100"
          tooltipText="Weighted average VAT applied to your worldwide sales, taking into account regional pricing disparities. Usually 20%"
          type="number"
          min={0}
          max={100}
          allowNegative={false}
        />
      )}
    </Collapsible>
  );
};

export default GameDistribution;
