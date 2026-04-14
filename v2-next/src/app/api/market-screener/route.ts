import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const scrId = searchParams.get('scrId') || 'trending_tickers';
    const count = searchParams.get('count') || '10';

    try {
        // Yahoo Finance Screener API
        const url = `https://query2.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=${scrId}&count=${count}`;

        const res = await fetch(url, {
            next: { revalidate: 300 }, // Cache for 5 mins
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!res.ok) {
            throw new Error(`Yahoo API responded with status: ${res.status}`);
        }

        const data = await res.json();

        if (!data.finance || !data.finance.result || !data.finance.result[0].quotes) {
            return NextResponse.json({ success: true, data: [] });
        }

        const quotes = data.finance.result[0].quotes;

        // Standardize the format to match our Market Hub indices
        const formattedData = quotes.map((q: any) => ({
            symbol: q.symbol,
            name: q.shortName || q.longName || q.symbol,
            price: q.regularMarketPrice,
            change: q.regularMarketChange,
            changePercent: q.regularMarketChangePercent,
            volume: q.regularMarketVolume,
            high: q.regularMarketDayHigh,
            low: q.regularMarketDayLow,
            region: q.market.includes('us') ? 'US' : 'Global'
        }));

        return NextResponse.json({
            success: true,
            data: formattedData,
            timestamp: Date.now()
        });

    } catch (error: any) {
        console.error('Screener API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Error'
        }, { status: 500 });
    }
}
