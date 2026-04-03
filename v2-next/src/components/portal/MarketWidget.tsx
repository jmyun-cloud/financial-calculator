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

export default function MarketWidget() {
    const [indicators, setIndicators] = useState<MarketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [updateTime, setUpdateTime] = useState("");

    const fetchMarketData = async () => {
        try {
            const fetchPromises = SYMBOLS.map(async (symbol) => {
                try {
                    // Using Allorigins proxy to bypass CORS
                    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d&_=${Date.now()}`;
                    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

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
                    console.error(`Failed to fetch ${symbol}:`, e);
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

            const now = new Date();
            setUpdateTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
            setLoading(false);
        } catch (error) {
            console.error("Market data fetch error:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketData();
        const interval = setInterval(fetchMarketData, 60000); // 1분마다 갱신
        return () => clearInterval(interval);
    }, []);

    if (loading && indicators.length === 0) {
        return (
            <div className="market-widget widget-panel">
                <h2 className="widget-title">📈 시장 지수</h2>
                <p className="loading-text">실시간 데이터를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="market-widget widget-panel">
            <h2 className="widget-title" style={{ display: 'flex', alignItems: 'center' }}>
                📊 오늘의 주요 지표
                <span className="live-dot" style={{ color: '#10b981', margin: '0 8px' }}>●</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                    오늘 {updateTime} 업데이트
                </span>
            </h2>
            <div className="market-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '15px' }}>
                {indicators.map((item) => (
                    <div key={item.symbol} className="market-item" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                        <div className="market-label" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            {item.name}
                        </div>
                        <div className="market-main-info" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span className="market-price" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                {item.price}
                            </span>
                        </div>
                        <div className={`market-change ${item.isPositive ? 'up' : 'down'}`} style={{ fontSize: '0.9rem', fontWeight: 600, color: item.isPositive ? '#ef4444' : '#3b82f6' }}>
                            {item.isPositive ? '▲' : '▼'} {item.change} ({item.isPositive ? '+' : ''}{item.changePercent}%)
                            {item.symbol === 'BASE' && <span style={{ marginLeft: '4px', color: 'var(--text-secondary)', fontWeight: 400 }}>동결 (최근 코멘트 기준)</span>}
                        </div>
                    </div>
                ))}
            </div>
            <div className="market-footer" style={{ marginTop: '15px', fontSize: '0.75rem', opacity: 0.6 }}>
                제공: Yahoo Finance (실시간 연동됨)
            </div>
        </div>
    );
}
