import { getMarketIndicators } from '@/lib/market-service';

export default async function MarketWidget() {
    const indicators = await getMarketIndicators();

    if (indicators.length === 0) {
        return (
            <div className="widget-panel">
                <h2 className="widget-title">📊 오늘의 주요 지표</h2>
                <p>데이터를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="widget-panel">
            <h2 className="widget-title">
                📊 오늘의 주요 지표
            </h2>
            <div className="market-grid">
                {indicators.map((item) => (
                    <div key={item.symbol} className="market-item">
                        <div className="market-label">
                            {item.symbol === 'BASE' ? '한국은행 기준금리' :
                                item.symbol === 'KRW=X' ? '원/달러 환율' :
                                    item.symbol === '^KS11' ? 'KOSPI 지수' :
                                        item.symbol === '^KQ11' ? 'KOSDAQ 지수' :
                                            item.name}
                        </div>
                        <div className="market-value">
                            {item.price}{item.symbol === 'BASE' ? '' : ''}
                        </div>
                        <div className={`market-change ${item.isPositive ? 'up' : 'down'}`}>
                            {item.isPositive ? '▲' : '▼'} {item.change} ({item.isPositive ? '+' : ''}{item.changePercent}%)
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
