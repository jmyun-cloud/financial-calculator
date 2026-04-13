"use client";

import { useState, useEffect } from 'react';

const WATCHLIST_KEY = 'financial_portal_watchlist';

export function useWatchlist() {
    const [watchlist, setWatchlist] = useState<string[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(WATCHLIST_KEY);
        if (saved) {
            try {
                setWatchlist(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse watchlist from localStorage", e);
            }
        }
    }, []);

    // Save to localStorage whenever it changes
    const toggleWatchlist = (symbol: string) => {
        setWatchlist(prev => {
            const next = prev.includes(symbol)
                ? prev.filter(s => s !== symbol)
                : [...prev, symbol];

            localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
            return next;
        });
    };

    const isWatched = (symbol: string) => watchlist.includes(symbol);

    return { watchlist, toggleWatchlist, isWatched };
}
