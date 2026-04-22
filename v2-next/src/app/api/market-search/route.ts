import { NextRequest, NextResponse } from 'next/server';
import { KR_STOCKS } from '@/lib/market-data/kr-stocks';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.length < 1) {
        return NextResponse.json({ data: [] });
    }

    try {
        // 1. Local Search (KOSPI 200, etc.)
        const localMatches = KR_STOCKS.filter(s =>
            s.name.includes(q) ||
            s.symbol.toLowerCase().includes(q.toLowerCase())
        );

        // 2. Multi-digit check (If searching by ticker)
        const isTicker = /^\d{3,}$/.test(q);
        const searchTerms = [q];
        if (isTicker && q.length === 6) {
            searchTerms.push(`${q}.KS`, `${q}.KQ`);
        }

        // 3. Yahoo Finance search (fallback or complementary)
        // If q is Korean, Yahoo API might fail, but if it's English/Ticker, it works.
        const yahooResults: any[] = [];
        const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(q);

        if (!isKorean || isTicker) {
            const response = await fetch(
                `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=10&newsCount=0`,
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                (data.quotes || []).forEach((quote: any) => {
                    yahooResults.push({
                        symbol: quote.symbol,
                        name: quote.shortname || quote.longname || quote.symbol,
                        exchange: quote.exchange,
                        type: quote.quoteType === 'EQUITY' ? 'Stock' : 'Index',
                        region: quote.exchange === 'KSC' || quote.exchange === 'KOE' || quote.symbol.endsWith('.KS') || quote.symbol.endsWith('.KQ') ? 'KR' : 'US'
                    });
                });
            }
        }

        // Merge and deduplicate
        const merged = [...localMatches, ...yahooResults];
        const unique = merged.filter((v, i, a) => a.findIndex(t => t.symbol === v.symbol) === i);

        return NextResponse.json({ data: unique.slice(0, 15) });
    } catch (error) {
        console.error('Market search error:', error);
        return NextResponse.json({ error: 'Failed to search market data', data: [] }, { status: 500 });
    }
}
