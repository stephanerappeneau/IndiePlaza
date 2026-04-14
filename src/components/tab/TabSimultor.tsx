import React, { useState } from 'react';
import { TabsProps } from './Types';

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="shadow-custom h-[100%] overflow-auto">
      <div className="flex bg-[#D9D9D9] shadow-custom">
        {tabs.map((tab, index) => (
          <button
            type="button"
            key={index}
            className={`text-sm lg:text-base py-2 px-2 text-center text-black 
                        
                        ${
                          activeTab === index ? ' bg-white' : ' bg-[#D9D9D9] '
                        }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="w-full h-[88%]">{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;
