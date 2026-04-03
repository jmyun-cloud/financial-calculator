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
    '^KS11': 'KOSPI 지수',
    '^KQ11': 'KOSDAQ 지수',
    'KRW=X': '원/달러 환율',
    'GC=F': '국제 금 시세',
    'BASE': '한국은행 기준금리'
};

const CACHE_KEY = 'richcalc_market_data_v2';

export default function MarketWidget() {
    const [indicators, setIndicators] = useState<MarketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [updateTime, setUpdateTime] = useState("");

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

                    // Update ref with fresh data
                    latestDataRef.current[symbol] = item;
                    return item;
                } catch (e) {
                    return null;
                }
            });

            await Promise.all(fetchPromises);

            // Always include Base Rate
            const baseRate: MarketData = {
                symbol: 'BASE',
                name: NAMES['BASE'],
                price: '3.50%',
                change: '0.00',
                changePercent: '0.00',
                isPositive: true
            };
            latestDataRef.current['BASE'] = baseRate;

            // Sort by predefined SYMBOLS order
            const orderedOrder = ['BASE', ...SYMBOLS];
            const finalResults: MarketData[] = [];

            orderedOrder.forEach(sym => {
                if (latestDataRef.current[sym]) {
                    finalResults.push(latestDataRef.current[sym]);
                }
            });

            if (finalResults.length > 0) {
                setIndicators(finalResults);
                const now = new Date();
                const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                setUpdateTime(timeStr);

                // Save to cache
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: finalResults,
                    time: timeStr,
                    timestamp: Date.now()
                }));
            }

            setLoading(false);
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
                if (parsed.data && Array.from(parsed.data).length > 0) {
                    setIndicators(parsed.data);
                    setUpdateTime(parsed.time);

                    // Populate ref with cached data to prevent data loss on first failed fetch
                    parsed.data.forEach((item: MarketData) => {
                        latestDataRef.current[item.symbol] = item;
                    });

                    setLoading(false);
                }
            } catch (e) { }
        }

        fetchMarketData();
        const interval = setInterval(fetchMarketData, 60000);
        return () => clearInterval(interval);
    }, []);

    // Skeleton UI while loading if no indicators at all
    if (loading && indicators.length === 0) {
        return (
            <div className="market-widget widget-panel" style={{ minHeight: '420px' }}>
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
        <div className="market-widget widget-panel" style={{ minHeight: '420px' }}>
            <h2 className="widget-title" style={{ display: 'flex', alignItems: 'center' }}>
                📊 오늘의 주요 지표
                <span className="live-dot" style={{ color: '#10b981', margin: '0 8px', animation: 'blink 2s infinite' }}>●</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                    {updateTime ? `${updateTime} 업데이트` : '연동 중...'}
                </span>
            </h2>
            <div className="market-list" style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginTop: '15px' }}>
                {indicators.map((item) => (
                    <div key={item.symbol} className="market-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
                        <div className="market-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            {item.name}
                        </div>
                        <div className="market-main-info" style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                            <span className="market-price" style={{ fontSize: '1.45rem', fontWeight: 800 }}>
                                {item.price}
                            </span>
                            <span className={`market-change ${item.isPositive ? 'up' : 'down'}`} style={{ fontSize: '0.88rem', fontWeight: 700, color: item.isPositive ? '#ef4444' : '#3b82f6' }}>
                                {item.isPositive ? '▲' : '▼'}{item.change} ({item.isPositive ? '+' : ''}{item.changePercent}%)
                            </span>
                        </div>
                        {item.symbol === 'BASE' && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>동결 (금융통화위원회 코멘트 기준)</div>}
                    </div>
                ))}
            </div>
            <div className="market-footer" style={{ marginTop: '18px', fontSize: '0.72rem', opacity: 0.5, textAlign: 'right', fontStyle: 'italic' }}>
                제공: Yahoo Finance 실시간 데이터
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
