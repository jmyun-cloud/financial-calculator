"use client";
import React, { useEffect, useState } from "react";
import GoalTracker from "@/components/GoalTracker";
import { useMarketData } from "@/hooks/useMarketData";

function MarketDetailBar({ symbol, name }: { symbol: string, name: string }) {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setData(null);
        setError(false);
        fetch(`/api/market-detail?symbol=${encodeURIComponent(symbol)}`)
            .then(res => res.json())
            .then(d => {
                if (!isMounted) return;
                if (d.error) setError(true);
                else setData(d);
            })
            .catch(() => {
                if (isMounted) setError(true);
            });
        return () => { isMounted = false; };
    }, [symbol]);

    if (error) return <div className="detail-card error">데이터를 불러올 수 없습니다</div>;
    if (!data) return <div className="detail-card loading">상세 정보를 불러오는 중입니다...</div>;

    const formatNumber = (n: number | null | undefined) => {
        if (n === null || n === undefined) return "-";
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n);
    };

    const formatVolume = (vol: number | null | undefined) => {
        if (!vol) return "-";
        if (vol >= 100000000) return (vol / 100000000).toFixed(1) + "억";
        if (vol >= 10000) return (vol / 10000).toFixed(1) + "만";
        return new Intl.NumberFormat('en-US').format(vol);
    };

    return (
        <div className="detail-card fade-in">
            <div className="detail-title">{name} 상세</div>
            <div className="detail-stats">
                <div className="detail-col">
                    <span className="d-label">52주 최고</span>
                    <span className="d-val">{formatNumber(data.fiftyTwoWeekHigh)}</span>
                </div>
                <div className="detail-col">
                    <span className="d-label">52주 최저</span>
                    <span className="d-val">{formatNumber(data.fiftyTwoWeekLow)}</span>
                </div>
                {data.regularMarketVolume > 0 && (
                    <div className="detail-col">
                        <span className="d-label">거래량</span>
                        <span className="d-val">{formatVolume(data.regularMarketVolume)}{!symbol.includes("KRW") && !symbol.includes("=F") ? "주" : ""}</span>
                    </div>
                )}
            </div>
            <style jsx>{`
                .detail-card {
                    background: #F4F8FF;
                    border-radius: 12px;
                    padding: 16px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 24px;
                    border: 1px solid rgba(0, 100, 255, 0.05);
                }
                .detail-card.error { color: var(--danger); justify-content: center; }
                .detail-card.loading { color: var(--text-secondary); justify-content: center; }
                .detail-title {
                    font-weight: 800;
                    color: #0064FF;
                    font-size: 14px;
                }
                .detail-stats {
                    display: flex;
                    gap: 32px;
                }
                .detail-col {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 4px;
                }
                .d-label {
                    font-size: 11px;
                    color: var(--text-secondary);
                    font-weight: 500;
                }
                .d-val {
                    font-size: 14px;
                    font-weight: 800;
                    color: var(--text-primary);
                }
                .fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

function MarketSparkline({ data, color }: { data: string, color: string }) {
    const fillId = `spark-fill-${color.replace('#', '')}`;
    const fillPath = `${data} V 30 H 0 Z`;
    return (
        <svg viewBox="0 0 100 30" width="100%" height="30" preserveAspectRatio="none" style={{ display: 'block' }}>
            <defs>
                <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={fillPath} fill={`url(#${fillId})`} />
            <path
                d={data}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

export default function UserDashboard() {
    const [isClient, setIsClient] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // default to false
    const [activeMarketTab, setActiveMarketTab] = useState("국내");
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const { data: marketData, loading } = useMarketData();

    useEffect(() => {
        setIsClient(true);

        const handleLogin = () => setIsLoggedIn(true);
        window.addEventListener("fc_mock_login", handleLogin);
        return () => window.removeEventListener("fc_mock_login", handleLogin);
    }, []);

    if (!isClient) return <div className="skeleton-loader" style={{ height: '300px' }} />;

    if (!isLoggedIn) {
        // 비로그인 상태: 오늘의 시장 요약
        const marketTabs = [
            {
                id: "국내",
                indices: [
                    { symbol: "^KS11", name: "KOSPI" },
                    { symbol: "^KQ11", name: "KOSDAQ" },
                    { symbol: "KRW=X", name: "원/달러 환율" },
                    { symbol: "GC=F", name: "국제 금 시세" }
                ]
            },
            {
                id: "해외",
                indices: [
                    { symbol: "^GSPC", name: "S&P 500" },
                    { symbol: "^IXIC", name: "Nasdaq" },
                    { symbol: "^DJI", name: "Dow Jones" },
                    { symbol: "^N225", name: "Nikkei 225" }
                ]
            },
            {
                id: "환율",
                indices: [
                    { symbol: "KRW=X", name: "USD/KRW" },
                    { symbol: "JPYKRW=X", name: "JPY/KRW" },
                    { symbol: "EURKRW=X", name: "EUR/KRW" },
                    { symbol: "CNYKRW=X", name: "CNY/KRW" }
                ]
            },
            {
                id: "원자재",
                indices: [
                    { symbol: "GC=F", name: "Gold" },
                    { symbol: "SI=F", name: "Silver" },
                    { symbol: "CL=F", name: "WTI" },
                    { symbol: "HG=F", name: "Copper" }
                ]
            }
        ];

        const summaryIndices = marketTabs.find(t => t.id === activeMarketTab)?.indices || marketTabs[0].indices;

        return (
            <div className="market-summary-container">
                {/* 오늘의 시장 요약 */}
                <div className="bg-white rounded-[32px] p-8 border border-[#F2F4F7] shadow-[0_4px_24px_rgba(0,0,0,0.03)] mb-8">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-[20px] font-extrabold text-[#191F28] tracking-tight">오늘의 시장 요약</h2>
                            <span className="text-[13px] text-[#8B95A1] font-bold">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
                        </div>
                        <div className="bg-[#E8F9F0] text-[#1B8947] text-[12px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                            <span className="w-1.5 h-1.5 bg-[#1B8947] rounded-full animate-pulse"></span>
                            ● 실시간
                        </div>
                    </div>

                    <div className="flex gap-2 bg-[#F9FAFB] p-1 rounded-[14px] self-start inline-flex mb-8">
                        {marketTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveMarketTab(tab.id)}
                                className={`px-4 py-2 text-[13px] font-bold rounded-[10px] transition-all duration-300 ${
                                    activeMarketTab === tab.id 
                                    ? 'bg-white text-[#0064FF] shadow-[0_2px_8px_rgba(0,0,0,0.05)]' 
                                    : 'bg-transparent text-[#8B95A1] hover:text-[#4E5968]'
                                }`}
                            >
                                {tab.id}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {summaryIndices.map(idx => {
                            const item = marketData.find(m => m.symbol === idx.symbol) || {
                                price: "---",
                                change: "0.00",
                                changePercent: "0.00",
                                isPositive: true
                            };

                            const hasData = item.price !== "---";
                            const trendColor = item.isPositive ? '#F04251' : '#0064FF';
                            
                            const pathData = item.isPositive
                                ? "M0 25 L 15 22 L 30 26 L 45 15 L 60 18 L 75 8 L 100 5"
                                : "M0 5 L 15 8 L 30 5 L 45 15 L 60 12 L 75 22 L 100 25";

                            return (
                                <div 
                                    key={idx.symbol} 
                                    className={`group flex flex-col bg-white border border-[#F2F4F7] rounded-[24px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 cursor-pointer hover:shadow-[0_12px_24px_rgba(0,100,255,0.06)] hover:-translate-y-1 ${expandedCard === idx.symbol ? 'border-[#0064FF] bg-[#F8FBFF]' : ''}`}
                                    onClick={() => setExpandedCard(expandedCard === idx.symbol ? null : idx.symbol)}
                                >
                                    <div className="flex flex-col gap-1 mb-6">
                                        <span className="text-[11px] font-extrabold text-[#8B95A1] uppercase tracking-wider">{idx.name}</span>
                                        <h3 className="text-[20px] font-black text-[#191F28] tabular-nums tracking-tighter">{item.price}</h3>
                                        <div className={`text-[12px] font-extrabold tabular-nums flex items-center gap-1 ${item.isPositive ? 'text-[#F04251]' : 'text-[#0064FF]'}`}>
                                            {hasData ? (
                                                <>
                                                    <span>{item.isPositive ? '▲' : '▼'}</span>
                                                    <span>{item.change}</span>
                                                    <span className="opacity-80">({item.isPositive ? '+' : '-'}{item.changePercent}%)</span>
                                                </>
                                            ) : '수집중'}
                                        </div>
                                    </div>
                                    <div className="h-12 w-full mt-auto opacity-80 group-hover:opacity-100 transition-opacity">
                                        <MarketSparkline data={pathData} color={hasData ? trendColor : '#E5E8EB'} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {expandedCard && (
                        <div className="animate-[slide-up_0.3s_ease-out]">
                            <MarketDetailBar
                                symbol={expandedCard}
                                name={summaryIndices.find(idx => idx.symbol === expandedCard)?.name || ""}
                            />
                        </div>
                    )}


                    {/* 로그인 유도 배너 */}
                    <div className="login-cta-banner">
                        <div className="cta-content">
                            <span className="cta-icon">📉</span>
                            <div className="cta-text">
                                <span className="cta-title">내 자산을 한눈에 관리하고 싶다면?</span>
                                <span className="cta-desc">로그인하면 자산 현황 · DSR · 재무 목표를 바로 볼 수 있어요</span>
                            </div>
                        </div>
                        <button className="cta-btn" onClick={() => setIsLoggedIn(true)}>무료 시작하기</button>
                    </div>
                </div>

                {/* SIDEBAR GOALS (Integrated for Layout consistency) */}
                <div className="dashboard-sidebar-widgets" style={{ marginTop: '24px' }}>
                    <div className="widget-section">
                        <h3 className="section-title">내 재무 목표</h3>
                        <GoalTracker />
                    </div>
                </div>

                <style jsx>{`
                    .market-summary-container {
                        margin-bottom: 32px;
                    }
                    .market-summary-card {
                        background: var(--surface);
                        border-radius: 28px;
                        padding: 32px;
                        border: 1px solid var(--border);
                    }
                    .summary-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 24px;
                    }
                    .summary-title {
                        font-size: 1.25rem;
                        font-weight: 800;
                        color: var(--text-primary);
                        margin: 0;
                    }
                    .summary-date {
                        font-size: 0.85rem;
                        color: var(--text-secondary);
                    }
                    .live-badge {
                        font-size: 0.75rem;
                        font-weight: 700;
                        color: #00D166;
                        background: rgba(0, 209, 102, 0.1);
                        padding: 4px 12px;
                        border-radius: 100px;
                    }
                    .summary-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 12px;
                        margin-bottom: 24px;
                    }
                    .summary-card {
                        background: var(--surface-2);
                        padding: 20px;
                        border-radius: 20px;
                        border: 1px solid var(--border);
                    }
                    .card-label {
                        font-size: 0.75rem;
                        font-weight: 600;
                        color: var(--text-secondary);
                        display: block;
                        margin-bottom: 8px;
                    }
                    .card-value {
                        font-size: 1.3rem;
                        font-weight: 800;
                        color: var(--text-primary);
                        margin-bottom: 4px;
                        letter-spacing: -0.02em;
                    }
                    .card-change {
                        font-size: 0.75rem;
                        font-weight: 700;
                        margin-bottom: 12px;
                    }
                     .card-change.positive { color: #F04251; }
                    .card-change.negative { color: #0064FF; }
                    .card-change.neutral { color: #8B95A1; }
                    .sparkline { height: 30px; margin-top: 8px; }

                    .login-cta-banner {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background: #F4F8FF;
                        padding: 20px 24px;
                        border-radius: 20px;
                        border: 1px solid rgba(0, 100, 255, 0.1);
                    }
                    .cta-content {
                        display: flex;
                        align-items: center;
                        gap: 16px;
                    }
                    .cta-icon {
                        width: 44px;
                        height: 44px;
                        background: white;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.5rem;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                    }
                    .cta-text { display: flex; flex-direction: column; gap: 2px; }
                    .cta-title {
                        font-size: 0.95rem;
                        font-weight: 700;
                        color: var(--text-primary);
                    }
                    .cta-desc {
                        font-size: 0.8rem;
                        color: var(--text-secondary);
                    }
                    .cta-btn {
                        background: white;
                        color: var(--text-primary);
                        border: 1px solid var(--border);
                        padding: 10px 20px;
                        border-radius: 14px;
                        font-size: 0.9rem;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.2s;
                        box-shadow: var(--shadow-sm);
                    }
                    .cta-btn:hover { background: var(--surface-2); transform: translateY(-1px); }

                    .section-title {
                        font-size: 1.1rem;
                        font-weight: 800;
                        margin-bottom: 16px;
                        color: var(--text-primary);
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="user-dashboard-v3">
            {/* HER0 ASSET CARD */}
            <div className="hero-asset-card shadow-premium">
                <div className="asset-label">내 총 자산</div>
                <div className="asset-amount">₩ 48,320,000</div>

                <div className="asset-sub-grid">
                    <div className="asset-sub-item">
                        <span className="sub-label">이번 달 수익</span>
                        <span className="sub-value highlight">+ ₩320,000</span>
                    </div>
                    <div className="asset-sub-item">
                        <span className="sub-label">DSR 잔여</span>
                        <span className="sub-value">35.2%</span>
                    </div>
                    <div className="asset-sub-item">
                        <span className="sub-label">목표 달성률</span>
                        <span className="sub-value">68%</span>
                    </div>
                </div>
            </div>

            {/* SIDEBAR GOALS */}
            <div className="dashboard-sidebar-widgets">
                <div className="widget-section">
                    <h3 className="section-title">내 재무 목표</h3>
                    <GoalTracker />
                </div>
            </div>

            <style jsx>{`
                .user-dashboard-v3 {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    margin-bottom: 32px;
                }
                .hero-asset-card {
                    background: linear-gradient(135deg, #0064FF 0%, #0046B3 100%);
                    border-radius: 28px;
                    padding: 32px;
                    color: white;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 20px 40px -10px rgba(0, 100, 255, 0.3);
                }
                .hero-asset-card::after {
                    content: '';
                    position: absolute;
                    top: -20%;
                    right: -10%;
                    width: 250px;
                    height: 250px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 50%;
                }
                .asset-label {
                    font-size: 1rem;
                    opacity: 0.8;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                }
                .asset-amount {
                    font-size: 2.8rem;
                    font-weight: 800;
                    margin-bottom: 40px;
                    letter-spacing: -0.02em;
                }
                .asset-sub-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                }
                .asset-sub-item {
                    background: rgba(255,255,255,0.12);
                    padding: 18px 16px;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .sub-label {
                    font-size: 0.8rem;
                    opacity: 0.75;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.8);
                }
                .sub-value {
                    font-size: 1.1rem;
                    font-weight: 700;
                }
                .sub-value.highlight {
                    color: #FFD363;
                }
                .section-title {
                    font-size: 1.1rem;
                    font-weight: 800;
                    margin-bottom: 16px;
                    color: var(--text-primary);
                }
                .skeleton-loader {
                    height: 300px;
                    background: rgba(0,0,0,0.05);
                    border-radius: 28px;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 0.3; } 100% { opacity: 0.6; } }
            `}</style>
        </div>
    );
}
