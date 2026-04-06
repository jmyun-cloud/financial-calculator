"use client";
import { useState, useEffect } from "react";

export interface MarketItem {
    symbol: string;
    name: string;
    price: string;
    change: string;
    changePercent: string;
    isPositive: boolean;
    category: string;
}

export function useMarketData() {
    const [data, setData] = useState<MarketItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/market");
            if (!res.ok) throw new Error("Failed to fetch market data");
            const result = await res.json();
            setData(result);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const timer = setInterval(fetchData, 60000); // 60s
        return () => clearInterval(timer);
    }, []);

    return { data, loading, error, refresh: fetchData };
}
