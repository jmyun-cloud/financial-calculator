"use client";

import React from 'react';
import { useMarketData } from '@/hooks/useMarketData';

export default function TickerBar() {
    const { data: indicators, loading } = useMarketData();

    if (loading && indicators.length === 0) {
        return (
            <div className="ticker-wrapper" style={{ height: '40px' }}>
                <div className="ticker-track">
                    {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} className="ticker-item" style={{ opacity: 0.3 }}>● ● ● ●</span>
                    ))}
                </div>
            </div>
        );
    }

    // Triple the items for smooth infinite scroll
    const displayItems = [...indicators, ...indicators, ...indicators];

    return (
        <div className="ticker-wrapper">
            <div className="ticker-track">
                {displayItems.map((item, idx) => (
                    <div key={`${item.symbol}-${idx}`} className="ticker-item">
                        <span className="ticker-label">{item.name}</span>
                        <span className="ticker-value">{item.price}</span>
                        <span className={`ticker-change ${item.isPositive ? 'positive' : 'negative'}`}>
                            {item.isPositive ? '▲' : '▼'}{item.change} ({item.isPositive ? '+' : ''}{item.changePercent}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
