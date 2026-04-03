"use client";

import React, { useState, useEffect } from 'react';

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

export default function TickerBar() {
    const [indicators, setIndicators] = useState<MarketData[]>([]);

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

                    return {
                        symbol,
                        name: NAMES[symbol] || symbol,
                        price: currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                        change: change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                        changePercent: changePercent.toFixed(2),
                        isPositive: change >= 0
                    };
                } catch (e) {
                    return null;
                }
            });

            const results = await Promise.all(fetchPromises);
            const validResults = results.filter((item): item is MarketData => item !== null);

            // Add Base Rate
            const baseRate: MarketData = {
                symbol: 'BASE',
                name: NAMES['BASE'],
                price: '3.50%',
                change: '0.00',
                changePercent: '0.00',
                isPositive: true
            };

            setIndicators([baseRate, ...validResults]);
        } catch (error) {
            console.error("Ticker fetch error:", error);
        }
    };

    useEffect(() => {
        fetchMarketData();
        const interval = setInterval(fetchMarketData, 300000); // 5분마다 갱신
        return () => clearInterval(interval);
    }, []);

    // If API fails or loading, show a placeholder
    if (indicators.length === 0) {
        return (
            <div className="ticker-wrapper">
                <div className="ticker-track">
                    <span className="ticker-item">실시간 시장 데이터를 불러오는 중입니다...</span>
                </div>
            </div>
        );
    }

    // Duplicate for infinite animation
    const displayItems = [...indicators, ...indicators, ...indicators];

    return (
        <div className="ticker-wrapper">
            <div className="ticker-track">
                {displayItems.map((item, idx) => (
                    <div key={`${item.symbol}-${idx}`} className="ticker-item">
                        <span className="ticker-label text-white">{item.name}</span>
                        <span className="ticker-value text-white">{item.price}</span>
                        <span className={`ticker-change ${item.isPositive ? 'positive' : 'negative'}`}>
                            {item.isPositive ? '▲' : '▼'} {item.change} ({item.changePercent}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
