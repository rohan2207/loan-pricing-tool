import React, { useState, useMemo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
    AI_TOOLS, 
    CATEGORIES, 
    filterTools, 
    filterByCategory,
    getCategoryById,
    getCategoryColorClass 
} from '../../config/aiTools.config';

export function AIToolGrid({ onSelectTool, selectedCategory = 'all' }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(selectedCategory);

    // Filter tools based on search and category
    const filteredTools = useMemo(() => {
        let tools = AI_TOOLS;
        tools = filterByCategory(tools, activeCategory);
        tools = filterTools(tools, searchQuery);
        return tools;
    }, [searchQuery, activeCategory]);

    return (
        <div className="flex flex-col h-full">
            {/* Search Bar */}
            <div className="px-4 pt-4 pb-2">
                <div className="relative">
                    <Search 
                        size={18} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" 
                    />
                    <input
                        type="text"
                        placeholder="Search AI tools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(
                            "w-full pl-10 pr-4 py-2.5 rounded-xl",
                            "bg-[#f5f5f7] border border-black/5",
                            "text-sm text-[#1d1d1f] placeholder-[#86868b]",
                            "focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30",
                            "transition-all"
                        )}
                    />
                </div>
            </div>

            {/* Category Pills */}
            <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                        activeCategory === 'all'
                            ? "bg-[#1d1d1f] text-white"
                            : "bg-black/5 text-[#86868b] hover:bg-black/10"
                    )}
                >
                    All Tools
                </button>
                {CATEGORIES.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                            activeCategory === category.id
                                ? "bg-[#1d1d1f] text-white"
                                : "bg-black/5 text-[#86868b] hover:bg-black/10"
                        )}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            {/* Tool Grid */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
                {filteredTools.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center mb-3">
                            <Search size={24} className="text-[#86868b]" />
                        </div>
                        <p className="text-sm font-medium text-[#1d1d1f]">No tools found</p>
                        <p className="text-xs text-[#86868b] mt-1">
                            Try a different search term
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-3">
                        {filteredTools.map(tool => {
                            const Icon = tool.icon;
                            const category = getCategoryById(tool.category);
                            
                            return (
                                <button
                                    key={tool.id}
                                    onClick={() => onSelectTool(tool)}
                                    className={cn(
                                        "flex flex-col items-center p-4 rounded-2xl",
                                        "bg-white border border-black/5",
                                        "hover:shadow-lg hover:shadow-black/5 hover:border-black/10",
                                        "hover:scale-[1.02] active:scale-[0.98]",
                                        "transition-all duration-200",
                                        "group"
                                    )}
                                >
                                    {/* Icon */}
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                                        "bg-gradient-to-br transition-all",
                                        category?.color === 'blue' && "from-blue-500 to-blue-600",
                                        category?.color === 'purple' && "from-purple-500 to-purple-600",
                                        category?.color === 'green' && "from-green-500 to-green-600",
                                        category?.color === 'amber' && "from-amber-500 to-amber-600",
                                        category?.color === 'teal' && "from-teal-500 to-teal-600",
                                        "group-hover:shadow-lg group-hover:shadow-current/20"
                                    )}>
                                        <Icon size={22} className="text-white" />
                                    </div>

                                    {/* Label */}
                                    <span className="text-sm font-semibold text-[#1d1d1f] text-center leading-tight">
                                        {tool.label}
                                    </span>

                                    {/* Description */}
                                    <span className="text-[10px] text-[#86868b] text-center mt-1 leading-tight line-clamp-2">
                                        {tool.description}
                                    </span>

                                    {/* Category Badge */}
                                    <span className={cn(
                                        "mt-2 px-2 py-0.5 rounded-full text-[9px] font-medium",
                                        getCategoryColorClass(tool.category)
                                    )}>
                                        {category?.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Coming Soon Hint */}
                {filteredTools.length > 0 && filteredTools.length < 6 && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
                                <Sparkles size={20} className="text-purple-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[#1d1d1f]">More tools coming soon</p>
                                <p className="text-xs text-[#86868b]">We're building more AI assistants</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}





