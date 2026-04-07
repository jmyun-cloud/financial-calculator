import { NextResponse } from 'next/server';
import { MARKET_CONFIG } from '@/lib/market-config';

export async function GET() {
    try {
        const fetchPromises = MARKET_CONFIG.symbols.map(async (symbol) => {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
            try {
                const res = await fetch(url, { next: { revalidate: 60 } });
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
                    fiftyTwoWeekLow: meta.fiftyTwoWeekLow
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
            prevClose: 3.5
        };

        return NextResponse.json({
            success: true,
            data: dataMap,
            timestamp: Date.now()
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
    }
}
