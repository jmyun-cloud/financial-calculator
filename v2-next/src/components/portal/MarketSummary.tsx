"use client";

import React, { useState, useEffect } from "react";
import { useMarketData } from "@/hooks/useMarketData";
import { MARKET_CONFIG } from "@/lib/market-config";

export default function MarketSummary() {
    const { data: marketData, loading } = useMarketData();
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
    const [detailData, setDetailData] = useState<any>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    // Categories mapping from config
    const categories = [
        { id: "domestic", name: "국내 시장", icon: "🇰🇷" },
        { id: "global", name: "해외 시장", icon: "🌎" },
        { id: "crypto", name: "암호화폐", icon: "🪙" },
        { id: "commodity", name: "원자재", icon: "🎨" }
    ];

    useEffect(() => {
        if (!selectedSymbol) {
            setDetailData(null);
            return;
        }

        const fetchDetail = async () => {
            setIsDetailLoading(true);
            try {
                const res = await fetch(`/api/market-detail?symbol=${encodeURIComponent(selectedSymbol)}`);
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
    }, [selectedSymbol]);

    const formatVolume = (vol: number | null) => {
        if (!vol || vol === 0) return "---";
        if (vol >= 100000000) return (vol / 100000000).toFixed(1) + "억주";
        if (vol >= 10000) return (vol / 10000).toFixed(0) + "만주";
        return vol.toLocaleString() + "주";
    };

    if (loading) {
        return (
            <div className="market-skeleton-loader">
                <style jsx>{`
                    .market-skeleton-loader {
                        height: 400px;
                        background: rgba(0,0,0,0.03);
                        border-radius: 24px;
                        animation: pulse 1.5s infinite;
                    }
                    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="market-grouped-container">
            {categories.map((cat) => (
                <div key={cat.id} className="market-group-block">
                    <div className="group-header">
                        <span className="group-icon">{cat.icon}</span>
                        <h3 className="group-name">{cat.name}</h3>
                    </div>

                    <div className="market-rows-card shadow-premium-subtle">
                        {MARKET_CONFIG.categories[cat.id]?.map((symbol) => {
                            const item = marketData.find((m) => m.symbol === symbol) || {
                                price: "---",
                                change: "0.00",
                                changePercent: "0.00",
                                isPositive: true
                            };
                            const isSelected = selectedSymbol === symbol;

                            return (
                                <div key={symbol} className={`market-row-item-wrapper ${isSelected ? 'active' : ''}`}>
                                    <div
                                        className="market-row-item"
                                        onClick={() => setSelectedSymbol(isSelected ? null : symbol)}
                                    >
                                        <div className="row-info">
                                            <span className="row-name">{MARKET_CONFIG.names[symbol] || symbol}</span>
                                        </div>
                                        <div className="row-values">
                                            <span className="row-price">{item.price}</span>
                                            <span className={`row-change ${item.isPositive ? 'up' : 'down'}`}>
                                                {item.isPositive ? '▲' : '▼'} {item.changePercent}%
                                            </span>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="row-detail-panel">
                                            {isDetailLoading ? (
                                                <div className="detail-loading">정보를 불러오는 중...</div>
                                            ) : (
                                                <div className="detail-content">
                                                    <div className="detail-metric">
                                                        <span className="label">52주 최고</span>
                                                        <span className="val">{detailData?.fiftyTwoWeekHigh?.toLocaleString() || '---'}</span>
                                                    </div>
                                                    <div className="detail-metric">
                                                        <span className="label">52주 최저</span>
                                                        <span className="val">{detailData?.fiftyTwoWeekLow?.toLocaleString() || '---'}</span>
                                                    </div>
                                                    <div className="detail-metric">
                                                        <span className="label">거래량</span>
                                                        <span className="val">{formatVolume(detailData?.regularMarketVolume)}</span>
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

            <style jsx>{`
                .market-grouped-container {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .market-group-block {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .group-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding-left: 4px;
                }

                .group-icon { font-size: 18px; }
                .group-name {
                    font-size: 16px;
                    font-weight: 800;
                    color: #191F28;
                    margin: 0;
                }

                .market-rows-card {
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid #F2F4F7;
                }

                .shadow-premium-subtle {
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                }

                .market-row-item-wrapper {
                    border-bottom: 1px solid #F2F4F7;
                    transition: all 0.2s ease;
                }

                .market-row-item-wrapper:last-child {
                    border-bottom: none;
                }

                .market-row-item-wrapper.active {
                    background: #F8FAFF;
                }

                .market-row-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 18px 20px;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .market-row-item:hover {
                    background: #F9FAFB;
                }

                .market-row-item-wrapper.active .market-row-item:hover {
                    background: #F0F4FF;
                }

                .row-name {
                    font-size: 15px;
                    font-weight: 600;
                    color: #4E5968;
                }

                .row-values {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 2px;
                }

                .row-price {
                    font-size: 16px;
                    font-weight: 800;
                    color: #191F28;
                }

                .row-change {
                    font-size: 13px;
                    font-weight: 700;
                }

                .row-change.up { color: #F04452; }
                .row-change.down { color: #3182F6; }

                /* Detail Panel */
                .row-detail-panel {
                    padding: 0 20px 20px 20px;
                    animation: slideDown 0.3s ease-out;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .detail-loading {
                    font-size: 13px;
                    color: #8B95A1;
                    padding: 10px 0;
                    text-align: center;
                }

                .detail-content {
                    display: flex;
                    justify-content: space-between;
                    background: rgba(255, 255, 255, 0.5);
                    padding: 14px 16px;
                    border-radius: 12px;
                    border: 1px solid rgba(0, 85, 251, 0.1);
                }

                .detail-metric {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .detail-metric .label {
                    font-size: 11px;
                    color: #8B95A1;
                    font-weight: 600;
                }

                .detail-metric .val {
                    font-size: 13px;
                    font-weight: 800;
                    color: #333D4B;
                }
            `}</style>
        </div>
    );
}
