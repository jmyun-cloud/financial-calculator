"use client";

import React from 'react';
import { MARKET_CONFIG } from '@/lib/market-config';
import { useMarketData, MarketItem } from '@/hooks/useMarketData';
import { Gem, Circle, Droplet, Zap } from 'lucide-react';

export default function MarketWidget() {
    const { data: indicators, loading } = useMarketData();

    if (loading && indicators.length === 0) {
        return <div className="h-[500px] bg-[#F9FAFB] rounded-[24px] animate-pulse" />;
    }

    const SectionTitleMap = {
        domestic: "국내 시장",
        global: "해외 시장",
        crypto: "암호화폐",
        commodity: "원자재"
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
        if (symbol === 'BTC-USD') return (
            <div className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[9px] font-bold bg-[#FFF3E0] text-[#F7931A]">BTC</div>
        );
        if (symbol === 'ETH-USD') return (
            <div className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[9px] font-bold bg-[#EDE7F6] text-[#627EEA]">ETH</div>
        );
        if (symbol === 'XRP-USD') return (
            <div className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[9px] font-bold bg-[#E3F2FD] text-[#0064FF]">XRP</div>
        );

        if (symbol === 'GC=F') return (
            <div className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center bg-[#FFF8E6]"><Gem size={16} color="#F59E0B" /></div>
        );
        if (symbol === 'SI=F') return (
            <div className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center bg-[#F1F5F9]"><Circle size={14} color="#94A3B8" fill="#94A3B8" /></div>
        );
        if (symbol === 'CL=F') return (
            <div className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center bg-[#F1F5F9]"><Droplet size={16} color="#64748B" /></div>
        );
        if (symbol === 'HG=F') return (
            <div className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center bg-[#FFF8E6]"><Zap size={16} color="#B45309" /></div>
        );

        const flag = symbol === '^N225' ? "🇯🇵" : symbol === '^HSI' ? "🇭🇰" : (symbol.startsWith('^G') || symbol.startsWith('^I') || symbol.startsWith('^D')) ? "🇺🇸" : symbol.startsWith('^K') ? "🇰🇷" : "📈";
        return (
            <div className="w-7 h-7 shrink-0 rounded-full bg-[#F9FAFB] flex items-center justify-center text-[14px] border border-[#E5E8EB]">{flag}</div>
        );
    };

    const renderSection = (id: string, title: string, symbols: string[]) => {
        const filtered = indicators.filter(item => symbols.includes(item.symbol));
        if (filtered.length === 0) return null;

        return (
            <section key={id} className="mb-7 last:mb-0">
                <header className="mb-3">
                    <h3 className="text-[15px] font-extrabold text-[#191F28] tracking-tight">{title}</h3>
                </header>
                <div className="flex flex-col gap-1">
                    {filtered.map(item => {
                        const trend = getTrendStyle(item);
                        return (
                            <div key={item.symbol} className="flex justify-between items-center p-2 -mx-2 cursor-pointer hover:bg-[#F8F9FB] rounded-lg transition-colors duration-150">
                                <div className="flex items-center gap-3 min-width-0">
                                    {renderIcon(item.symbol)}
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-[13px] font-bold text-[#191F28]">{MARKET_CONFIG.names[item.symbol] || item.symbol}</span>
                                        <span className="text-[10px] text-[#8B95A1] font-medium tracking-tight whitespace-nowrap">{getUnit(item.symbol)}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end leading-tight shrink-0">
                                    <span className="text-[14px] font-extrabold text-[#191F28] tabular-nums">{item.price}</span>
                                    <span className="text-[11px] font-bold tabular-nums whitespace-nowrap" style={{ color: trend.color }}>
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
        <div className="bg-white rounded-[24px] p-6 border border-[#E5E8EB] w-full">
            {Object.entries(MARKET_CONFIG.categories).map(([id, symbols]) =>
                renderSection(id, SectionTitleMap[id as keyof typeof SectionTitleMap], symbols)
            )}
        </div>
    );
}
