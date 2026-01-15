import React, { useState, useCallback, useEffect } from 'react';
import { 
    X, 
    Minus,
    ExternalLink,
    Sparkles,
    ChevronLeft,
    ChevronUp
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AI_TOOLS, getToolById } from '../../config/aiTools.config';
import { AIToolGrid } from './AIToolGrid';
import { GoodLeapSummary } from './GoodLeapSummary';
import { GoodLeapAVM } from './GoodLeapAVM';
import { LiabilityAI } from './LiabilityAI';
import { SalesCoach } from './SalesCoach';
import '../../styles/bento.css';

// Component registry - maps component names to actual components
const COMPONENT_MAP = {
    'GoodLeapSummary': GoodLeapSummary,
    'LiabilityAI': LiabilityAI,
    'GoodLeapAVM': GoodLeapAVM,
    'SalesCoach': SalesCoach,
    // Add new components here as they're created
    // 'RateCompare': RateCompare,
    // 'DTICalculator': DTICalculator,
};

export function AIPanel({ 
    accounts = [], 
    borrowerData,
    isOpen,
    onClose,
    onMinimize,
    isMinimized,
    defaultTool = null,  // null = show grid, string = show specific tool
    isPopout = false,
    cachedToolData = null  // Cached data from parent/popout window
}) {
    const [selectedTool, setSelectedTool] = useState(defaultTool);
    const [isDetached, setIsDetached] = useState(false);
    const [toolCache, setToolCache] = useState(cachedToolData || {});

    // Get tool config if a tool is selected
    const toolConfig = selectedTool ? getToolById(selectedTool) : null;

    // Handle tool selection from grid
    const handleSelectTool = useCallback((tool) => {
        setSelectedTool(tool.id);
    }, []);

    // Handle back to grid
    const handleBackToGrid = useCallback(() => {
        setSelectedTool(null);
    }, []);

    // Handle popout to new window
    const handlePopout = useCallback(() => {
        const width = 520;
        const height = 750;
        const left = window.screen.width - width - 50;
        const top = 50;

        // Store cached tool data for the popout window
        window.aiPanelToolCache = toolCache;

        const toolParam = selectedTool ? `&tool=${selectedTool}` : '';
        const popoutWindow = window.open(
            `${window.location.origin}/?popout=ai${toolParam}`,
            'AIPanel',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );

        if (popoutWindow) {
            window.aiPanelPopout = popoutWindow;
            setIsDetached(true);
            onMinimize?.();
        }
    }, [selectedTool, onMinimize, toolCache]);

    // Listen for popout window close
    useEffect(() => {
        if (isDetached && window.aiPanelPopout) {
            const checkClosed = setInterval(() => {
                if (window.aiPanelPopout?.closed) {
                    setIsDetached(false);
                    window.aiPanelPopout = null;
                    clearInterval(checkClosed);
                }
            }, 500);
            return () => clearInterval(checkClosed);
        }
    }, [isDetached]);

    // Render the selected tool component
    const renderToolContent = () => {
        if (!toolConfig) return null;

        const Component = COMPONENT_MAP[toolConfig.component];
        if (!Component) {
            return (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
                        <Sparkles size={28} className="text-amber-500" />
                    </div>
                    <p className="text-lg font-semibold text-[#1d1d1f]">Coming Soon</p>
                    <p className="text-sm text-[#86868b] mt-1">
                        {toolConfig.label} is currently in development
                    </p>
                </div>
            );
        }

        // Pass appropriate props based on the component
        const props = { 
            embedded: true,
            // In popout mode, don't auto-load if there's no cached data (user can click refresh)
            autoLoad: !isPopout || !!toolCache[selectedTool],
            cachedData: toolCache[selectedTool] || null
        };
        if (toolConfig.component !== 'GoodLeapAVM') {
            props.accounts = accounts;
        }
        props.borrowerData = borrowerData;

        return <Component {...props} />;
    };

    if (!isOpen && !isPopout) return null;

    // Minimized state
    if (isMinimized && !isPopout) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={onMinimize}
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                >
                    <Sparkles size={20} />
                    <span className="font-medium">AI Assistant</span>
                    {isDetached && (
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Detached</span>
                    )}
                    <ChevronUp size={18} />
                </button>
            </div>
        );
    }

    return (
        <div className={cn(
            "flex flex-col bg-[#f5f5f7] shadow-2xl",
            isPopout ? "h-screen w-full" : "fixed bottom-4 right-4 z-50 w-[480px] h-[680px] rounded-2xl overflow-hidden border border-black/10"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                    {/* Back button when tool is selected */}
                    {selectedTool && (
                        <button
                            onClick={handleBackToGrid}
                            className="p-1.5 -ml-1 hover:bg-white/10 rounded-lg transition-colors"
                            title="Back to tools"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}
                    
                    {!selectedTool && (
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <Sparkles size={18} />
                        </div>
                    )}
                    
                    <div>
                        <h2 className="font-semibold text-sm">
                            {toolConfig ? toolConfig.label : 'AI Assistant'}
                        </h2>
                        <p className="text-xs text-white/70">
                            {toolConfig ? toolConfig.description : 'Powered by GPT-4'}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-1">
                    {!isPopout && (
                        <>
                            <button
                                onClick={onMinimize}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Minimize"
                            >
                                <Minus size={16} />
                            </button>
                            <button
                                onClick={handlePopout}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Pop out to new window"
                            >
                                <ExternalLink size={16} />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Close"
                            >
                                <X size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Content Area - Grid or Tool */}
            <div className="flex-1 overflow-hidden">
                {selectedTool ? (
                    renderToolContent()
                ) : (
                    <AIToolGrid onSelectTool={handleSelectTool} />
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-white border-t border-black/5">
                <p className="text-[10px] text-[#86868b] text-center">
                    AI-generated content for informational purposes only. Verify all data.
                </p>
            </div>
        </div>
    );
}

// Floating button to trigger the panel
export function AIFloatingButton({ onClick, isOpen, isDetached }) {
    if (isOpen) return null;

    return (
        <button
            onClick={onClick}
            className={cn(
                "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4",
                "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
                "rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105",
                "transition-all duration-200"
            )}
        >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles size={22} />
            </div>
            <div className="text-left">
                <p className="font-semibold">AI Assistant</p>
                <p className="text-xs text-white/70">
                    {isDetached ? 'Open in window' : 'Get AI insights'}
                </p>
            </div>
        </button>
    );
}
