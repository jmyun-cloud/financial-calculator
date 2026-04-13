/**
 * Technical Analysis Utilities
 */

export interface TechnicalIndicators {
    rsi: number | null;
    ma5: number | null;
    ma20: number | null;
    ma60: number | null;
    ma120: number | null;
    signal: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
}

export function calculateIndicators(data: { close: number }[]): TechnicalIndicators {
    if (!data || data.length === 0) {
        return { rsi: null, ma5: null, ma20: null, ma60: null, ma120: null, signal: 'Neutral' };
    }

    const prices = data.map(d => Number(d.close)).filter(v => !isNaN(v));
    if (prices.length < 5) {
        return { rsi: null, ma5: null, ma20: null, ma60: null, ma120: null, signal: 'Neutral' };
    }

    const ma = (p: number[], period: number) => {
        if (p.length < period) return null;
        const sum = p.slice(-period).reduce((a, b) => a + b, 0);
        return sum / period;
    };

    const rsi = (p: number[], period: number = 14) => {
        if (p.length <= period) return null;
        let gains = 0;
        let losses = 0;
        for (let i = p.length - period; i < p.length; i++) {
            const diff = p[i] - p[i - 1];
            if (diff >= 0) gains += diff;
            else losses -= diff;
        }
        if (losses === 0) return 100;
        const rs = gains / losses;
        return 100 - (100 / (1 + rs));
    };

    const valRsi = rsi(prices);
    const valMa5 = ma(prices, 5);
    const valMa20 = ma(prices, 20);
    const valMa60 = ma(prices, 60);
    const valMa120 = ma(prices, 120);

    // Simple Signal Logic
    let signal: TechnicalIndicators['signal'] = 'Neutral';
    if (valRsi !== null && valMa5 !== null && valMa20 !== null) {
        if (valRsi > 70) signal = 'Strong Sell';
        else if (valRsi < 30) signal = 'Strong Buy';
        else if (valMa5 > valMa20) signal = 'Buy';
        else if (valMa5 < valMa20) signal = 'Sell';
    }

    return {
        rsi: valRsi,
        ma5: valMa5,
        ma20: valMa20,
        ma60: valMa60,
        ma120: valMa120,
        signal
    };
}
