import React, { useEffect, useState } from 'react';
import { useField } from 'formik';
import Image from 'next/image';
import Tooltip from '@/components/tooltip';

const DateField = ({
  name,
  label,
  placeholder,
  tooltipText = '',
  className,
  rowDisplay,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [field, meta, helpers] = useField(name);
  const rowClass = rowDisplay
    ? 'flex-row items-center'
    : 'flex-col items-start';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };

    load();
  }, [field.value]);
  return (
    <div
      className={`flex ${rowClass} ${className} flex-wrap gap-1 my-1 w-full`}
    >
      {label && (
        <div className="flex items-center w-full">
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
                className="ml-2 mb-1"
              />
            </Tooltip>
          )}
        </div>
      )}
      <div className="flex items-center w-full relative">
        <input
          {...field}
          name="datefield"
          type="date"
          placeholder={placeholder}
          className="w-full border border-black focus:outline-none focus:border-blue-500 text-[20px] px-2"
          onChange={(e) => helpers.setValue(e.target.value)}
        />
        {loading ? (
          <Image
            src="/assets/input-loading.svg"
            width={25}
            height={25}
            alt="loading"
            className="ml-2"
          />
        ) : (
          <Image
            src="/assets/input-validate.svg"
            width={25}
            height={25}
            alt="loading"
            className="ml-2"
          />
        )}
      </div>
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

export default DateField;
