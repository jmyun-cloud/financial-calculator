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
    '^KS11': 'KOSPI 지수',
    '^KQ11': 'KOSDAQ 지수',
    'KRW=X': '원/달러 환율',
    'GC=F': '국제 금 시세',
    'BASE': '한국은행 기준금리'
};

const CACHE_KEY = 'richcalc_market_data';

export default function MarketWidget() {
    const [indicators, setIndicators] = useState<MarketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [updateTime, setUpdateTime] = useState("");

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

            const baseRate: MarketData = {
                symbol: 'BASE',
                name: NAMES['BASE'],
                price: '3.50%',
                change: '0.00',
                changePercent: '0.00',
                isPositive: true
            };

            const newIndicators = [baseRate, ...validResults];
            setIndicators(newIndicators);

            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            setUpdateTime(timeStr);
            setLoading(false);

            // Save to cache
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: newIndicators,
                time: timeStr,
                timestamp: Date.now()
            }));
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Load from cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                // Only use cache if it's less than 1 hour old for initial display
                if (Date.now() - parsed.timestamp < 3600000) {
                    setIndicators(parsed.data);
                    setUpdateTime(parsed.time);
                    setLoading(false);
                }
            } catch (e) { }
        }

        fetchMarketData();
        const interval = setInterval(fetchMarketData, 60000);
        return () => clearInterval(interval);
    }, []);

    // Skeleton UI while loading if no cache
    if (loading && indicators.length === 0) {
        return (
            <div className="market-widget widget-panel" style={{ minHeight: '400px' }}>
                <h2 className="widget-title">📊 주요 지표</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '20px' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{ height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                    ))}
                </div>
                <style jsx>{`
                    @keyframes pulse {
                        0% { opacity: 0.5; }
                        50% { opacity: 0.8; }
                        100% { opacity: 0.5; }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="market-widget widget-panel" style={{ minHeight: '400px' }}>
            <h2 className="widget-title" style={{ display: 'flex', alignItems: 'center' }}>
                📊 오늘의 주요 지표
                <span className="live-dot" style={{ color: '#10b981', margin: '0 8px', animation: 'blink 2s infinite' }}>●</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                    {updateTime ? `${updateTime} 업데이트` : '연동 중...'}
                </span>
            </h2>
            <div className="market-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '15px' }}>
                {indicators.map((item) => (
                    <div key={item.symbol} className="market-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                        <div className="market-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            {item.name}
                        </div>
                        <div className="market-main-info" style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                            <span className="market-price" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                                {item.price}
                            </span>
                            <span className={`market-change ${item.isPositive ? 'up' : 'down'}`} style={{ fontSize: '0.85rem', fontWeight: 600, color: item.isPositive ? '#ef4444' : '#3b82f6' }}>
                                {item.isPositive ? '▲' : '▼'}{item.change} ({item.isPositive ? '+' : ''}{item.changePercent}%)
                                {item.symbol === 'BASE' && <span style={{ marginLeft: '6px', color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.75rem' }}>동결</span>}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="market-footer" style={{ marginTop: '15px', fontSize: '0.72rem', opacity: 0.5, textAlign: 'right' }}>
                제공: Yahoo Finance
            </div>
            <style jsx>{`
                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0.3; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
