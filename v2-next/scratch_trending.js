async function testTrending() {
    try {
        const res = await fetch('https://query1.finance.yahoo.com/v1/finance/trending/KR');
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
testTrending();
