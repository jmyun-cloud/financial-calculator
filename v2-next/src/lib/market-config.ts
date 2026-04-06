/**
 * 금융 지표 설정 파일
 * 
 * 새로운 지표를 추가하거나 이름을 바꾸고 싶을 때 여기서 수정하면
 * TickerBar(상단 바)와 MarketWidget(우측 패널)에 모두 즉시 반영됩니다.
 */

export const MARKET_CONFIG = {
    // 야후 파이낸스 심볼 목록
    symbols: [
        '^KS11', '^KQ11', 'KRW=X',
        '^IXIC', '^DJI', '^N225', '^HSI', '^FTSE', // 해외
        'BTC-USD', 'ETH-USD', 'XRP-USD', // 암호화폐
        'GC=F', 'SI=F', 'CL=F' // 원자재
    ],

    // 카테고리 분류 (신규)
    categories: {
        domestic: ['^KS11', '^KQ11', 'KRW=X', 'BASE'],
        global: ['^IXIC', '^DJI', '^N225', '^HSI', '^FTSE'],
        crypto: ['BTC-USD', 'ETH-USD', 'XRP-USD'],
        commodity: ['GC=F', 'SI=F', 'CL=F']
    } as Record<string, string[]>,

    // 화면에 표시할 이름 매핑
    names: {
        '^KS11': 'KOSPI',
        '^KQ11': 'KOSDAQ',
        'KRW=X': 'USD/KRW',
        '^IXIC': 'Nasdaq',
        '^DJI': 'Dow Jones',
        '^N225': 'Nikkei 225',
        '^HSI': 'Hang Seng',
        '^FTSE': 'FTSE 100',
        'BTC-USD': 'BitCoin',
        'ETH-USD': 'Ethereum',
        'XRP-USD': 'Ripple',
        'GC=F': 'Gold',
        'SI=F': 'Silver',
        'CL=F': 'Crude Oil',
        'BASE': '금리'
    } as Record<string, string>,

    // 상단 티커바 전용 이름 (짧은 이름 권장)
    tickerNames: {
        '^KS11': 'KOSPI',
        '^KQ11': 'KOSDAQ',
        'KRW=X': '환율',
        '^IXIC': '나스닥',
        'BTC-USD': 'BTC',
        'GC=F': '골드',
        'BASE': '금리'
    } as Record<string, string>,

    // 우측 위젯 전용 이름 (상세 이름 권장)
    widgetNames: {
        '^KS11': 'KOSPI 지수',
        '^KQ11': 'KOSDAQ 지수',
        'KRW=X': '원/달러 환율',
        '^IXIC': '나스닥 종합',
        '^DJI': '다우 존스',
        '^N225': '니케이 225',
        '^HSI': '항셍 지수',
        '^FTSE': 'FTSE 100',
        'BTC-USD': '비트코인',
        'ETH-USD': '이더리움',
        'XRP-USD': '리플',
        'GC=F': '국제 금 시세',
        'SI=F': '국제 은 시세',
        'CL=F': 'WTI 원유',
        'BASE': '한국은행 기준금리'
    } as Record<string, string>
};
