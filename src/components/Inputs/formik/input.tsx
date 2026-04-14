/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from 'react';
import { useField, useFormikContext } from 'formik';
import Image from 'next/image';
import Tooltip from '@/components/tooltip';
import { NumericFormat } from 'react-number-format';
import { INPUT_FIELD_PROP } from './Types';

const TextField = ({
  name,
  label,
  max = Infinity,
  min = 0,
  placeholder,
  tooltipText = '',
  className,
  rowDisplay,
  steps = 1,
  allowNegative,
}: INPUT_FIELD_PROP) => {
  const [field, meta, helpers] = useField(name);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const inputKeyRef = useRef(0);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      let value = parseFloat(field.value);
      if (!isNaN(value)) {
        if (value > max) value = max;
        if (value < min) value = min;
        if (value !== parseFloat(field.value)) {
          helpers.setValue(value);
        }
      }
      const isValid = !isNaN(value) && value >= min && value <= max;
      setValid(isValid);
      setLoading(false);
    }, 1000);
  }, [field.value, min, max, helpers]);

  const handleValueChange = ({ floatValue }: any) => {
    if (!isNaN(floatValue)) {
      const floatValueStr = floatValue.toString();
      const hasNegativeSign = floatValueStr.startsWith('-');

      if (allowNegative && hasNegativeSign && floatValueStr.length === 1) {
        setFieldValue(name, '');
      } else {
        let newValue = floatValue;
        if (newValue == null || newValue == '') {
          setFieldValue(name, '');
        } else if (!isNaN(newValue)) {
          if (newValue > max) {
            newValue = max;
            inputKeyRef.current += 1;
          } else if (newValue < min) {
            newValue = min;
            inputKeyRef.current += 1;
          }
          setFieldValue(name, newValue);
        } else {
          setFieldValue(name, min);
        }
      }
    }
  };

  const updateValue = (newValue: any) => {
    if (!isNaN(newValue)) {
      if (typeof max !== 'undefined') {
        newValue = Math.min(newValue, max);
      }
      if (typeof min !== 'undefined') {
        newValue = Math.max(newValue, min);
      }
      helpers.setValue(newValue);
    } else {
      helpers.setValue(0);
    }
  };

  const incrementValue = () => {
    const currentValue = Number(field.value) || 0;
    const newValue = parseFloat((currentValue + steps).toFixed(1));
    updateValue(newValue);
  };

  const decrementValue = () => {
    const currentValue = Number(field.value) || 0;
    const newValue = parseFloat((currentValue - steps).toFixed(1));
    updateValue(newValue);
  };

  return (
    <div
      className={`flex min-w-fit ${
        rowDisplay ? 'flex-row items-center' : 'flex-col items-start'
      } ${className} flex-wrap gap-1 my-1 w-full`}
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
        <NumericFormat
          id={name}
          name="numericInput"
          key={inputKeyRef.current}
          value={field.value}
          onValueChange={handleValueChange}
          onBlur={field.onBlur}
          thousandSeparator
          placeholder={placeholder}
          allowNegative={allowNegative}
          className="w-full border border-black focus:outline-none focus:border-blue-500 text-[20px] px-2"
        />

        <div className="relative text-xs bottom-1">
          <button onClick={incrementValue} type="button" className="relative">
            <div className="absolute bg-gray-200 hover:bg-gray-300 w-4 h-3 right-1 bottom-1 flex justify-center items-center ">
              ▲
            </div>
          </button>
          <button onClick={decrementValue} type="button">
            <div className="absolute bg-gray-200 hover:bg-gray-300 w-4 h-3 right-1  flex justify-center items-center ">
              ▼
            </div>
          </button>
        </div>

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
            alt="verified"
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

export default TextField;
