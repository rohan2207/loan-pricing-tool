import React, { useState } from 'react';
import { 
    MessageCircle, 
    ChevronDown,
    Sparkles, 
    LayoutDashboard,
    Phone,
    CreditCard,
    Home,
    Bot,
    Archive
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar({ currentView, onViewChange, activeQuickAction, onQuickActionChange }) {
    const [showArchive, setShowArchive] = useState(false);
    const [showAI, setShowAI] = useState(false);
    
    const handleQuickActionClick = (itemName) => {
        if (activeQuickAction === itemName) {
            onQuickActionChange(null);
        } else {
            onQuickActionChange(itemName);
        }
    };

    return (
        <nav className="fixed left-0 top-0 h-full bg-neutral-d3 shadow-lg z-30 flex flex-col w-56">
            {/* Logo */}
            <div className="border-b border-neutral-d2 py-4 px-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange to-orange-d1 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-white font-bold text-lg">LinkAI</span>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                {/* AI Assistant Section - Collapsed by default */}
                <button
                    onClick={() => setShowAI(!showAI)}
                    className="w-full flex items-center justify-between px-4 py-3 text-purple-400 hover:text-purple-300 text-left"
                >
                    <div className="flex items-center gap-2">
                        <Bot size={14} />
                        <span className="text-xs font-medium uppercase tracking-wider">AI Assistant</span>
                    </div>
                    <ChevronDown size={14} className={cn("transition-transform", showAI && "rotate-180")} />
                </button>
                
                {showAI && (
                    <div className="bg-purple-900/20 py-1">
                        <NavItem 
                            icon={<Phone size={16} />} 
                            label="Call Prep Brief" 
                            active={activeQuickAction === 'Call Prep Brief'} 
                            onClick={() => handleQuickActionClick('Call Prep Brief')} 
                            highlight 
                            small
                        />
                        <NavItem 
                            icon={<CreditCard size={16} />} 
                            label="Liability AI" 
                            active={activeQuickAction === 'Liability AI'} 
                            onClick={() => handleQuickActionClick('Liability AI')} 
                            highlight 
                            small
                        />
                        <NavItem 
                            icon={<Home size={16} />} 
                            label="Property AVM" 
                            active={activeQuickAction === 'Property AVM'} 
                            onClick={() => handleQuickActionClick('Property AVM')} 
                            highlight 
                            small
                        />
                    </div>
                )}

                {/* Divider */}
                <div className="my-3 mx-4 border-t border-neutral-d2" />

                {/* Main Navigation - Only Dashboard */}
                <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => onViewChange('dashboard')} />
                
                {/* Archive / Old Versions - Collapsed by default */}
                <button
                    onClick={() => setShowArchive(!showArchive)}
                    className="w-full flex items-center justify-between px-4 py-2 text-white/40 hover:text-white/60 text-left"
                >
                    <div className="flex items-center gap-3">
                        <Archive size={16} className="opacity-50" />
                        <span className="text-xs">Archive (Old Versions)</span>
                    </div>
                    <ChevronDown size={14} className={cn("transition-transform", showArchive && "rotate-180")} />
                </button>
                
                {showArchive && (
                    <div className="bg-neutral-d2/30 py-1">
                        <NavItem icon={<Sparkles size={16} />} label="Advantage V1" active={currentView === 'advantage'} onClick={() => onViewChange('advantage')} small muted />
                        <NavItem icon={<Sparkles size={16} />} label="Advantage V2" active={currentView === 'advantageV2'} onClick={() => onViewChange('advantageV2')} small muted />
                        <NavItem icon={<Sparkles size={16} />} label="Advantage V3" active={currentView === 'advantageV3'} onClick={() => onViewChange('advantageV3')} small muted />
                        <NavItem icon={<Sparkles size={16} />} label="Advantage V4" active={currentView === 'advantageV4'} onClick={() => onViewChange('advantageV4')} small muted />
                        <NavItem icon={<Sparkles size={16} />} label="Advantage V5" active={currentView === 'advantageV5'} onClick={() => onViewChange('advantageV5')} small muted />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-d2 py-3">
                <NavItem icon={<MessageCircle size={18} />} label="Feedback" />
            </div>
        </nav>
    );
}

function NavItem({ icon, label, active, onClick, highlight, small, muted }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center text-left",
                small ? "px-6 py-1.5" : "px-4 py-2.5",
                muted ? "text-white/40" : "text-white/80",
                active && "bg-white/10 text-white border-l-2 border-orange",
                !active && "hover:bg-white/5 hover:text-white",
                highlight && !active && "text-orange"
            )}
        >
            <span className={cn("mr-3 opacity-70", active && "opacity-100", highlight && !active && "text-orange")}>{icon}</span>
            <span className={cn("font-medium", small ? "text-xs" : "text-sm")}>{label}</span>
        </button>
    );
}
