"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import { ArrowLeft, TrendingUp, Newspaper, Search, Star, Share2 } from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import Link from 'next/link';

// Dynamically import heavy charting components
const ProfessionalChart = dynamic(() => import('@/components/portal/ProfessionalChart'), { ssr: false });
const TechnicalSummary = dynamic(() => import('@/components/portal/TechnicalSummary'), { ssr: false });

export default function AnalysisPage() {
    const params = useParams();
    const router = useRouter();
    const symbol = params.symbol as string;
    const { toggleWatchlist, isWatched } = useWatchlist();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [chartRange, setChartRange] = useState('1m'); // Use 1m (intraday) by default

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`/api/market-detail?symbol=${encodeURIComponent(symbol)}&range=${chartRange}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const result = await res.json();
                if (result) {
                    setData(result);
                }
            } catch (err) {
                console.error("Failed to fetch symbol detail", err);
            } finally {
                setLoading(false);
            }
        };

        if (symbol) fetchDetail();
    }, [symbol, chartRange]);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', color: '#0055FB', fontWeight: 700 }}>
            세밀한 시장 분석 정보를 불러오는 중...
        </div>
    );

    const isPositive = (data?.change || 0) >= 0;
    const color = isPositive ? '#F04452' : '#3182F6';

    const categories = [
        { symbol: '^KS11', name: '코스피', color: '#F04452' },
        { symbol: '^KQ11', name: '코스닥', color: '#F04452' },
        { symbol: '^DJI', name: '다우존스', color: '#3182F6' },
        { symbol: '^IXIC', name: '나스닥', color: '#3182F6' },
    ];

    return (
        <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>
            <Header />

            <div className="container" style={{ display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: '1px', background: '#F2F4F7', marginTop: '1px' }}>

                {/* Left Sidebar: Market Stats */}
                <aside style={{ background: '#ffffff', padding: '32px 24px', borderRight: '1px solid #F2F4F7' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '8px', cursor: 'pointer' }} onClick={() => router.back()}>
                            &lt; 국내/국내 지수·선물
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ width: '24px', height: '24px', background: '#F2F4F7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🇰🇷</div>
                            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#191F28' }}>{data?.name || symbol}</h1>
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: 900, color: '#191F28', marginBottom: '4px' }}>
                            {data?.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: color }}>
                            {isPositive ? '▲' : '▼'} {Math.abs(data?.change || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} (+{data?.changePercent?.toFixed(2)}%)
                        </div>
                        <div style={{ fontSize: '12px', color: '#B0B8C1', marginTop: '4px' }}>04.22. • 장마감</div>
                    </div>

                    <div style={{ borderTop: '1px solid #F2F4F7', paddingTop: '20px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#191F28', marginBottom: '16px' }}>시세정보</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="stat-row"><span>52주 최고</span><span style={{ fontWeight: 700 }}>{data?.fiftyTwoWeekHigh?.toLocaleString()}</span></div>
                            <div className="stat-row"><span>52주 최저</span><span style={{ fontWeight: 700 }}>{data?.fiftyTwoWeekLow?.toLocaleString()}</span></div>
                            <div style={{ height: '1px', background: '#F2F4F7', margin: '4px 0' }} />
                            <div className="stat-row"><span>전일</span><span style={{ fontWeight: 600 }}>{(data?.price - data?.change).toLocaleString()}</span></div>
                            <div className="stat-row"><span>시가</span><span style={{ fontWeight: 600 }}>{(data?.price - data?.change * 0.8).toLocaleString()}</span></div>
                            <div className="stat-row"><span>고가</span><span style={{ fontWeight: 600, color: '#F04452' }}>{data?.regularMarketDayHigh?.toLocaleString()}</span></div>
                            <div className="stat-row"><span>저가</span><span style={{ fontWeight: 600, color: '#3182F6' }}>{data?.regularMarketDayLow?.toLocaleString()}</span></div>
                            <div className="stat-row"><span>거래량</span><span style={{ fontWeight: 600 }}>{(data?.regularMarketVolume / 1000).toFixed(0)}천주</span></div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #F2F4F7', paddingTop: '20px', marginTop: '24px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#191F28', marginBottom: '16px' }}>투자정보</h3>
                        <div className="stat-row"><span>외국인</span><span style={{ color: '#3182F6' }}>-6,749</span></div>
                        <div className="stat-row"><span>기관</span><span style={{ color: '#3182F6' }}>-4,487</span></div>
                        <div className="stat-row"><span>개인</span><span style={{ color: '#F04452' }}>+12,405</span></div>
                    </div>
                </aside>

                {/* Main Content: Chart & Table */}
                <main style={{ background: '#ffffff', minHeight: '800px' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #F2F4F7' }}>
                        <div style={{ padding: '16px 24px', fontSize: '15px', fontWeight: 800, borderBottom: '2px solid #191F28', cursor: 'pointer' }}>차트·시세</div>
                        <div style={{ padding: '16px 24px', fontSize: '15px', fontWeight: 500, color: '#8B95A1', cursor: 'pointer' }}>토론</div>
                    </div>

                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#191F28' }}>차트</h2>
                        </div>

                        <div style={{ border: '1px solid #F2F4F7', borderRadius: '12px', padding: '20px', background: '#F9FAFB' }}>
                            {data?.chartData && (
                                <ProfessionalChart
                                    data={data.chartData}
                                    isPositive={isPositive}
                                    height={400}
                                    currentRange={chartRange}
                                    onRangeChange={(r) => setChartRange(r)}
                                />
                            )}
                        </div>

                        <div style={{ marginTop: '40px' }}>
                            <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #F2F4F7', marginBottom: '16px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 700, paddingBottom: '8px', borderBottom: '2px solid #191F28' }}>시세</div>
                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#8B95A1', paddingBottom: '8px' }}>시간별</div>
                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#8B95A1', paddingBottom: '8px' }}>일별</div>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: '#8B95A1', borderBottom: '1px solid #F2F4F7' }}>
                                        <th style={{ padding: '12px 0' }}>날짜</th>
                                        <th>시각</th>
                                        <th>현재가</th>
                                        <th>전일대비</th>
                                        <th>거래량</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.chartData?.slice(-10).reverse().map((d: any, idx: number) => {
                                        const date = new Date(d.time * 1000);
                                        return (
                                            <tr key={idx} style={{ borderBottom: '1px solid #F2F4F7' }}>
                                                <td style={{ padding: '14px 0', color: '#4E5968' }}>{date.toLocaleDateString()}</td>
                                                <td style={{ color: '#4E5968' }}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                <td style={{ fontWeight: 600 }}>{d.close.toLocaleString()}</td>
                                                <td style={{ color: d.close >= d.open ? '#F04452' : '#3182F6' }}>
                                                    {d.close >= d.open ? '▲' : '▼'} {Math.abs(d.close - d.open).toFixed(2)}
                                                </td>
                                                <td style={{ color: '#4E5968' }}>{d.volume?.toLocaleString() || '0'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar: Forums & Quick Indices */}
                <aside style={{ background: '#ffffff', padding: '32px 24px', borderLeft: '1px solid #F2F4F7' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#191F28' }}>🔥 HOT 토론글</h3>
                            <span style={{ fontSize: '12px', color: '#00D166', fontWeight: 600 }}>✎ 글쓰기</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ borderBottom: '1px solid #F2F4F7', paddingBottom: '16px' }}>
                                    <div style={{ fontSize: '12px', color: '#8B95A1', marginBottom: '6px' }}>성난황소 • 13시간 전</div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#333D4B', lineHeight: 1.4 }}>미국 증시 반등 가능성 있을까요? 현재 포지션 공유합니다.</div>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px', color: '#B0B8C1', fontSize: '12px' }}>
                                        <span>👍 37</span><span>💬 13</span><span>👁 8</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#191F28', marginBottom: '16px' }}>주요 증시</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {categories.map(cat => (
                                <div key={cat.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '18px', height: '18px', background: '#F2F4F7', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🇰🇷</div>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#4E5968' }}>{cat.name}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#191F28' }}>6,417.93</div>
                                        <div style={{ fontSize: '11px', fontWeight: 600, color: cat.color }}>▲ 29.46</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            <style jsx>{`
                .stat-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 13px;
                    color: #4E5968;
                }
                .stat-row span:first-child {
                    color: #8B95A1;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
            `}</style>
        </div>
    );
}
