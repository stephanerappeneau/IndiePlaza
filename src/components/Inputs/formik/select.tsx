// SelectField Component
import { useField } from 'formik';
import Image from 'next/image';
import Tooltip from '@/components/tooltip';
import { SELECT_FIELD_PROP } from './Types'; // Define this type according to your needs

const SelectField = ({
  name,
  label,
  options,
  tooltipText = '',
  className,
  onChange,
  value,
  rowDisplay,
}: SELECT_FIELD_PROP) => {
  const [field, , helpers] = useField(name);

  const handleChange = (e: any) => {
    if (onChange) {
      onChange(e);
    }
    helpers.setValue(e.target.value);
  };
  const rowClass = rowDisplay
    ? 'flex-row items-center'
    : 'flex-col items-start';

  return (
    <div className={`flex ${rowClass} ${className} flex-wrap`}>
      {label && (
        <div className="flex items-center min-w-[213px]">
          <label htmlFor={name} className={`${rowDisplay ? 'mr-2' : ''}`}>
            {label}
          </label>
          {!rowDisplay && tooltipText && (
            <Tooltip text={tooltipText} position="right">
              <Image
                src="/assets/info-blue.svg"
                width={25}
                height={25}
                alt="info"
                className="ml-2"
              />
            </Tooltip>
          )}
        </div>
      )}

      <select
        {...field}
        value={value}
        id={name}
        onChange={handleChange}
        className="w-11/12 border border-black focus:outline-none focus:border-blue-500 text-[18px] p-1 px-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="hidden md:block">
        {rowDisplay && tooltipText && (
          <Tooltip text={tooltipText}>
            <Image
              src="/assets/info-blue.svg"
              width={25}
              height={25}
              alt="info"
              className="ml-2"
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default SelectField;
