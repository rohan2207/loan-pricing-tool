import React, { useState } from 'react';
import { Sparkles, Search, ChevronRight, ChevronLeft, Phone, CreditCard, Home, X, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AI_TOOLS, CATEGORIES, filterTools, filterByCategory, getCategoryColorClass } from '../../config/aiTools.config';

/**
 * Permanent AI Panel Component
 * 
 * Shows on the right side of the dashboard:
 * - Expanded: Full AI tools grid (320px width)
 * - Collapsed: Small floating icon (when flyover is open OR user manually collapses)
 */
export function AIPanelPermanent({ 
    isCollapsed, 
    isManuallyCollapsed,
    onExpand, 
    onManualCollapse,
    onSelectTool,
    accounts,
    borrowerData 
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    // Filter tools based on search and category
    let filteredTools = filterByCategory(AI_TOOLS, selectedCategory);
    filteredTools = filterTools(filteredTools, searchQuery);

    // Collapsed state - show floating icon button (either from flyover or manual collapse)
    if (isCollapsed || isManuallyCollapsed) {
        return (
            <button
                onClick={onExpand}
                className="fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1 px-3 py-4 bg-gradient-to-b from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                title="Open AI Assistant"
            >
                <Sparkles size={20} />
                <span className="text-[10px] font-medium uppercase tracking-wide">AI</span>
            </button>
        );
    }

    // Expanded state - full AI tools panel
    return (
        <div className="fixed right-0 top-0 bottom-0 w-[320px] bg-white border-l border-stone-200 shadow-lg z-10 flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 px-4 py-4 border-b border-stone-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold text-stone-800">AI Assistant</h2>
                        <p className="text-[10px] text-stone-500">Select a tool to get started</p>
                    </div>
                    {/* Collapse button */}
                    <button
                        onClick={onManualCollapse}
                        className="p-1.5 rounded-lg hover:bg-stone-200/50 text-stone-400 hover:text-stone-600 transition-colors"
                        title="Collapse panel"
                    >
                        <PanelRightClose size={18} />
                    </button>
                </div>
                
                {/* Search */}
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search tools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
                    />
                </div>
            </div>
            
            {/* Category Filters */}
            <div className="flex-shrink-0 px-4 py-2 border-b border-stone-100 bg-stone-50">
                <div className="flex gap-1.5 overflow-x-auto">
                    <CategoryPill 
                        label="All" 
                        active={selectedCategory === 'all'} 
                        onClick={() => setSelectedCategory('all')} 
                    />
                    {CATEGORIES.map(cat => (
                        <CategoryPill 
                            key={cat.id}
                            label={cat.label} 
                            active={selectedCategory === cat.id} 
                            onClick={() => setSelectedCategory(cat.id)} 
                        />
                    ))}
                </div>
            </div>
            
            {/* Tools Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                {filteredTools.length === 0 ? (
                    <div className="text-center py-8 text-stone-400">
                        <Search size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No tools found</p>
                        <p className="text-xs">Try a different search</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredTools.map(tool => (
                            <ToolCard 
                                key={tool.id}
                                tool={tool}
                                onClick={() => onSelectTool(tool.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <div className="flex-shrink-0 px-4 py-3 border-t border-stone-200 bg-stone-50">
                <p className="text-[10px] text-stone-400 text-center">
                    AI-generated content. Always verify important details.
                </p>
            </div>
        </div>
    );
}

// Category filter pill
function CategoryPill({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors",
                active 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "bg-white text-stone-500 hover:bg-stone-100"
            )}
        >
            {label}
        </button>
    );
}

// Tool card component
function ToolCard({ tool, onClick }) {
    const IconComponent = tool.icon;
    
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-xl hover:border-indigo-300 hover:shadow-md hover:bg-indigo-50/30 transition-all group text-left"
        >
            <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                getCategoryColorClass(tool.category)
            )}>
                <IconComponent size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-800 text-sm">{tool.label}</p>
                <p className="text-xs text-stone-500 truncate">{tool.description}</p>
            </div>
            <ChevronRight size={16} className="text-stone-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
        </button>
    );
}

export default AIPanelPermanent;

