import React from 'react';
import { User } from 'lucide-react';

export function BorrowerHeader() {
    return (
        <div className="flex-shrink-0">
            {/* Borrower Info Bar */}
            <header className="bg-gradient-to-r from-alternativePrimary-l1 to-alternativePrimary-d2 text-white px-6 py-4 shadow-lg">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                            <User size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xl font-bold">John Smith</p>
                            <p className="text-sm text-white/70 mt-0.5">Loan: MOCK-LOAN-001 • $425,000 • Austin, TX</p>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                        <p className="text-xs font-medium text-white/70">Loan Status</p>
                        <p className="text-base font-semibold flex items-center mt-0.5">
                            <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></span>
                            Initial Call
                        </p>
                    </div>
                </div>
            </header>
        </div>
    );
}







