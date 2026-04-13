"use client";
import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import GoalTracker from "@/components/GoalTracker";
import { useMarketData } from "@/hooks/useMarketData";

const ProfessionalChart = dynamic(() => import("./ProfessionalChart"), { ssr: false });
const TechnicalSummary = dynamic(() => import("./TechnicalSummary"), { ssr: false });
import EconomicCalendar from "./EconomicCalendar";
import SentimentGauge from "./SentimentGauge";

export default function UserDashboard() {
    const [isClient, setIsClient] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { data: marketData, loading } = useMarketData();

    // Guest view states (Premium upgrade)
    const [activeMarketTab, setActiveMarketTab] = useState("국내");
    const [selectedCard, setSelectedCard] = useState<string>("");
    const [detailData, setDetailData] = useState<any>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    // Fetch detailed data when a card is selected
    useEffect(() => {
        if (!selectedCard) {
            setDetailData(null);
            return;
        }

        const fetchDetail = async () => {
            setIsDetailLoading(true);
            try {
                const res = await fetch(`/api/market-detail?symbol=${encodeURIComponent(selectedCard)}`);
                if (res.ok) {
                    const data = await res.json();
                    setDetailData(data);
                }
            } catch (err) {
                console.error("Failed to fetch detail:", err);
            } finally {
                setIsDetailLoading(false);
            }
        };

        fetchDetail();
    }, [selectedCard]);

    const formatVolume = (vol: number | null) => {
        if (!vol || vol === 0) return "---";
        if (vol >= 100000000) return (vol / 100000000).toFixed(1) + "억주";
        if (vol >= 10000) return (vol / 10000).toFixed(0) + "만주";
        return vol.toLocaleString() + "주";
    };

    useEffect(() => {
        setIsClient(true);
        const handleLogin = () => setIsLoggedIn(true);
        window.addEventListener("fc_mock_login", handleLogin);
        return () => window.removeEventListener("fc_mock_login", handleLogin);
    }, []);

    // Helper data for premium design
    const marketTabs = useMemo(() => [
        {
            id: "국내",
            indices: [
                { symbol: "^KS11", name: "KOSPI", flag: "🇰🇷", unit: "pt" },
                { symbol: "^KQ11", name: "KOSDAQ", flag: "🇰🇷", unit: "pt" },
                { symbol: "KRW=X", name: "USD/KRW", flag: "💱", unit: "원" },
                { symbol: "GC=F", name: "금 시세", flag: "🥇", unit: "USD/oz" }
            ]
        },
        {
            id: "해외",
            indices: [
                { symbol: "^GSPC", name: "S&P 500", flag: "🇺🇸", unit: "pt" },
                { symbol: "^IXIC", name: "Nasdaq", flag: "🇺🇸", unit: "pt" },
                { symbol: "^DJI", name: "Dow Jones", flag: "🇺🇸", unit: "pt" },
                { symbol: "^N225", name: "Nikkei 225", flag: "🇯🇵", unit: "pt" }
            ]
        },
        {
            id: "환율",
            indices: [
                { symbol: "KRW=X", name: "USD/KRW", flag: "🇺🇸", unit: "원" },
                { symbol: "JPYKRW=X", name: "JPY/KRW", flag: "🇯🇵", unit: "원/100엔" },
                { symbol: "EURKRW=X", name: "EUR/KRW", flag: "🇪🇺", unit: "원" },
                { symbol: "CNYKRW=X", name: "CNY/KRW", flag: "🇨🇳", unit: "원" }
            ]
        },
        {
            id: "원자재",
            indices: [
                { symbol: "GC=F", name: "Gold", flag: "🥇", unit: "USD/oz" },
                { symbol: "SI=F", name: "Silver", flag: "🥈", unit: "USD/oz" },
                { symbol: "CL=F", name: "WTI", flag: "🛢️", unit: "USD/배럴" },
                { symbol: "HG=F", name: "Copper", flag: "🧱", unit: "USD/lb" }
            ]
        }
    ], []);

    const getMarketStatus = (sym: string) => {
        const now = new Date();
        const kstHour = (now.getUTCHours() + 9) % 24;
        const kstMin = now.getUTCMinutes();
        const kstDay = now.getUTCDay();
        const isWeekend = kstDay === 0 || kstDay === 6;

        if (["^KS11", "^KQ11"].includes(sym)) {
            const minutes = kstHour * 60 + kstMin;
            if (!isWeekend && minutes >= 540 && minutes <= 930) return { type: "open", text: "장중" };
            return { type: "closed", text: "장마감" };
        }
        return { type: "realtime", text: "실시간" };
    };

    if (!isClient) return <div className="skeleton-loader" style={{ height: '300px', background: 'rgba(0,0,0,0.05)', borderRadius: '28px' }} />;

    if (!isLoggedIn) {
        const currentTab = marketTabs.find(t => t.id === activeMarketTab) || marketTabs[0];
        const summaryIndices = currentTab.indices;

        return (
            <div className="market-summary-container">
                <div className="market-summary-card shadow-premium-clean">
                    <div className="summary-section-header">
                        <div className="header-left">
                            <h2 className="summary-title">오늘의 시장 요약</h2>
                            <span className="summary-date">{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}</span>
                        </div>
                        <div className="live-status-badge">
                            <span className="dot"></span>
                            실시간
                        </div>
                    </div>

                    <div className="market-tabs-nav">
                        {marketTabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-item ${activeMarketTab === tab.id ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveMarketTab(tab.id);
                                    setSelectedCard(""); // clear on tab switch
                                }}
                            >
                                {tab.id}
                            </button>
                        ))}
                    </div>

                    <div className="summary-grid">
                        {summaryIndices.map(idx => {
                            const item = marketData.find(m => m.symbol === idx.symbol) || {
                                price: "---",
                                change: "0.00",
                                changePercent: "0.00",
                                isPositive: true
                            };
                            const status = getMarketStatus(idx.symbol);
                            const isSelected = selectedCard === idx.symbol;

                            return (
                                <div
                                    key={idx.symbol}
                                    className={`summary-card-v2 ${isSelected ? 'selected' : ''}`}
                                    onClick={() => setSelectedCard(selectedCard === idx.symbol ? "" : idx.symbol)}
                                >
                                    <div className="card-top">
                                        <div className="card-name-group">
                                            <span className="symbol-name">{idx.name}</span>
                                            <span className="symbol-flag">{idx.flag}</span>
                                        </div>
                                        <span className={`status-badge ${status.type}`}>
                                            {status.text}
                                        </span>
                                    </div>
                                    <div className="card-main">
                                        <div className="price-val">{item.price}</div>
                                        <div className={`change-val ${item.isPositive ? 'positive' : 'negative'}`}>
                                            {item.isPositive ? '▲' : '▼'} {item.change} ({item.isPositive ? '+' : ''}{item.changePercent}%)
                                        </div>
                                    </div>
                                    <div className="card-unit-row">
                                        <span className="unit-label">{idx.unit}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Market Detail Panel (Investing.com Style) */}
                    <div
                        className="detail-preview-section"
                        style={{
                            maxHeight: selectedCard ? '450px' : '0',
                            opacity: selectedCard ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease, margin 0.3s ease',
                            marginBottom: selectedCard ? '24px' : '0',
                            padding: selectedCard ? '24px' : '0 24px',
                            background: '#F8FAFF',
                            border: '1px solid #E8EFFD',
                            borderRadius: '24px'
                        }}
                    >
                        <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="detail-title" style={{ fontSize: '16px', fontWeight: 800, color: '#0055FB' }}>
                                    {currentTab.indices.find(i => i.symbol === selectedCard)?.name} 실시간 차트
                                </span>
                                <span style={{ fontSize: '11px', color: '#8B95A1', fontWeight: 500 }}>(일봉, 30일)</span>
                            </div>
                            {isDetailLoading && <span className="loading-spinner">데이터 갱신 중...</span>}
                        </div>

                        {/* Chart Area */}
                        {detailData && Array.isArray(detailData.chartData) && detailData.chartData.length > 0 && (
                            <>
                                <div style={{ background: 'white', borderRadius: '16px', padding: '16px 20px 0', marginBottom: '20px', border: '1px solid #F2F4F7', minHeight: '300px' }}>
                                    <ProfessionalChart
                                        data={detailData.chartData}
                                        isPositive={(detailData.change || 0) >= 0}
                                    />
                                </div>
                                <TechnicalSummary data={detailData.chartData} />
                            </>
                        )}

                        {/* Analysis Grid */}
                        <div className="detail-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            {/* Day Range visualizer */}
                            <div className="range-box" style={{ gridColumn: 'span 2', background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #F2F4F7' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '11px', color: '#8B95A1', fontWeight: 700 }}>일일 변동 폭</span>
                                    <span style={{ fontSize: '11px', fontWeight: 800 }}>{(detailData?.price || 0).toLocaleString()}</span>
                                </div>
                                <div style={{ height: '4px', background: '#F2F4F7', borderRadius: '2px', position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: `${(() => {
                                            const high = detailData?.regularMarketDayHigh || 0;
                                            const low = detailData?.regularMarketDayLow || 0;
                                            const current = detailData?.price || 0;
                                            if (high === low) return 50;
                                            const pos = ((current - low) / (high - low)) * 100;
                                            return Math.max(0, Math.min(100, pos));
                                        })()}%`,
                                        width: '8px', height: '8px', borderRadius: '50%', background: '#0055FB', top: '-2px', transform: 'translateX(-50%)',
                                        boxShadow: '0 0 0 3px rgba(0, 85, 251, 0.1)'
                                    }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                                    <span style={{ fontSize: '10px', color: '#B0B8C1' }}>최저 {(detailData?.regularMarketDayLow || 0).toLocaleString()}</span>
                                    <span style={{ fontSize: '10px', color: '#B0B8C1' }}>최고 {(detailData?.regularMarketDayHigh || 0).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="metric-item-v3" style={{ background: 'white', padding: '12px 16px', borderRadius: '14px', border: '1px solid #F2F4F7' }}>
                                <span className="m-label" style={{ fontSize: '11px', color: '#8B95A1', display: 'block', marginBottom: '4px' }}>52주 최고</span>
                                <span className="m-value" style={{ fontSize: '14px', fontWeight: 800 }}>{(detailData?.fiftyTwoWeekHigh || 0).toLocaleString()}</span>
                            </div>
                            <div className="metric-item-v3" style={{ background: 'white', padding: '12px 16px', borderRadius: '14px', border: '1px solid #F2F4F7' }}>
                                <span className="m-label" style={{ fontSize: '11px', color: '#8B95A1', display: 'block', marginBottom: '4px' }}>52주 최저</span>
                                <span className="m-value" style={{ fontSize: '14px', fontWeight: 800 }}>{(detailData?.fiftyTwoWeekLow || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="slim-login-cta">
                        <span className="slim-cta-text">📊 로그인하면 자산 현황 · DSR · 재무 목표를 볼 수 있어요</span>
                        <button className="slim-cta-btn" onClick={() => setIsLoggedIn(true)}>
                            무료 시작하기 →
                        </button>
                    </div>
                </div>

                <div className="dashboard-sidebar-widgets" style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <SentimentGauge value={42} label="공포" />
                    <div className="widget-section">
                        <EconomicCalendar />
                    </div>
                    <div className="widget-section">
                        <h3 className="section-title">내 재무 목표</h3>
                        <GoalTracker />
                    </div>
                </div>

                <style jsx>{`
                    .market-summary-container { margin-bottom: 40px; }
                    .market-summary-card {
                        background: white;
                        border-radius: 32px;
                        padding: 32px;
                        border: 1px solid #F2F4F7;
                    }
                    .shadow-premium-clean { box-shadow: 0 8px 30px rgba(0,0,0,0.04); }
                    .summary-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                    .summary-title { font-size: 20px; font-weight: 800; color: #191F28; margin: 0; }
                    .summary-date { font-size: 14px; color: #8B95A1; font-weight: 500; margin-left: 12px; }
                    .live-status-badge { background: #E8F9F0; color: #1B8947; padding: 6px 12px; border-radius: 100px; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 4px; }
                    .live-status-badge .dot { width: 6px; height: 6px; background: #1B8947; border-radius: 50%; animation: pulse 1.5s infinite; }
                    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

                    .market-tabs-nav {
                        display: flex;
                        background: #F2F4F6;
                        padding: 4px;
                        border-radius: 12px;
                        gap: 4px;
                        margin-bottom: 32px;
                    }
                    .tab-item {
                        flex: 1;
                        border: none;
                        background: transparent;
                        padding: 10px;
                        font-size: 14px;
                        font-weight: 700;
                        color: #8B95A1;
                        cursor: pointer;
                        border-radius: 8px;
                        transition: all 0.2s;
                    }
                    .tab-item.active { background: white; color: #0055FB; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

                    .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
                    .summary-card-v2 { background: #F9FAFB; border: 1.5px solid transparent; border-radius: 20px; padding: 20px; cursor: pointer; transition: all 0.2s; position: relative; }
                    .summary-card-v2:hover { background: #F2F4F6; }
                    .summary-card-v2.selected { background: white; border-color: #0055FB; box-shadow: 0 4px 12px rgba(0, 85, 251, 0.08); }

                    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                    .card-name-group { display: flex; align-items: center; gap: 4px; }
                    .symbol-name { font-size: 13px; font-weight: 700; color: #8B95A1; }
                    .symbol-flag { font-size: 14px; }
                    .status-badge { font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 6px; }
                    .status-badge.open { background: #FFF0F0; color: #F04251; }
                    .status-badge.closed { background: #F2F4F6; color: #8B95A1; }
                    .status-badge.realtime { background: #EBF3FF; color: #0064FF; }

                    .card-main { margin-bottom: 16px; }
                    .price-val { font-size: 24px; font-weight: 800; color: #191F28; margin-bottom: 4px; }
                    .change-val { font-size: 14px; font-weight: 700; }
                    .change-val.positive { color: #F04251; }
                    .change-val.negative { color: #0064FF; }

                    .card-unit-row { display: flex; align-items: center; margin-top: 8px; }
                    .unit-label { font-size: 11px; font-weight: 600; color: #B0B8C1; letter-spacing: 0.02em; }

                    .detail-preview-section { background: #F4F8FF; border-radius: 16px; }
                    .detail-header { display: flex; align-items: center; margin-bottom: 12px; }
                    .detail-title { font-size: 14px; font-weight: 800; color: #0055FB; }
                    .loading-spinner { font-size: 11px; color: #0055FB; margin-left: 10px; font-weight: 500; opacity: 0.8; animation: pulse 1.5s infinite; }
                    .detail-metrics-grid { display: flex; gap: 32px; }
                    .metric-item { display: flex; align-items: center; gap: 8px; }
                    .metric-label { font-size: 12px; color: #8B95A1; font-weight: 600; }
                    .metric-value { font-size: 14px; font-weight: 800; color: #191F28; }

                    .slim-login-cta { display: flex; align-items: center; justify-content: space-between; background: #F4F8FF; border: 1px solid #DDEEFF; border-radius: 14px; padding: 12px 20px; gap: 12px; }
                    .slim-cta-text { font-size: 13px; color: #4E5968; font-weight: 500; }
                    .slim-cta-btn { background: #0055FB; color: white; border: none; padding: 8px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background 0.2s; }
                    .slim-cta-btn:hover { background: #0046D9; }
                    .section-title { font-size: 18px; font-weight: 800; color: #191F28; margin-bottom: 16px; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="user-dashboard-v3">
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

            <div className="dashboard-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '32px', alignItems: 'start' }}>
                <div className="dashboard-main-col">
                    <div className="widget-section">
                        <EconomicCalendar />
                    </div>
                </div>

                <div className="dashboard-sidebar-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <SentimentGauge value={42} label="공포" />
                    <div className="widget-section">
                        <h3 className="section-title">내 재무 목표</h3>
                        <GoalTracker />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .user-dashboard-v3 { display: flex; flex-direction: column; gap: 24px; margin-bottom: 32px; }
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
                .asset-label { font-size: 1rem; opacity: 0.8; margin-bottom: 8px; font-weight: 600; color: rgba(255, 255, 255, 0.9); }
                .asset-amount { font-size: 2.8rem; font-weight: 800; margin-bottom: 40px; letter-spacing: -0.02em; }
                .asset-sub-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
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
                .sub-label { font-size: 0.8rem; opacity: 0.75; font-weight: 500; color: rgba(255, 255, 255, 0.8); }
                .sub-value { font-size: 1.1rem; font-weight: 700; }
                .sub-value.highlight { color: #FFD363; }
                .section-title { font-size: 1.1rem; font-weight: 800; margin-bottom: 16px; color: var(--text-primary); }
            `}</style>
        </div>
    );
}
