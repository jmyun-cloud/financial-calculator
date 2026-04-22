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
    "주요 지표": [
        { symbol: '^KS11', name: '코스피', flag: '🇰🇷' },
        { symbol: '^KQ11', name: '코스닥', flag: '🇰🇷' },
        { symbol: '^DJI', name: '다우존스', flag: '🇺🇸' },
        { symbol: '^IXIC', name: '나스닥 종합', flag: '🇺🇸' },
        { symbol: '^GSPC', name: 'S&P 500', flag: '🇺🇸' },
        { symbol: 'USDKRW=X', name: '미국 USD', flag: '🇺🇸' },
        { symbol: 'GC=F', name: '국제 금', flag: '🪙' },
        { symbol: 'CL=F', name: 'WTI 원유', flag: '🛢️' },
    ],
    "국내": [
        { symbol: '^KS11', name: '코스피', flag: '🇰🇷' },
        { symbol: '^KQ11', name: '코스닥', flag: '🇰🇷' },
        { symbol: '^KS100', name: '코스피 100', flag: '🇰🇷' },
        { symbol: '^KS200', name: '코스피 200', flag: '🇰🇷' },
        { symbol: 'KMY00=F', name: '코스피 200 선물', flag: '🇰🇷' },
        { symbol: '^KS11', name: '코리아 밸류업', flag: '🇰🇷' }, // Using KOSPI as fallback if ValueUp symbol is elusive
    ],
    "미국": [
        { symbol: '^DJI', name: '다우존스', flag: '🇺🇸' },
        { symbol: '^IXIC', name: '나스닥 종합', flag: '🇺🇸' },
        { symbol: '^GSPC', name: 'S&P 500', flag: '🇺🇸' },
        { symbol: '^NDX', name: '나스닥 100', flag: '🇺🇸' },
        { symbol: 'RTY=F', name: '러셀 2000 선물', flag: '🇺🇸' },
        { symbol: '^VIX', name: 'VIX', flag: '🇺🇸' },
    ],
    "아시아": [
        { symbol: '000001.SS', name: '상해종합', flag: '🇨🇳' },
        { symbol: '399106.SZ', name: '심천종합', flag: '🇨🇳' },
        { symbol: '^HSI', name: '항생', flag: '🇭🇰' },
        { symbol: '^HSCE', name: '홍콩H', flag: '🇭🇰' },
        { symbol: '^N225', name: '니케이 225', flag: '🇯🇵' },
        { symbol: '^VNI', name: '호치민 VN', flag: '🇻🇳' },
    ],
    "유럽": [
        { symbol: '^STOXX50E', name: '유로스톡스 50', flag: '🇪🇺' },
        { symbol: 'FESX=F', name: '유로스톡스 50 선물', flag: '🇪🇺' },
        { symbol: '^GDAXI', name: '독일 DAX', flag: '🇩🇪' },
        { symbol: '^FTSE', name: '영국 FTSE 100', flag: '🇬🇧' },
        { symbol: '^FCHI', name: '프랑스 CAC 40', flag: '🇫🇷' },
        { symbol: '^IBEX', name: '스페인 IBEX 35', flag: '🇪🇸' },
    ],
    "시장지표": [
        { symbol: 'DX-Y.NYB', name: '달러인덱스', flag: '🇺🇸' },
        { symbol: 'USDKRW=X', name: '미국 USD', flag: '🇺🇸' },
        { symbol: '^KR10Y', name: '한국 국채 10년', flag: '🇰🇷' }, // Fallback if no data
        { symbol: '^TNX', name: '미국 국채 10년', flag: '🇺🇸' },
        { symbol: 'KRW=X', name: 'CD금리 (91일)', flag: '🇰🇷' }, // Placeholder
        { symbol: 'CL=F', name: 'WTI', flag: '🛢️' },
    ],
};

const CATEGORIES = ["주요 지표", "국내", "미국", "아시아", "유럽", "시장지표"];

