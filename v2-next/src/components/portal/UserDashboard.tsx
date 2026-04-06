"use client";
import React, { useEffect, useState } from "react";
import GoalTracker from "@/components/GoalTracker";
import { useMarketData } from "@/hooks/useMarketData";

export default function UserDashboard() {
    const [isClient, setIsClient] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // default to false
    const { data: marketData, loading } = useMarketData();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return <div className="skeleton-loader" style={{ height: '300px' }} />;

    if (!isLoggedIn) {
        // 비로그인 상태: 오늘의 시장 요약
        const summaryIndices = [
            { symbol: "KOSPI", name: "KOSPI", color: "#FF4D4D" },
            { symbol: "USD/KRW", name: "원/달러 환율", color: "#FF4D4D" },
            { symbol: "BASE_RATE", name: "기준금리", color: "#666" },
            { symbol: "S&P 500", name: "S&P 500", color: "#0064FF" }
        ];

        return (
            <div className="market-summary-container">
                {/* 오늘의 시장 요약 */}
                <div className="market-summary-card shadow-sm">
                    <div className="summary-header">
                        <div className="header-left">
                            <h2 className="summary-title">오늘의 시장 요약</h2>
                            <span className="summary-date">2026년 4월 6일 월요일</span>
                        </div>
                        <div className="live-badge">● 실시간</div>
                    </div>

                    <div className="summary-grid">
                        {summaryIndices.map(idx => {
                            const item = marketData.find(m => m.symbol === idx.symbol) || {
                                price: idx.symbol === "BASE_RATE" ? "2.75%" : "---",
                                change: "0.00",
                                changePercent: "0.00",
                                isPositive: true
                            };
                            const isRate = idx.symbol === "BASE_RATE";

                            return (
                                <div key={idx.symbol} className="summary-card">
                                    <span className="card-label">{idx.name}</span>
                                    <div className="card-value">{item.price}</div>
                                    <div className={`card-change ${item.isPositive ? 'positive' : 'negative'}`}>
                                        {!isRate && (item.isPositive ? '▲' : '▼')}
                                        {item.change} ({item.isPositive ? '+' : ''}{item.changePercent}%)
                                    </div>
                                    <div className="sparkline">
                                        <svg viewBox="0 0 100 30" width="100%" height="30">
                                            <path
                                                d={isRate ? "M0 15 L 100 15" : "M0 25 Q 15 20, 30 22 T 50 15 T 70 18 T 100 5"}
                                                fill="none"
                                                stroke={isRate ? '#999' : (item.isPositive ? '#FF4D4D' : '#0064FF')}
                                                strokeWidth="2"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

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
                    .card-change.positive { color: var(--danger); }
                    .card-change.negative { color: var(--primary); }
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
