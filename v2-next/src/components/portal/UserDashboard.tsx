"use client";
import React, { useEffect, useState, useMemo } from "react";
import GoalTracker from "@/components/GoalTracker";
import MarketSummary from "./MarketSummary";

export default function UserDashboard() {
    const [isClient, setIsClient] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const handleLogin = () => setIsLoggedIn(true);
        window.addEventListener("fc_mock_login", handleLogin);
        return () => window.removeEventListener("fc_mock_login", handleLogin);
    }, []);

    if (!isClient) return <div className="skeleton-loader" style={{ height: '300px', background: 'rgba(0,0,0,0.05)', borderRadius: '28px' }} />;

    if (!isLoggedIn) {
        return (
            <div className="market-summary-container">
                <div className="market-summary-card shadow-premium-clean">
                    <div className="summary-section-header">
                        <div className="header-left">
                            <h2 className="summary-title">전체 시장 현황</h2>
                            <span className="summary-date">{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}</span>
                        </div>
                        <div className="live-status-badge">
                            <span className="dot"></span>
                            실시간
                        </div>
                    </div>

                    <MarketSummary />

                    <div className="premium-blue-banner" style={{ marginTop: '32px' }}>
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

            <div className="market-summary-logged-in">
                <h3 className="section-title">실시간 시장 지표</h3>
                <div className="market-summary-card shadow-premium-clean">
                    <MarketSummary />
                </div>
            </div>

            <div className="dashboard-sidebar-widgets">
                <div className="widget-section">
                    <h3 className="section-title">내 재무 목표</h3>
                    <GoalTracker />
                </div>
            </div>

            <style jsx>{`
                .user-dashboard-v3 { display: flex; flex-direction: column; gap: 32px; margin-bottom: 32px; }
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
                
                .market-summary-card {
                    background: white;
                    border-radius: 28px;
                    padding: 24px;
                    border: 1px solid #F2F4F7;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.04);
                }
            `}</style>
        </div>
    );
}
