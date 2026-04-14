import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import Checkbox from '@/components/Checkbox';
import TextField from '@/components/Inputs/formik/input';
import Collapsible from '@/components/collapsible';
import { SimulatorBodyText } from '@/components/text/SimulatorText';

interface FormValues {
  productionInvestment: number;
  marketingInvestment: number;
  studioShareUntilRecoup: number;
  studioShareAfterRecoup: number;
}
interface PublisherProps {
  displayProductionInvestment: boolean;
  displayMarketingInvestment: boolean;
  displayStudioShareUntilRecoup: boolean;
  displayStudioShareAfterRecoup: boolean;
}

const Publisher: React.FC<PublisherProps> = ({
  displayProductionInvestment,
  displayMarketingInvestment,
  displayStudioShareUntilRecoup,
  displayStudioShareAfterRecoup,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const { values, setFieldValue, initialValues } =
    useFormikContext<FormValues>();

  useEffect(() => {
    const shouldCheck =
      initialValues.productionInvestment === 0 &&
      initialValues.marketingInvestment === 0;
    setIsChecked(shouldCheck);
  }, [initialValues]);

  useEffect(() => {
    if (
      values.productionInvestment > 0 ||
      values.marketingInvestment > 0 ||
      values.studioShareUntilRecoup < 100 ||
      values.studioShareAfterRecoup < 100
    ) {
      setIsChecked(false);
    }
  }, [values.productionInvestment, values.marketingInvestment]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    if (checked) {
      setFieldValue('productionInvestment', 0);
      setFieldValue('marketingInvestment', 0);
      setFieldValue('studioShareUntilRecoup', 100);
      setFieldValue('studioShareAfterRecoup', 100);
    } else {
      setFieldValue('productionInvestment', initialValues.productionInvestment);
      setFieldValue('marketingInvestment', initialValues.marketingInvestment);
      setFieldValue(
        'studioShareUntilRecoup',
        initialValues.studioShareUntilRecoup,
      );
      setFieldValue(
        'studioShareAfterRecoup',
        initialValues.studioShareAfterRecoup,
      );
    }
  };
  return (
    <Collapsible
      tooltipText="Publisher description."
      title="Publishing"
      defaultOpen
    >
      <SimulatorBodyText
        text="Should you decide to go for a publisher, the below parameters will be set in the publishing agreement."
        className="max-w-[800px]"
      />
      <div className="my-2">
        <Checkbox
          label="Self-published"
          isChecked={isChecked}
          onChange={handleCheckboxChange}
        />
      </div>
      {!isChecked && (
        <div>
          {displayProductionInvestment && (
            <TextField
              className="max-w-xs"
              name="productionInvestment"
              label="Publisher recoupable production costs (€)"
              placeholder={isChecked ? '0' : 'Ex 300'}
              tooltipText="The amount of money the publisher is investing in the production"
              type="number"
              min={0}
              steps={10000}
              allowNegative={false}
            />
          )}

          {displayMarketingInvestment && (
            <TextField
              className="max-w-xs"
              name="marketingInvestment"
              label="Publisher recoupable marketing costs (€)"
              placeholder={isChecked ? '0' : 'Ex: 300'}
              tooltipText="The amount of money the publisher is investing in the marketing. Usually 10 to 50% of total production  budget for marketing costs."
              type="number"
              min={0}
              steps={10000}
              allowNegative={false}
            />
          )}

          {displayStudioShareUntilRecoup && (
            <TextField
              className="max-w-xs"
              name="studioShareUntilRecoup"
              label="Studio Share Until Recoup (%)"
              placeholder="Ex : 100 %"
              tooltipText="The % of net revenues that comes back to studio, until publisher recoups their cost. Usually 0 to 20%."
              type="number"
              min={0}
              steps={10}
              max={100}
              allowNegative={false}
            />
          )}
          {displayStudioShareAfterRecoup && (
            <TextField
              className="max-w-xs"
              name="studioShareAfterRecoup"
              label="Studio Share After Recoup (%)"
              placeholder="Ex : 50"
              tooltipText="The % of net revenues that comes back to studio, after publisher recoups their cost. Usually 5 to 60% depending on financial deal"
              type="number"
              min={0}
              max={100}
              steps={10}
              allowNegative={false}
            />
          )}
        </div>
      )}
    </Collapsible>
  );
};

export default Publisher;
