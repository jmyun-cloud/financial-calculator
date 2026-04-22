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
        // Map UI resolution to Yahoo Finance interval and range.
        let yfInterval = '1d';
        let yfRange = '1y';

        if (range === '1m') { yfInterval = '1m'; yfRange = '1d'; }
        else if (range === '5m') { yfInterval = '5m'; yfRange = '5d'; }
        else if (range === '15m') { yfInterval = '15m'; yfRange = '5d'; }
        else if (range === '1h') { yfInterval = '60m'; yfRange = '1mo'; }
        else if (range === '4h') { yfInterval = '60m'; yfRange = '3mo'; }
        else if (range === '1d') { yfInterval = '5m'; yfRange = '1d'; } // Use intraday for 1d request
        else if (range === '3m' || range === '6m' || range === '1y') { yfInterval = '1d'; yfRange = '1y'; }

        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${yfInterval}&range=${yfRange}&_=${Date.now()}`;

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

        // Apply specific truncations for legacy month ranges. For intraday, send all fetched data.
        let slicedData = chartData;
        if (range === '1y' && yfInterval === '1d') slicedData = chartData.slice(-252);
        if (range === '6m' && yfInterval === '1d') slicedData = chartData.slice(-132);
        if (range === '3m' && yfInterval === '1d') slicedData = chartData.slice(-66);

        const previousClose = meta.regularMarketPreviousClose || meta.chartPreviousClose;

        return NextResponse.json({
            price: meta.regularMarketPrice,
            change: meta.regularMarketPrice - previousClose,
            changePercent: ((meta.regularMarketPrice - previousClose) / previousClose) * 100,
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
