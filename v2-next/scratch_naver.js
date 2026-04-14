async function testNaver() {
    try {
        // Top Gainers KOSPI
        const res = await fetch('https://m.stock.naver.com/api/stocks/fluctuationsRatio/KOSPI?page=1&pageSize=15&type=rise');
        const data = await res.json();
        console.log("KOSPI Gainers:", JSON.stringify(data.stocks.map(s => s.itemCode + ' ' + s.stockName + ' ' + s.fluctuationsRatio), null, 2));

        // Top Volume KOSPI
        const res2 = await fetch('https://m.stock.naver.com/api/stocks/quant/KOSPI?page=1&pageSize=5');
        const data2 = await res2.json();
        console.log("KOSPI Volume:", JSON.stringify(data2.stocks.map(s => s.stockName), null, 2));
    } catch (e) {
        console.error(e);
    }
}
testNaver();
