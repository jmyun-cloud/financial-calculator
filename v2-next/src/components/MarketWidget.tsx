"use client";
import { useEffect, useState } from 'react';

export default function MarketWidget() {
    const [exchange, setExchange] = useState({ val: '...', text: '-', isDown: false });
    const [status, setStatus] = useState("업데이트 중...");
    const [stamp, setStamp] = useState("");

    useEffect(() => {
        async function fetchExchangeRate() {
            try {
                const res = await fetch('https://open.er-api.com/v6/latest/USD');
                const data = await res.json();
                const krw = data.rates.KRW;

                // Mock yesterday compare
                const mockPrevClose = 1350.00;
                const changeAmount = krw - mockPrevClose;
                const changePercent = (changeAmount / mockPrevClose) * 100;

                setExchange({
                    val: krw.toLocaleString('ko-KR', { minimumFractionDigits: 2 }),
                    text: `${changeAmount >= 0 ? '▲' : '▼'} ${Math.abs(changeAmount).toFixed(1)} (${changeAmount >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`,
                    isDown: changeAmount < 0
                });

                const now = new Date();
                const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                setStatus("업데이트 완료");
                setStamp(`오늘 ${timeStr} 업데이트`);
            } catch (err) {
                setStatus("업데이트 실패");
            }
        }
        fetchExchangeRate();
        const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="widget-panel">
            <h2 className="widget-title">
                📊 오늘의 주요 지표
                <span id="market-status" style={{ color: status === '업데이트 실패' ? '#ef4444' : 'rgba(255,255,255,0.4)' }}>
                    {stamp ? <><span style={{ color: '#10b981' }}>●</span> {stamp}</> : status}
                </span>
            </h2>
            <div className="market-grid">
                <div className="market-item">
                    <div className="market-label">한국은행 기준금리</div>
                    <div className="market-value">3.50%</div>
                    <div className="market-change">동결 (최근 코멘트 기준)</div>
                </div>
                <div className="market-item">
                    <div className="market-label">원/달러 환율</div>
                    <div className="market-value">{exchange.val}</div>
                    <div className={`market-change ${exchange.isDown ? 'down' : ''}`}>{exchange.text}</div>
                </div>
                <div className="market-item">
                    <div className="market-label">KOSPI 지수</div>
                    <div className="market-value">2,750.20</div>
                    <div className="market-change">▲ 15.30 (+0.56%)</div>
                </div>
            </div>
        </div>
    );
}
