import React, { useState } from 'react';
import { 
    User,
    CreditCard,
    Calculator,
    Home,
    FileText,
    ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar({ currentView, onViewChange, activeQuickAction, onQuickActionChange }) {
    const [expandedSection, setExpandedSection] = useState('cf-liabilities');
    
    const handleNavClick = (view) => {
        onViewChange(view);
    };

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <nav className="fixed left-0 top-0 h-full bg-[#F8F7FC] shadow-sm z-30 flex flex-col w-44 border-r border-[#E8E6F0]">
            {/* Logo */}
            <div className="py-6 px-5">
                <div className="flex items-baseline gap-0">
                    <span className="text-[#1a1a2e] font-bold text-xl tracking-tight">L</span>
                    <span className="text-[#1a1a2e] font-bold text-xl tracking-tight">I</span>
                    <span className="text-[#1a1a2e] font-bold text-xl tracking-tight">N</span>
                    <span className="text-[#1a1a2e] font-bold text-xl tracking-tight">K</span>
                    <span className="text-[#1a1a2e] font-bold text-xl tracking-tight">A</span>
                    <span className="text-[#1a1a2e] font-bold text-xl tracking-tight">!</span>
                </div>
                <p className="text-[#E07A5F] text-[10px] font-medium tracking-wide mt-0.5">goodleap</p>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
                {/* CF Liabilities Section */}
                <NavSection 
                    label="CF Liabilities" 
                    icon={<CreditCard size={16} />}
                    expanded={expandedSection === 'cf-liabilities'}
                    onClick={() => toggleSection('cf-liabilities')}
                >
                    <NavItem 
                        label="Liabilities" 
                        active={currentView === 'dashboard'} 
                        onClick={() => handleNavClick('dashboard')} 
                    />
                </NavSection>

                {/* Property Section */}
                <NavSection 
                    label="Property" 
                    icon={<Home size={16} />}
                    expanded={expandedSection === 'property-section'}
                    onClick={() => toggleSection('property-section')}
                >
                    <NavItem 
                        label="Property" 
                        active={currentView === 'property'} 
                        onClick={() => handleNavClick('property')} 
                    />
                </NavSection>

                {/* Figure Section */}
                <NavSection 
                    label="Figure" 
                    icon={<FileText size={16} />}
                    expanded={expandedSection === 'figure-section'}
                    onClick={() => toggleSection('figure-section')}
                >
                    <NavItem 
                        label="Figure" 
                        active={currentView === 'figure'} 
                        onClick={() => handleNavClick('figure')} 
                    />
                </NavSection>

                {/* Short 1003 Section */}
                <NavSection 
                    label="Short 1003" 
                    icon={<FileText size={16} />}
                    expanded={expandedSection === 'short1003-section'}
                    onClick={() => toggleSection('short1003-section')}
                >
                    <NavItem 
                        label="Short 1003" 
                        active={currentView === 'short1003'} 
                        onClick={() => handleNavClick('short1003')} 
                    />
                </NavSection>

                {/* Pricing Section */}
                <NavSection 
                    label="Pricing" 
                    icon={<Calculator size={16} />}
                    expanded={expandedSection === 'pricing'}
                    onClick={() => toggleSection('pricing')}
                >
                    <NavItem 
                        label="Calculators" 
                        active={currentView === 'pricing'} 
                        onClick={() => handleNavClick('pricing')} 
                    />
                </NavSection>
            </div>

            {/* User at Bottom */}
            <div className="border-t border-[#E8E6F0] p-4">
                <div className="flex items-center gap-2 text-[#1a1a2e]">
                    <div className="w-6 h-6 rounded-full bg-[#E8E6F0] flex items-center justify-center">
                        <User size={14} className="text-[#6B6B7B]" />
                    </div>
                    <span className="text-sm font-medium text-[#6B6B7B]">{'{Name}'}</span>
                </div>
            </div>
        </nav>
    );
}

function NavSection({ label, icon, expanded, onClick, children }) {
    return (
        <div className="mb-1">
            <button
                onClick={onClick}
                className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    expanded 
                        ? "bg-[#EFEDF5] text-[#1a1a2e]" 
                        : "text-[#6B6B7B] hover:bg-[#EFEDF5] hover:text-[#1a1a2e]"
                )}
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <span>{label}</span>
                </div>
                <ChevronDown 
                    size={14} 
                    className={cn("transition-transform", expanded && "rotate-180")} 
                />
            </button>
            {expanded && (
                <div className="mt-1 ml-3 space-y-0.5">
                    {children}
                </div>
            )}
        </div>
    );
}

function NavItem({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center text-left px-3 py-1.5 rounded-md text-sm transition-colors",
                active 
                    ? "bg-[#1a1a2e] text-white font-medium" 
                    : "text-[#6B6B7B] hover:bg-[#EFEDF5] hover:text-[#1a1a2e]"
            )}
        >
            <span>{label}</span>
        </button>
    );
}
