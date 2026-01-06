import React, { useState, useEffect } from 'react';
import { Sparkles, X, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AIPanel } from './AIPanel';

export function GoodLeapAssistant({ accounts = [], borrowerData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isDetached, setIsDetached] = useState(false);

    // Listen for popout window messages
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data?.type === 'AI_PANEL_CLOSED') {
                setIsDetached(false);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Check if popout window is still open
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

    const handleToggle = () => {
        if (isDetached) {
            // Focus the popout window if it exists
            if (window.aiPanelPopout && !window.aiPanelPopout.closed) {
                window.aiPanelPopout.focus();
            } else {
                setIsDetached(false);
                setIsOpen(true);
                setIsMinimized(false);
            }
        } else if (isMinimized) {
            setIsMinimized(false);
        } else {
            setIsOpen(!isOpen);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setIsMinimized(false);
    };

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    // Floating button when panel is closed
    if (!isOpen || isMinimized) {
        return (
            <button
                onClick={handleToggle}
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
                        {isDetached ? 'View in window' : isMinimized ? 'Expand panel' : 'Get AI insights'}
                    </p>
                </div>
                {isDetached && (
                    <div className="ml-2 flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                        <ExternalLink size={12} />
                        <span>Open</span>
                    </div>
                )}
            </button>
        );
    }

    // Render the AIPanel when open
    return (
        <AIPanel
            accounts={accounts}
            borrowerData={borrowerData}
            isOpen={isOpen}
            onClose={handleClose}
            onMinimize={handleMinimize}
            isMinimized={isMinimized}
        />
    );
}
