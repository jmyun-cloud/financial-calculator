"use client";
import React from 'react';

export default function TickerBar() {
    // 실제 API 연동 전 UI 프로토타입
    return (
        <div className="ticker-wrapper">
            <div className="ticker-track">
                <div className="ticker-item">
                    <span className="ticker-label">KOSPI</span>
                    <span className="ticker-value">2,750.20</span>
                    <span className="ticker-change positive">▲ 15.30 (+0.56%)</span>
                </div>
                <div className="ticker-item">
                    <span className="ticker-label">KOSDAQ</span>
                    <span className="ticker-value">910.45</span>
                    <span className="ticker-change positive">▲ 8.21 (+0.91%)</span>
                </div>
                <div className="ticker-item">
                    <span className="ticker-label">USD/KRW</span>
                    <span className="ticker-value">1,310.50</span>
                    <span className="ticker-change negative">▼ 2.50 (-0.19%)</span>
                </div>
                <div className="ticker-item">
                    <span className="ticker-label">한국은행 기준금리</span>
                    <span className="ticker-value">3.50%</span>
                    <span className="ticker-change neutral">- 동결</span>
                </div>
                <div className="ticker-item">
                    <span className="ticker-label">비트코인(BTC)</span>
                    <span className="ticker-value">98,500,000</span>
                    <span className="ticker-change positive">▲ 1,200,000 (+1.23%)</span>
                </div>
                {/* 무한 애니메이션을 위해 똑같은 데이터 반복 */}
                <div className="ticker-item">
                    <span className="ticker-label">KOSPI</span>
                    <span className="ticker-value">2,750.20</span>
                    <span className="ticker-change positive">▲ 15.30 (+0.56%)</span>
                </div>
                <div className="ticker-item">
                    <span className="ticker-label">KOSDAQ</span>
                    <span className="ticker-value">910.45</span>
                    <span className="ticker-change positive">▲ 8.21 (+0.91%)</span>
                </div>
                <div className="ticker-item">
                    <span className="ticker-label">USD/KRW</span>
                    <span className="ticker-value">1,310.50</span>
                    <span className="ticker-change negative">▼ 2.50 (-0.19%)</span>
                </div>
                <div className="ticker-item">
                    <span className="ticker-label">한국은행 기준금리</span>
                    <span className="ticker-value">3.50%</span>
                    <span className="ticker-change neutral">- 동결</span>
                </div>
            </div>
        </div>
    );
}
