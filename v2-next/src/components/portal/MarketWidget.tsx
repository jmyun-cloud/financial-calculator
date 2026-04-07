"use client";

import React from 'react';
import { MARKET_CONFIG } from '@/lib/market-config';
import { useMarketData, MarketItem } from '@/hooks/useMarketData';

export default function MarketWidget() {
    const { data: indicators, loading } = useMarketData();

    if (loading && indicators.length === 0) {
        return <div className="v3-sidebar-skeleton" />;
    }

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

    const renderSection = (id: string, title: string, symbols: string[], icon: string) => {
        const filtered = indicators.filter(item => symbols.includes(item.symbol));
        if (filtered.length === 0) return null;

        return (
            <section key={id} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <header style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1rem' }}>{icon}</span>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
                        {title}
                    </h3>
                </header>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filtered.map(item => (
                        <div key={item.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', minHeight: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                <div style={{
                                    width: '28px', height: '28px', minWidth: '28px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.9rem', background: 'var(--surface-2)', border: '1px solid var(--border)'
                                }}>
                                    {getFlagIcon(item.symbol)}
                                </div>
                                <span style={{
                                    fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                }}>
                                    {MARKET_CONFIG.names[item.symbol] || item.symbol}
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: '8px', flexShrink: 0 }}>
                                <span style={{
                                    fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px', fontVariantNumeric: 'tabular-nums'
                                }}>
                                    {item.price}
                                </span>
                                <span style={{
                                    fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
                                    color: item.isPositive ? 'var(--danger)' : 'var(--primary)'
                                }}>
                                    {item.isPositive ? '+' : ''}{item.changePercent}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    return (
        <div style={{
            background: 'var(--surface)', borderRadius: '24px', padding: '24px',
            border: '1px solid var(--border)', width: '100%', boxSizing: 'border-box'
        }}>
            {Object.entries(MARKET_CONFIG.categories).map(([id, symbols]) =>
                renderSection(id, SectionTitleMap[id as keyof typeof SectionTitleMap], symbols, CategoryIcons[id as keyof typeof CategoryIcons])
            )}

            <style jsx>{`
                .v3-sidebar-skeleton {
                    height: 500px;
                    background: var(--surface-2);
                    border-radius: 24px;
                }
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
