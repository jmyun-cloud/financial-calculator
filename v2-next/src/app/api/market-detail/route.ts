import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const range = searchParams.get('range') || '1y';

    if (!symbol) return NextResponse.json({ error: 'Missing symbol' }, { status: 400 });

    // Standardize Base Rate
    if (symbol === 'BASE') {
        return NextResponse.json({
            price: 3.5,
            fiftyTwoWeekHigh: 3.5,
            fiftyTwoWeekLow: 3.5,
            regularMarketVolume: 0
        });
    }

    try {
        // Always fetch 1y to ensure we have historical data for slicing, even if user asks for 1m/3m/6m
        // Yahoo API often returns 0 or 1 point for short ranges with 1d interval on indices.
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1y&_=${Date.now()}`;

        const res = await fetch(url, {
            // Lower revalidate to 1 minute for detailed market data
            next: { revalidate: 60 },
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

        // 1. Manually calculate 52-week High/Low (Historical analysis)
        const highs = (indicators.high || []).filter((v: any) => v !== null && v !== 0);
        const lows = (indicators.low || []).filter((v: any) => v !== null && v !== 0);

        const calculatedHigh = highs.length > 0 ? Math.max(...highs) : meta.fiftyTwoWeekHigh;
        const calculatedLow = lows.length > 0 ? Math.min(...lows) : meta.fiftyTwoWeekLow;

        // 2. Extract Volume (Special handling for indices)
        let volume = meta.regularMarketVolume;

        // If meta volume is 0/null, fallback to the latest valid indicator volume
        if (!volume || volume === 0) {
            const volumes = (indicators.volume || []).filter((v: any) => v !== null && v !== 0);
            if (volumes.length > 0) {
                volume = volumes[volumes.length - 1];
            }
        }

        // CRITICAL: Yahoo Finance reports KOSPI (^KS11) and KOSDAQ (^KQ11) volume in '1,000 shares' units.
        // We must multiply by 1000 to match the standard stock unit.
        if (volume && (symbol === '^KS11' || symbol === '^KQ11')) {
            volume = volume * 1000;
        }

        // 3. Extract Historical Data for Charting (Last 30 valid points)
        const closes = indicators.close || [];
        const opens = indicators.open || [];
        const highs_arr = indicators.high || [];
        const lows_arr = indicators.low || [];
        const volumes_arr = indicators.volume || [];
        const timestamps = result.timestamp || [];

        const chartData = timestamps
            .map((t: number, i: number) => ({
                time: t, // Send raw timestamp (seconds) for lightweight-charts
                open: opens[i],
                high: highs_arr[i],
                low: lows_arr[i],
                close: closes[i],
                volume: volumes_arr[i],
                value: closes[i] // Keep 'value' for backward compatibility
            }))
            .filter((d: any) => d.close !== null && d.close !== 0);

        // For '1y' or more, we might want more points, but for detail view we limit to keep it fast
        // However, if the user specifically asked for a range, we should return the relevant portion.
        // Slicing manually since we always fetch 1y to avoid Yahoo API bugs
        const slicedData = range === '1m' ? chartData.slice(-22) :
            range === '3m' ? chartData.slice(-66) :
                range === '6m' ? chartData.slice(-132) :
                    range === '1y' ? chartData.slice(-252) : chartData;

        return NextResponse.json({
            price: meta.regularMarketPrice,
            change: meta.regularMarketPrice - meta.chartPreviousClose,
            changePercent: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100,
            fiftyTwoWeekHigh: calculatedHigh,
            fiftyTwoWeekLow: calculatedLow <= 0 ? null : calculatedLow,
            regularMarketDayHigh: meta.regularMarketDayHigh || calculatedHigh,
            regularMarketDayLow: meta.regularMarketDayLow || calculatedLow,
            regularMarketVolume: volume,
            chartData: slicedData
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
            }
        });

    } catch (error: any) {
        console.error("Market Detail API Error:", error.message);
        return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 });
    }
}
