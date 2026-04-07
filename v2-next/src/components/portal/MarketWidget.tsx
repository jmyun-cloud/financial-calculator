"use client";

import React from 'react';
import { MARKET_CONFIG } from '@/lib/market-config';
import { useMarketData, MarketItem } from '@/hooks/useMarketData';
import { Gem, Circle, Droplets, Zap } from 'lucide-react';

export default function MarketWidget() {
    const { data: indicators, loading } = useMarketData();

    if (loading && indicators.length === 0) {
        return <div className="v3-sidebar-skeleton" />;
    }

    const SectionTitleMap = {
        domestic: "국내 시장",
        global: "해외 시장",
        crypto: "암호화폐",
        commodity: "원자재"
    };

    const getUnit = (symbol: string) => {
        if (['GC=F', 'SI=F'].includes(symbol)) return "USD/oz";
        if (symbol === 'CL=F') return "USD/bbl";
        if (symbol === 'HG=F') return "USD/lb";
        if (['BTC-USD', 'ETH-USD', 'XRP-USD'].includes(symbol)) return "USD";
        if (symbol === 'KRW=X') return "KRW";
        return "pt";
    };

    const getTrendStyle = (item: MarketItem) => {
        const percent = parseFloat(item.changePercent);
        if (percent === 0) return { color: '#8B95A1', sign: '' };
        if (item.isPositive) return { color: '#F04251', sign: '+' };
        return { color: '#0064FF', sign: '-' };
    };

    const renderIcon = (symbol: string) => {
        if (symbol === 'BTC-USD') return (
            <div className="icon-badge" style={{ background: '#FFF3E0', color: '#F7931A' }}>BTC</div>
        );
        if (symbol === 'ETH-USD') return (
            <div className="icon-badge" style={{ background: '#EDE7F6', color: '#627EEA' }}>ETH</div>
        );
        if (symbol === 'XRP-USD') return (
            <div className="icon-badge" style={{ background: '#E3F2FD', color: '#0064FF' }}>XRP</div>
        );

        if (symbol === 'GC=F') return (
            <div className="icon-rect" style={{ background: '#FFF8E6' }}><Gem size={16} color="#F59E0B" /></div>
        );
        if (symbol === 'SI=F') return (
            <div className="icon-rect" style={{ background: '#F1F5F9' }}><Circle size={14} color="#94A3B8" fill="#94A3B8" /></div>
        );
        if (symbol === 'CL=F') return (
            <div className="icon-rect" style={{ background: '#F1F5F9' }}><Droplets size={16} color="#64748B" /></div>
        );
        if (symbol === 'HG=F') return (
            <div className="icon-rect" style={{ background: '#FFF8E6' }}><Zap size={16} color="#B45309" /></div>
        );

        // Fallback for others
        const flag = symbol === '^N225' ? "🇯🇵" : symbol === '^HSI' ? "🇭🇰" : (symbol.startsWith('^G') || symbol.startsWith('^I') || symbol.startsWith('^D')) ? "🇺🇸" : symbol.startsWith('^K') ? "🇰🇷" : "📈";
        return (
            <div className="icon-placeholder">{flag}</div>
        );
    };

    const renderSection = (id: string, title: string, symbols: string[]) => {
        const filtered = indicators.filter(item => symbols.includes(item.symbol));
        if (filtered.length === 0) return null;

        return (
            <section key={id} className="market-section">
                <header className="market-header">
                    <h3 className="section-title">{title}</h3>
                </header>
                <div className="market-list">
                    {filtered.map(item => {
                        const trend = getTrendStyle(item);
                        return (
                            <div key={item.symbol} className="market-row">
                                <div className="market-row-left">
                                    {renderIcon(item.symbol)}
                                    <div className="name-box">
                                        <span className="market-name">{MARKET_CONFIG.names[item.symbol] || item.symbol}</span>
                                        <span className="market-unit">{getUnit(item.symbol)}</span>
                                    </div>
                                </div>
                                <div className="market-row-right">
                                    <span className="market-price">{item.price}</span>
                                    <span className="market-change" style={{ color: trend.color }}>
                                        {trend.sign}{item.change} ({trend.sign}{item.changePercent}%)
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    };

    return (
        <div className="market-widget-v4">
            {Object.entries(MARKET_CONFIG.categories).map(([id, symbols]) =>
                renderSection(id, SectionTitleMap[id as keyof typeof SectionTitleMap], symbols)
            )}

            <style jsx>{`
                .market-widget-v4 {
                    background: var(--surface);
                    border-radius: 24px;
                    padding: 24px;
                    border: 1px solid var(--border);
                    width: 100%;
                }
                .market-section {
                    margin-bottom: 28px;
                }
                .market-section:last-child {
                    margin-bottom: 0;
                }
                .section-title {
                    font-size: 0.95rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin: 0 0 12px 0;
                    letter-spacing: -0.01em;
                }
                .market-list {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .market-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 10px;
                    margin: 0 -10px;
                    cursor: pointer;
                    transition: background 0.12s ease;
                }
                .market-row:hover {
                    background: #F8F9FB;
                    border-radius: 8px;
                }
                .market-row-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 0;
                }
                .name-box {
                    display: flex;
                    flex-direction: column;
                }
                .market-name {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .market-unit {
                    font-size: 10px;
                    color: #8B95A1;
                    margin-top: 1px;
                }
                .icon-badge {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 9px;
                    font-weight: 700;
                }
                .icon-rect {
                    width: 28px;
                    height: 28px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .icon-placeholder {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: var(--surface-2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    border: 1px solid var(--border);
                }
                .market-row-right {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    flex-shrink: 0;
                }
                .market-price {
                    font-size: 0.9rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    font-variant-numeric: tabular-nums;
                }
                .market-change {
                    font-size: 11px;
                    font-weight: 600;
                    white-space: nowrap;
                    font-variant-numeric: tabular-nums;
                }
                .v3-sidebar-skeleton {
                    height: 500px;
                    background: var(--surface-2);
                    border-radius: 24px;
                }
            `}</style>
        </div>
    );
}
