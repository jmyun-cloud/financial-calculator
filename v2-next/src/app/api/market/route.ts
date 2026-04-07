import { NextResponse } from 'next/server';
import { MARKET_CONFIG } from '@/lib/market-config';

export async function GET() {
    try {
        const symbols = MARKET_CONFIG.symbols.join(',');
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

        const res = await fetch(url, {
            next: { revalidate: 60 },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!res.ok) {
            console.error(`Yahoo API error: ${res.status}`);
            return NextResponse.json({ success: false, error: 'Failed to fetch from Yahoo' }, { status: 500 });
        }

        const data = await res.json();

        if (!data.quoteResponse || !data.quoteResponse.result) {
            return NextResponse.json({ success: false, error: 'Malformed Yahoo response' }, { status: 500 });
        }

        const results = data.quoteResponse.result;
        const dataMap: Record<string, any> = {};

        results.forEach((q: any) => {
            dataMap[q.symbol] = {
                symbol: q.symbol,
                price: q.regularMarketPrice,
                prevClose: q.regularMarketPreviousClose,
                high: q.regularMarketDayHigh,
                low: q.regularMarketDayLow,
                volume: q.regularMarketVolume,
                fiftyTwoWeekHigh: q.fiftyTwoWeekHigh,
                fiftyTwoWeekLow: q.fiftyTwoWeekLow
            };
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
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
            }
        });
    } catch (error: any) {
        console.error('API Error:', error.message);
        return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
    }
}
