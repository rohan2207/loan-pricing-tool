import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { BorrowerHeader } from './BorrowerHeader';
import { AIPanelPermanent } from './AIPanelPermanent';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export function Layout({ 
    children, 
    currentView,
    onViewChange,
    activeQuickAction, 
    onQuickActionChange, 
    rightPanel,
    accounts,
    borrowerData
}) {
    // Manual collapse state - user can collapse the AI panel
    const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);

    const handleClosePanel = () => {
        onQuickActionChange(null);
    };

    const handleManualCollapse = () => {
        setIsManuallyCollapsed(true);
    };

    const handleExpand = () => {
        // If there's a flyover, close it; otherwise, expand the manually collapsed panel
        if (rightPanel) {
            onQuickActionChange(null);
        } else {
            setIsManuallyCollapsed(false);
        }
    };

    // Check if a flyover is active (rightPanel is rendered)
    const hasFlyover = !!rightPanel;
    
    // Panel is visible when: no flyover AND not manually collapsed
    const isPanelVisible = !hasFlyover && !isManuallyCollapsed;

    return (
        <div className="flex w-full relative min-h-screen bg-neutral-l5">
            <Sidebar 
                currentView={currentView}
                onViewChange={onViewChange}
                activeQuickAction={activeQuickAction} 
                onQuickActionChange={onQuickActionChange} 
            />
            <div className={cn(
                "flex-1 min-w-0 transition-all duration-300 ml-44 flex flex-col", 
                hasFlyover ? "mr-[480px]" : isPanelVisible ? "mr-[320px]" : ""
            )}>
                {/* Persistent Borrower Header - Shows on all screens */}
                <BorrowerHeader />
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    {children}
                </main>
            </div>
            
            {/* Permanent AI Panel - collapses to icon when flyover is open OR user manually collapses */}
            <AIPanelPermanent 
                isCollapsed={hasFlyover}
                isManuallyCollapsed={isManuallyCollapsed}
                onExpand={handleExpand}
                onManualCollapse={handleManualCollapse}
                onSelectTool={onQuickActionChange}
                accounts={accounts}
                borrowerData={borrowerData}
            />
            
            {/* Flyover Panel - overlays when active */}
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
