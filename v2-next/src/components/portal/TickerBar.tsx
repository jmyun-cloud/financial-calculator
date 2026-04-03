import React from 'react';
import { getMarketIndicators } from '@/lib/market-service';

export default async function TickerBar() {
    const indicators = await getMarketIndicators();

    // If API fails, show a placeholder
    if (indicators.length === 0) {
        return (
            <div className="ticker-wrapper">
                <div className="ticker-track">
                    <span className="ticker-item">실시간 시장 데이터를 불러오는 중입니다...</span>
                </div>
            </div>
        );
    }

    // Duplicate for infinite animation
    const displayItems = [...indicators, ...indicators, ...indicators];

    return (
        <div className="ticker-wrapper">
            <div className="ticker-track">
                {displayItems.map((item, idx) => (
                    <div key={`${item.symbol}-${idx}`} className="ticker-item">
                        <span className="ticker-label text-white">{item.name}</span>
                        <span className="ticker-value text-white">{item.price}</span>
                        <span className={`ticker-change ${item.isPositive ? 'positive' : 'negative'}`}>
                            {item.isPositive ? '▲' : '▼'} {item.change} ({item.changePercent}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
