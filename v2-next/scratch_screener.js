async function testScreener() {
    try {
        const res = await fetch('https://query2.finance.yahoo.com/v1/finance/screener', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            },
            body: JSON.stringify({
                offset: 0,
                size: 25,
                sortField: "regularMarketChangePercent",
                sortType: "DESC",
                quoteType: "EQUITY",
                query: {
                    operator: "EQ",
                    operands: ["region", "kr"]
                }
            })
        });

        if (!res.ok) {
            console.log('Error status:', res.status);
        }
        const data = await res.json();
        console.log(data?.finance?.result?.[0]?.quotes?.[0]);
    } catch (e) {
        console.error(e);
    }
}
testScreener();
