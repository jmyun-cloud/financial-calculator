"use client";
import React, { useEffect, useState } from "react";
import GoalTracker from "@/components/GoalTracker";

export default function UserDashboard() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

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

            {/* SIDEBAR GOALS (Integrated for Layout) */}
            <div className="dashboard-sidebar-widgets">
                <div className="widget-section">
                    <h3 className="section-title">내 재무 목표</h3>
                    {isClient ? <GoalTracker /> : <div className="skeleton-loader" />}
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
                }
                .hero-asset-card::after {
                    content: '';
                    position: absolute;
                    top: -20%;
                    right: -10%;
                    width: 200px;
                    height: 200px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 50%;
                }
                .asset-label {
                    font-size: 0.9rem;
                    opacity: 0.8;
                    margin-bottom: 8px;
                    font-weight: 600;
                }
                .asset-amount {
                    font-size: 2.2rem;
                    font-weight: 800;
                    margin-bottom: 32px;
                    letter-spacing: -0.02em;
                }
                .asset-sub-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                }
                .asset-sub-item {
                    background: rgba(255,255,255,0.12);
                    padding: 16px;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    backdrop-filter: blur(10px);
                }
                .sub-label {
                    font-size: 0.75rem;
                    opacity: 0.75;
                    font-weight: 500;
                }
                .sub-value {
                    font-size: 0.95rem;
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
                    height: 120px;
                    background: rgba(0,0,0,0.05);
                    border-radius: 20px;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 0.3; } 100% { opacity: 0.6; } }
            `}</style>
        </div>
    );
}
