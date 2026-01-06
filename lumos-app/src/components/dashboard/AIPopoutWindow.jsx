import React, { useState, useEffect, useMemo } from 'react';
import { AIPanel } from './AIPanel';

// This component is rendered in the popout window
// It receives data from the main window via URL params and window.opener

export function AIPopoutWindow() {
    const [accounts, setAccounts] = useState([]);
    const [borrowerData, setBorrowerData] = useState(null);
    const [defaultTool, setDefaultTool] = useState(null); // null = show grid
    const [cachedToolData, setCachedToolData] = useState(null);

    useEffect(() => {
        // Parse URL params
        const params = new URLSearchParams(window.location.search);
        const tool = params.get('tool'); // null if not specified = show grid
        setDefaultTool(tool || null);

        // Try to get data from opener window
        if (window.opener) {
            if (window.opener.aiPanelData) {
                const data = window.opener.aiPanelData;
                setAccounts(data.accounts || []);
                setBorrowerData(data.borrowerData || null);
            }
            // Get cached tool results to avoid re-fetching
            if (window.opener.aiPanelToolCache) {
                setCachedToolData(window.opener.aiPanelToolCache);
            }
        }

        // Notify opener that we're ready
        if (window.opener) {
            window.opener.postMessage({ type: 'AI_PANEL_READY' }, '*');
        }

        // Notify opener when closing
        const handleBeforeUnload = () => {
            if (window.opener) {
                window.opener.postMessage({ type: 'AI_PANEL_CLOSED' }, '*');
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // Listen for data updates from main window
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data?.type === 'AI_PANEL_DATA_UPDATE') {
                if (event.data.accounts) setAccounts(event.data.accounts);
                if (event.data.borrowerData) setBorrowerData(event.data.borrowerData);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <div className="h-screen w-full">
            <AIPanel
                accounts={accounts}
                borrowerData={borrowerData}
                isOpen={true}
                isPopout={true}
                defaultTool={defaultTool}
                cachedToolData={cachedToolData}
            />
        </div>
    );
}

