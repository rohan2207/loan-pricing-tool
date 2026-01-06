import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
    X, 
    Minus,
    ExternalLink,
    Sparkles,
    FileText,
    CreditCard,
    Home,
    RefreshCw,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { GoodLeapSummary } from './GoodLeapSummary';
import { GoodLeapAVM } from './GoodLeapAVM';
import { LiabilityAI } from './LiabilityAI';
import '../../styles/bento.css';

const TOOLS = [
    { id: 'call-prep', label: 'Call Prep', icon: FileText, description: 'Customer briefing' },
    { id: 'liability', label: 'Liability AI', icon: CreditCard, description: 'Debt consolidation' },
    { id: 'avm', label: 'Property AVM', icon: Home, description: 'Valuation analysis' }
];

export function AIPanel({ 
    accounts = [], 
    borrowerData,
    isOpen,
    onClose,
    onMinimize,
    isMinimized,
    defaultTool = 'call-prep',
    isPopout = false
}) {
    const [selectedTool, setSelectedTool] = useState(defaultTool);
    const [isDetached, setIsDetached] = useState(false);

    // Handle popout to new window
    const handlePopout = useCallback(() => {
        const width = 520;
        const height = 750;
        const left = window.screen.width - width - 50;
        const top = 50;

        const popoutWindow = window.open(
            `${window.location.origin}/?popout=ai&tool=${selectedTool}`,
            'AIPanel',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );

        if (popoutWindow) {
            // Store reference for communication
            window.aiPanelPopout = popoutWindow;
            setIsDetached(true);
            onMinimize?.();
        }
    }, [selectedTool, onMinimize]);

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

    // Render tool content
    const renderToolContent = () => {
        switch (selectedTool) {
            case 'call-prep':
                return <GoodLeapSummary accounts={accounts} borrowerData={borrowerData} embedded />;
            case 'liability':
                return <LiabilityAI accounts={accounts} borrowerData={borrowerData} embedded />;
            case 'avm':
                return <GoodLeapAVM borrowerData={borrowerData} embedded />;
            default:
                return null;
        }
    };

    if (!isOpen && !isPopout) return null;

    // Minimized state - just show the header
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
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm">AI Assistant</h2>
                        <p className="text-xs text-white/70">Powered by GPT-4</p>
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

            {/* Tool Selector Tabs */}
            <div className="flex bg-white border-b border-black/5 px-2 py-2 gap-1">
                {TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = selectedTool === tool.id;
                    return (
                        <button
                            key={tool.id}
                            onClick={() => setSelectedTool(tool.id)}
                            className={cn(
                                "flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all",
                                isActive 
                                    ? "bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-md" 
                                    : "hover:bg-black/5 text-[#86868b]"
                            )}
                        >
                            <Icon size={18} />
                            <span className="text-xs font-medium">{tool.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {renderToolContent()}
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

