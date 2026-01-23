import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { MockScenarios } from './components/dashboard/MockScenarios';
import { Tabs } from './components/dashboard/Tabs';

import { LiabilitiesTab } from './components/dashboard/LiabilitiesTab';
import { DebtWorksheet } from './components/dashboard/DebtWorksheet';
import { QuickQuote } from './components/dashboard/QuickQuote';
import { AIPopoutWindow } from './components/dashboard/AIPopoutWindow';
import { GoodLeapSummary } from './components/dashboard/GoodLeapSummary';
import { LiabilityAI } from './components/dashboard/LiabilityAI';
import { GoodLeapAVM } from './components/dashboard/GoodLeapAVM';
import { SalesCoach } from './components/dashboard/SalesCoach';
import { GoodLeapAdvantage } from './components/advantage/GoodLeapAdvantage';
import { GoodLeapAdvantageV2 } from './components/advantage/GoodLeapAdvantageV2';
import { GoodLeapAdvantageV3 } from './components/advantage/GoodLeapAdvantageV3';
import { GoodLeapAdvantageV4 } from './components/advantage/GoodLeapAdvantageV4';
import { GoodLeapAdvantageV5 } from './components/advantage/GoodLeapAdvantageV5';
import { ChartPreview } from './components/advantage/ChartPreview';
import { ProposalPreview } from './components/advantage/ProposalPreview';
import { GoodLeapAdvantageTabs } from './components/dashboard/GoodLeapAdvantageTabs';
import { PricingCalculator } from './components/dashboard/PricingCalculator';
import { PropertyTabs } from './components/dashboard/PropertyTabs';
import { FigureView } from './components/dashboard/FigureView';
import { Short1003View } from './components/dashboard/Short1003View';
import { LoanDetailsPopout } from './components/dashboard/LoanDetailsPopout';
import { PropertyTester } from './components/dashboard/PropertyTester';

// Initial accounts data
const initialAccounts = [
  { id: 1, type: 'Borrower', account: '401...', creditor: 'REGIONS BANK', accountType: 'Mortgage', reported: ['EQ', 'EX', 'TU'], limit: '-', startDate: '2012-04-25', balance: '$247,500', payment: '$1,710', util: '-', rate: '3.75%', willPay: true },
  { id: 2, type: 'Borrower', account: '', creditor: 'PENFED', accountType: 'Mortgage', reported: ['TU'], limit: '$15,000', startDate: '2018-11-01', balance: '$180,000', payment: '$1,250', util: '-', rate: '4.25%', willPay: true },
  { id: 3, type: 'Borrower', account: 'AU...', creditor: 'CHASE AUTO', accountType: 'Installment', reported: ['EX', 'TU'], limit: '-', startDate: '2022-06-01', balance: '$18,000', payment: '$450', util: '-', rate: '6.9%', willPay: true },
  { id: 4, type: 'Borrower', account: 'L2...', creditor: '5/3 DIVIDEND', accountType: 'Installment', reported: ['EX', 'TU'], limit: '-', startDate: '2021-09-05', balance: '$12,645', payment: '$121', util: '-', rate: '5.5%', willPay: true },
  { id: 5, type: 'Co-Borrower', account: '517...', creditor: 'WFBNA AUTO', accountType: 'Installment', reported: ['EQ', 'EX', 'TU'], limit: '-', startDate: '2021-08-12', balance: '$11,219', payment: '$446', util: '-', rate: '7.2%', willPay: true },
  { id: 6, type: 'Borrower', account: '577...', creditor: 'WFBNA CARD', accountType: 'Revolving', reported: ['EQ', 'EX', 'TU'], limit: '$11,500', startDate: '2024-08-22', balance: '$10,200', payment: '$154', util: '88.70%', rate: '24.99%', willPay: true },
  { id: 7, type: 'Borrower', account: '123...', creditor: 'AMERICAN EXPRESS', accountType: 'Revolving', reported: ['EQ'], limit: '$10,000', startDate: '2020-01-15', balance: '$2,500', payment: '$0', util: '-', rate: '19.99%', willPay: true },
  { id: 8, type: 'Borrower', account: 'CIT...', creditor: 'CITI BANK', accountType: 'Revolving', reported: ['TU'], limit: '$2,000', startDate: '2023-01-01', balance: '$750', payment: '$0', util: '-', rate: '22.99%', willPay: true },
  { id: 9, type: 'Borrower', account: 'XXX...', creditor: 'DISCOVER CARD', accountType: 'Revolving', reported: ['EQ', 'EX'], limit: '$5,000', startDate: '2018-06-01', balance: '$500', payment: '$25', util: '-', rate: '18.99%', willPay: true },
];

