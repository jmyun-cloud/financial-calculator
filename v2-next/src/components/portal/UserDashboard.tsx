"use client";
import React, { useEffect, useState } from "react";
import GoalTracker from "@/components/GoalTracker";

export default function UserDashboard() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="user-dashboard widget-panel">
            <div className="dashboard-header">
                <div className="user-profile">
                    <div className="avatar-placeholder">👤</div>
                    <div className="user-info">
                        <span className="greeting">반갑습니다!</span>
                        <span className="login-prompt">로그인하고 자산 관리하기</span>
                    </div>
                </div>
                <button className="login-btn-sm">로그인</button>
            </div>

            <div className="dashboard-body">
                <div className="goal-summary">
                    <span className="goal-label">저장된 내 재무 목표</span>
                    {isClient ? <GoalTracker /> : <div className="skeleton-loader" style={{ height: '100px' }} />}
                </div>

                <div className="dashboard-stats">
                    <div className="stat-box">
                        <span className="stat-title">이번 달 카드값</span>
                        <span className="stat-value blur-text">₩ 1,250,000</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-title">DSR 예상 잔여</span>
                        <span className="stat-value blur-text">35%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
