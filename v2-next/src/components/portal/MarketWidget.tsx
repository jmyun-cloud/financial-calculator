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
        const percent = parseFloat(item.changePercent);
        if (percent === 0) return { color: '#8B95A1', sign: '' };
        if (item.isPositive) return { color: '#F04251', sign: '+' };
        return { color: '#0064FF', sign: '-' };
    };

    const renderIcon = (symbol: string) => {
        const baseClass = "w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200 border border-[#F2F4F7]";
        
        if (symbol === 'BTC-USD') return (
            <div className={`${baseClass} bg-[#FFF3E0] text-[#F7931A] text-[10px] font-extrabold uppercase shadow-sm`}>BTC</div>
        );
        if (symbol === 'ETH-USD') return (
            <div className={`${baseClass} bg-[#F0F2FF] text-[#627EEA] text-[10px] font-extrabold uppercase shadow-sm`}>ETH</div>
        );
        if (symbol === 'XRP-USD') return (
            <div className={`${baseClass} bg-[#E3F2FD] text-[#0064FF] text-[10px] font-extrabold uppercase shadow-sm`}>XRP</div>
        );

        if (symbol === 'GC=F') return (
            <div className={`${baseClass} bg-[#FFF8E6] shadow-sm`}><Gem size={18} color="#F59E0B" /></div>
        );
        if (symbol === 'SI=F') return (
            <div className={`${baseClass} bg-[#F1F5F9] shadow-sm`}><Circle size={16} color="#94A3B8" fill="#94A3B8" /></div>
        );
        if (symbol === 'CL=F') return (
            <div className={`${baseClass} bg-[#F0F2FF] shadow-sm`}><Droplet size={18} color="#64748B" /></div>
        );
        if (symbol === 'HG=F') return (
            <div className={`${baseClass} bg-[#FFF8E6] shadow-sm`}><Zap size={18} color="#B45309" /></div>
        );

        const flag = symbol === '^N225' ? "🇯🇵" : symbol === '^HSI' ? "🇭🇰" : (symbol.startsWith('^G') || symbol.startsWith('^I') || symbol.startsWith('^D')) ? "🇺🇸" : symbol.startsWith('^K') ? "🇰🇷" : "📈";
        return (
            <div className={`${baseClass} bg-white text-[16px] shadow-sm`}>{flag}</div>
        );
    };

    const renderSection = (id: string, title: string, symbols: string[]) => {
        const filtered = indicators.filter(item => symbols.includes(item.symbol));
        if (filtered.length === 0) return null;

        return (
            <section key={id} className="mb-9 last:mb-0">
                <header className="px-1 mb-4 flex items-center justify-between">
                    <h3 className="text-[16px] font-extrabold text-[#191F28] tracking-tight">{title}</h3>
                </header>
                <div className="flex flex-col gap-0.5">
                    {filtered.map(item => {
                        const trend = getTrendStyle(item);
                        return (
                            <div key={item.symbol} className="group flex justify-between items-center p-3 sm:p-3.5 -mx-2.5 cursor-pointer hover:bg-[#F9FAFB] rounded-2xl transition-all duration-200">
                                <div className="flex items-center gap-3.5 min-width-0">
                                    {renderIcon(item.symbol)}
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-bold text-[#333D4B] leading-tight mb-0.5">{MARKET_CONFIG.names[item.symbol] || item.symbol}</span>
                                        <span className="text-[10px] text-[#8B95A1] font-bold tracking-wider uppercase opacity-80">{getUnit(item.symbol)}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end shrink-0">
                                    <span className="text-[15px] font-extrabold text-[#191F28] tabular-nums mb-0.5">{item.price}</span>
                                    <span className="text-[11px] font-extrabold tabular-nums whitespace-nowrap px-1.5 py-0.5 rounded-md" style={{ color: trend.color, backgroundColor: `${trend.color}08` }}>
                                        {trend.sign}{item.change} ({trend.sign}{item.changePercent}%)
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    };

    return (
        <div className="bg-white rounded-[32px] p-7 border border-[#F2F4F7] w-full shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            {Object.entries(MARKET_CONFIG.categories).map(([id, symbols]) =>
                renderSection(id, SectionTitleMap[id as keyof typeof SectionTitleMap], symbols)
            )}
        </div>
    );
}

