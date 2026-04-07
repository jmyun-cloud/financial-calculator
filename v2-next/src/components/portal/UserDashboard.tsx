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
                <div className="market-summary-card shadow-sm">
                    <div className="summary-header">
                        <div className="header-left">
                            <h2 className="summary-title">오늘의 시장 요약</h2>
                            <span className="summary-date">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
                        </div>
                        <div className="live-badge">● 실시간</div>
                    </div>

                    <div className="market-tabs-wrapper" style={{ marginBottom: "20px" }}>
                        <div style={{ background: "#F2F4F6", borderRadius: "8px", padding: "3px", display: "inline-flex", gap: "2px" }}>
                            {marketTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveMarketTab(tab.id)}
                                    style={{
                                        border: "none",
                                        padding: "6px 16px",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        background: activeMarketTab === tab.id ? "#fff" : "transparent",
                                        color: activeMarketTab === tab.id ? "#0064FF" : "#8B95A1",
                                        borderRadius: activeMarketTab === tab.id ? "6px" : "0",
                                        boxShadow: activeMarketTab === tab.id ? "0 2px 4px rgba(0,0,0,0.05)" : "none"
                                    }}
                                >
                                    {tab.id}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="summary-grid" style={{ transition: "opacity 0.2s" }}>
                        {summaryIndices.map(idx => {
                            const item = marketData.find(m => m.symbol === idx.symbol) || {
                                price: "---",
                                change: "0.00",
                                changePercent: "0.00",
                                isPositive: true
                            };

                            const hasData = item.price !== "---";

                            // UTC market badge computation
                            const getMarketBadge = (sym: string) => {
                                const now = new Date();
                                const utcHour = now.getUTCHours();
                                const utcMin = now.getUTCMinutes();
                                const utcDay = now.getUTCDay();
                                const isWeekend = utcDay === 0 || utcDay === 6;
                                const minutes = utcHour * 60 + utcMin;

                                if (["^KS11", "^KQ11"].includes(sym)) {
                                    // UTC 00:00~06:30 (KST 09:00~15:30), 평일만
                                    if (!isWeekend && minutes >= 0 && minutes <= 390) return { type: "open", text: "장중" };
                                    return { type: "closed", text: "장마감" };
                                }

                                if (["^GSPC", "^IXIC", "^DJI"].includes(sym)) {
                                    const month = now.getUTCMonth() + 1;
                                    const date = now.getUTCDate();

                                    let isDst = false;
                                    if (month > 3 && month < 11) isDst = true;
                                    else if (month === 3) {
                                        const secondSunday = 1 + (7 - new Date(Date.UTC(now.getUTCFullYear(), 2, 1)).getUTCDay()) % 7 + 7;
                                        if (date >= secondSunday) isDst = true;
                                    } else if (month === 11) {
                                        const firstSunday = 1 + (7 - new Date(Date.UTC(now.getUTCFullYear(), 10, 1)).getUTCDay()) % 7;
                                        if (date < firstSunday) isDst = true;
                                    }

                                    if (isDst) {
                                        if (minutes >= 810 && minutes <= 1200) return { type: "open", text: "장중" };
                                    } else {
                                        if (minutes >= 870 && minutes <= 1260) return { type: "open", text: "장중" };
                                    }
                                    return { type: "closed", text: "장마감" };
                                }

                                if (["GC=F", "SI=F", "CL=F", "HG=F"].includes(sym)) {
                                    return { type: "24h", text: "24H" };
                                }

                                if (["KRW=X", "JPYKRW=X", "EURKRW=X", "CNYKRW=X"].includes(sym)) {
                                    return { type: "realtime", text: "실시간" };
                                }

                                return null;
                            };

                            const badge = getMarketBadge(idx.symbol);

                            // Dynamic Sparkline Path based on direction
                            const pathData = item.isPositive
                                ? "M0 25 L 15 22 L 30 26 L 45 15 L 60 18 L 75 8 L 100 5"  // Upswing, straight sharp lines
                                : "M0 5 L 15 8 L 30 5 L 45 15 L 60 12 L 75 22 L 100 25"; // Downswing, straight sharp lines

                            const strokeColor = !hasData ? '#E5E8EB' : (item.isPositive ? '#FF4D4D' : '#0064FF');
                            const fillId = item.isPositive ? 'spark-up' : 'spark-down';
                            const fillColor = !hasData ? 'transparent' : `url(#${fillId})`;
                            const fillPath = `${pathData} V 30 H 0 Z`;

                            return (
                                <div key={idx.symbol} className="summary-card" onClick={() => setExpandedCard(expandedCard === idx.symbol ? null : idx.symbol)} style={{ cursor: "pointer", transition: "all 0.2s" }}>
                                    <div className="card-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {idx.name === "원/달러 환율" ? "USD/KRW" : idx.name}
                                            </span>
                                            {idx.symbol === "GC=F" && <span style={{ fontSize: "10px", color: "#8B95A1", whiteSpace: "nowrap", flexShrink: 0 }}>USD/oz</span>}
                                        </div>
                                        {badge && badge.type === "realtime" ? (
                                            <span style={{ fontSize: "10px", color: "#8B95A1", whiteSpace: "nowrap", flexShrink: 0 }}>{badge.text}</span>
                                        ) : badge ? (
                                            <span style={{
                                                fontSize: "10px",
                                                fontWeight: 700,
                                                padding: "2px 6px",
                                                borderRadius: "4px",
                                                whiteSpace: "nowrap",
                                                flexShrink: 0,
                                                background: badge.type === "open" ? "#FFF0F0" : badge.type === "closed" ? "#F2F4F6" : "#E8F9F0",
                                                color: badge.type === "open" ? "#F04251" : badge.type === "closed" ? "#8B95A1" : "#1B8947"
                                            }}>
                                                {badge.text}
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="card-value">{item.price}</div>
                                    <div className={`card-change ${!hasData ? '' : (parseFloat(item.changePercent) === 0 ? 'neutral' : (item.isPositive ? 'positive' : 'negative'))}`}>
                                        {hasData ? (
                                            parseFloat(item.changePercent) === 0 
                                                ? `0.00 (0.00%)` 
                                                : `${item.isPositive ? '+' : '-'}${item.change} (${item.isPositive ? '+' : '-'}${item.changePercent}%)`
                                        ) : '데이터 수집 중'}
                                    </div>
                                    <div className="sparkline">
                                        <svg viewBox="0 0 100 30" width="100%" height="30" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="spark-up" x1="0" x2="0" y1="0" y2="1">
                                                    <stop offset="0%" stopColor="#F04251" stopOpacity="0.2" />
                                                    <stop offset="100%" stopColor="#F04251" stopOpacity="0" />
                                                </linearGradient>
                                                <linearGradient id="spark-down" x1="0" x2="0" y1="0" y2="1">
                                                    <stop offset="0%" stopColor="#0064FF" stopOpacity="0.2" />
                                                    <stop offset="100%" stopColor="#0064FF" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <path d={fillPath} fill={fillColor} />
                                            <path
                                                d={pathData}
                                                fill="none"
                                                stroke={strokeColor}
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                vectorEffect="non-scaling-stroke"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {expandedCard && (
                        <MarketDetailBar
                            symbol={expandedCard}
                            name={summaryIndices.find(idx => idx.symbol === expandedCard)?.name || ""}
                        />
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
