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
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return <div className="skeleton-loader" style={{ height: '300px' }} />;

    return (
        <div className="user-dashboard-v3">
            {/* HERO ASSET CARD */}
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
