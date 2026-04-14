/**
 * 금융 지표 설정 파일
 * 
 * 새로운 지표를 추가하거나 이름을 바꾸고 싶을 때 여기서 수정하면
 * TickerBar(상단 바)와 MarketWidget(우측 패널)에 모두 즉시 반영됩니다.
 */

export const MARKET_CONFIG = {
    // 야후 파이낸스 심볼 목록
    symbols: [
        '^KS11', '^KQ11', 'KRW=X', 'JPYKRW=X', 'EURKRW=X', 'CNYKRW=X',
        '^GSPC', '^IXIC', '^DJI', '^N225', '^HSI', '^FTSE', // 해외
        '005930.KS', '000660.KS', '035420.KS', '035720.KS', '005380.KS', '000270.KS',
        '373220.KS', '207940.KS', '068270.KS', '005490.KS', '051910.KS', '000810.KS',
        '012330.KS', '035420.KS', '066570.KS', '096770.KS', '036570.KS', // 한국 대형주 추가
        'AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NFLX', 'BRK-B', 'V', 'JPM', // 미국 주식 추가
        'SPY', 'QQQ', 'SOXX', 'ARKK', // ETF
        'BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', // 암호화폐
        'GC=F', 'SI=F', 'CL=F', 'HG=F' // 원자재
    ],

    // 카테고리 분류 (신규)
    categories: {
        domestic: ['^KS11', '^KQ11', 'KRW=X'],
        global: ['^GSPC', '^IXIC', '^DJI', '^N225', '^HSI'],
        crypto: ['BTC-USD', 'ETH-USD', 'XRP-USD'],
        commodity: ['GC=F', 'SI=F', 'CL=F', 'HG=F']
    } as Record<string, string[]>,

    // 화면에 표시할 이름 매핑
    names: {
        '^KS11': 'KOSPI',
        '^KQ11': 'KOSDAQ',
        'KRW=X': 'USD/KRW',
        'JPYKRW=X': 'JPY/KRW',
        'EURKRW=X': 'EUR/KRW',
        'CNYKRW=X': 'CNY/KRW',
        '^GSPC': 'S&P 500',
        '^IXIC': 'Nasdaq',
        '^DJI': 'Dow Jones',
        '^N225': 'Nikkei 225',
        '^HSI': 'Hang Seng',
        '^FTSE': 'FTSE 100',
        '005930.KS': '삼성전자',
        '000660.KS': 'SK하이닉스',
        '035420.KS': 'NAVER',
        '035720.KS': '카카오',
        '005380.KS': '현대차',
        '000270.KS': '기아',
        '373220.KS': 'LG에너지솔루션',
        '207940.KS': '삼성바이오로직스',
        '068270.KS': '셀트리온',
        '005490.KS': 'POSCO홀딩스',
        '051910.KS': 'LG화학',
        '000810.KS': '삼성화재',
        '012330.KS': '현대모비스',
        '066570.KS': 'LG전자',
        '096770.KS': 'SK이노베이션',
        '036570.KS': '엔씨소프트',
        'AAPL': 'Apple',
        'TSLA': 'Tesla',
        'NVDA': 'Nvidia',
        'MSFT': 'Microsoft',
        'GOOGL': 'Alphabet',
        'AMZN': 'Amazon',
        'META': 'Meta',
        'NFLX': 'Netflix',
        'BRK-B': 'Berkshire',
        'V': 'Visa',
        'JPM': 'JPMorgan',
        'SPY': 'S&P 500 ETF',
        'QQQ': 'Nasdaq ETF',
        'SOXX': 'Semi ETF',
        'ARKK': 'ARK Innovation',
        'BTC-USD': 'BitCoin',
        'ETH-USD': 'Ethereum',
        'SOL-USD': 'Solana',
        'XRP-USD': 'Ripple',
        'GC=F': 'Gold',
        'SI=F': 'Silver',
        'CL=F': 'Crude Oil',
        'HG=F': 'Copper',
        'BASE': '금리'
    } as Record<string, string>,

    // 상단 티커바 전용 이름 (짧은 이름 권장)
    tickerNames: {
        '^KS11': 'KOSPI',
        '^KQ11': 'KOSDAQ',
        'KRW=X': '환율',
        '^GSPC': 'S&P 500',
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
        'JPYKRW=X': '엔/원 환율',
        'EURKRW=X': '유로/원 환율',
        'CNYKRW=X': '위안/원 환율',
        '^GSPC': 'S&P 500',
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
        'HG=F': '구리 선물',
        'BASE': '한국은행 기준금리'
    } as Record<string, string>
};
