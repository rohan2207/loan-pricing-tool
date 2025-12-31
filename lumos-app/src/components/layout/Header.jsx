import React from 'react';
import { User } from 'lucide-react';

export function Header() {
    return (
        <header className="bg-gradient-to-r from-alternativePrimary-l1 to-alternativePrimary-d2 text-white p-4 shadow-lg">
            <div className="flex justify-between items-center pl-6 pr-2">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-white bg-opacity-30 rounded-full flex items-center justify-center mr-3">
                        <User size={24} className="text-white" />
                    </div>
                    <div>
                        <p className="not-italic text-lg font-bold">John Smith</p>
                        <p className="not-italic text-sm text-white opacity-80 mt-0.5">Loan: MOCK-LOAN-001 • $425,000 • Austin, TX</p>
                    </div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1.5 rounded">
                    <p className="not-italic text-sm font-medium text-white opacity-80">Loan Status</p>
                    <p className="not-italic text-base font-medium flex items-center mt-0.5">
                        <span className="w-2 h-2 bg-information rounded-full mr-2 animate-pulse"></span>
                        Initial Call
                    </p>
                </div>
            </div>
        </header>
    );
}
