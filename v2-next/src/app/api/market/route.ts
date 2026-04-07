import { NextResponse } from 'next/server';
import { MARKET_CONFIG } from '@/lib/market-config';

export async function GET() {
    try {
        const fetchPromises = MARKET_CONFIG.symbols.map(async (symbol) => {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
            try {
                const res = await fetch(url, {
                    next: { revalidate: 60 },
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });
                if (!res.ok) return null;
                const data = await res.json();

                if (!data.chart || !data.chart.result) return null;
                const meta = data.chart.result[0].meta;

                return {
                    symbol,
                    price: meta.regularMarketPrice,
                    prevClose: meta.previousClose || meta.chartPreviousClose,
                    high: meta.regularMarketDayHigh,
                    low: meta.regularMarketDayLow,
                    volume: meta.regularMarketVolume,
                    fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
                    // If fiftyTwoWeekLow is 0, it's often a data bug for indices. 
                    // Set to null to show '---' in UI instead of misleading 0.
                    fiftyTwoWeekLow: meta.fiftyTwoWeekLow === 0 ? null : meta.fiftyTwoWeekLow
                };
            } catch (e) {
                return null;
            }
        });

        const results = await Promise.all(fetchPromises);
        const dataMap: Record<string, any> = {};
        results.forEach(item => {
            if (item) dataMap[item.symbol] = item;
        });

        // Add Base Rate (Standardized)
        dataMap['BASE'] = {
            symbol: 'BASE',
            price: 3.5,
            prevClose: 3.5,
            high: 3.5,
            low: 3.5,
            volume: 0,
            fiftyTwoWeekHigh: 3.5,
            fiftyTwoWeekLow: 3.5
        };

        return NextResponse.json({
            success: true,
            data: dataMap,
            timestamp: Date.now()
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
    }
}
