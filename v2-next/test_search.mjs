async function testSearch(query) {
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=10`;
    console.log(`Searching Browser-like: ${url}`);

    try {
        const response = await fetch(url, {
            headers: {
                'accept': '*/*',
                'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                'Referer': 'https://finance.yahoo.com/',
            },
        });

        console.log(`Status: ${response.status}`);
        const data = await response.json();
        console.log('Results:', JSON.stringify(data.quotes?.map(q => ({ symbol: q.symbol, name: q.shortname })), null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

testSearch('삼성전자');
