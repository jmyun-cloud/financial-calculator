"use client";

import React from 'react';
import { useMarketData } from '@/hooks/useMarketData';

export default function TickerBar() {
    const { data: indicators, loading } = useMarketData();

    if (loading && indicators.length === 0) {
        return (
            <div className="ticker-wrapper" style={{ height: '44px', background: 'white', borderBottom: '1px solid #eee' }}>
                <div className="ticker-track">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="ticker-item" style={{ opacity: 0.1 }}>● ● ●</div>
                    ))}
                </div>
            </div>
        );
    }

    // Triple the items for smooth infinite scroll
    const displayItems = [...indicators, ...indicators, ...indicators];
    // Adjust duration based on count (e.g., 8 seconds per item for a consistent speed)
    const scrollDuration = indicators.length > 0 ? indicators.length * 8 : 60;

    return (
        <div className="ticker-wrapper">
            <div className="ticker-track" style={{ animationDuration: `${scrollDuration}s` }}>
                {displayItems.map((item, idx) => (
                    <div key={`${item.symbol}-${idx}`} className="ticker-item">
                        <span className="ticker-label">{item.name}</span>
                        <span className="ticker-value">{item.price}</span>
                        <span className={`ticker-chip ${item.isPositive ? 'positive' : 'negative'}`}>
                            {item.isPositive ? '▲' : '▼'}{item.changePercent}%
                        </span>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .ticker-wrapper {
                    width: 100%;
                    background: white;
                    border-bottom: 1px solid #f2f2f2;
                    overflow: hidden;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    position: sticky;
                    top: 64px; /* Exactly below Header */
                    z-index: 999;
                }
                .ticker-track {
                    display: flex;
                    white-space: nowrap;
                    animation: ticker-scroll 60s linear infinite;
                    padding-left: 20px;
                }
                .ticker-item {
                    display: inline-flex;
                    align-items: center;
                    margin-right: 48px;
                    gap: 8px;
                }
                .ticker-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #adb5bd; /* Light grey for labels */
                    text-transform: uppercase;
                }
                .ticker-value {
                    font-size: 0.95rem;
                    font-weight: 800;
                    color: #191F28;
                }
                .ticker-chip {
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: 4px;
                }
                .ticker-chip.positive {
                    color: #F04452; /* Red Up */
                    background: rgba(240, 68, 82, 0.08);
                }
                .ticker-chip.negative {
                    color: #3182F6; /* Blue Down */
                    background: rgba(49, 130, 246, 0.08);
                }

                @keyframes ticker-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                .ticker-wrapper:hover .ticker-track {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
