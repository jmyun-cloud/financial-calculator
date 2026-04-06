"use client";

import React from 'react';
import { MARKET_CONFIG } from '@/lib/market-config';
import { useMarketData, MarketItem } from '@/hooks/useMarketData';

// --- Category Icons (Mockup style) ---
const CategoryIcons = {
    domestic: "🇰🇷",
    global: "🌍",
    crypto: "🪙",
    commodity: "🏗️"
};

const SectionTitleMap = {
    domestic: "국내 시장",
    global: "해외 시장",
    crypto: "암호화폐",
    commodity: "원자재"
};

export default function MarketWidget() {
    const { data: indicators, loading } = useMarketData();

    if (loading && indicators.length === 0) {
        return <div className="market-sidebar-skeleton" />;
    }

    const renderSection = (id: string, title: string, symbols: string[], icon: string) => {
        const filtered = indicators.filter(item => symbols.includes(item.symbol));
        if (filtered.length === 0) return null;

        return (
            <div key={id} className="market-section">
                <div className="section-header">
                    <span className="section-icon">{icon}</span>
                    <h3 className="section-title">{title}</h3>
                </div>
                <div className="section-list">
                    {filtered.map(item => (
                        <div key={item.symbol} className="market-row">
                            <div className="row-left">
                                <div className="symbol-bullet">
                                    {getFlagIcon(item.symbol)}
                                </div>
                                <span className="item-name">{MARKET_CONFIG.names[item.symbol] || item.symbol}</span>
                            </div>
                            <div className="row-right">
                                <span className={`item-change ${item.isPositive ? 'positive' : 'negative'}`}>
                                    {item.isPositive ? '+' : '-'}{item.changePercent}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="market-sidebar-v3 shadow-sm">
            {Object.entries(MARKET_CONFIG.categories).map(([id, symbols]) =>
                renderSection(id, SectionTitleMap[id as keyof typeof SectionTitleMap], symbols, CategoryIcons[id as keyof typeof CategoryIcons])
            )}

            <style jsx>{`
                .market-sidebar-v3 {
                    background: var(--surface);
                    border-radius: 24px;
                    padding: 24px;
                    border: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    width: 100%;
                    box-sizing: border-box;
                }
                .market-section {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 4px;
                }
                .section-icon { font-size: 1rem; }
                .section-title {
                    font-size: 0.95rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin: 0;
                    letter-spacing: -0.01em;
                }
                .section-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .market-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }
                .row-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex: 1;
                    min-width: 0;
                }
                .symbol-bullet {
                    width: 28px;
                    height: 28px;
                    min-width: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    background: var(--surface-2);
                    border: 1px solid var(--border);
                }
                .item-name {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .row-right {
                    display: flex;
                    align-items: center;
                    margin-left: 8px;
                }
                .item-change {
                    font-size: 0.85rem;
                    font-weight: 700;
                    white-space: nowrap;
                }
                .item-change.positive { color: var(--danger); }
                .item-change.negative { color: var(--primary); }

                .market-sidebar-skeleton {
                    height: 500px;
                    background: var(--surface-2);
                    border-radius: 24px;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 0.3; } 100% { opacity: 0.6; } }
            `}</style>
        </div>
    );
}

// --- Helper for Mockup Style Icons ---
function getFlagIcon(symbol: string) {
    if (symbol === '^IXIC' || symbol === '^DJI' || symbol === '^GSPC') return "🇺🇸";
    if (symbol === '^N225') return "🇯🇵";
    if (symbol === '^HSI') return "🇭🇰";
    if (symbol === '^FTSE') return "🇬🇧";
    if (symbol === 'BTC-USD') return "₿";
    if (symbol === 'ETH-USD') return "Ξ";
    if (symbol === 'XRP-USD') return "✕";
    if (symbol === 'GC=F') return "🥇";
    if (symbol === 'SI=F') return "🥈";
    if (symbol === 'CL=F') return "🛢️";
    if (symbol.startsWith('^K')) return "🇰🇷";
    if (symbol === 'KRW=X') return "💵";
    return "📈";
}
