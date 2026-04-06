"use client";

import React, { useState, useEffect } from 'react';
import { MARKET_CONFIG } from '@/lib/market-config';
import { useMarketData } from '@/hooks/useMarketData';

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

const SYMBOL_TO_ICON: Record<string, keyof typeof Icons> = {
    'BASE': 'Bank',
    '^KS11': 'Chart',
    '^KQ11': 'Chart',
    'KRW=X': 'Globe',
    'GC=F': 'Gold',
};

const getIcon = (symbol: string) => {
    const iconName = SYMBOL_TO_ICON[symbol] || 'Chart';
    const IconComponent = Icons[iconName];
    return <IconComponent />;
};

export default function MarketWidget() {
    const { data: indicators, loading } = useMarketData();
    const [updateTime, setUpdateTime] = useState("");

    useEffect(() => {
        if (indicators.length > 0) {
            const now = new Date();
            setUpdateTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
        }
    }, [indicators]);

    if (loading && indicators.length === 0) {
        return (
            <div className="market-widget dashboard-card shadow-premium skeleton-container" style={{ minHeight: '440px' }}>
                <div className="skeleton-header"></div>
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton-row"></div>)}
                <style jsx>{`
                    .skeleton-container { padding: 24px; background: var(--surface); border-radius: 20px; border: 1px solid var(--border); }
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
                            color: item.isPositive ? 'var(--danger)' : 'var(--primary)',
                            background: item.isPositive ? 'rgba(255, 77, 77, 0.08)' : 'rgba(0, 100, 255, 0.08)'
                        }}>
                            {getIcon(item.symbol)}
                        </div>

                        <div className="info-box">
                            <div className="label-row">
                                <span className="item-name">{item.name}</span>
                                {item.symbol === 'BASE_RATE' && <span className="tag-fixed">동결</span>}
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
                    background: var(--surface);
                    border-radius: 20px;
                    padding: 24px;
                    border: 1px solid var(--border);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .market-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 24px;
                }
                .title-group { display: flex; flex-direction: column; gap: 6px; }
                .live-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: #00D166;
                    background: rgba(0, 209, 102, 0.1);
                    padding: 2px 8px;
                    border-radius: 100px;
                }
                .dot { width: 6px; height: 6px; background: #00D166; border-radius: 50%; animation: blink 1.5s infinite; }
                .market-title { font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0; }
                .update-meta { font-size: 0.75rem; color: var(--text-secondary); opacity: 0.7; }
                .market-grid { display: flex; flex-direction: column; gap: 12px; }
                .market-row-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 14px;
                    border-radius: 16px;
                    background: var(--surface-2);
                    transition: all 0.2s ease;
                    border: 1px solid transparent;
                }
                .market-row-item:hover {
                    background: var(--surface);
                    border-color: var(--border);
                    transform: translateX(4px);
                    box-shadow: var(--shadow-sm);
                }
                .icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .info-box { flex: 1; display: flex; flex-direction: column; }
                .label-row { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
                .item-name { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); }
                .tag-fixed { font-size: 0.65rem; background: var(--surface); color: var(--text-muted); padding: 1px 6px; border-radius: 4px; border: 1px solid var(--border); }
                .value-row { display: flex; justify-content: space-between; align-items: center; }
                .current-price { font-size: 1.3rem; font-weight: 800; color: var(--text-primary); font-variant-numeric: tabular-nums; }
                .percent-badge { font-size: 0.8rem; font-weight: 700; padding: 2px 8px; border-radius: 8px; }
                .percent-badge.up { color: var(--danger); background: rgba(255, 77, 77, 0.08); }
                .percent-badge.down { color: var(--primary); background: rgba(0, 100, 255, 0.08); }
                .change-raw { font-size: 0.75rem; font-weight: 600; margin-top: -2px; }
                .change-raw.up { color: var(--danger); }
                .change-raw.down { color: var(--primary); }
                .market-status-footer { margin-top: 24px; padding-top: 16px; border-top: 1px dashed var(--border); }
                .server-status { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.68rem; color: var(--text-muted); opacity: 0.6; }
                @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
            `}</style>
        </div>
    );
}
