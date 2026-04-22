"use client";

import React, { useEffect, useState } from 'react';
import {
    createChart,
    ColorType,
    AreaSeries,
} from 'lightweight-charts';

interface IndexData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    history: { time: number; value: number }[];
}

const CATEGORY_SYMBOLS: Record<string, { symbol: string; name: string; flag: string }[]> = {
    "국내": [
        { symbol: '^KS11', name: '코스피', flag: '🇰🇷' },
        { symbol: '^KQ11', name: '코스닥', flag: '🇰🇷' },
        { symbol: '005930.KS', name: '삼성전자', flag: '🇰🇷' },
        { symbol: '000660.KS', name: 'SK하이닉스', flag: '🇰🇷' },
    ],
    "미국": [
        { symbol: '^DJI', name: '다우존스', flag: '🇺🇸' },
        { symbol: '^IXIC', name: '나스닥 종합', flag: '🇺🇸' },
        { symbol: '^GSPC', name: 'S&P 500', flag: '🇺🇸' },
        { symbol: '^SOX', name: '필라델피아 반도체', flag: '🇺🇸' },
        { symbol: '^RUT', name: '러셀 2000', flag: '🇺🇸' },
    ],
    "아시아": [
        { symbol: '^N225', name: '니케이 225', flag: '🇯🇵' },
        { symbol: '^HSI', name: '항셍 지수', flag: '🇭🇰' },
        { symbol: '000001.SS', name: '상하이 종합', flag: '🇨🇳' },
        { symbol: '^TWII', name: '대만 가권', flag: '🇹🇼' },
    ],
    "유럽": [
        { symbol: '^STOXX50E', name: '유로 스톡스 50', flag: '🇪🇺' },
        { symbol: '^GDAXI', name: 'DAX', flag: '🇩🇪' },
        { symbol: '^FTSE', name: 'FTSE 100', flag: '🇬🇧' },
        { symbol: '^FCHI', name: 'CAC 40', flag: '🇫🇷' },
    ],
    "시장지표": [
        { symbol: 'USDKRW=X', name: 'USD/KRW', flag: '🇺🇸' },
        { symbol: 'JPYKRW=X', name: 'JPY/KRW', flag: '🇯🇵' },
        { symbol: 'BTC-USD', name: '비트코인', flag: '₿' },
        { symbol: 'GC=F', name: '금 선물', flag: '🪙' },
        { symbol: 'CL=F', name: 'WTI 원유', flag: '🛢️' },
    ]
};

const CATEGORIES = ["국내", "미국", "아시아", "유럽", "시장지표"];

export default function MarketIndexCards() {
    const [activeTab, setActiveTab] = useState("국내");
    const [indices, setIndices] = useState<IndexData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllIndices = async () => {
            setLoading(true);
            try {
                const symbols = CATEGORY_SYMBOLS[activeTab];
                const results = await Promise.all(symbols.map(async (s) => {
                    const res = await fetch(`/api/market-detail?symbol=${encodeURIComponent(s.symbol)}&range=1d`);
                    const data = await res.json();

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
            } catch (err) {
                console.error("Failed to fetch indices:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllIndices();

        // Reset scroll position on tab change
        const el = document.querySelector('.market-index-bar');
        if (el) el.scrollLeft = 0;
    }, [activeTab]);

    if (loading && indices.length === 0) return (
        <div style={{ display: 'flex', gap: '12px', padding: '16px 20px', overflowX: 'auto', borderBottom: '1px solid #F2F4F7' }}>
            {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ minWidth: '228px', height: '110px', background: '#F8F9FA', borderRadius: '12px' }} />
            ))}
        </div>
    );

    return (
        <div className="market-index-section container" style={{ padding: '32px 40px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#191F28', margin: 0 }}>주요 지수</h2>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#B0B8C1', marginLeft: '12px' }}>
                        {CATEGORIES.map((cat, idx) => (
                            <React.Fragment key={cat}>
                                <span
                                    onClick={() => setActiveTab(cat)}
                                    style={{
                                        color: activeTab === cat ? '#191F28' : '#B0B8C1',
                                        cursor: 'pointer',
                                        transition: 'color 0.2s'
                                    }}
                                >
                                    {cat}
                                </span>
                                {idx < CATEGORIES.length - 1 && <span>/</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#4E5968', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    전체 지수 보기 <span style={{ marginLeft: '4px', fontSize: '10px' }}>&gt;</span>
                </div>
            </div>

            <div style={{ position: 'relative' }}>
                <div className={`market-index-bar hide-scrollbar ${loading ? 'opacity-50' : ''}`} style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '4px 0 24px',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                    scrollBehavior: 'smooth',
                    transition: 'opacity 0.2s'
                }}>
                    {indices.map((idx) => (
                        <IndexCard
                            key={idx.symbol}
                            data={idx}
                            flag={CATEGORY_SYMBOLS[activeTab].find(s => s.symbol === idx.symbol)?.flag || ''}
                        />
                    ))}
                </div>

                {/* Right Slider Arrow */}
                <button
                    style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'white',
                        border: '1px solid #E5E8EB',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 2,
                        color: '#4E5968'
                    }}
                    onClick={() => {
                        const el = document.querySelector('.market-index-bar');
                        if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
                    }}
                >
                    <span style={{ fontSize: '18px', fontWeight: 600 }}>&gt;</span>
                </button>
            </div>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}

function IndexCard({ data, flag }: { data: IndexData; flag: string }) {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const isPositive = data.change >= 0;
    const color = isPositive ? '#F04452' : '#3182F6';
    const areaColor = isPositive ? 'rgba(240, 68, 82, 0.1)' : 'rgba(49, 130, 246, 0.1)';

    useEffect(() => {
        if (!chartRef.current || data.history.length === 0) return;

        const chart = createChart(chartRef.current, {
            width: 100,
            height: 44,
            layout: { background: { type: ColorType.Solid, color: 'transparent' } },
            grid: { vertLines: { visible: false }, horzLines: { visible: false } },
            rightPriceScale: { visible: false },
            timeScale: { visible: false, borderVisible: false },
            handleScroll: false,
            handleScale: false,
        });

        const areaSeries = chart.addSeries(AreaSeries, {
            lineColor: color,
            topColor: areaColor,
            bottomColor: 'transparent',
            lineWidth: 2,
            lastValueVisible: false,
            priceLineVisible: false,
        });

        areaSeries.setData(data.history.map(pt => ({
            time: pt.time as any,
            value: pt.value
        })));

        chart.timeScale().fitContent();

        return () => chart.remove();
    }, [data, color, areaColor]);

    return (
        <div style={{
            minWidth: '228px',
            padding: '16px',
            border: '1px solid #F2F4F7',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            background: '#ffffff',
            cursor: 'pointer',
            flexShrink: 0
        }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#191F28', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '14px' }}>{flag}</span>
                    {data.name}
                    <span style={{ fontSize: '11px', color: '#B0B8C1', marginLeft: '2px' }}>● {data.symbol.startsWith('^K') ? '실시간' : '장마감'}</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#191F28', letterSpacing: '-0.4px', marginBottom: '4px' }}>
                    {data.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: color, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {isPositive ? '▲' : '▼'} {Math.abs(data.change).toFixed(2)}({data.changePercent?.toFixed(2)}%)
                </div>
            </div>
            <div ref={chartRef} style={{ width: '100px', height: '44px', marginTop: '12px' }} />
        </div>
    );
}