// Comprehensive borrower data
const borrowerData = {
  // Borrower Info
  borrower: {
    name: 'John Smith',
    loanNumber: 'MOCK-LOAN-001',
    loanAmount: 425000,
    location: 'Austin, TX'
  },
  // Credit Scores
  creditScores: {
    borrower: 608,
    coBorrower: 650,
    reportDate: '2025-01-14'
  },
  // Credit Utilization
  creditUtilization: {
    totalLimit: 31500,
    totalBalance: 13950,
    available: 17550,
    utilizationPercent: 44.29,
    delinquencies: 0
  },
  // Consumer Finance / GoodLeap Loan
  consumerFinance: {
    product: 'Solar Installation',
    loanNumber: 'CF-1234567',
    unpaidBalance: 42000,
    payment: 0,
    rate: 6.75,
    status: 'Active',
    originationDate: '2022-03-15' // ~3 years ago
  },
  // Available Equity
  availableEquity: {
    cashOut80: 0,
    heloc95: 77188
  },
  // Property Data
  property: {
    address: '2116 Shrewsbury Dr',
    unit: '',
    city: 'McKinney',
    state: 'TX',
    zip: '75071-4420',
    county: 'Collin County',
    apn: 'R-11106-00M-0210-1',
    fipsCode: '48085',
    legalDescription: 'AUBURN HILLS PHASE 1A (CMC), BLOCK M, LOT 21',
    owners: 'John Robert Smith / Jane Marie Smith',
    ownershipRights: 'Joint Tenancy',
    // Valuation
    purchasePrice: 523700,
    purchaseDate: 'Sep 15, 2017',
    avmValue: 785000,
    avmDate: 'May 2025',
    confidence: 93,
    stdDeviation: 5,
    avmLow: 732000,
    avmHigh: 842000,
    marketValue: 771565,
    landValue: 180000,
    improvementValue: 591565,
    totalAssessed: 771565,
    annualTax: 12182.44,
    taxYear: 2024,
    // Appreciation
    appreciation: 49.9,
    currentEquity: 357500,
    pricePerSqFt: 204,
    ownershipYears: 9,
    // Building Details
    yearBuilt: 2017,
    effectiveYear: 2017,
    livingArea: 3850,
    totalBuilding: 4258,
    groundFloor: 2532,
    garage: 408,
    bedrooms: 5,
    bathrooms: 4.5,
    totalRooms: 11,
    stories: 2,
    construction: 'Wood Frame',
    exterior: 'Brick'
  },
  // Sales Comparables
  comparables: [
    { address: '2104 Shrewsbury Dr', price: 765000, sqFt: 3720, pricePerSqFt: 206, daysAgo: 15, status: 'Sold' },
    { address: '2089 Auburn Hills Blvd', price: 798000, sqFt: 3900, pricePerSqFt: 205, daysAgo: 22, status: 'Sold' },
    { address: '1955 Canyon Creek Dr', price: 749000, sqFt: 3650, pricePerSqFt: 205, daysAgo: 8, status: 'Pending' }
  ]
};

// Template chart data for testing - used by chart quick actions
const TEMPLATE_CHART_DATA = {
  isTemplated: true,  // Flag to show testing banner
  // Payment breakdown
  currentMortgagePI: 1710,
  currentEscrow: 570,
  currentMI: 0,
  debtsPaidOff: 2446,
  debtsRemaining: 154,
  proposedPI: 3499,
  proposedEscrow: 570,
  proposedMI: 0,
  // Loan details
  newLoanAmount: 588750,
  amt: 588750,
  cashout: 63436,
  debtsPayoff: 525314,
  // Sample accounts for debt worksheet
  accounts: [
    { creditor: 'REGIONS BANK', accountType: 'Mortgage', payment: '$1,710', balance: '$247,500', willPay: true },
    { creditor: 'PENFED', accountType: 'Mortgage', payment: '$1,250', balance: '$180,000', willPay: true },
    { creditor: 'CHASE AUTO', accountType: 'Auto', payment: '$450', balance: '$18,000', willPay: true },
    { creditor: '5/3 DIVIDEND', accountType: 'Installment', payment: '$121', balance: '$12,645', willPay: true },
    { creditor: 'WFBNA AUTO', accountType: 'Installment', payment: '$446', balance: '$11,219', willPay: true },
    { creditor: 'WFBNA CARD', accountType: 'Revolving', payment: '$154', balance: '$10,200', willPay: true },
  ]
};

// Map AI tool IDs from config to quick action names
const AI_TOOL_MAPPING = {
  'call-prep': 'Call Prep Brief',
  'liability': 'Liability AI',
  'avm': 'Property AVM',
  'sales-coach': 'Sales Coach',
  'debt-worksheet': 'Debt Worksheet Chart',
  'payment-savings': 'Payment Savings Chart',
  'cash-back': 'Cash Back Chart',
  'accelerated-payoff': 'Accelerated Payoff Chart'
};

