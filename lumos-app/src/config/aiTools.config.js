/**
 * AI Tools Registry
 * 
 * To add a new AI tool:
 * 1. Create the component in src/components/dashboard/tools/
 * 2. Add an entry to AI_TOOLS array below
 * 3. Done - the grid will automatically include it
 */

import { 
    Phone, 
    CreditCard, 
    Home, 
    TrendingUp, 
    Calculator, 
    MessageSquare,
    FileText,
    BarChart3,
    Shield,
    DollarSign,
    Users,
    Clock
} from 'lucide-react';

// Tool category definitions
export const CATEGORIES = [
    { id: 'conversation', label: 'Conversation', color: 'blue' },
    { id: 'analysis', label: 'Analysis', color: 'purple' },
    { id: 'valuation', label: 'Valuation', color: 'green' },
    { id: 'charts', label: 'Charts', color: 'teal' },
    { id: 'compliance', label: 'Compliance', color: 'amber' }
];

// Get category by ID
export const getCategoryById = (id) => CATEGORIES.find(c => c.id === id);

// AI Tools registry
export const AI_TOOLS = [
    {
        id: 'call-prep',
        label: 'Call Prep',
        description: 'Customer briefing for calls',
        icon: Phone,
        category: 'conversation',
        component: 'GoodLeapSummary',
        apiEndpoint: '/api/ai/call-prep',
        keywords: ['call', 'prep', 'brief', 'customer', 'conversation']
    },
    {
        id: 'liability',
        label: 'Liability AI',
        description: 'Debt consolidation analysis',
        icon: CreditCard,
        category: 'analysis',
        component: 'LiabilityAI',
        apiEndpoint: '/api/ai/liability',
        keywords: ['liability', 'debt', 'consolidation', 'payoff', 'credit']
    },
    {
        id: 'avm',
        label: 'Property AVM',
        description: 'Property valuation analysis',
        icon: Home,
        category: 'valuation',
        component: 'GoodLeapAVM',
        apiEndpoint: '/api/ai/avm',
        keywords: ['avm', 'property', 'value', 'valuation', 'home', 'aus']
    },
    {
        id: 'sales-coach',
        label: 'Sales Coach',
        description: 'Objection handling & benefit calc',
        icon: MessageSquare,
        category: 'conversation',
        component: 'SalesCoach',
        apiEndpoint: '/api/ai/sales-coach',
        keywords: ['objection', 'sales', 'coach', 'benefit', 'calculation', 'response', 'handle']
    },
    // Chart tools - visual presentations
    {
        id: 'debt-worksheet',
        label: 'Debt Worksheet',
        description: 'Debt consolidation breakdown',
        icon: CreditCard,
        category: 'charts',
        component: 'ChartPreview',
        chartType: 'debt-consolidation',
        keywords: ['debt', 'consolidation', 'worksheet', 'payoff', 'chart']
    },
    {
        id: 'payment-savings',
        label: 'Payment Savings',
        description: 'Current vs proposed comparison',
        icon: TrendingUp,
        category: 'charts',
        component: 'ChartPreview',
        chartType: 'payment-savings',
        keywords: ['payment', 'savings', 'comparison', 'chart', 'monthly']
    },
    {
        id: 'cash-back',
        label: 'Cash Back',
        description: 'Cash out calculator',
        icon: DollarSign,
        category: 'charts',
        component: 'ChartPreview',
        chartType: 'cash-back',
        keywords: ['cash', 'back', 'cashout', 'money', 'calculator', 'chart']
    },
    {
        id: 'accelerated-payoff',
        label: 'Accelerated Payoff',
        description: 'Mortgage payoff acceleration',
        icon: Clock,
        category: 'charts',
        component: 'ChartPreview',
        chartType: 'accelerated-payoff',
        keywords: ['accelerated', 'payoff', 'mortgage', 'early', 'principal', 'chart']
    }
    // Future tools - just add entries here:
    // {
    //     id: 'rate-compare',
    //     label: 'Rate Compare',
    //     description: 'Compare rate scenarios',
    //     icon: TrendingUp,
    //     category: 'analysis',
    //     component: 'RateCompare',
    //     apiEndpoint: '/api/ai/rate-compare',
    //     keywords: ['rate', 'compare', 'scenario', 'apr']
    // },
    // {
    //     id: 'dti-calc',
    //     label: 'DTI Calculator',
    //     description: 'Debt-to-income analysis',
    //     icon: Calculator,
    //     category: 'analysis',
    //     component: 'DTICalculator',
    //     apiEndpoint: '/api/ai/dti',
    //     keywords: ['dti', 'debt', 'income', 'ratio', 'qualify']
    // },
    // {
    //     id: 'objection-handler',
    //     label: 'Objection Handler',
    //     description: 'Handle customer objections',
    //     icon: MessageSquare,
    //     category: 'conversation',
    //     component: 'ObjectionHandler',
    //     apiEndpoint: '/api/ai/objection',
    //     keywords: ['objection', 'response', 'handle', 'concern']
    // }
];

// Get tool by ID
export const getToolById = (id) => AI_TOOLS.find(t => t.id === id);

// Filter tools by search query
export const filterTools = (tools, query) => {
    if (!query || query.trim() === '') return tools;
    
    const lowerQuery = query.toLowerCase().trim();
    return tools.filter(tool => 
        tool.label.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.keywords.some(k => k.includes(lowerQuery)) ||
        tool.category.includes(lowerQuery)
    );
};

// Filter tools by category
export const filterByCategory = (tools, categoryId) => {
    if (!categoryId || categoryId === 'all') return tools;
    return tools.filter(tool => tool.category === categoryId);
};

// Get category color class
export const getCategoryColorClass = (categoryId) => {
    const category = getCategoryById(categoryId);
    if (!category) return 'bg-gray-100 text-gray-600';
    
    const colors = {
        blue: 'bg-blue-100 text-blue-700',
        purple: 'bg-purple-100 text-purple-700',
        green: 'bg-green-100 text-green-700',
        teal: 'bg-teal-100 text-teal-700',
        amber: 'bg-amber-100 text-amber-700'
    };
    
    return colors[category.color] || 'bg-gray-100 text-gray-600';
};





