"use client";

import React from 'react';
import { MARKET_CONFIG } from '@/lib/market-config';
import { useMarketData, MarketItem } from '@/hooks/useMarketData';

export default function MarketWidget() {
    const { data: indicators, loading } = useMarketData();

    if (loading && indicators.length === 0) {
        return <div className="v3-sidebar-skeleton" />;
    }

    const renderSection = (id: string, title: string, symbols: string[], icon: string) => {
        const filtered = indicators.filter(item => symbols.includes(item.symbol));
        if (filtered.length === 0) return null;

        return (
            <section key={id} className="v3-sidebar-section">
                <header className="v3-section-header">
                    <span className="v3-section-icon">{icon}</span>
                    <h3 className="v3-section-title">{title}</h3>
                </header>
                <div className="v3-section-list">
                    {filtered.map(item => (
                        <div key={item.symbol} className="v3-market-row">
                            <div className="v3-row-left">
                                <div className="v3-symbol-bullet">
                                    {getFlagIcon(item.symbol)}
                                </div>
                                <span className="v3-item-name">{MARKET_CONFIG.names[item.symbol] || item.symbol}</span>
                            </div>
                            <div className="v3-row-right">
                                <span className={`v3-item-change ${item.isPositive ? 'v3-positive' : 'v3-negative'}`}>
                                    {item.isPositive ? '+' : '-'}{item.changePercent}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

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

    return (
        <div className="v3-sidebar-container shadow-sm">
            {Object.entries(MARKET_CONFIG.categories).map(([id, symbols]) =>
                renderSection(id, SectionTitleMap[id as keyof typeof SectionTitleMap], symbols, CategoryIcons[id as keyof typeof CategoryIcons])
            )}

            <style jsx>{`
                .v3-sidebar-container {
                    background: var(--surface);
                    border-radius: 24px;
                    padding: 24px;
                    border: 1px solid var(--border);
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 28px !important;
                    width: 100%;
                    box-sizing: border-box;
                }
                .v3-sidebar-section {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 12px !important;
                }
                .v3-section-header {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center !important;
                    gap: 8px !important;
                    margin-bottom: 2px;
                }
                .v3-section-icon { font-size: 1rem; flex-shrink: 0; }
                .v3-section-title {
                    font-size: 0.95rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin: 0 !important;
                    letter-spacing: -0.01em;
                }
                .v3-section-list {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 10px !important;
                }
                .v3-market-row {
                    display: flex !important;
                    flex-direction: row !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    width: 100% !important;
                    min-height: 32px;
                }
                .v3-row-left {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center !important;
                    gap: 12px !important;
                    flex: 1;
                    min-width: 0;
                }
                .v3-symbol-bullet {
                    width: 28px;
                    height: 28px;
                    min-width: 28px;
                    border-radius: 50%;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    font-size: 0.9rem;
                    background: var(--surface-2);
                    border: 1px solid var(--border);
                }
                .v3-item-name {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .v3-row-right {
                    display: flex !important;
                    align-items: center !important;
                    margin-left: 8px;
                    flex-shrink: 0;
                }
                .v3-item-change {
                    font-size: 0.85rem;
                    font-weight: 700;
                    white-space: nowrap;
                    font-variant-numeric: tabular-nums;
                }
                .v3-positive { color: var(--danger) !important; }
                .v3-negative { color: var(--primary) !important; }

                .v3-sidebar-skeleton {
                    height: 500px;
                    background: var(--surface-2);
                    border-radius: 24px;
                    animation: v3-pulse 1.5s infinite;
                }
                @keyframes v3-pulse { 0% { opacity: 0.6; } 50% { opacity: 0.3; } 100% { opacity: 0.6; } }
            `}</style>
        </div>
    );
}

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
