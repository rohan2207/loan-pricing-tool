import React from 'react';
import { 
    FileText, 
    Calculator, 
    DollarSign, 
    MessageCircle, 
    ChevronLeft, 
    ChevronRight, 
    Sparkles, 
    LayoutDashboard,
    BarChart3,
    FileSearch,
    Send,
    FileCheck,
    Phone,
    CreditCard,
    Home,
    Bot
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar({ currentView, onViewChange, activeQuickAction, onQuickActionChange }) {
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

            {/* Quick Actions Header */}
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-l1 uppercase tracking-wider">Quick Actions</span>
                <ChevronLeft size={16} className="text-neutral-l1" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <NavItem icon={<FileText size={18} />} label="Debt Worksheet" active={activeQuickAction === 'Debt Worksheet'} onClick={() => handleQuickActionClick('Debt Worksheet')} />
                <NavItem icon={<Calculator size={18} />} label="Blended Rate Calculator" active={activeQuickAction === 'Blended Rate Calculator'} onClick={() => handleQuickActionClick('Blended Rate Calculator')} />
                <NavItem icon={<BarChart3 size={18} />} label="Sales Comparables" active={activeQuickAction === 'Sales Comparables'} onClick={() => handleQuickActionClick('Sales Comparables')} />
                <NavItem icon={<FileSearch size={18} />} label="Property Lien Report" active={activeQuickAction === 'Property Lien Report'} onClick={() => handleQuickActionClick('Property Lien Report')} />
                <NavItem icon={<DollarSign size={18} />} label="Quick Quote" active={activeQuickAction === 'Quick Quote'} onClick={() => handleQuickActionClick('Quick Quote')} />

                {/* AI Assistant Section */}
                <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                    <Bot size={14} className="text-purple-400" />
                    <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">AI Assistant</span>
                </div>
                <NavItem 
                    icon={<Phone size={18} />} 
                    label="Call Prep Brief" 
                    active={activeQuickAction === 'Call Prep Brief'} 
                    onClick={() => handleQuickActionClick('Call Prep Brief')} 
                    highlight 
                />
                <NavItem 
                    icon={<CreditCard size={18} />} 
                    label="Liability AI" 
                    active={activeQuickAction === 'Liability AI'} 
                    onClick={() => handleQuickActionClick('Liability AI')} 
                    highlight 
                />
                <NavItem 
                    icon={<Home size={18} />} 
                    label="Property AVM" 
                    active={activeQuickAction === 'Property AVM'} 
                    onClick={() => handleQuickActionClick('Property AVM')} 
                    highlight 
                />

                {/* Divider */}
                <div className="my-3 mx-4 border-t border-neutral-d2" />

                {/* Main Navigation */}
                <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => onViewChange('dashboard')} />
                <NavItem icon={<Sparkles size={18} />} label="GoodLeap Advantage" active={currentView === 'advantage'} onClick={() => onViewChange('advantage')} />
                <NavItem icon={<Sparkles size={18} />} label="GoodLeap Advantage V2" active={currentView === 'advantageV2'} onClick={() => onViewChange('advantageV2')} />
                <NavItem icon={<Sparkles size={18} />} label="GoodLeap Advantage V3" active={currentView === 'advantageV3'} onClick={() => onViewChange('advantageV3')} />
                <NavItem icon={<Sparkles size={18} />} label="GoodLeap Advantage V4" active={currentView === 'advantageV4'} onClick={() => onViewChange('advantageV4')} />
                <NavItem icon={<Sparkles size={18} />} label="GoodLeap Advantage V5" active={currentView === 'advantageV5'} onClick={() => onViewChange('advantageV5')} highlight />

                {/* Action Buttons */}
                <div className="mx-3 mt-3">
                    <button className="w-full flex items-center justify-center gap-2 bg-danger hover:bg-danger-d2 text-white py-3 px-4 rounded-lg font-medium text-sm">
                        <Send size={16} />
                        Send to Figure
                    </button>
                </div>

                <div className="mx-3 mt-2 mb-4">
                    <button className="w-full flex items-center justify-between bg-information-d2 hover:bg-information-d1 text-white py-3 px-4 rounded-lg font-medium text-sm">
                        <div className="flex items-center gap-2">
                            <FileCheck size={16} />
                            Complete 1003
                        </div>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-d2 py-3">
                <NavItem icon={<MessageCircle size={18} />} label="Feedback" />
            </div>
        </nav>
    );
}

function NavItem({ icon, label, active, onClick, highlight }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center px-4 py-2.5 text-white/80 text-left",
                active && "bg-white/10 text-white border-l-2 border-orange",
                !active && "hover:bg-white/5 hover:text-white",
                highlight && !active && "text-orange"
            )}
        >
            <span className={cn("mr-3 opacity-70", active && "opacity-100", highlight && !active && "text-orange")}>{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}
