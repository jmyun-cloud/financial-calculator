"use client";

import React from 'react';
import { useMarketData } from '@/hooks/useMarketData';

export default function TickerBar() {
    const { data: indicators, loading } = useMarketData();

    if (loading && indicators.length === 0) {
        return (
            <div className="w-full bg-[#FBFCFE] border-b border-[#F2F4F7] overflow-hidden h-[52px] flex items-center sticky top-[64px] z-[999] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="flex whitespace-nowrap px-[20px]">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="inline-flex items-center mr-[60px] opacity-20 text-[13px] font-bold text-[#8B95A1]">불러오는 중...</div>
                    ))}
                </div>
            </div>
        );
    }

    const displayItems = [...indicators, ...indicators, ...indicators];

    return (
        <div className="w-full bg-[#FBFCFE] border-b border-[#F2F4F7] overflow-hidden h-[52px] flex items-center sticky top-[64px] z-[999] group shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex whitespace-nowrap animate-[ticker-scroll_60s_linear_infinite] px-[20px] group-hover:[animation-play-state:paused]">
                {displayItems.map((item, idx) => (
                    <div key={`${item.symbol}-${idx}`} className="inline-flex items-center mr-[60px] gap-2.5">
                        <span className="text-[12px] font-extrabold text-[#8D94A1] uppercase tracking-wider">{item.name}</span>
                        <span className="text-[14px] font-extrabold text-[#191F28] tabular-nums tracking-tight">{item.price}</span>
                        <span className={`text-[12px] font-extrabold px-2 py-[2px] rounded-[6px] tabular-nums ${item.isPositive ? 'text-[#F04251] bg-[#F04251]/[0.06]' : 'text-[#0064FF] bg-[#0064FF]/[0.06]'}`}>
                            {item.isPositive ? '+' : '-'}{item.changePercent}%
                        </span>
                    </div>
                ))}
            </div>

            <style jsx global>{`
                @keyframes ticker-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
}
