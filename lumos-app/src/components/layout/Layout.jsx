import React from 'react';
import { Sidebar } from './Sidebar';
import { BorrowerHeader } from './BorrowerHeader';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export function Layout({ 
    children, 
    currentView,
    onViewChange,
    activeQuickAction, 
    onQuickActionChange, 
    rightPanel 
}) {
    const handleClosePanel = () => {
        onQuickActionChange(null);
    };

    return (
        <div className="flex w-full relative min-h-screen bg-neutral-l5">
            <Sidebar 
                currentView={currentView}
                onViewChange={onViewChange}
                activeQuickAction={activeQuickAction} 
                onQuickActionChange={onQuickActionChange} 
            />
            <div className={cn(
                "flex-1 min-w-0 transition-all duration-300 ml-56 flex flex-col", 
                rightPanel ? "mr-[480px]" : ""
            )}>
                {/* Persistent Borrower Header - Shows on all screens */}
                <BorrowerHeader />
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    {children}
                </main>
            </div>
            {rightPanel && (
                <div className="fixed right-0 top-0 bottom-0 w-[480px] shadow-xl z-20 bg-white border-l border-neutral-l3 overflow-y-auto">
                    {/* Close button */}
                    <button 
                        onClick={handleClosePanel}
                        className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-neutral-l4 hover:bg-neutral-l3 text-neutral-d1 transition-colors"
                    >
                        <X size={18} />
                    </button>
                    <div className="h-full pt-2">
                        {rightPanel}
                    </div>
                </div>
            )}
        </div>
    );
}
