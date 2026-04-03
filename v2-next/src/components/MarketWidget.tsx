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
    'BASE': '한국은행 기준금리'
};

export default function MarketWidget() {
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
            const baseRate: MarketData = { symbol: 'BASE', name: NAMES['BASE'], price: '3.50%', change: '0.00', changePercent: '0.00', isPositive: true };
            setIndicators([baseRate, ...validResults]);
        } catch (error) { }
    };

    useEffect(() => {
        fetchMarketData();
        const interval = setInterval(fetchMarketData, 300000);
        return () => clearInterval(interval);
    }, []);

    if (indicators.length === 0) {
        return <div className="widget-panel"><h2 className="widget-title">📊 오늘의 주요 지표</h2><p>데이터를 불러오는 중...</p></div>;
    }

    return (
        <div className="widget-panel">
            <h2 className="widget-title">📊 주요 지수</h2>
            <div className="market-grid">
                {indicators.map((item) => (
                    <div key={item.symbol} className="market-item">
                        <div className="market-label">{item.name}</div>
                        <div className="market-value">{item.price}</div>
                        <div className={`market-change ${item.isPositive ? 'up' : 'down'}`}>
                            {item.isPositive ? '▲' : '▼'} {item.change} ({item.isPositive ? '+' : ''}{item.changePercent}%)
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
