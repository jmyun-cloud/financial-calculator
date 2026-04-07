"use client";

/**
 * [RESTORED VERSION] 
 * This file has been restored to the original compact sidebar design.
 */

import React from 'react';
import { useMarketData } from '@/hooks/useMarketData';

const MARKET_GROUPS = [
    {
        title: "국내 시장",
        indices: [
            { symbol: "^KS11", name: "KOSPI", flag: "🇰🇷" },
            { symbol: "^KQ11", name: "KOSDAQ", flag: "🇰🇷" },
            { symbol: "KRW=X", name: "USD/KRW", flag: "💵" }
        ]
    },
    {
        title: "해외 시장",
        indices: [
            { symbol: "^GSPC", name: "S&P 500", flag: "🇺🇸" },
            { symbol: "^IXIC", name: "Nasdaq", flag: "🇺🇸" },
            { symbol: "^DJI", name: "Dow Jones", flag: "🇺🇸" },
            { symbol: "^N225", name: "Nikkei 225", flag: "🇯🇵" },
            { symbol: "HSI", name: "Hang Seng", flag: "🇭🇰" }
        ]
    },
    {
        title: "암호화폐",
        indices: [
            { symbol: "BTC-USD", name: "BitCoin", flag: "₿" },
            { symbol: "ETH-USD", name: "Ethereum", flag: "Ξ" },
            { symbol: "XRP-USD", name: "Ripple", flag: "✕" }
        ]
    },
    {
        title: "원자재",
        indices: [
            { symbol: "GC=F", name: "Gold", flag: "🥇" },
            { symbol: "SI=F", name: "Silver", flag: "🥈" },
            { symbol: "CL=F", name: "Crude Oil", flag: "🛢️" }
        ]
    }
];

export default function MarketWidget() {
    const { data: marketData, loading } = useMarketData();

    return (
        <div className="bg-white rounded-[32px] p-7 border border-[#F2F4F7] shadow-[0_4px_24px_rgba(0,0,0,0.03)] sticky top-24">
            <div className="flex flex-col gap-9">
                {MARKET_GROUPS.map((group) => (
                    <div key={group.title} className="flex flex-col">
                        <header className="flex items-center gap-2 mb-5">
                            <h3 className="text-[14px] font-bold text-[#191F28]">{group.title}</h3>
                        </header>
                        <ul className="flex flex-col gap-4 m-0 p-0 list-none">
                            {group.indices.map((idx) => {
                                const item = marketData.find(m => m.symbol === idx.symbol) || {
                                    price: "---",
                                    changePercent: "0.00",
                                    isPositive: true
                                };
                                return (
                                    <li key={idx.symbol} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[16px] filter grayscale group-hover:grayscale-0 transition-all">{idx.flag}</span>
                                            <span className="text-[13px] font-bold text-[#4E5968] group-hover:text-[#191F28]">{idx.name}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[14px] font-black text-[#191F28] tabular-nums">{item.price}</span>
                                            <span className={`text-[11px] font-bold tabular-nums ${item.isPositive ? 'text-[#F04251]' : 'text-[#0064FF]'}`}>
                                                {item.isPositive ? '+' : '-'}{item.changePercent}%
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
