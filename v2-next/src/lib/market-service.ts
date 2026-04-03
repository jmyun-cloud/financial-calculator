export interface MarketData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

export async function getMarketIndicators(): Promise<MarketData[]> {
  try {
    // 1. Fetch symbols from Yahoo Finance
    const symbols = ['^KS11', '^KQ11', 'KRW=X', 'GC=F'];
    const names: Record<string, string> = {
      '^KS11': 'KOSPI',
      '^KQ11': 'KOSDAQ',
      'KRW=X': 'USD/KRW',
      'GC=F': 'Gold'
    };

    const fetchPromises = symbols.map(async (symbol) => {
      try {
        const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d&_=${Date.now()}`, {
          cache: 'no-store'
        });
        if (!res.ok) {
          console.error(`Fetch failed for ${symbol}: Status ${res.status}`);
          return null;
        }
        const data = await res.json();
        const meta = data.chart.result[0].meta;
        const currentPrice = meta.regularMarketPrice;
        const prevClose = meta.previousClose;
        const change = currentPrice - prevClose;
        const changePercent = (change / prevClose) * 100;

        return {
          symbol,
          name: names[symbol],
          price: currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          change: change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          changePercent: changePercent.toFixed(2),
          isPositive: change >= 0
        };
      } catch (e) {
        console.error(`Failed to fetch ${symbol}:`, e);
        return null;
      }
    });

    const marketResults = await Promise.all(fetchPromises);
    const indicators = marketResults.filter((item): item is MarketData => item !== null);

    // 2. Add Base Rate (Mock for now as it's not on Yahoo Finance easily)
    const baseRate: MarketData = {
      symbol: 'BASE',
      name: '기준금리',
      price: '3.50%',
      change: '0.00',
      changePercent: '0.00',
      isPositive: true
    };

    return [baseRate, ...indicators];
  } catch (error) {
    console.error("Market data fetch error:", error);
    return [];
  }
}
