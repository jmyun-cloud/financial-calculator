"use client";
import { useState, useEffect } from "react";
import { MARKET_CONFIG } from "@/lib/market-config";

export interface MarketItem {
    symbol: string;
    name: string;
    price: string;
    change: string;
    changePercent: string;
    isPositive: boolean;
    high?: string;
    low?: string;
    volume?: string;
    fiftyTwoWeekHigh?: string;
    fiftyTwoWeekLow?: string;
}

const formatVolume = (vol: number) => {
    if (!vol) return "---";
    if (vol >= 100000000) return (vol / 100000000).toFixed(1) + "억주";
    if (vol >= 10000) return (vol / 10000).toFixed(0) + "만주";
    return vol.toLocaleString() + "주";
};

export function useMarketData() {
    const [data, setData] = useState<MarketItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/market");
            if (!res.ok) throw new Error("Failed to fetch market data");
            const result = await res.json();

            if (result.success && result.data) {
                const rawData = result.data;
                const formatted: MarketItem[] = [];

                const allSymbols = ['BASE', ...MARKET_CONFIG.symbols];

                allSymbols.forEach(symbol => {
                    const raw = rawData[symbol];
                    if (raw) {
                        const priceNum = raw.price;
                        const prevClose = raw.prevClose;
                        const change = priceNum - prevClose;
                        const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;

                        formatted.push({
                            symbol: symbol,
                            name: MARKET_CONFIG.names[symbol] || symbol,
                            price: priceNum.toLocaleString(undefined, {
                                minimumFractionDigits: symbol === 'BASE' ? 2 : 0,
                                maximumFractionDigits: 2
                            }) + (symbol === 'BASE' ? '%' : ''),
                            change: Math.abs(change).toLocaleString(undefined, { maximumFractionDigits: 2 }),
                            changePercent: Math.abs(changePercent).toFixed(2),
                            isPositive: change >= 0,
                            high: raw.high?.toLocaleString(),
                            low: raw.low?.toLocaleString(),
                            volume: formatVolume(raw.volume),
                            fiftyTwoWeekHigh: raw.fiftyTwoWeekHigh?.toLocaleString(),
                            fiftyTwoWeekLow: raw.fiftyTwoWeekLow?.toLocaleString()
                        });
                    }
                });
                setData(formatted);
            }
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const timer = setInterval(fetchData, 60000);
        return () => clearInterval(timer);
    }, []);

    return { data, loading, error, refresh: fetchData };
}
