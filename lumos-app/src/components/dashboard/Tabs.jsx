import React from 'react';
import { cn } from '../../lib/utils';

const tabs = ['Liabilities'];

export function Tabs({ activeTab, onTabChange }) {
    return (
        <div className="border-b border-neutral-l3">
            <div className="flex">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
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
    );
}
