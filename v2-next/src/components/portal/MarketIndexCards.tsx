"use client";

import React, { useEffect, useState } from 'react';
import {
    createChart,
    ColorType,
    LineSeries,
} from 'lightweight-charts';

interface IndexData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    history: { time: number; value: number }[];
}

const SYMBOLS = [
    { symbol: '^KS11', name: '코스피' },
    { symbol: '^KQ11', name: '코스닥' },
    { symbol: '^DJI', name: '다우존스' },
    { symbol: '^IXIC', name: '나스닥 종합' },
    { symbol: '^GSPC', name: 'S&P 500' }
];

export default function MarketIndexCards() {
    const [indices, setIndices] = useState<IndexData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllIndices = async () => {
            try {
                const results = await Promise.all(SYMBOLS.map(async (s) => {
                    // Fetch index data with 1-day range and 5-min interval for sparkline
                    const res = await fetch(`/api/market-detail?symbol=${encodeURIComponent(s.symbol)}&range=1d`);
                    const data = await res.json();

                    // Simple path to extract history for sparkline
                    const history = (data.chartData || []).map((d: any) => ({
                        time: d.time,
                        value: d.close
                    }));

                    return {
                        symbol: s.symbol,
                        name: s.name,
                        price: data.price,
                        change: data.change,
                        changePercent: data.changePercent,
                        history
                    };
                }));
                setIndices(results);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch indices:", err);
            }
        };

        fetchAllIndices();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', gap: '12px', padding: '16px 20px', overflowX: 'auto', borderBottom: '1px solid #F2F4F7' }}>
            {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ minWidth: '220px', height: '90px', background: '#F8F9FA', borderRadius: '8px' }} />
            ))}
        </div>
    );

    return (
        <div className="market-index-section container" style={{ padding: '32px 40px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#191F28', margin: 0 }}>주요 지수</h2>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px', fontWeight: 600, color: '#8B95A1' }}>
                    <span style={{ color: '#191F28', borderBottom: '2px solid #191F28', paddingBottom: '2px' }}>국내</span>
                    <span>미국</span>
                    <span>아시아</span>
                    <span>유럽</span>
                    <span>시장지표</span>
                </div>
            </div>

            <div className="market-index-bar" style={{
                display: 'flex',
                gap: '12px',
                padding: '4px 0 24px',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch'
            }}>
                {indices.map((idx) => (
                    <IndexCard key={idx.symbol} data={idx} />
                ))}
            </div>
        </div>
    );
}

function IndexCard({ data }: { data: IndexData }) {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const isPositive = data.change >= 0;
    const color = isPositive ? '#F04452' : '#0064FF';

    useEffect(() => {
        if (!chartRef.current || data.history.length === 0) return;

        const chart = createChart(chartRef.current, {
            width: 80,
            height: 40,
            layout: { background: { type: ColorType.Solid, color: 'transparent' } },
            grid: { vertLines: { visible: false }, horzLines: { visible: false } },
            rightPriceScale: { visible: false },
            timeScale: { visible: false, borderVisible: false },
            handleScroll: false,
            handleScale: false,
        });

        const lineSeries = chart.addSeries(LineSeries, {
            color: color,
            lineWidth: 2,
            lastValueVisible: false,
            priceLineVisible: false,
        });

        lineSeries.setData(data.history.map(pt => ({
            ...pt,
            time: pt.time as any
        })));

        return () => chart.remove();
    }, [data, color]);

    return (
        <div style={{
            minWidth: '220px',
            padding: '16px',
            border: '1px solid #F2F4F7',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ffffff',
            cursor: 'pointer'
        }}>
            <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#4E5968', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {data.name} <span style={{ fontSize: '10px', color: '#B0B8C1' }}>● 실시간</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#191F28' }}>
                    {data.price?.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: color, marginTop: '2px' }}>
                    {isPositive ? '▲' : '▼'} {Math.abs(data.change).toFixed(2)} ({data.changePercent?.toFixed(2)}%)
                </div>
            </div>
            <div ref={chartRef} style={{ width: '80px', height: '40px' }} />
        </div>
    );
}
