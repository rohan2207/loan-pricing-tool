import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { MockScenarios } from './components/dashboard/MockScenarios';
import { Tabs } from './components/dashboard/Tabs';

import { LiabilitiesTab } from './components/dashboard/LiabilitiesTab';
import { PropertyTab } from './components/dashboard/tabs/PropertyTab';
import { CFLoanDataTab } from './components/dashboard/tabs/CFLoanDataTab';
import { SalesComparablesTab } from './components/dashboard/tabs/SalesComparablesTab';
import { URLATab } from './components/dashboard/tabs/URLATab';
import { DebtWorksheet } from './components/dashboard/DebtWorksheet';
import { QuickQuote } from './components/dashboard/QuickQuote';
import { GoodLeapAssistant } from './components/dashboard/GoodLeapAssistant';
import { AIPopoutWindow } from './components/dashboard/AIPopoutWindow';
import { GoodLeapAdvantage } from './components/advantage/GoodLeapAdvantage';
import { GoodLeapAdvantageV2 } from './components/advantage/GoodLeapAdvantageV2';
import { GoodLeapAdvantageV3 } from './components/advantage/GoodLeapAdvantageV3';
import { GoodLeapAdvantageV4 } from './components/advantage/GoodLeapAdvantageV4';
import { GoodLeapAdvantageV5 } from './components/advantage/GoodLeapAdvantageV5';
import { ChartPreview } from './components/advantage/ChartPreview';
import { ProposalPreview } from './components/advantage/ProposalPreview';

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

function App() {
  // Check if this is a popout window
  const isPopout = new URLSearchParams(window.location.search).get('popout') === 'ai';

  // Level 1 navigation - which full page view
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Dashboard tabs
  const [activeTab, setActiveTab] = useState('Liabilities');
  
  // Quick Actions flyovers
  const [activeQuickAction, setActiveQuickAction] = useState(null);
  
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

  // Handle flyover from GoodLeap Advantage (now accepts analysis data)
  const handleAdvantageFlyover = (flyoverType, analysisData = null) => {
    setActiveQuickAction(flyoverType);
    if (analysisData) {
      setFlyoverData(analysisData);
    }
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

    // Standard Quick Actions (AI tools moved to floating assistant)
    switch (activeQuickAction) {
      case 'Debt Worksheet':
        return <DebtWorksheet selectedDebts={accounts} />;
      case 'Quick Quote':
        return <QuickQuote />;
      default:
        return null;
    }
  };

  // Main content based on currentView
  const renderMainContent = () => {
    switch (currentView) {
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
                  />
                )}
                {activeTab === 'Property' && <PropertyTab />}
                {activeTab === 'CF Loan Data' && <CFLoanDataTab />}
                {activeTab === 'Sales Comparables' && <SalesComparablesTab />}
                {activeTab === 'URLA' && <URLATab />}
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

  return (
    <>
      <Layout
        currentView={currentView}
        onViewChange={setCurrentView}
        activeQuickAction={activeQuickAction}
        onQuickActionChange={setActiveQuickAction}
        rightPanel={getRightPanelContent()}
      >
        {renderMainContent()}
      </Layout>
      
      {/* Floating AI Assistant - always visible */}
      <GoodLeapAssistant accounts={accounts} borrowerData={borrowerData} />
    </>
  );
}

export default App;
