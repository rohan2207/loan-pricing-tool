import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { PropertyView } from './PropertyView';
import { SalesComparablesView } from './SalesComparablesView';

const tabs = ['Property', 'Sales Comparables'];

export function PropertyTabs({ borrowerData }) {
  const [activeTab, setActiveTab] = useState('Property');

  return (
    <div className="px-6 py-6">
      {/* Tabs */}
      <div className="border-b border-neutral-l3">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-4 text-default font-semibold focus:outline-none transition-colors border-b-2",
                activeTab === tab
                  ? "border-secondary text-neutral-d3"
                  : "border-transparent text-neutral-l1 hover:border-secondary-l2 hover:text-neutral-d1"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'Property' && (
          <div className="-mx-6 -mt-4">
            <PropertyView borrowerData={borrowerData} />
          </div>
        )}
        {activeTab === 'Sales Comparables' && (
          <div className="-mx-6 -mt-4">
            <SalesComparablesView borrowerData={borrowerData} />
          </div>
        )}
      </div>
    </div>
  );
}
