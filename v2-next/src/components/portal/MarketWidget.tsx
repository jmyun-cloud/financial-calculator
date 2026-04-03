"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MARKET_CONFIG } from '@/lib/market-config';

interface MarketData {
    symbol: string;
    name: string;
    price: string;
    change: string;
    changePercent: string;
    isPositive: boolean;
}

const CACHE_KEY = 'richcalc_market_data_v4';

// --- Premium Icons (Inline SVGs) ---
const Icons = {
    Bank: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4" /><path d="M5 21V10.85" /><path d="M19 21V10.85" /><path d="M9 21v-4a2 2 0 0 1 4 0v4" /></svg>
    ),
    Chart: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
    ),
    Globe: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
    ),
    Gold: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 12L2 9z" /><path d="M11 3 8 9l4 12 4-12-3-6" /><path d="M2 9h20" /></svg>
    )
};

const getIcon = (symbol: string) => {
    if (symbol === 'BASE') return <Icons.Bank />;
    if (symbol.startsWith('^K')) return <Icons.Chart />;
    if (symbol.includes('KRW')) return <Icons.Globe />;
    if (symbol.includes('GC')) return <Icons.Gold />;
    return <Icons.Chart />;
};

export default function MarketWidget() {
    const [indicators, setIndicators] = useState<MarketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [updateTime, setUpdateTime] = useState("");
    const latestDataRef = useRef<Record<string, MarketData>>({});

    const fetchMarketData = async () => {
        try {
            const res = await fetch('/api/market');
            if (!res.ok) throw new Error('API fetch failed');

            const json = await res.json();
            if (!json.success) throw new Error('API reported failure');

            const newIndicators: MarketData[] = [];
            const displaySymbols = ['BASE', ...MARKET_CONFIG.symbols];

            displaySymbols.forEach(symbol => {
                const raw = json.data[symbol];
                const displayName = MARKET_CONFIG.widgetNames[symbol] || MARKET_CONFIG.names[symbol] || symbol;

                if (raw) {
                    const priceNum = raw.price;
                    const prevClose = raw.prevClose;
                    const change = priceNum - prevClose;
                    const changePercent = (prevClose !== 0) ? (change / prevClose) * 100 : 0;

                    const item = {
                        symbol,
                        name: displayName,
                        price: priceNum.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }) + (symbol === 'BASE' ? '%' : ''),
                        change: Math.abs(change).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                        changePercent: Math.abs(changePercent).toFixed(2),
                        isPositive: change >= 0
                    };

                    latestDataRef.current[symbol] = item;
                    newIndicators.push(item);
                } else if (latestDataRef.current[symbol]) {
                    newIndicators.push(latestDataRef.current[symbol]);
                }
            });

            if (newIndicators.length > 0) {
                setIndicators(newIndicators);
                const now = new Date();
                const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                setUpdateTime(timeStr);

                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: newIndicators,
                    time: timeStr,
                    timestamp: Date.now()
                }));
            }
        } catch (error) {
            console.error('Market fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (parsed.data && parsed.data.length > 0) {
                    setIndicators(parsed.data);
                    setUpdateTime(parsed.time || "");
                    parsed.data.forEach((item: MarketData) => {
                        latestDataRef.current[item.symbol] = item;
                    });
                    setLoading(false);
                }
            } catch (e) { }
        }

        fetchMarketData();
        const interval = setInterval(fetchMarketData, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading && indicators.length === 0) {
        return (
            <div className="market-widget dashboard-card shadow-premium skeleton-container" style={{ minHeight: '440px' }}>
                <div className="skeleton-header"></div>
                <div className="skeleton-grid">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton-row"></div>)}
                </div>
                <style jsx>{`
                    .skeleton-container { padding: 24px; background: var(--surface-1); border-radius: 20px; }
                    .skeleton-header { width: 140px; height: 28px; background: rgba(0,0,0,0.05); border-radius: 8px; margin-bottom: 24px; }
                    .skeleton-row { height: 72px; background: rgba(0,0,0,0.03); border-radius: 16px; margin-bottom: 12px; animation: pulse 1.5s infinite; }
                    @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 0.8; } 100% { opacity: 0.5; } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="market-widget dashboard-card shadow-premium">
            <header className="market-header">
                <div className="title-group">
                    <span className="live-badge">
                        <span className="dot"></span> LIVE
                    </span>
                    <h2 className="market-title">오늘의 주요 지표</h2>
                </div>
                <div className="update-meta">{updateTime} 업데이트</div>
            </header>

            <div className="market-grid">
                {indicators.map((item) => (
                    <div key={item.symbol} className="market-row-item">
                        <div className="icon-box" style={{
                            color: item.isPositive ? 'var(--up-color, #ef4444)' : 'var(--down-color, #3b82f6)',
                            background: item.isPositive ? 'rgba(239, 68, 68, 0.08)' : 'rgba(59, 130, 246, 0.08)'
                        }}>
                            {getIcon(item.symbol)}
                        </div>

                        <div className="info-box">
                            <div className="label-row">
                                <span className="item-name">{item.name}</span>
                                {item.symbol === 'BASE' && <span className="tag-fixed">동결</span>}
                            </div>

                            <div className="value-row">
                                <div className="current-price">{item.price}</div>
                                <div className={`percent-badge ${item.isPositive ? 'up' : 'down'}`}>
                                    {item.isPositive ? '▲' : '▼'} {item.changePercent}%
                                </div>
                            </div>

                            <div className={`change-raw ${item.isPositive ? 'up' : 'down'}`}>
                                {item.isPositive ? '+' : '-'}{item.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="market-status-footer">
                <div className="server-status">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" /></svg>
                    <span>Yahoo Finance 실시간 연동 (KR-Speed Mode)</span>
                </div>
            </footer>

            <style jsx>{`
                .market-widget {
                    background: var(--surface-1, #ffffff);
                    border-radius: 20px;
                    padding: 24px;
                    border: 1px solid rgba(0,0,0,0.04);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                :global(.dark) .market-widget {
                    background: var(--surface-1, #1e293b);
                    border-color: rgba(255,255,255,0.06);
                }
                .shadow-premium {
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
                }
                
                .market-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 24px;
                }
                .title-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .live-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: #10b981;
                    background: rgba(16, 185, 129, 0.1);
                    padding: 2px 8px;
                    border-radius: 100px;
                    letter-spacing: 0.05em;
                }
                .dot {
                    width: 6px;
                    height: 6px;
                    background: #10b981;
                    border-radius: 50%;
                    animation: blink 1.5s infinite;
                }
                .market-title {
                    font-size: 1.15rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin: 0;
                }
                .update-meta {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    opacity: 0.7;
                }

                .market-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .market-row-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 14px;
                    border-radius: 16px;
                    background: rgba(0,0,0,0.01);
                    transition: all 0.2s ease;
                    border: 1px solid transparent;
                    cursor: default;
                }
                .market-row-item:hover {
                    background: rgba(0,0,0,0.025);
                    border-color: rgba(0,0,0,0.04);
                    transform: translateX(4px);
                }
                :global(.dark) .market-row-item {
                    background: rgba(255,255,255,0.02);
                }
                :global(.dark) .market-row-item:hover {
                    background: rgba(255,255,255,0.04);
                    border-color: rgba(255,255,255,0.08);
                }

                .icon-box {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .info-box {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                .label-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 2px;
                }
                .item-name {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                }
                .tag-fixed {
                    font-size: 0.65rem;
                    background: var(--surface-2, #f1f5f9);
                    color: var(--text-muted, #64748b);
                    padding: 1px 6px;
                    border-radius: 4px;
                }
                
                .value-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .current-price {
                    font-size: 1.3rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    font-variant-numeric: tabular-nums;
                }
                .percent-badge {
                    font-size: 0.8rem;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: 8px;
                }
                .percent-badge.up {
                    color: #e11d48;
                    background: rgba(225, 29, 72, 0.08);
                }
                .percent-badge.down {
                    color: #2563eb;
                    background: rgba(37, 99, 235, 0.08);
                }
                
                .change-raw {
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-top: -2px;
                }
                .change-raw.up { color: #f43f5e; }
                .change-raw.down { color: #3b82f6; }

                .market-status-footer {
                    margin-top: 24px;
                    padding-top: 16px;
                    border-top: 1px dashed var(--border, rgba(0,0,0,0.06));
                }
                .server-status {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    font-size: 0.68rem;
                    color: var(--text-muted);
                    opacity: 0.6;
                }

                /* Skeleton */
                .skeleton-item {
                    height: 72px;
                    background: linear-gradient(90deg, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.03) 75%);
                    background-size: 200% 100%;
                    animation: shimmy 2s infinite linear;
                    border-radius: 16px;
                    margin-bottom: 12px;
                }
                @keyframes shimmy { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
            `}</style>
        </div>
    );
}
