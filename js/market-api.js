/**
 * js/market-api.js
 * Fetches real-time market indicators and renders the dashboard & ticker bar.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const statusEl = document.getElementById("market-status");
    const tickerTrack = document.getElementById("ticker-track");

    const valRate = document.getElementById("val-rate");
    const changeRate = document.getElementById("change-rate");

    const valUsd = document.getElementById("val-usd");
    const changeUsd = document.getElementById("change-usd");

    const valKospi = document.getElementById("val-kospi");
    const changeKospi = document.getElementById("change-kospi");

    const valKosdaq = document.getElementById("val-kosdaq");
    const changeKosdaq = document.getElementById("change-kosdaq");

    const valGold = document.getElementById("val-gold");
    const changeGold = document.getElementById("change-gold");

    if (!valRate || !valUsd || !valKospi) return;

    // Format Helpers
    const formatNumber = (num, decimals = 2) => {
        return num.toLocaleString('ko-KR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    };

    /**
     * 1. 한국은행 기준금리 (Mock)
     */
    async function fetchBaseRate() {
        return {
            name: '기준금리',
            value: 3.50,
            changeText: '동결',
            isDown: false,
            unit: '%'
        };
    }

    /**
     * 2. Yahoo Finance Data Fetcher (Generic)
     */
    async function fetchYahooData(symbol, name) {
        try {
            const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d&_=${Date.now()}`;
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(yahooUrl)}`;
            const res = await fetch(proxyUrl);
            const data = await res.json();
            const result = JSON.parse(data.contents).chart.result[0];
            const meta = result.meta;
            const currentPrice = meta.regularMarketPrice;
            const prevClose = meta.previousClose;
            const change = currentPrice - prevClose;
            const changePercent = (change / prevClose) * 100;

            return {
                symbol,
                name,
                value: currentPrice,
                change: change,
                changePercent: changePercent,
                changeText: `${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)} (${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`,
                isDown: change < 0
            };
        } catch (e) {
            console.error(`Error fetching ${symbol}:`, e);
            return null;
        }
    }

    function updateElement(valEl, changeEl, data) {
        if (!valEl || !changeEl || !data) return;
        valEl.textContent = formatNumber(data.value, data.symbol === 'GC=F' ? 2 : (data.unit === '%' ? 2 : 2));
        if (data.unit) valEl.textContent += data.unit;

        changeEl.textContent = data.changeText;
        changeEl.className = `market-change ${data.isDown ? 'down' : ''}`;
    }

    function renderTicker(indicators) {
        if (!tickerTrack) return;

        const validIndicators = indicators.filter(idx => idx !== null);
        // Triple the items for smooth infinite loop
        const displayItems = [...validIndicators, ...validIndicators, ...validIndicators];

        tickerTrack.innerHTML = displayItems.map(item => `
            <div class="ticker-item">
                <span class="ticker-label">${item.name}</span>
                <span class="ticker-value">${formatNumber(item.value)}</span>
                <span class="ticker-change ${item.isDown ? 'down' : 'up'}">
                    ${item.isDown ? '▼' : '▲'} ${Math.abs(item.change || 0).toFixed(2)} (${(item.changePercent || 0).toFixed(2)}%)
                </span>
            </div>
        `).join('');
    }

    async function updateMarketWidget() {
        try {
            if (statusEl) {
                statusEl.textContent = "연결 중...";
            }

            const [rateData, usdData, kospiData, kosdaqData, goldData] = await Promise.all([
                fetchBaseRate(),
                fetchYahooData('KRW=X', '원/달러 환율'),
                fetchYahooData('^KS11', 'KOSPI'),
                fetchYahooData('^KQ11', 'KOSDAQ'),
                fetchYahooData('GC=F', '국제 금 (USD)')
            ]);

            // Update Sidebar
            updateElement(valRate, changeRate, rateData);
            updateElement(valUsd, changeUsd, usdData);
            updateElement(valKospi, changeKospi, kospiData);
            updateElement(valKosdaq, changeKosdaq, kosdaqData);
            updateElement(valGold, changeGold, goldData);

            // Update Ticker
            renderTicker([rateData, usdData, kospiData, kosdaqData, goldData]);

            if (statusEl) {
                const now = new Date();
                const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                statusEl.innerHTML = `<span style="color:#10b981">●</span> 오늘 ${timeStr} 업데이트`;
            }
        } catch (error) {
            console.error("Market update failed", error);
            if (statusEl) statusEl.textContent = "연결 지연";
        }
    }

    // Initial call
    updateMarketWidget();

    // Refresh every 5 minutes
    setInterval(updateMarketWidget, 5 * 60 * 1000);
});
