import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) return NextResponse.json({ error: 'Missing symbol' }, { status: 400 });
    if (symbol === 'BASE') {
        return NextResponse.json({
            price: 3.5,
            fiftyTwoWeekHigh: 3.5,
            fiftyTwoWeekLow: 3.5,
            regularMarketVolume: 0
        });
    }

    try {
        // Fetch 1 year of daily data to calculate true 52-week high/low
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1y`;
        const res = await fetch(url, {
            next: { revalidate: 3600 }, // Cache detail for 1 hour
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!res.ok) throw new Error(`Yahoo API error: ${res.status}`);
        const data = await res.json();

        if (!data.chart || !data.chart.result) throw new Error('Malformed Yahoo response');

        const result = data.chart.result[0];
        const meta = result.meta;
        const indicators = result.indicators.quote[0];

        // Manually calculate 52-week High/Low from historical data
        // This is much more reliable than the 'meta' fields for indices
        const highs = (indicators.high || []).filter((v: any) => v !== null && v !== 0);
        const lows = (indicators.low || []).filter((v: any) => v !== null && v !== 0);

        const calculatedHigh = highs.length > 0 ? Math.max(...highs) : meta.fiftyTwoWeekHigh;
        const calculatedLow = lows.length > 0 ? Math.min(...lows) : meta.fiftyTwoWeekLow;

        return NextResponse.json({
            price: meta.regularMarketPrice,
            fiftyTwoWeekHigh: calculatedHigh,
            fiftyTwoWeekLow: calculatedLow === 0 ? null : calculatedLow,
            regularMarketVolume: meta.regularMarketVolume
        });

    } catch (error: any) {
        console.error("Market Detail API Error:", error.message);
        return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 });
    }
}
