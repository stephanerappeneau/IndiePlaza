import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import Image from 'next/image';

export const ResetButton: React.FC = () => {
  const { initialValues, values, resetForm } = useFormikContext();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipShownOnce, setTooltipShownOnce] = useState(false);

  const hasChanged = JSON.stringify(values) !== JSON.stringify(initialValues);

  const handleResetParams = () => {
    resetForm();
  };

  const handleMouseEnter = () => {
    if (!tooltipShownOnce) {
      setShowTooltip(true);
      setTooltipShownOnce(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleTouchStart = () => {
    if (!tooltipShownOnce) {
      setShowTooltip(true);
      setTooltipShownOnce(true);
    }
  };

  const handleTouchEnd = () => {
    setShowTooltip(false);
  };

  if (!hasChanged) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleResetParams}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed bottom-20 w-12 h-12 border bg-white border-gray-200 right-4 flex justify-center items-center rounded-full shadow-lg font-bold z-20"
    >
      <Image
        src="/assets/reset.svg"
        alt="Reset Icon"
        role="button"
        width={25}
        height={25}
      />
      {showTooltip && (
        <span className="absolute right-12 bg-gray-100 border border-gray-300 min-w-[250px] md:min-w-[200px] p-2 rounded-lg font-medium text-sm md:text-md text-justify">
          Go back to default values
        </span>
      )}
    </button>
  );
};
