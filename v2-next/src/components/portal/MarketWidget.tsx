"use client";

import React from 'react';
import { MARKET_CONFIG } from '@/lib/market-config';
import { useMarketData, MarketItem } from '@/hooks/useMarketData';
import { Gem, Circle, Droplet, Zap } from 'lucide-react';

export default function MarketWidget() {
    const { data: indicators, loading } = useMarketData();

    if (loading && indicators.length === 0) {
        return <div className="h-[600px] bg-[#F9FAFB] rounded-[32px] animate-pulse mx-1 shadow-inner" />;
    }

    const SectionTitleMap = {
        domestic: "국내 지수",
        global: "글로벌 지수",
        crypto: "가상자산",
        commodity: "원자재 및 에너지"
    };

    const getUnit = (symbol: string) => {
        if (['GC=F', 'SI=F'].includes(symbol)) return "USD/oz";
        if (symbol === 'CL=F') return "USD/bbl";
        if (symbol === 'HG=F') return "USD/lb";
        if (['BTC-USD', 'ETH-USD', 'XRP-USD'].includes(symbol)) return "USD";
        if (symbol === 'KRW=X') return "KRW";
        return "pt";
    };

    const getTrendStyle = (item: MarketItem) => {
];

export default function MarketWidget() {
    const { data: marketData, loading } = useMarketData();

    return (
        <div className="bg-white rounded-[32px] p-7 border border-[#F2F4F7] shadow-[0_4px_24px_rgba(0,0,0,0.03)] sticky top-24">
            <div className="flex flex-col gap-9">
                {MARKET_GROUPS.map((group) => (
                    <div key={group.title} className="flex flex-col">
                        <header className="flex items-center gap-2 mb-5">
                            <span className="text-[14px]">{group.flag || "🌐"}</span>
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
