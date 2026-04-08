"use client";
import React, { useEffect, useState, useMemo } from "react";
import GoalTracker from "@/components/GoalTracker";
import { useMarketData } from "@/hooks/useMarketData";
import { MARKET_CONFIG } from "@/lib/market-config";

export default function UserDashboard() {
    const [isClient, setIsClient] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { data: marketData, loading } = useMarketData();

    // Guest view states
    const [selectedCard, setSelectedCard] = useState<string>("");
    const [detailData, setDetailData] = useState<any>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    // Market Categories Config
    const marketGroups = useMemo(() => [
        { id: "domestic", name: "국내 시장", icon: "🇰🇷" },
        { id: "global", name: "해외 시장", icon: "🌎" },
        { id: "crypto", name: "암호화폐", icon: "🪙" },
        { id: "commodity", name: "원자재", icon: "🏭" }
    ], []);

    const getUnit = (symbol: string) => {
        if (symbol.includes("KRW=X")) return "KRW";
        if (symbol.includes("=F")) {
            if (symbol === "CL=F") return "USD/bbl";
            if (symbol === "HG=F") return "USD/lb";
            return "USD/oz";
        }
        if (symbol.includes("-USD")) return "USD";
        return "pt";
    };

    const getTrendIcon = (isPositive: boolean, change: string) => {
        if (change === "0.00" || change === "0" || change === "---") return "-";
        return isPositive ? "▲" : "▼";
    };

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

    const formatVolume = (vol: number | null) => {
        if (!vol || vol === 0) return "---";
        if (vol >= 100000000) return (vol / 100000000).toFixed(1) + "억주";
        if (vol >= 10000) return (vol / 10000).toFixed(0) + "만주";
        return vol.toLocaleString() + "주";
    };

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

    useEffect(() => {
        setIsClient(true);
        const handleLogin = () => setIsLoggedIn(true);
        window.addEventListener("fc_mock_login", handleLogin);
        return () => window.removeEventListener("fc_mock_login", handleLogin);
    }, []);

    if (!isClient) return <div className="skeleton-loader" style={{ height: '300px', background: 'rgba(0,0,0,0.05)', borderRadius: '28px' }} />;

    const renderMarketSummary = () => (
        <div className="market-groups-container">
            {marketGroups.map(group => (
                <div key={group.id} className="market-group-card shadow-premium-clean">
                    <div className="group-header">
                        <div className="group-title-box">
                            <span className="group-icon">{group.icon}</span>
                            <span className="group-name">{group.name}</span>
                        </div>
                        <span className="view-more">더보기 →</span>
                    </div>

                    <div className="indicators-list">
                        {(MARKET_CONFIG.categories[group.id] || []).map(symbol => {
                            const data = marketData.find(m => m.symbol === symbol) || {
                                price: "---",
                                change: "---",
                                changePercent: "---",
                                isPositive: true
                            };
                            const isSelected = selectedCard === symbol;
                            return (
                                <div key={symbol} className="indicator-row-wrapper">
                                    <div
                                        className={`indicator-row ${isSelected ? 'active' : ''}`}
                                        onClick={() => setSelectedCard(isSelected ? "" : symbol)}
                                    >
                                        <div className="row-left">
                                            <div className="symbol-icon-box">
                                                {MARKET_CONFIG.names[symbol]?.includes('KOSPI') || MARKET_CONFIG.names[symbol]?.includes('KOSDAQ') ? '🇰🇷' :
                                                    symbol.includes('BTC') ? '₿' :
                                                        symbol.includes('ETH') ? 'Ξ' :
                                                            symbol.includes('XRP') ? '✕' :
                                                                symbol.includes('GC=F') ? '🥇' :
                                                                    symbol.includes('SI=F') ? '🥈' :
                                                                        symbol.includes('CL=F') ? '🛢️' :
                                                                            symbol.includes('HG=F') ? '🧱' :
                                                                                symbol.includes('^GSPC') || symbol.includes('^IXIC') || symbol.includes('^DJI') ? '🇺🇸' :
                                                                                    symbol.includes('^N225') ? '🇯🇵' :
                                                                                        symbol.includes('^HSI') ? '🇭🇰' : '🌏'}
                                            </div>
                                            <div className="name-box">
                                                <div className="indicator-name">{MARKET_CONFIG.names[symbol] || symbol}</div>
                                                <div className="indicator-unit">{getUnit(symbol)}</div>
                                            </div>
                                        </div>
                                        <div className="row-right">
                                            <div className="price-val">{data.price}</div>
                                            <div className={`change-val ${data.isPositive ? 'positive' : 'negative'}`}>
                                                <span className="trend-icon">{getTrendIcon(data.isPositive, data.change)}</span>
                                                {data.change.replace('-', '')} ({data.changePercent}%)
                                            </div>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="inline-detail-container">
                                            {isDetailLoading ? (
                                                <div className="detail-loading">데이터 분석 중...</div>
                                            ) : (
                                                <div className="detail-metrics-grid">
                                                    <div className="metric-item">
                                                        <span className="metric-label">52주 최고</span>
                                                        <span className="metric-value">{detailData?.fiftyTwoWeekHigh?.toLocaleString() || '---'}</span>
                                                    </div>
                                                    <div className="metric-item">
                                                        <span className="metric-label">52주 최저</span>
                                                        <span className="metric-value">{detailData?.fiftyTwoWeekLow?.toLocaleString() || '---'}</span>
                                                    </div>
                                                    <div className="metric-item">
                                                        <span className="metric-label">거래량</span>
                                                        <span className="metric-value">{formatVolume(detailData?.regularMarketVolume)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );

    if (!isLoggedIn) {
        return (
            <div className="market-summary-container">
                <div className="market-summary-card shadow-premium-clean main-summary-wrapper">
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

                    {renderMarketSummary()}

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
                    .main-summary-wrapper {
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

                    /* Market Vertical Groups Design */
                    .market-groups-container {
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        margin-bottom: 24px;
                    }

                    .market-group-card {
                        background: white;
                        border-radius: 24px;
                        padding: 24px;
                        border: 1px solid #F2F4F7;
                    }

                    .group-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                    }

                    .group-title-box {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .group-icon { font-size: 20px; }
                    .group-name { font-size: 17px; font-weight: 800; color: #191F28; }
                    .view-more { font-size: 13px; color: #0064FF; font-weight: 700; cursor: pointer; }

                    .indicators-list {
                        display: flex;
                        flex-direction: column;
                    }

                    .indicator-row-wrapper {
                        border-bottom: 1px solid #F2F4F6;
                    }
                    .indicator-row-wrapper:last-child { border-bottom: none; }

                    .indicator-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 16px 4px;
                        cursor: pointer;
                        transition: all 0.2s;
                        border-radius: 12px;
                        margin: 0 -4px;
                    }
                    .indicator-row:hover { background: #F9FAFB; }
                    .indicator-row.active { background: #F4F8FF; }

                    .row-left { display: flex; align-items: center; gap: 12px; }
                    .symbol-icon-box {
                        width: 36px; height: 36px;
                        background: #F2F4F6;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;
                    }

                    .indicator-name { font-size: 15px; font-weight: 700; color: #333D4B; margin-bottom: 2px; }
                    .indicator-unit { font-size: 12px; color: #8B95A1; font-weight: 500; }

                    .row-right { text-align: right; }
                    .price-val { font-size: 16px; font-weight: 800; color: #191F28; margin-bottom: 4px; }
                    .change-val { font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: flex-end; gap: 4px; }
                    .change-val.positive { color: #F04438; }
                    .change-val.negative { color: #0064FF; }
                    .trend-icon { font-size: 10px; }

                    .inline-detail-container {
                        background: #F4F8FF;
                        margin: 4px 0 16px;
                        padding: 20px;
                        border-radius: 16px;
                        animation: slideDown 0.3s ease-out;
                    }

                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .detail-loading { font-size: 12px; color: #0064FF; text-align: center; font-weight: 700; padding: 10px; }

                    .detail-metrics-grid {
                        display: flex;
                        justify-content: space-between;
                        gap: 16px;
                    }
                    .metric-item { display: flex; flex-direction: column; gap: 6px; flex: 1; text-align: center; }
                    .metric-label { font-size: 11px; color: #8B95A1; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
                    .metric-value { font-size: 14px; font-weight: 800; color: #191F28; }

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

            <div className="market-summary-logged-in" style={{ marginTop: '24px' }}>
                <div className="summary-section-header">
                    <h2 className="summary-title" style={{ fontSize: '18px' }}>실시간 시장 현황</h2>
                </div>
                {renderMarketSummary()}
            </div>

            <div className="dashboard-sidebar-widgets" style={{ marginTop: '8px' }}>
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
                
                /* Shared styles for market summary when logged in */
                .summary-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .summary-title { font-size: 20px; font-weight: 800; color: #191F28; margin: 0; }
                
                .market-groups-container { display: flex; flex-direction: column; gap: 20px; margin-bottom: 24px; }
                .market-group-card { background: white; border-radius: 24px; padding: 24px; border: 1px solid #F2F4F7; box-shadow: 0 8px 30px rgba(0,0,0,0.04); }
                .group-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .group-title-box { display: flex; align-items: center; gap: 8px; }
                .group-icon { font-size: 20px; }
                .group-name { font-size: 17px; font-weight: 800; color: #191F28; }
                .view-more { font-size: 13px; color: #0064FF; font-weight: 700; cursor: pointer; }
                .indicators-list { display: flex; flex-direction: column; }
                .indicator-row-wrapper { border-bottom: 1px solid #F2F4F6; }
                .indicator-row-wrapper:last-child { border-bottom: none; }
                .indicator-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 4px; cursor: pointer; transition: all 0.2s; border-radius: 12px; margin: 0 -4px; }
                .indicator-row:hover { background: #F9FAFB; }
                .indicator-row.active { background: #F4F8FF; }
                .row-left { display: flex; align-items: center; gap: 12px; }
                .symbol-icon-box { width: 36px; height: 36px; background: #F2F4F6; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
                .indicator-name { font-size: 15px; font-weight: 700; color: #333D4B; margin-bottom: 2px; }
                .indicator-unit { font-size: 12px; color: #8B95A1; font-weight: 500; }
                .row-right { text-align: right; }
                .price-val { font-size: 16px; font-weight: 800; color: #191F28; margin-bottom: 4px; }
                .change-val { font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: flex-end; gap: 4px; }
                .change-val.positive { color: #F04438; }
                .change-val.negative { color: #0064FF; }
                .trend-icon { font-size: 10px; }
                .inline-detail-container { background: #F4F8FF; margin: 4px 0 16px; padding: 20px; border-radius: 16px; animation: slideDown 0.3s ease-out; }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .detail-loading { font-size: 12px; color: #0064FF; text-align: center; font-weight: 700; padding: 10px; }
                .detail-metrics-grid { display: flex; justify-content: space-between; gap: 16px; }
                .metric-item { display: flex; flex-direction: column; gap: 6px; flex: 1; text-align: center; }
                .metric-label { font-size: 11px; color: #8B95A1; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
                .metric-value { font-size: 14px; font-weight: 800; color: #191F28; }
            `}</style>
        </div>
    );
}