export default function MarketIndexCards() {
    const [activeTab, setActiveTab] = useState("주요 지표");
    const [indices, setIndices] = useState<IndexData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllIndices = async () => {
            try {
                const symbols = CATEGORY_SYMBOLS[activeTab];
                const results = await Promise.all(symbols.map(async (s) => {
                    const res = await fetch(`/api/market-detail?symbol=${encodeURIComponent(s.symbol)}&range=1d&t=${Date.now()}`);
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
        const interval = setInterval(fetchAllIndices, 5000); // Poll every 5s

        // Reset scroll position on tab change
        const el = document.querySelector('.market-index-bar');
        if (el) el.scrollLeft = 0;

        return () => clearInterval(interval);
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
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px', fontWeight: 600, color: '#B0B8C1', alignItems: 'center' }}>
                        {CATEGORIES.map((cat, idx) => (
                            <React.Fragment key={cat}>
                                <span
                                    onClick={() => setActiveTab(cat)}
                                    style={{
                                        color: activeTab === cat ? '#191F28' : '#B0B8C1',
                                        fontWeight: activeTab === cat ? 900 : 600,
                                        cursor: 'pointer',
                                        transition: 'color 0.2s',
                                        fontSize: activeTab === cat ? '16px' : '15px'
                                    }}
                                >
                                    {cat}
                                </span>
                                {idx < CATEGORIES.length - 1 && <span style={{ color: '#E5E8EB', fontSize: '13px' }}>/</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#4E5968', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    전체 지수 보기 <span style={{ marginLeft: '4px', fontSize: '10px', color: '#B0B8C1' }}>&gt;</span>
                </div>
            </div>

            <div style={{ position: 'relative' }}>
                <div className={`market-index-bar hide-scrollbar ${loading ? 'opacity-50' : ''}`}
                    onScroll={(e) => {
                        const target = e.target as HTMLDivElement;
                        const rightBtn = document.getElementById('index-scroll-right');
                        const leftBtn = document.getElementById('index-scroll-left');
                        if (rightBtn) rightBtn.style.display = target.scrollLeft + target.clientWidth >= target.scrollWidth - 10 ? 'none' : 'flex';
                        if (leftBtn) leftBtn.style.display = target.scrollLeft <= 10 ? 'none' : 'flex';
                    }}
                    style={{
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

                {/* Left Slider Arrow */}
                <button
                    id="index-scroll-left"
                    style={{
                        position: 'absolute',
                        left: '-20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'white',
                        border: '1px solid #E5E8EB',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        display: 'none', // Hidden initially
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 2,
                        color: '#4E5968'
                    }}
                    onClick={() => {
                        const el = document.querySelector('.market-index-bar');
                        if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
                    }}
                >
                    <span style={{ fontSize: '18px', fontWeight: 600 }}>&lt;</span>
                </button>

                {/* Right Slider Arrow */}
                <button
                    id="index-scroll-right"
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
                        display: indices.length > 5 ? 'flex' : 'none',
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
    const prevPriceRef = React.useRef<number>(data.price);
    const [flashClass, setFlashClass] = useState('');

    const isPositive = data.change >= 0;
    const color = isPositive ? '#F04452' : '#3182F6';
    const areaColor = isPositive ? 'rgba(240, 68, 82, 0.08)' : 'rgba(49, 130, 246, 0.08)';
    const isLive = data.symbol.startsWith('^K') || data.symbol.includes('=X');

    useEffect(() => {
        if (data.price && data.price !== prevPriceRef.current) {
            const isUp = data.price > prevPriceRef.current;
            setFlashClass(isUp ? 'flash-red' : 'flash-blue');
            prevPriceRef.current = data.price;

            const timer = setTimeout(() => {
                setFlashClass('');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [data.price]);

    const priceStr = data.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '';
    const prevPriceStr = prevPriceRef.current?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '';

    let diffIndex = -1;
    if (flashClass && priceStr !== prevPriceStr) {
        for (let i = 0; i < priceStr.length; i++) {
            if (priceStr[i] !== prevPriceStr[i]) {
                diffIndex = i;
                break;
            }
        }
    }

    useEffect(() => {
        if (!chartRef.current || data.history.length === 0) return;

        const chart = createChart(chartRef.current, {
            width: 76,
            height: 40,
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
            crosshairMarkerVisible: false,
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
            minWidth: '224px',
            padding: '16px 18px',
            border: '1px solid #F2F4F7',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ffffff',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#191F28', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        overflow: 'hidden'
                    }}>
                        {flag}
                    </div>
                    <span>{data.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginLeft: '2px' }}>
                        <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: isLive ? '#00D166' : '#B0B8C1' }} />
                        <span style={{ fontSize: '11px', fontWeight: 500, color: '#B0B8C1' }}>{isLive ? '실시간' : '장마감'}</span>
                    </div>
                </div>
                <div style={{
                    fontSize: '19px',
                    fontWeight: 900,
                    color: '#191F28',
                    letterSpacing: '-0.5px',
                    marginBottom: '4px',
                    lineHeight: 1
                }}>
                    {diffIndex === -1 ? (
                        priceStr
                    ) : (
                        <>
                            <span>{priceStr.slice(0, diffIndex)}</span>
                            <span className={flashClass} style={{ transition: 'color 0.3s ease' }}>{priceStr.slice(diffIndex)}</span>
                        </>
                    )}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: color, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '10px' }}>{isPositive ? '▲' : '▼'}</span>
                    {Math.abs(data.change).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    ({data.changePercent?.toFixed(2)}%)
                </div>
            </div>
            <div ref={chartRef} style={{ width: '76px', height: '40px' }} />

            <style jsx>{`
                .flash-red {
                    color: #F04452 !important;
                }
                .flash-blue {
                    color: #3182F6 !important;
                }
            `}</style>
        </div>
    );
}
