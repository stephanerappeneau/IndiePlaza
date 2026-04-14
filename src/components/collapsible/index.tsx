import Image from 'next/image';
import React, { useState } from 'react';
import { CollapsibleProps } from './Types';

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="shadow-custom w-full">
      <button
        type="button"
        className="z-10 text-left w-full py-2 px-4 text-[32px] font-light flex items-center text-shadow-default gap-2"
        onClick={toggleOpen}
      >
        <div
          className={`transform ${!isOpen ? '-rotate-90' : ''}`}
          onClick={toggleOpen}
        >
          <Image
            src="/assets/arrow-bottom.svg"
            alt="chevron"
            width={30}
            height={30}
          />
        </div>
        {title}
      </button>
      {isOpen && <div className="p-4 ">{children}</div>}
    </div>
  );
};

export default Collapsible;
