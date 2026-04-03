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

const SYMBOLS = ['^KS11', '^KQ11', 'KRW=X', 'GC=F'];
const NAMES: Record<string, string> = {
    '^KS11': 'KOSPI',
    '^KQ11': 'KOSDAQ',
    'KRW=X': 'USD/KRW',
    'GC=F': 'Gold',
    'BASE': '금리'
};

const CACHE_KEY = 'richcalc_ticker_data_v2';

export default function TickerBar() {
    const [indicators, setIndicators] = useState<MarketData[]>([]);

    // Use a ref to keep track of the latest data for merging
    const latestDataRef = useRef<Record<string, MarketData>>({});

    const fetchMarketData = async () => {
        try {
            const fetchPromises = SYMBOLS.map(async (symbol) => {
                try {
                    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d&_=${Date.now()}`;
                    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&_=${Date.now()}`;

                    const res = await fetch(proxyUrl);
                    if (!res.ok) return null;

                    const rawData = await res.json();
                    const data = JSON.parse(rawData.contents);

                    if (!data.chart || !data.chart.result) return null;

                    const meta = data.chart.result[0].meta;
                    const currentPrice = meta.regularMarketPrice;
                    const prevClose = meta.previousClose;
                    const change = currentPrice - prevClose;
                    const changePercent = (change / prevClose) * 100;

                    const item = {
                        symbol,
                        name: NAMES[symbol] || symbol,
                        price: currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                        change: change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                        changePercent: changePercent.toFixed(2),
                        isPositive: change >= 0
                    };

                    latestDataRef.current[symbol] = item;
                    return item;
                } catch (e) {
                    return null;
                }
            });

            await Promise.all(fetchPromises);

            const baseRate: MarketData = {
                symbol: 'BASE',
                name: NAMES['BASE'],
                price: '3.50%',
                change: '0.00',
                changePercent: '0.00',
                isPositive: true
            };
            latestDataRef.current['BASE'] = baseRate;

            const orderedOrder = ['BASE', ...SYMBOLS];
            const finalResults: MarketData[] = [];
            orderedOrder.forEach(sym => {
                if (latestDataRef.current[sym]) {
                    finalResults.push(latestDataRef.current[sym]);
                }
            });

            if (finalResults.length > 0) {
                setIndicators(finalResults);

                // Save to cache
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: finalResults,
                    timestamp: Date.now()
                }));
            }
        } catch (error) { }
    };

    useEffect(() => {
        // Load from cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (parsed.data && Array.from(parsed.data).length > 0) {
                    setIndicators(parsed.data);
                    parsed.data.forEach((item: MarketData) => {
                        latestDataRef.current[item.symbol] = item;
                    });
                }
            } catch (e) { }
        }

        fetchMarketData();
        const interval = setInterval(fetchMarketData, 300000); // 5분마다 갱신
        return () => clearInterval(interval);
    }, []);

    if (indicators.length === 0) {
        return (
            <div className="ticker-wrapper" style={{ height: '40px', background: '#0a0f1e' }}>
                <div className="ticker-track">
                    <span className="ticker-item" style={{ opacity: 0.6 }}>시장 지수 연동 중...</span>
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