function App() {
  // Check if this is a popout window
  const urlParams = new URLSearchParams(window.location.search);
  const isPopout = urlParams.get('popout') === 'ai';
  const isLoanDetailsPopout = urlParams.get('view') === 'loan-details-popout';

  // Level 1 navigation - which full page view
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Dashboard tabs
  const [activeTab, setActiveTab] = useState('Liabilities');
  
  // Quick Actions flyovers
  const [activeQuickAction, setActiveQuickAction] = useState(null);
  
  // Pricing mode - transforms liabilities view into GoodLeap Advantage
  const [pricingMode, setPricingMode] = useState(false);
  
  // Shared data
  const [accounts, setAccounts] = useState(initialAccounts);

  // Store data for popout window access
  useEffect(() => {
    window.aiPanelData = { accounts, borrowerData };
  }, [accounts]);

  // GoodLeap Advantage proposal state (for flyover previews)
  const [advantageState, setAdvantageState] = useState({
    chart1: '',
    chart2: '',
    includeDebtWorksheet: true,
  });

  // Analysis data from V3 (for charts/proposals)
  const [flyoverData, setFlyoverData] = useState(null);

  const handleAccountToggle = (accountId) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, willPay: !acc.willPay } : acc
    ));
  };

  const handleToggleAll = (checked) => {
    setAccounts(prev => prev.map(acc => ({ ...acc, willPay: checked })));
  };

  const handleAccountUpdate = (accountId, field, value) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, [field]: value } : acc
    ));
  };

  // Enter/Exit pricing mode
  const handleEnterPricingMode = () => {
    setPricingMode(true);
  };

  const handleExitPricingMode = () => {
    setPricingMode(false);
  };

  const handleViewChart = (chartType, chartData = null) => {
    // Use provided chartData or build basic data from accounts
    const data = chartData || {
      accounts: accounts.filter(a => a.willPay),
      debtsPayoff: accounts.filter(a => a.willPay).reduce((s, a) => s + (parseFloat(String(a.balance).replace(/[$,]/g, '')) || 0), 0),
      debtsMonthlyPayment: accounts.filter(a => a.willPay).reduce((s, a) => s + (parseFloat(String(a.payment).replace(/[$,]/g, '')) || 0), 0),
      debtsCount: accounts.filter(a => a.willPay).length,
    };
    handleAdvantageFlyover(`ChartPreview:${chartType}`, data);
  };

  const handleGenerateProposal = (selectedCharts, chartData) => {
    handleAdvantageFlyover('ProposalPreview', { selectedCharts, chartData });
  };

  // Handle flyover from GoodLeap Advantage (now accepts analysis data)
  const handleAdvantageFlyover = (flyoverType, analysisData = null) => {
    setActiveQuickAction(flyoverType);
    if (analysisData) {
      setFlyoverData(analysisData);
    }
  };
  
  // Update flyover data in real-time when chart config changes (for inline controls)
  const handleUpdateFlyoverData = (chartData) => {
    if (activeQuickAction?.startsWith('ChartPreview:')) {
      setFlyoverData(chartData);
    }
  };
  
  // Get the currently open chart type (for real-time sync)
  const openChartType = activeQuickAction?.startsWith('ChartPreview:') 
    ? activeQuickAction.replace('ChartPreview:', '') 
    : null;

  // Handle quick action change - supports AI tool IDs from config
  const handleQuickActionChange = (action) => {
    // Map AI tool IDs to quick action names
    const mappedAction = AI_TOOL_MAPPING[action] || action;
    setActiveQuickAction(mappedAction);
  };

  // Flyover content based on activeQuickAction
  const getRightPanelContent = () => {
    if (!activeQuickAction) return null;
    
    // Handle chart preview flyovers
    if (activeQuickAction.startsWith('ChartPreview:')) {
      const chartType = activeQuickAction.replace('ChartPreview:', '');
      return <ChartPreview chartType={chartType} data={flyoverData} />;
    }

    // Handle proposal preview flyover
    if (activeQuickAction === 'ProposalPreview') {
      return (
        <ProposalPreview 
          chart1={advantageState.chart1}
          chart2={advantageState.chart2}
          includeDebtWorksheet={advantageState.includeDebtWorksheet}
          data={flyoverData}
        />
      );
    }

    // Standard Quick Actions
    switch (activeQuickAction) {
      case 'Debt Worksheet':
        return <DebtWorksheet selectedDebts={accounts} />;
      case 'Quick Quote':
        return <QuickQuote />;
      // AI Assistant tools - open in flyout
      case 'Call Prep Brief':
        return <GoodLeapSummary accounts={accounts} borrowerData={borrowerData} onClose={() => setActiveQuickAction(null)} />;
      case 'Liability AI':
        return <LiabilityAI accounts={accounts} borrowerData={borrowerData} onClose={() => setActiveQuickAction(null)} />;
      case 'Property AVM':
        return <GoodLeapAVM borrowerData={borrowerData} onClose={() => setActiveQuickAction(null)} />;
      case 'Sales Coach':
        return <SalesCoach accounts={accounts} borrowerData={borrowerData} onClose={() => setActiveQuickAction(null)} />;
      // Chart tools with templated test data
      case 'Debt Worksheet Chart':
        return <ChartPreview chartType="debt-consolidation" data={TEMPLATE_CHART_DATA} />;
      case 'Payment Savings Chart':
        return <ChartPreview chartType="payment-savings" data={TEMPLATE_CHART_DATA} />;
      case 'Cash Back Chart':
        return <ChartPreview chartType="cash-back" data={TEMPLATE_CHART_DATA} />;
      case 'Accelerated Payoff Chart':
        return <ChartPreview chartType="accelerated-payoff" data={TEMPLATE_CHART_DATA} />;
      default:
        return null;
    }
  };

  // Main content based on currentView
  const renderMainContent = () => {
    switch (currentView) {
      case 'pricing':
        return (
          <PricingCalculator 
            accounts={accounts}
            borrowerData={borrowerData}
            onSelectChart={handleQuickActionChange}
          />
        );
      case 'property':
        return (
          <PropertyTabs 
            borrowerData={borrowerData}
          />
        );
      case 'figure':
        return (
          <FigureView 
            borrowerData={borrowerData}
          />
        );
      case 'short1003':
        return (
          <Short1003View 
            borrowerData={borrowerData}
          />
        );
      case 'propertyTester':
        return <PropertyTester />;
      case 'advantage':
        return (
          <GoodLeapAdvantage 
            accounts={accounts}
            onOpenFlyover={handleAdvantageFlyover}
            onStateChange={setAdvantageState}
          />
        );
      case 'advantageV2':
        return (
          <GoodLeapAdvantageV2 
            accounts={accounts}
            onOpenFlyover={handleAdvantageFlyover}
          />
        );
      case 'advantageV3':
        return (
          <GoodLeapAdvantageV3 
            accounts={accounts}
            onOpenFlyover={handleAdvantageFlyover}
          />
        );
      case 'advantageV4':
        return (
          <GoodLeapAdvantageV4 
            accounts={accounts}
            onOpenFlyover={handleAdvantageFlyover}
          />
        );
      case 'advantageV5':
        return (
          <GoodLeapAdvantageV5 
            accounts={accounts}
            onOpenFlyover={handleAdvantageFlyover}
          />
        );
      case 'dashboard':
      default:
        // Check if we're in pricing mode on the Liabilities tab
        if (pricingMode && activeTab === 'Liabilities') {
          return (
            <div className="h-[calc(100vh-80px)]">
              <GoodLeapAdvantageTabs
                accounts={accounts}
                borrowerData={borrowerData}
                onExit={handleExitPricingMode}
                onViewChart={handleViewChart}
                onGenerateProposal={handleGenerateProposal}
                onAccountToggle={handleAccountToggle}
                onToggleAll={handleToggleAll}
                onAccountUpdate={handleAccountUpdate}
                onUpdateFlyoverData={handleUpdateFlyoverData}
                openChartType={openChartType}
              />
            </div>
          );
        }

        // Normal dashboard view
        return (
          <>
            <MockScenarios />
            <div className="px-6 mb-6">
              <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="mt-4">
                {activeTab === 'Liabilities' && (
                  <LiabilitiesTab 
                    accounts={accounts}
                    onAccountToggle={handleAccountToggle}
                    onToggleAll={handleToggleAll}
                    isPricingMode={false}
                    onEnterPricingMode={handleEnterPricingMode}
                  />
                )}
              </div>
            </div>
          </>
        );
    }
  };

  // If this is a popout window, render only the AI panel
  if (isPopout) {
    return <AIPopoutWindow />;
  }

  // If this is the loan details popout window
  if (isLoanDetailsPopout) {
    return <LoanDetailsPopout />;
  }

  return (
    <Layout
      currentView={currentView}
      onViewChange={setCurrentView}
      activeQuickAction={activeQuickAction}
      onQuickActionChange={handleQuickActionChange}
      rightPanel={getRightPanelContent()}
      accounts={accounts}
      borrowerData={borrowerData}
    >
      {renderMainContent()}
    </Layout>
  );
}

export default App;
