"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MARKET_CONFIG } from '@/lib/market-config';

interface MarketData {
    symbol: string;
    name: string;
    price: string;
    change: string;
    changePercent: string;
    isPositive: boolean;
}

const CACHE_KEY = 'richcalc_market_data_v4';

export default function MarketWidget() {
    const [indicators, setIndicators] = useState<MarketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [updateTime, setUpdateTime] = useState("");
    const latestDataRef = useRef<Record<string, MarketData>>({});

    const fetchMarketData = async () => {
        try {
            const res = await fetch('/api/market');
            if (!res.ok) throw new Error('API fetch failed');

            const json = await res.json();
            if (!json.success) throw new Error('API reported failure');

            const newIndicators: MarketData[] = [];

            // Use order and names from MARKET_CONFIG
            const displaySymbols = ['BASE', ...MARKET_CONFIG.symbols];

            displaySymbols.forEach(symbol => {
                const raw = json.data[symbol];
                const displayName = MARKET_CONFIG.widgetNames[symbol] || MARKET_CONFIG.names[symbol] || symbol;

                if (raw) {
                    const priceNum = raw.price;
                    const prevClose = raw.prevClose;
                    const change = priceNum - prevClose;
                    const changePercent = (change / prevClose) * 100;

                    const item = {
                        symbol,
                        name: displayName,
                        price: priceNum.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }) + (symbol === 'BASE' ? '%' : ''),
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
                const now = new Date();
                setUpdateTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);

                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: newIndicators,
                    time: updateTime,
                    timestamp: Date.now()
                }));
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (parsed.data && parsed.data.length > 0) {
                    setIndicators(parsed.data);
                    setUpdateTime(parsed.time || "");
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

    if (loading && indicators.length === 0) {
        return (
            <div className="market-widget widget-panel" style={{ minHeight: '420px' }}>
                <h2 className="widget-title">📊 주요 지표</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '20px' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{ height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                    ))}
                </div>
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
                        {item.symbol === 'BASE' && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>동결 (지난 금통위 기준)</div>}
                    </div>
                ))}
            </div>
            <div className="market-footer" style={{ marginTop: '18px', fontSize: '0.72rem', opacity: 0.5, textAlign: 'right' }}>
                Yahoo Finance 실시간 연동 (고속 서버 모드)
            </div>
            <style jsx>{`
                @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
                @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 0.8; } 100% { opacity: 0.5; } }
            `}</style>
        </div>
    );
}
