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
    const [chartRange, setChartRange] = useState('1y');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`/api/market-detail?symbol=${encodeURIComponent(symbol)}&range=${chartRange}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const result = await res.json();
                // API returns data directly (price, change, chartData, ...)
                if (result && result.chartData) {
                    setData(result);
                } else {
                    console.error('[AnalysisPage] Unexpected API response:', result);
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
        <div className="flex h-screen items-center justify-center bg-[#F8FAFF]">
            <div className="animate-pulse text-[#0055FB] font-bold">심층 분석 로딩 중...</div>
        </div>
    );

    const isPositive = (data?.change || 0) >= 0;

    return (
        <div className="analysis-container">
            <Header />

            <main className="analysis-content container">
                <div className="analysis-header">
                    <div className="header-left">
                        <button onClick={() => router.back()} className="back-btn">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="symbol-info">
                            <h1 className="symbol-name">{data?.name || symbol}</h1>
                            <span className="symbol-ticker">{symbol}</span>
                        </div>
                    </div>

                    <div className="header-right">
                        <div className="price-group">
                            <div className="current-price">
                                {data?.price?.toLocaleString()}
                                <span className="price-unit">{symbol === 'BASE' ? '%' : ''}</span>
                            </div>
                            <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
                                {isPositive ? '▲' : '▼'} {Math.abs(data?.change || 0).toLocaleString()} ({Math.abs(data?.changePercent || 0).toFixed(2)}%)
                            </div>
                        </div>
                        <div className="action-buttons">
                            <button
                                className={`action-btn watchlist ${isWatched(symbol) ? 'active' : ''}`}
                                onClick={() => toggleWatchlist(symbol)}
                            >
                                <Star size={18} fill={isWatched(symbol) ? "#FFB800" : "none"} />
                            </button>
                            <button className="action-btn">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="analysis-grid">
                    <div className="chart-section shadow-premium">
                        <div className="section-header">
                            <div className="title-group">
                                <TrendingUp size={18} className="icon" />
                                <h2>고성능 실시간 차트</h2>
                            </div>
                            <div className="chart-controls">
                                <span>1분</span>
                                <span>5분</span>
                                <span className="active">1일</span>
                                <span>주</span>
                            </div>
                        </div>
                        <div className="chart-wrapper">
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
                    </div>

                    <div className="sidebar-section">
                        <div className="indicator-widget shadow-premium">
                            <div className="section-header">
                                <div className="title-group">
                                    <Search size={18} className="icon" />
                                    <h2>기술적 분석 지표</h2>
                                </div>
                            </div>
                            <div className="indicator-content">
                                <TechnicalSummary data={data?.chartData} />
                            </div>
                        </div>

                        <div className="news-widget shadow-premium">
                            <div className="section-header">
                                <div className="title-group">
                                    <Newspaper size={18} className="icon" />
                                    <h2>관련 주요 뉴스</h2>
                                </div>
                            </div>
                            <div className="news-list">
                                <div className="no-news">현재 종목 관련 실시간 뉴스를 불러오는 중입니다...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .analysis-container {
                    min-height: 100vh;
                    background: #F8FAFF;
                    padding-bottom: 60px;
                }
                .analysis-content {
                    margin-top: 32px;
                }
                .analysis-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    padding: 0 4px;
                }
                .header-left { display: flex; align-items: center; gap: 20px; }
                .back-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    border: 1px solid #E5E8EB;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #4E5968;
                    transition: all 0.2s;
                }
                .back-btn:hover { background: #F2F4F7; }
                .symbol-info { display: flex; flex-direction: column; }
                .symbol-name { font-size: 28px; font-weight: 800; color: #191F28; margin: 0; }
                .symbol-ticker { font-size: 14px; font-weight: 600; color: #8B95A1; }

                .header-right { display: flex; align-items: center; gap: 32px; }
                .price-group { text-align: right; }
                .current-price { font-size: 32px; font-weight: 900; color: #191F28; }
                .price-unit { font-size: 16px; font-weight: 600; color: #8B95A1; margin-left: 4px; }
                .price-change { font-size: 16px; font-weight: 700; margin-top: 2px; }
                .price-change.positive { color: #F04251; }
                .price-change.negative { color: #0064FF; }

                .action-buttons { display: flex; gap: 10px; }
                .action-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 14px;
                    border: 1px solid #E5E8EB;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #8B95A1;
                    transition: all 0.2s;
                }
                .action-btn:hover { background: #F2F4F7; color: #4E5968; }
                .action-btn.watchlist.active { color: #FFB800; border-color: #FFB800; background: #FFF9E6; }

                .analysis-grid {
                    display: grid;
                    grid-template-columns: 1fr 360px;
                    gap: 24px;
                    align-items: start;
                }
                .shadow-premium {
                    background: white;
                    border-radius: 28px;
                    border: 1px solid #F2F4F7;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                    overflow: hidden;
                }
                .section-header {
                    padding: 24px 28px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #F2F4F7;
                }
                .title-group { display: flex; align-items: center; gap: 10px; }
                .title-group h2 { font-size: 17px; font-weight: 800; color: #191F28; margin: 0; }
                .icon { color: #0055FB; }

                .chart-controls { display: flex; gap: 12px; }
                .chart-controls span {
                    font-size: 13px;
                    font-weight: 600;
                    color: #8B95A1;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 6px;
                }
                .chart-controls span.active { color: #0055FB; background: #E8F3FF; }

                .chart-wrapper { padding: 24px; }
                
                .sidebar-section { display: flex; flex-direction: column; gap: 24px; }
                .indicator-content { padding: 12px; }
                .news-widget { min-height: 400px; }
                .no-news { padding: 40px; text-align: center; color: #B0B8C1; font-size: 13px; font-weight: 500; }
            `}</style>
        </div>
    );
}
