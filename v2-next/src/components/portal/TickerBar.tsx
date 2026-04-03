"use client";

import React, { useState, useEffect, useRef } from 'react';

interface MarketData {
    symbol: string;
    name: string;
    price: string;
    change: string;
    changePercent: string;
    isPositive: boolean;
}

const SYMBOLS_ORDER = ['BASE', '^KS11', '^KQ11', 'KRW=X', 'GC=F'];
const NAMES: Record<string, string> = {
    '^KS11': 'KOSPI',
    '^KQ11': 'KOSDAQ',
    'KRW=X': 'USD/KRW',
    'GC=F': 'Gold',
    'BASE': '금리'
};

const CACHE_KEY = 'richcalc_ticker_data_v3';

export default function TickerBar() {
    const [indicators, setIndicators] = useState<MarketData[]>([]);
    const latestDataRef = useRef<Record<string, MarketData>>({});

    const fetchMarketData = async () => {
        try {
            const res = await fetch('/api/market');
            if (!res.ok) throw new Error('Ticker API fetch failed');
            const json = await res.json();
            if (!json.success) throw new Error('Ticker API failure');

            const newIndicators: MarketData[] = [];
            SYMBOLS_ORDER.forEach(symbol => {
                const raw = json.data[symbol];
                if (raw) {
                    const priceNum = raw.price;
                    const prevClose = raw.prevClose;
                    const change = priceNum - prevClose;
                    const changePercent = (change / prevClose) * 100;

                    const item = {
                        symbol,
                        name: NAMES[symbol] || symbol,
                        price: priceNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (symbol === 'BASE' ? '%' : ''),
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
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: newIndicators,
                    timestamp: Date.now()
                }));
            }
        } catch (error) { }
    };

    useEffect(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (parsed.data && parsed.data.length > 0) {
                    setIndicators(parsed.data);
                    parsed.data.forEach((item: MarketData) => {
                        latestDataRef.current[item.symbol] = item;
                    });
                }
            } catch (e) { }
        }

        fetchMarketData();
        const interval = setInterval(fetchMarketData, 300000);
        return () => clearInterval(interval);
    }, []);

    if (indicators.length === 0) {
        return (
            <div className="ticker-wrapper" style={{ height: '40px', background: '#0a0f1e' }}>
                <div className="ticker-track">
                    {[1, 2, 3, 4, 5].map(i => <span key={i} className="ticker-item" style={{ opacity: 0.3 }}>● ● ● ●</span>)}
                </div>
            </div>
        );
    }

    const displayItems = [...indicators, ...indicators, ...indicators];

    return (
        <div className="ticker-wrapper">
            <div className="ticker-track">
                {displayItems.map((item, idx) => (
                    <div key={`${item.symbol}-${idx}`} className="ticker-item">
                        <span className="ticker-label text-white">{item.name}</span>
                        <span className="ticker-value text-white">{item.price}</span>
                        <span className={`ticker-change ${item.isPositive ? 'positive' : 'negative'}`}>
                            {item.isPositive ? '▲' : '▼'}{item.change} ({item.isPositive ? '+' : ''}{item.changePercent}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
