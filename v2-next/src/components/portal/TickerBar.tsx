"use client";

import React from 'react';
import { useMarketData } from '@/hooks/useMarketData';

const TICKER_ITEMS = [
    { symbol: "^KS11", name: "KOSPI" },
    { symbol: "^KQ11", name: "KOSDAQ" },
    { symbol: "^GSPC", name: "S&P 500" },
    { symbol: "^IXIC", name: "Nasdaq" },
    { symbol: "^DJI", name: "Dow Jones" },
    { symbol: "^N225", name: "Nikkei 225" },
    { symbol: "HSI", name: "Hang Seng" },
];

export default function TickerBar() {
    const { data: marketData } = useMarketData();

    return (
        <div className="w-full bg-white border-b border-[#F2F4F7] h-[38px] flex items-center overflow-hidden">
            <div className="flex animate-ticker whitespace-nowrap px-4">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
                    const data = marketData.find(m => m.symbol === item.symbol) || {
                        price: "---",
                        changePercent: "0.00",
                        isPositive: true
                    };
                    
                    return (
                        <div key={idx} className="flex items-center gap-2 mx-5">
                            <span className="text-[11px] font-bold text-[#8B95A1] uppercase">{item.name}</span>
                            <span className="text-[12px] font-black text-[#191F28] tabular-nums">{data.price}</span>
                            <span className={`text-[11px] font-bold tabular-nums ${data.isPositive ? 'text-[#F04251]' : 'text-[#0064FF]'}`}>
                                {data.isPositive ? '▲' : '▼'}{data.changePercent}%
                            </span>
                        </div>
                    );
                })}
            </div>
            
            <style jsx>{`
                .animate-ticker {
                    display: inline-flex;
                    animation: ticker 40s linear infinite;
                }
                .animate-ticker:hover {
                    animation-play-state: paused;
                }
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
}
