"use client";
import React, { useEffect, useState, useMemo } from "react";
import GoalTracker from "@/components/GoalTracker";
import { useMarketData } from "@/hooks/useMarketData";

export default function UserDashboard() {
    const [isClient, setIsClient] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { data: marketData, loading } = useMarketData();

    // Guest view states (Premium upgrade)
    const [activeMarketTab, setActiveMarketTab] = useState("국내");
    const [selectedCard, setSelectedCard] = useState<string>("^KS11");

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
                { symbol: "^KS11", name: "KOSPI", flag: "🇰🇷" },
                { symbol: "^KQ11", name: "KOSDAQ", flag: "🇰🇷" },
                { symbol: "KRW=X", name: "USD/KRW", flag: "💱" },
                { symbol: "GC=F", name: "금 시세", flag: "🥇" }
            ]
        },
        {
            id: "해외",
            indices: [
                { symbol: "^GSPC", name: "S&P 500", flag: "🇺🇸" },
                { symbol: "^IXIC", name: "Nasdaq", flag: "🇺🇸" },
                { symbol: "^DJI", name: "Dow Jones", flag: "🇺🇸" },
                { symbol: "^N225", name: "Nikkei 225", flag: "🇯🇵" }
            ]
        },
        {
            id: "환율",
            indices: [
                { symbol: "KRW=X", name: "USD/KRW", flag: "🇺🇸" },
                { symbol: "JPYKRW=X", name: "JPY/KRW", flag: "🇯🇵" },
                { symbol: "EURKRW=X", name: "EUR/KRW", flag: "🇪🇺" },
                { symbol: "CNYKRW=X", name: "CNY/KRW", flag: "🇨🇳" }
            ]
        },
        {
            id: "원자재",
            indices: [
                { symbol: "GC=F", name: "Gold", flag: "🥇" },
                { symbol: "SI=F", name: "Silver", flag: "🥈" },
                { symbol: "CL=F", name: "WTI", flag: "🛢️" },
                { symbol: "HG=F", name: "Copper", flag: "🧱" }
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
                                    setSelectedCard(tab.indices[0].symbol);
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
                                    onClick={() => setSelectedCard(idx.symbol)}
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
                                    <div className="card-bottom-line">
                                        <div className={`line-fill ${item.isPositive ? 'up' : 'down'}`}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {selectedCard && (
                        <div className="market-detail-preview">
                            <div className="detail-header">
                                <span className="detail-name">{currentTab.indices.find(i => i.symbol === selectedCard)?.name} 상세</span>
                            </div>
                            <div className="detail-stats-grid">
                                <div className="stat-item">
                                    <span className="stat-label">52주 최고</span>
                                    <span className="stat-value">5,882</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">52주 최저</span>
                                    <span className="stat-value">2,169</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">거래량</span>
                                    <span className="stat-value">4.2억주</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="premium-blue-banner">
                        <div className="banner-content">
                            <div className="banner-icon-box">
                                <span className="icon-emoji">📊</span>
                            </div>
                            <div className="banner-text">
                                <h3 className="banner-title">내 자산을 한눈에 관리하고 싶다면?</h3>
                                <p className="banner-desc">로그인하면 자산 현황 · DSR · 재무 목표를 바로 볼 수 있어요</p>
                            </div>
                        </div>
                        <button className="banner-cta-btn" onClick={() => setIsLoggedIn(true)}>
                            무료 시작하기
                        </button>
                    </div>
                </div>

                <div className="dashboard-sidebar-widgets" style={{ marginTop: '32px' }}>
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

                    .card-bottom-line { height: 2px; background: #E5E8EB; border-radius: 2px; overflow: hidden; }
                    .line-fill { height: 100%; width: 60%; border-radius: 2px; }
                    .line-fill.up { background: #F04251; }
                    .line-fill.down { background: #0064FF; }

                    .market-detail-preview { background: #F4F8FF; border-radius: 16px; padding: 16px 24px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
                    .detail-name { font-size: 14px; font-weight: 800; color: #0055FB; }
                    .detail-stats-grid { display: flex; gap: 32px; }
                    .stat-item { display: flex; align-items: center; gap: 8px; }
                    .stat-label { font-size: 12px; color: #8B95A1; font-weight: 600; }
                    .stat-value { font-size: 14px; font-weight: 800; color: #191F28; }

                    .premium-blue-banner { background: #0055FB; border-radius: 20px; padding: 24px; display: flex; justify-content: space-between; align-items: center; color: white; }
                    .banner-content { display: flex; align-items: center; gap: 20px; }
                    .banner-icon-box { width: 48px; height: 48px; background: rgba(255,255,255,0.15); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
                    .banner-title { font-size: 16px; font-weight: 800; margin: 0 0 4px 0; }
                    .banner-desc { font-size: 13px; color: rgba(255,255,255,0.8); margin: 0; font-weight: 500; }
                    .banner-cta-btn { background: transparent; border: 1.5px solid rgba(255,255,255,0.3); color: white; padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
                    .banner-cta-btn:hover { background: rgba(255,255,255,0.1); border-color: white; }
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

            <div className="dashboard-sidebar-widgets">
                <div className="widget-section">
                    <h3 className="section-title">내 재무 목표</h3>
                    <GoalTracker />
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
