import React from 'react';

export function MockScenarios() {
    return (
        <div className="px-6 py-6 font-sans">
            <div className="rounded bg-warning-l5 border border-warning-l2 p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-default font-medium text-warning-d2">Mock Scenarios</p>
                    <p className="text-xs font-normal text-warning-d2">Visible only in mock mode</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {['Initial Call', 'Pre-Qual', 'Application', 'Lock'].map((label, idx) => (
                        <button
                            key={label}
                            className={`py-1.5 px-4 text-sm font-normal rounded-[4px] min-w-fit transition-colors
                        ${idx === 0 ? 'bg-primary text-white hover:bg-primary-d1' : 'bg-neutral-l4 text-neutral-d2 hover:bg-neutral-l3'}
                    `}
                        >
                            {label}
                        </button>
                    ))}
                    <button className="py-1.5 px-4 text-sm font-normal rounded-[4px] min-w-fit text-primary hover:text-primary-d1 underline underline-offset-2">
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
