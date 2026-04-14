import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
        return NextResponse.json({ data: [] });
    }

    try {
        // Yahoo Finance Autocomplete API
        const response = await fetch(
            `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=10&newsCount=0`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Yahoo Finance search failed');
        }

        const data = await response.json();

        // Standardize the results
        const results = (data.quotes || []).map((quote: any) => ({
            symbol: quote.symbol,
            name: quote.shortname || quote.longname || quote.symbol,
            exchange: quote.exchange,
            type: quote.quoteType,
            region: quote.exchange === 'KSC' || quote.exchange === 'KOE' ? 'KR' : 'US'
        }));

        return NextResponse.json({ data: results });
    } catch (error) {
        console.error('Market search error:', error);
        return NextResponse.json({ error: 'Failed to search market data', data: [] }, { status: 500 });
    }
}
