import TextField from '@/components/Inputs/formik/input';
import Collapsible from '@/components/collapsible';
import { SimulatorBodyText } from '@/components/text/SimulatorText';

const StudioFunds = () => {
  return (
    <Collapsible title="Studio Funds" defaultOpen>
      <SimulatorBodyText
        text="This section includes all budget gathered by the founders before resorting to a publisher."
        className="max-w-[800px]"
      />
      <SimulatorBodyText
        text="It includes personal investment, friends and family investment, bank loan and public grants."
        className="max-w-[800px]"
      />

      <TextField
        className="max-w-xs"
        name="budget"
        label="Studio own investment (€)"
        placeholder="Ex : 300"
        tooltipText="The amount of money the studio is investing in the project, usually production costs up to vertical slice"
        min={0}
        steps={10000}
        allowNegative={false}
      />
    </Collapsible>
  );
};

export default StudioFunds;
