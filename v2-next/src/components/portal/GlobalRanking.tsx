"use client";

import React, { useState, useEffect } from 'react';

interface RankingItem {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    metric?: string; // e.g. Volume or Value
}

const COUNTRIES = [
    { id: 'KR', label: '국내', icon: '🇰🇷' },
    { id: 'US', label: '미국', icon: '🇺🇸' },
    { id: 'CN', label: '중국', icon: '🇨🇳' },
    { id: 'HK', label: '홍콩', icon: '🇭🇰' },
    { id: 'JP', label: '일본', icon: '🇯🇵' },
    { id: 'VN', label: '베트남', icon: '🇻🇳' },
];

export default function GlobalRanking() {
    const [activeCountry, setActiveCountry] = useState('KR');
    const [volumeTop, setVolumeTop] = useState<RankingItem[]>([]);
    const [valueTop, setValueTop] = useState<RankingItem[]>([]);
    const [searchTop, setSearchTop] = useState<RankingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            setLoading(true);
            try {
                // In a real scenario, we'd pass activeCountry to the API
                // For now, we use existing screeners and simulate country filtering
                const [volRes, trendRes] = await Promise.all([
                    fetch('/api/market-screener?scrId=most_actives&count=10'),
                    fetch('/api/market-screener?scrId=trending_tickers&count=10')
                ]);

                const volData = await volRes.json();
                const trendData = await trendRes.json();

                // Mocking Value Top by multiplying Vol * Price in the frontend for now
                const volItems = volData.data || [];
                const valueItems = [...volItems].sort((a, b) => (b.price * b.volume) - (a.price * a.volume));

                setVolumeTop(volItems.slice(0, 10));
                setValueTop(valueItems.slice(0, 10));
                setSearchTop(trendData.data || []);
            } catch (err) {
                console.error("Failed to fetch rankings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, [activeCountry]);

    return (
        <div className="global-ranking-section" style={{ background: 'white', borderRadius: '12px', padding: '32px', marginTop: '40px', border: '1px solid #F2F4F7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#191F28', margin: 0 }}>글로벌 실시간 랭킹</h2>
                <span style={{ color: '#B0B8C1', fontSize: '18px', cursor: 'help' }}>ⓘ</span>
            </div>

            {/* Country Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px' }}>
                {COUNTRIES.map(country => (
                    <button
                        key={country.id}
                        onClick={() => setActiveCountry(country.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            borderRadius: '100px',
                            border: '1px solid #F2F4F7',
                            background: activeCountry === country.id ? '#191F28' : 'white',
                            color: activeCountry === country.id ? 'white' : '#4E5968',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>{country.icon}</span> {country.label}
                    </button>
                ))}
            </div>

            {/* 3-Column Rankings Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
                <RankingList title="거래량 상위" items={volumeTop} loading={loading} />
                <RankingList title="거래대금 상위" items={valueTop} loading={loading} />
                <RankingList title="검색 상위" items={searchTop} loading={loading} />
            </div>
        </div>
    );
}

function RankingList({ title, items, loading }: { title: string; items: RankingItem[]; loading: boolean }) {
    return (
        <div className="ranking-column">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #F2F4F7', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#191F28', margin: 0 }}>{title} 〉</h3>
                {title === '검색 상위' && <span style={{ fontSize: '11px', color: '#B0B8C1' }}>4.22. 오전 11시 기준</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {loading ? (
                    [...Array(5)].map((_, i) => <div key={i} style={{ height: '40px', background: '#F8F9FA', borderRadius: '8px' }} />)
                ) : items.map((item, idx) => (
                    <div key={item.symbol} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: '#191F28', width: '20px' }}>{idx + 1}</span>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F2F4F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#8B95A1', fontWeight: 700 }}>
                            {item.name.slice(0, 1)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#191F28', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#191F28' }}>{Math.round(item.price).toLocaleString()}원</div>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: item.change >= 0 ? '#F04452' : '#0064FF' }}>
                                {item.change >= 0 ? '▲' : '▼'}{Math.abs(item.change).toLocaleString()} ({item.changePercent.toFixed(2)}%)
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
