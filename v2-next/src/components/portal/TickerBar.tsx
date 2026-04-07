"use client";

import React from 'react';
import { useMarketData } from '@/hooks/useMarketData';

export default function TickerBar() {
    const { data: indicators, loading } = useMarketData();

    if (loading && indicators.length === 0) {
        return (
            <div className="w-full bg-white border-b border-[#eee] overflow-hidden h-[44px] flex items-center sticky top-[64px] z-[999]">
                <div className="flex whitespace-nowrap px-[20px]">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="inline-flex items-center mr-[48px] opacity-10">● ● ●</div>
                    ))}
                </div>
            </div>
        );
    }

    const displayItems = [...indicators, ...indicators, ...indicators];

    return (
        <div className="w-full bg-white border-b border-[#f2f2f2] overflow-hidden h-[44px] flex items-center sticky top-[64px] z-[999] group">
            <div className="flex whitespace-nowrap animate-[ticker-scroll_60s_linear_infinite] px-[20px] group-hover:[animation-play-state:paused]">
                {displayItems.map((item, idx) => (
                    <div key={`${item.symbol}-${idx}`} className="inline-flex items-center mr-[48px] gap-2">
                        <span className="text-[0.85rem] font-semibold text-[#adb5bd] uppercase">{item.name}</span>
                        <span className="text-[0.95rem] font-extrabold text-[#191F28]">{item.price}</span>
                        <span className={`text-[0.75rem] font-bold px-2 py-[2px] rounded-sm ${item.isPositive ? 'text-[#F04251] bg-[#F04251]/[0.08]' : 'text-[#0064FF] bg-[#0064FF]/[0.08]'}`}>
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
