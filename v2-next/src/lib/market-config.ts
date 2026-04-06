/**
 * 금융 지표 설정 파일
 * 
 * 새로운 지표를 추가하거나 이름을 바꾸고 싶을 때 여기서 수정하면
 * TickerBar(상단 바)와 MarketWidget(우측 패널)에 모두 즉시 반영됩니다.
 */

export const MARKET_CONFIG = {
    // 야후 파이낸스 심볼 목록
    symbols: ['^KS11', '^KQ11', 'KRW=X', 'GC=F', 'BTC-USD', '^GSPC'],

    // 화면에 표시할 이름 매핑
    names: {
        '^KS11': 'KOSPI',
        '^KQ11': 'KOSDAQ',
        'KRW=X': 'USD/KRW',
        'GC=F': 'Gold',
        'BTC-USD': '비트코인',
        '^GSPC': 'S&P 500',
        'BASE': '금리'
    } as Record<string, string>,

    // 상단 티커바 전용 이름 (짧은 이름 권장)
    tickerNames: {
        '^KS11': 'KOSPI',
        '^KQ11': 'KOSDAQ',
        'KRW=X': '환율',
        'GC=F': '골드',
        'BTC-USD': 'BTC',
        '^GSPC': 'S&P500',
        'BASE': '금리'
    } as Record<string, string>,

    // 우측 위젯 전용 이름 (상세 이름 권장)
    widgetNames: {
        '^KS11': 'KOSPI 지수',
        '^KQ11': 'KOSDAQ 지수',
        'KRW=X': '원/달러 환율',
        'GC=F': '국제 금 시세',
        'BTC-USD': '비트코인(USD)',
        '^GSPC': 'S&P 500 지수',
        'BASE': '한국은행 기준금리'
    } as Record<string, string>
};
