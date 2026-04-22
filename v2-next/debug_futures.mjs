async function debugYF() {
    const symbols = ['KMY00=F', 'KMC=F', 'KOSPI200.KS'];
    for (const symbol of symbols) {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
        console.log('Testing:', symbol);
        try {
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const data = await res.json();
            if (data.chart.result) {
                const meta = data.chart.result[0].meta;
                console.log(`${symbol} Meta:`, {
                    regularMarketPrice: meta.regularMarketPrice,
                    chartPreviousClose: meta.chartPreviousClose
                });
            } else {
                console.log(`${symbol} Failed:`, data.chart.error);
            }
        } catch (e) {
            console.log(`${symbol} Error:`, e.message);
        }
    }
}

debugYF();
