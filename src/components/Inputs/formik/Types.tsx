export interface INPUT_FIELD_PROP {
  name: string;
  label?: string;
  type?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  tooltipText?: string;
  className?: string;
  rowDisplay?: boolean;
  onChange?: any;
  steps?: number;
  allowNegative?: boolean;
}

interface Option {
  label: string;
  value: string;
}

export interface SELECT_FIELD_PROP extends INPUT_FIELD_PROP {
  options: Option[];
  value?: string;
}
