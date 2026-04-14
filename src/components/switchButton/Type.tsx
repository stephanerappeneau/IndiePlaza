export interface SwitchButtonProps {
  defaultValue?: number;
  onChange?: (index: number) => void; // Updated to accept a number argument
  firstElementLabel?: string;
  secondElementLabel?: string;
  tooltipText?: string;
}
