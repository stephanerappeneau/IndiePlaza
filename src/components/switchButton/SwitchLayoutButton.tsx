import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { SwitchButtonProps } from './Type';
import Image from 'next/image';
import Tooltip from '@/components/tooltip';

const SwitchButton: React.FC<SwitchButtonProps> = ({
  defaultValue = 0,
  onChange,
  firstElementLabel = 'Easy Mode',
  secondElementLabel = 'Expert Mode',
  tooltipText = '',
}) => {
  const [switchIndex, setSwitchIndex] = useState(defaultValue);

  useEffect(() => {
    setSwitchIndex(defaultValue);
  }, [defaultValue]);

  const handleClick = (index: number) => {
    setSwitchIndex(index);
    onChange?.(index);
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-[200px] rounded-3xl h-14 lg:flex flex-row relative z-0">
        <button
          type="button"
          className={clsx(
            'absolute left-0 drop-shadow-custom rounded-3xl h-full py-2 pl-2 pr-4 flex flex-row items-center',
            {
              'bg-[#00A72F] text-white z-20': switchIndex === 0,
              'bg-[#F8F6F6] text-black z-10': switchIndex !== 0,
            },
          )}
          onClick={() => handleClick(0)}
        >
          {firstElementLabel}
        </button>
        <button
          type="button"
          className={clsx(
            'absolute right-0 drop-shadow-custom rounded-3xl h-full p-2 text-right flex flex-row items-center',
            {
              'bg-[#DD0000] text-white z-20': switchIndex === 1,
              'bg-[#F8F6F6] text-black z-10': switchIndex !== 1,
            },
          )}
          onClick={() => handleClick(1)}
        >
          {secondElementLabel}
        </button>
      </div>
      {tooltipText && (
        <Tooltip text={tooltipText} position="right">
          <div className="flex items-center">
            <Image
              src="/assets/info-blue.svg"
              width={25}
              height={25}
              alt="info"
            />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default SwitchButton;
