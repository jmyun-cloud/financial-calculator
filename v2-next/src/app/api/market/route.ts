import { NextResponse } from 'next/server';

const SYMBOLS = ['^KS11', '^KQ11', 'KRW=X', 'GC=F'];

export async function GET() {
    try {
        const fetchPromises = SYMBOLS.map(async (symbol) => {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
            try {
                // Fetch with a 60-second revalidation period to ensure speed and bypass static build issues
                const res = await fetch(url, { next: { revalidate: 60 } });
                if (!res.ok) return null;
                const data = await res.json();

                if (!data.chart || !data.chart.result) return null;
                const meta = data.chart.result[0].meta;

                return {
                    symbol,
                    price: meta.regularMarketPrice,
                    prevClose: meta.previousClose
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
