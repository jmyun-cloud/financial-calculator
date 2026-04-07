import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) return NextResponse.json({ error: 'Missing symbol' }, { status: 400 });

    try {
        let result: any = {};

        // Yahoo Finance Fetch Helper
        const fetchYahoo = async (sym: string) => {
            const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`);
            const data = await res.json();
            return data.chart?.result?.[0]?.meta || {};
        };

        if (symbol === 'KRW=X' || symbol === 'USD/KRW') {
            const [exRateRes, yahooData] = await Promise.all([
                fetch('https://api.exchangerate-api.com/v4/latest/USD'),
                fetchYahoo('KRW=X')
            ]);
            let exRatePrice = null;
            if (exRateRes.ok) {
                const exData = await exRateRes.json();
                exRatePrice = exData.rates?.KRW;
            }
            return NextResponse.json({
                price: exRatePrice,
                fiftyTwoWeekHigh: yahooData.fiftyTwoWeekHigh,
                fiftyTwoWeekLow: yahooData.fiftyTwoWeekLow,
                regularMarketVolume: null // Forex usually doesn't have reliable volume
            });
        }

        // For KOSPI, KOSDAQ, Gold and others
        const meta = await fetchYahoo(symbol);

        return NextResponse.json({
            price: meta.regularMarketPrice,
            fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
            fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
            regularMarketVolume: meta.regularMarketVolume
        });

    } catch (error) {
        console.error("Market Detail API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 });
    }
}
