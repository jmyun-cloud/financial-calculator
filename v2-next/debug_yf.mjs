async function debugYF() {
    const symbol = '^KS11';
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    console.log('Fetching:', url);
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    const data = await res.json();
    console.log('Meta:', JSON.stringify(data.chart.result[0].meta, null, 2));
}

debugYF();
