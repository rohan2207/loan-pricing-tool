import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { 
    RefreshCw, 
    MessageCircle,
    Sparkles,
    AlertCircle,
    Bot,
    Lightbulb,
    HelpCircle,
    Calculator,
    ChevronRight,
    ChevronLeft,
    Copy,
    Check,
    TrendingUp,
    DollarSign,
    Percent,
    CreditCard,
    Target
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { sendMessage, buildLoanScenario, CONVERSATION_STARTERS } from '../../services/salesCoachLLM';
import '../../styles/bento.css';

// ============================================================
// FORMATTED RESPONSE RENDERER
// ============================================================
function FormattedResponse({ text }) {
    // Parse the response into structured sections
    const sections = useMemo(() => {
        if (!text) return [];
        
        const lines = text.split('\n');
        const parsed = [];
        let currentSection = null;
        let currentBullets = [];
        
        const flushBullets = () => {
            if (currentBullets.length > 0) {
                parsed.push({ type: 'bullets', items: [...currentBullets] });
                currentBullets = [];
            }
        };
        
        const flushSection = () => {
            flushBullets();
            if (currentSection) {
                parsed.push(currentSection);
                currentSection = null;
            }
        };
        
        lines.forEach(line => {
            const trimmed = line.trim();
            
            // Skip empty lines
            if (!trimmed) {
                flushBullets();
                return;
            }
            
            // Headers (## or ###)
            if (trimmed.startsWith('###')) {
                flushSection();
                parsed.push({ type: 'subheader', text: trimmed.replace(/^#+\s*/, '') });
                return;
            }
            if (trimmed.startsWith('##')) {
                flushSection();
                parsed.push({ type: 'header', text: trimmed.replace(/^#+\s*/, '') });
                return;
            }
            if (trimmed.startsWith('#')) {
                flushSection();
                parsed.push({ type: 'header', text: trimmed.replace(/^#+\s*/, '') });
                return;
            }
            
            // Numbered items (1. 2. 3. etc)
            if (/^\d+\.\s/.test(trimmed)) {
                currentBullets.push({ text: trimmed.replace(/^\d+\.\s*/, ''), numbered: true });
                return;
            }
            
            // Bullet points
            if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
                currentBullets.push({ text: trimmed.replace(/^[-•*]\s*/, ''), numbered: false });
                return;
            }
            
            // Regular paragraph
            flushBullets();
            parsed.push({ type: 'paragraph', text: trimmed });
        });
        
        flushSection();
        return parsed;
    }, [text]);
    
    // Format text with highlights for numbers, percentages, and bold
    const formatText = (text) => {
        if (!text) return null;
        
        // Clean up any LaTeX notation that slipped through
        let cleanText = text
            // Remove inline LaTeX delimiters first: \( ... \) or $ ... $
            .replace(/\\\(\s*/g, '')
            .replace(/\s*\\\)/g, '')
            // Handle \frac{numerator}{denominator} -> simplified
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, (match, num, denom) => {
                // Try to simplify: if it's balance × rate / 12, just show monthly amount
                if (denom === '12') {
                    return `(${num.replace(/\\times/g, '×')} ÷ 12)`;
                }
                return `(${num.replace(/\\times/g, '×')} ÷ ${denom})`;
            })
            .replace(/\\times/g, '×')       // \times -> ×
            .replace(/\\\$/g, '$')          // \$ -> $
            .replace(/\\%/g, '%')           // \% -> %
            .replace(/\\ /g, ' ')           // Escaped spaces
            .replace(/\s*=\s*\\/g, ' = ')   // Clean up = \
            .replace(/\s+/g, ' ')           // Collapse multiple spaces
            .trim();
        
        // Split by bold markers first
        const parts = cleanText.split(/(\*\*[^*]+\*\*)/g);
        
        return parts.map((part, i) => {
            // Bold text
            if (part.startsWith('**') && part.endsWith('**')) {
                const inner = part.slice(2, -2);
                return <strong key={i} className="font-semibold text-[#1d1d1f]">{formatText(inner)}</strong>;
            }
            
            // Highlight dollar amounts
            const withDollars = part.split(/(\$[\d,]+(?:\.\d{2})?(?:\/mo|\/yr|\/month|\/year)?)/g);
            
            return withDollars.map((chunk, j) => {
                if (chunk.match(/^\$[\d,]+/)) {
                    return (
                        <span key={`${i}-${j}`} className="inline-flex items-center gap-0.5 font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {chunk}
                        </span>
                    );
                }
                
                // Highlight percentages
                const withPercents = chunk.split(/(\d+\.?\d*%)/g);
                return withPercents.map((pChunk, k) => {
                    if (pChunk.match(/^\d+\.?\d*%$/)) {
                        return (
                            <span key={`${i}-${j}-${k}`} className="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                {pChunk}
                            </span>
                        );
                    }
                    return pChunk;
                });
            });
        });
    };
    
    // Get icon for section based on content
    const getSectionIcon = (text) => {
        const lower = text.toLowerCase();
        if (lower.includes('rate') || lower.includes('interest')) return <Percent size={14} />;
        if (lower.includes('payment') || lower.includes('cash') || lower.includes('savings')) return <DollarSign size={14} />;
        if (lower.includes('credit') || lower.includes('card')) return <CreditCard size={14} />;
        if (lower.includes('opportunity') || lower.includes('benefit')) return <TrendingUp size={14} />;
        if (lower.includes('talking') || lower.includes('point')) return <Target size={14} />;
        return <Lightbulb size={14} />;
    };
    
    return (
        <div className="space-y-4">
            {sections.map((section, idx) => {
                switch (section.type) {
                    case 'header':
                        return (
                            <div key={idx} className="flex items-center gap-2 pt-2">
                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white">
                                    {getSectionIcon(section.text)}
                                </div>
                                <h3 className="font-semibold text-[#1d1d1f]">{section.text}</h3>
                            </div>
                        );
                    
                    case 'subheader':
                        return (
                            <div key={idx} className="flex items-center gap-2 pt-1">
                                <div className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center text-stone-500">
                                    {getSectionIcon(section.text)}
                                </div>
                                <h4 className="font-medium text-sm text-[#1d1d1f]">{section.text}</h4>
                            </div>
                        );
                    
                    case 'bullets':
                        return (
                            <div key={idx} className="bg-stone-50 rounded-xl p-4 space-y-2">
                                {section.items.map((item, i) => (
                                    <div key={i} className="flex gap-3">
                                        <span className={cn(
                                            "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium",
                                            item.numbered 
                                                ? "bg-orange-100 text-orange-600" 
                                                : "bg-stone-200 text-stone-500"
                                        )}>
                                            {item.numbered ? i + 1 : '•'}
                                        </span>
                                        <p className="text-sm text-[#1d1d1f] leading-relaxed flex-1">
                                            {formatText(item.text)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        );
                    
                    case 'paragraph':
                        return (
                            <p key={idx} className="text-sm text-[#1d1d1f] leading-relaxed">
                                {formatText(section.text)}
                            </p>
                        );
                    
                    default:
                        return null;
                }
            })}
        </div>
    );
}

export function SalesCoach({ 
    accounts = [], 
    borrowerData, 
    advantageData = null,
    onClose, 
    embedded = false, 
    autoLoad = false,
    cachedData = null 
}) {
    const [response, setResponse] = useState(null); // Single response, not conversation
    const [selectedPrompt, setSelectedPrompt] = useState(null); // Which starter was clicked
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const contentRef = useRef(null);

    // Build the loan scenario context from available data
    const loanScenario = useMemo(() => {
        return buildLoanScenario(accounts, borrowerData, advantageData);
    }, [accounts, borrowerData, advantageData]);

    // Scroll to top when response arrives
    useEffect(() => {
        if (response) {
            contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [response]);

    // Handle clicking a conversation starter
    const handleStarterClick = useCallback(async (starter) => {
        setSelectedPrompt(starter);
        setIsLoading(true);
        setError(null);
        setResponse(null);

        try {
            // Send single message (not a conversation)
            const result = await sendMessage(
                [{ role: 'user', content: starter.prompt }], 
                loanScenario
            );
            setResponse(result.message);
        } catch (err) {
            console.error('Failed to get response:', err);
            setError(err.message || 'Failed to get response');
        } finally {
            setIsLoading(false);
        }
    }, [loanScenario]);

    // Go back to starters
    const handleBack = useCallback(() => {
        setResponse(null);
        setSelectedPrompt(null);
        setError(null);
    }, []);

    // Copy response to clipboard
    const handleCopy = useCallback(() => {
        if (!response) return;
        navigator.clipboard.writeText(response);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [response]);

    const hasResponse = !!response || isLoading;

    return (
        <div className="h-full flex flex-col bg-[#f5f5f7]">
            {/* Header - hidden when embedded */}
            {!embedded && (
                <div className="px-6 py-5 bg-white border-b border-black/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {hasResponse && (
                                <button 
                                    onClick={handleBack}
                                    className="p-2 -ml-2 hover:bg-stone-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft size={20} className="text-[#86868b]" />
                                </button>
                            )}
                            <div className="bento-icon bento-icon-orange">
                                <MessageCircle size={22} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[#1d1d1f] tracking-tight">Sales Coach</h1>
                                <p className="text-sm text-[#86868b]">
                                    {selectedPrompt ? selectedPrompt.label : 'Objection Handling & Benefit Calculation'}
                                </p>
                            </div>
                        </div>
                        {hasResponse && response && (
                            <button 
                                onClick={handleCopy}
                                className="bento-btn bento-btn-secondary"
                                title="Copy response"
                            >
                                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* AI Notice */}
            <div className={cn("bg-amber-50 border-b border-amber-100 flex items-center justify-between", embedded ? "px-4 py-2" : "px-6 py-2")}>
                <p className="text-xs text-amber-700">
                    <span className="font-semibold">AI Sales Coach</span> - Uses your loan scenario data for personalized guidance
                </p>
                {embedded && hasResponse && (
                    <button onClick={handleBack} className="p-1.5 hover:bg-amber-100 rounded-lg transition-colors">
                        <ChevronLeft size={14} className="text-amber-700" />
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div ref={contentRef} className="flex-1 overflow-y-auto">
                {!hasResponse ? (
                    // Starter selection view
                    <div className="p-6 space-y-6">
                        {/* Welcome */}
                        <div className="text-center py-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-4">
                                <Sparkles size={28} className="text-white" />
                            </div>
                            <h2 className="text-lg font-semibold text-[#1d1d1f] mb-2">How can I help you today?</h2>
                            <p className="text-sm text-[#86868b] max-w-md mx-auto">
                                Select a topic below for AI-powered guidance using your client's loan scenario.
                            </p>
                        </div>

                        {/* Objection Handling Starters */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center">
                                    <HelpCircle size={14} className="text-rose-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-[#1d1d1f]">Handle Objections</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {CONVERSATION_STARTERS.objections.map((starter) => (
                                    <button
                                        key={starter.id}
                                        onClick={() => handleStarterClick(starter)}
                                        disabled={isLoading}
                                        className="p-3 bg-white rounded-xl border border-black/5 text-left hover:border-rose-200 hover:bg-rose-50/50 transition-all group disabled:opacity-50"
                                    >
                                        <p className="text-sm font-medium text-[#1d1d1f] group-hover:text-rose-700">
                                            {starter.label}
                                        </p>
                                        <ChevronRight size={14} className="text-[#86868b] group-hover:text-rose-500 mt-1" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Benefit Calculation Starters */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center">
                                    <Calculator size={14} className="text-teal-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-[#1d1d1f]">Calculate Benefits</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {CONVERSATION_STARTERS.benefits.map((starter) => (
                                    <button
                                        key={starter.id}
                                        onClick={() => handleStarterClick(starter)}
                                        disabled={isLoading}
                                        className="p-3 bg-white rounded-xl border border-black/5 text-left hover:border-teal-200 hover:bg-teal-50/50 transition-all group disabled:opacity-50"
                                    >
                                        <p className="text-sm font-medium text-[#1d1d1f] group-hover:text-teal-700">
                                            {starter.label}
                                        </p>
                                        <ChevronRight size={14} className="text-[#86868b] group-hover:text-teal-500 mt-1" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Scenario Summary */}
                        {loanScenario.debtsBeingPaidOff?.length > 0 && (
                            <div className="p-4 bg-white rounded-xl border border-black/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb size={14} className="text-amber-500" />
                                    <p className="text-xs font-semibold text-[#86868b] uppercase tracking-wide">Loaded Scenario</p>
                                </div>
                                <p className="text-sm text-[#1d1d1f]">
                                    {loanScenario.debtsBeingPaidOff.length} debts selected for payoff
                                    {loanScenario.comparison?.notYetPriced ? (
                                        <span className="text-amber-600 font-medium">
                                            {' '}(${loanScenario.comparison.debtsPaymentToEliminate?.toLocaleString() || 0}/mo in payments - price loan for full comparison)
                                        </span>
                                    ) : loanScenario.comparison?.monthlySavings > 0 ? (
                                        <span className="text-teal-600 font-semibold">
                                            {' '}(saving ${loanScenario.comparison.monthlySavings.toLocaleString()}/mo)
                                        </span>
                                    ) : null}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    // Response view (one-shot)
                    <div className="p-6">
                        {/* Loading state */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4 animate-pulse">
                                    <Sparkles size={28} className="text-white" />
                                </div>
                                <p className="text-lg font-semibold text-[#1d1d1f]">Generating Response...</p>
                                <p className="text-sm text-[#86868b] mt-1">{selectedPrompt?.label}</p>
                            </div>
                        )}

                        {/* Error state */}
                        {error && !isLoading && (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
                                    <AlertCircle size={28} className="text-red-500" />
                                </div>
                                <p className="text-lg font-semibold text-red-600 mb-2">Failed to Generate</p>
                                <p className="text-sm text-[#86868b] mb-4">{error}</p>
                                <button 
                                    onClick={() => handleStarterClick(selectedPrompt)} 
                                    className="bento-btn bento-btn-primary"
                                >
                                    <RefreshCw size={16} /> Retry
                                </button>
                            </div>
                        )}

                        {/* Response content */}
                        {response && !isLoading && (
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                                        <Bot size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#1d1d1f]">AI Sales Coach</p>
                                        <p className="text-xs text-[#86868b]">{selectedPrompt?.label}</p>
                                    </div>
                                </div>

                                {/* Formatted response */}
                                <div className="bento-card p-5">
                                    <FormattedResponse text={response} />
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleBack}
                                        className="flex-1 py-3 bg-stone-100 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft size={16} />
                                        Try Another Topic
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all flex items-center gap-2 shadow-md"
                                    >
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

