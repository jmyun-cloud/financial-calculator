"use client";
import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import GoalTracker from "@/components/GoalTracker";
import { useMarketData } from "@/hooks/useMarketData";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const ProfessionalChart = dynamic(() => import("./ProfessionalChart"), { ssr: false });
const TechnicalSummary = dynamic(() => import("./TechnicalSummary"), { ssr: false });
import EconomicCalendar from "./EconomicCalendar";
import SentimentGauge from "./SentimentGauge";
import { useAuth } from "@/contexts/AuthContext";

export default function UserDashboard() {
    const [isClient, setIsClient] = useState(false);
    const { isLoggedIn, setShowLoginModal } = useAuth();
    const { data: marketData, loading } = useMarketData();
    const { toggleWatchlist, isWatched } = useWatchlist();

    const marketDataMap = useMemo(() => {
        const map: Record<string, any> = {};
        if (Array.isArray(marketData)) {
            marketData.forEach(item => {
                map[item.symbol] = item;
            });
        }
        return map;
    }, [marketData]);

    // Guest view states (Premium upgrade)
    const [activeMarketTab, setActiveMarketTab] = useState("주식");
    const [activeRegion, setActiveRegion] = useState("KR"); // "KR" or "US"
    const [activeChip, setActiveChip] = useState("트렌딩 주식");
    const [selectedCard, setSelectedCard] = useState<string>("BTC-USD");
    const [detailData, setDetailData] = useState<any>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [chartRange, setChartRange] = useState("1y");
    const [screenerData, setScreenerData] = useState<any[]>([]);
    const [isScreenerLoading, setIsScreenerLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    // Helper data for premium design
    const marketTabs = useMemo(() => [
        {
            id: "지수",
            indices: [
                { symbol: "^KS11", name: "KOSPI", flag: "🇰🇷", unit: "pt", region: "KR" },
                { symbol: "^KQ11", name: "KOSDAQ", flag: "🇰🇷", unit: "pt", region: "KR" },
                { symbol: "^GSPC", name: "S&P 500", flag: "🇺🇸", unit: "pt", region: "US" },
                { symbol: "^IXIC", name: "Nasdaq", flag: "🇺🇸", unit: "pt", region: "US" },
                { symbol: "^DJI", name: "Dow Jones", flag: "🇺🇸", unit: "pt", region: "US" },
                { symbol: "^N225", name: "Nikkei 225", flag: "🇯🇵", unit: "pt", region: "US" },
                { symbol: "^HSI", name: "Hang Seng", flag: "🇭🇰", unit: "pt", region: "US" },
                { symbol: "^FTSE", name: "FTSE 100", flag: "🇬🇧", unit: "pt", region: "US" },
                { symbol: "^STOXX50E", name: "Euro Stoxx 50", flag: "🇪🇺", unit: "pt", region: "US" }
            ],
            chips: ["전체 지수", "주요 지수", "선물 지수", "아시아", "유럽", "미국"]
        },
        {
            id: "주식",
            indices: [
                { symbol: "005930.KS", name: "삼성전자", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "000660.KS", name: "SK하이닉스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "005935.KS", name: "삼성전자우", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "005380.KS", name: "현대차", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "373220.KS", name: "LG에너지솔루션", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "402340.KS", name: "SK스퀘어", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "012450.KS", name: "한화에어로스페이스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "207940.KS", name: "삼성바이오로직스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "034020.KS", name: "두산에너빌리티", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "000270.KS", name: "기아", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "105560.KS", name: "KB금융", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "329180.KS", name: "HD현대중공업", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "032830.KS", name: "삼성생명", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "028260.KS", name: "삼성물산", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "055550.KS", name: "신한지주", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "068270.KS", name: "셀트리온", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "009150.KS", name: "삼성전기", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "006800.KS", name: "미래에셋증권", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "267260.KS", name: "HD현대일렉트릭", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "042660.KS", name: "한화오션", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "006400.KS", name: "삼성SDI", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "012330.KS", name: "현대모비스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "010130.KS", name: "고려아연", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "086790.KS", name: "하나금융지주", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "035420.KS", name: "NAVER", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "005490.KS", name: "POSCO홀딩스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "015760.KS", name: "한국전력", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "298040.KS", name: "효성중공업", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "009540.KS", name: "HD한국조선해양", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "010120.KS", name: "LS ELECTRIC", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "042700.KS", name: "한미반도체", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "034730.KS", name: "SK", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "316140.KS", name: "우리금융지주", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "272210.KS", name: "한화시스템", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "010140.KS", name: "삼성중공업", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "051910.KS", name: "LG화학", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "064350.KS", name: "현대로템", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "000810.KS", name: "삼성화재", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "000150.KS", name: "두산", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "035720.KS", name: "카카오", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "069500.KS", name: "KODEX 200", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "096770.KS", name: "SK이노베이션", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "079550.KS", name: "LIG디펜스앤에어로스페이스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "017670.KS", name: "SK텔레콤", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "138040.KS", name: "메리츠금융지주", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "011200.KS", name: "HMM", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "267250.KS", name: "HD현대", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "000720.KS", name: "현대건설", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "066570.KS", name: "LG전자", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "033780.KS", name: "KT&G", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "003670.KS", name: "포스코퓨처엠", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "047810.KS", name: "한국항공우주", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "024110.KS", name: "기업은행", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "086280.KS", name: "현대글로비스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "030200.KS", name: "KT", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "360750.KS", name: "TIGER 미국S&P500", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "278470.KS", name: "에이피알", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "071050.KS", name: "한국금융지주", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "003550.KS", name: "LG", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "0126Z0.KS", name: "삼성에피스홀딩스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "010950.KS", name: "S-Oil", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "047050.KS", name: "포스코인터내셔널", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "039490.KS", name: "키움증권", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "005940.KS", name: "NH투자증권", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "323410.KS", name: "카카오뱅크", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "005830.KS", name: "DB손해보험", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "018260.KS", name: "삼성에스디에스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "259960.KS", name: "크래프톤", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "307950.KS", name: "현대오토에버", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "352820.KS", name: "하이브", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "086520.KQ", name: "에코프로", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "247540.KQ", name: "에코프로비엠", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "196170.KQ", name: "알테오젠", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "000250.KQ", name: "삼천당제약", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "277810.KQ", name: "레인보우로보틱스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "298380.KQ", name: "에이비엘바이오", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "058470.KQ", name: "리노공업", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "028300.KQ", name: "HLB", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "950160.KQ", name: "코오롱티슈진", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "141080.KQ", name: "리가켐바이오", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "087010.KQ", name: "펩트론", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "240810.KQ", name: "원익IPS", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "039030.KQ", name: "이오테크닉스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "214370.KQ", name: "케어젠", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "310210.KQ", name: "보로노이", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "095340.KQ", name: "ISC", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "043260.KQ", name: "성호전자", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "263750.KQ", name: "펄어비스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "108490.KQ", name: "로보티즈", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "032820.KQ", name: "우리기술", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "214150.KQ", name: "클래시스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "403870.KQ", name: "HPSP", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "319400.KQ", name: "현대무벡스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "347850.KQ", name: "디앤디파마텍", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "357780.KQ", name: "솔브레인", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "226950.KQ", name: "올릭스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "010170.KQ", name: "대한광통신", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "145020.KQ", name: "휴젤", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "214450.KQ", name: "파마리서치", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "0009K0.KQ", name: "에임드바이오", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "AAPL", name: "Apple", flag: "🇺🇸", unit: "USD", region: "US", type: "trending" },
                { symbol: "NVDA", name: "Nvidia", flag: "🇺🇸", unit: "USD", region: "US", type: "trending" },
                { symbol: "TSLA", name: "Tesla", flag: "🇺🇸", unit: "USD", region: "US", type: "trending" },
                { symbol: "MSFT", name: "Microsoft", flag: "🇺🇸", unit: "USD", region: "US", type: "trending" },
                { symbol: "META", name: "Meta", flag: "🇺🇸", unit: "USD", region: "US" },
                { symbol: "GOOGL", name: "Alphabet", flag: "🇺🇸", unit: "USD", region: "US" },
                { symbol: "NFLX", name: "Netflix", flag: "🇺🇸", unit: "USD", region: "US" },
                { symbol: "AMZN", name: "Amazon", flag: "🇺🇸", unit: "USD", region: "US" },
                { symbol: "BRK-B", name: "Berkshire", flag: "🇺🇸", unit: "USD", region: "US" },
                { symbol: "V", name: "Visa", flag: "🇺🇸", unit: "USD", region: "US" },
                { symbol: "JPM", name: "JPMorgan", flag: "🇺🇸", unit: "USD", region: "US" }
            ],
            chips: ["트렌딩 주식", "최다 거래", "급등주", "급락주", "52주 신고가", "52주 신저가"]
        },
        {
            id: "원자재",
            indices: [
                { symbol: "GC=F", name: "금", flag: "🟡", unit: "USD/oz", region: "US" },
                { symbol: "SI=F", name: "은", flag: "⚪", unit: "USD/oz", region: "US" },
                { symbol: "CL=F", name: "WTI유", flag: "🛢️", unit: "USD/bbl", region: "US" },
                { symbol: "BZ=F", name: "브렌트유", flag: "🛢️", unit: "USD/bbl", region: "US" },
                { symbol: "HG=F", name: "구리", flag: "🥉", unit: "USD/lb", region: "US" },
                { symbol: "NG=F", name: "천연가스", flag: "🔥", unit: "USD/MMBtu", region: "US" },
                { symbol: "PL=F", name: "백금", flag: "⚪", unit: "USD/oz", region: "US" }
            ],
            chips: ["귀금속", "에너지", "비철금속", "농산물"]
        },
        {
            id: "외환",
            indices: [
                { symbol: "KRW=X", name: "USD/KRW", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "JPYKRW=X", name: "JPY/KRW", flag: "🇯🇵", unit: "원/100엔", region: "KR" },
                { symbol: "EURKRW=X", name: "EUR/KRW", flag: "🇪🇺", unit: "원", region: "KR" },
                { symbol: "CNYKRW=X", name: "CNY/KRW", flag: "🇨🇳", unit: "원", region: "KR" },
                { symbol: "EURUSD=X", name: "EUR/USD", flag: "🇪🇺", unit: "USD", region: "US" },
                { symbol: "GBPUSD=X", name: "GBP/USD", flag: "🇬🇧", unit: "USD", region: "US" },
                { symbol: "USDJPY=X", name: "USD/JPY", flag: "🇯🇵", unit: "JPY", region: "US" },
                { symbol: "AUDUSD=X", name: "AUD/USD", flag: "🇦🇺", unit: "USD", region: "US" }
            ],
            chips: ["주요 통화", "아시아", "유럽", "신흥국"]
        },
        {
            id: "ETF",
            indices: [
                { symbol: "SPY", name: "S&P 500 ETF", flag: "🇺🇸", unit: "USD", region: "US" },
                { symbol: "QQQ", name: "Nasdaq 100 ETF", flag: "🇺🇸", unit: "USD", region: "US" },
                { symbol: "ARKK", name: "ARK Innovation", flag: "🇺🇸", unit: "USD", region: "US" },
                { symbol: "SOXX", name: "Semiconductor ETF", flag: "🇺🇸", unit: "USD", region: "US" },
                { symbol: "TQQQ", name: "Nasdaq 3x Leverage", flag: "🇺🇸", unit: "USD", region: "US" },
                { symbol: "SQQQ", name: "Nasdaq 3x Inverse", flag: "🇺🇸", unit: "USD", region: "US" },
                { symbol: "DIA", name: "Dow 30 ETF", flag: "🇺🇸", unit: "USD", region: "US" }
            ],
            chips: ["지수 추종", "레버리지", "섹터/테마", "채권/배당"]
        },
        {
            id: "암호화폐",
            indices: [
                { symbol: "BTC-USD", name: "Bitcoin", flag: "₿", unit: "USD", region: "US" },
                { symbol: "ETH-USD", name: "Ethereum", flag: "Ξ", unit: "USD", region: "US" },
                { symbol: "BNB-USD", name: "Binance Coin", flag: "🔶", unit: "USD", region: "US" },
                { symbol: "SOL-USD", name: "Solana", flag: "☀️", unit: "USD", region: "US" },
                { symbol: "XRP-USD", name: "Ripple", flag: "✖️", unit: "USD", region: "US" },
                { symbol: "ADA-USD", name: "Cardano", flag: "💠", unit: "USD", region: "US" },
                { symbol: "DOGE-USD", name: "Dogecoin", flag: "🐕", unit: "USD", region: "US" }
            ],
            chips: ["메이저 코인", "알트코인", "레이어 1", "DeFi", "NFT/메타버스"]
        }
    ], []);

    // Dynamic filtering based on Region and Chips
    const currentTab = useMemo(() => marketTabs.find(t => t.id === activeMarketTab) || marketTabs[0], [activeMarketTab, marketTabs]);

    const summaryIndices = useMemo(() => {
        // Priority 0: Search Results
        if (searchQuery.length >= 2 && searchResults.length > 0) {
            return searchResults.map(item => ({
                symbol: item.symbol,
                name: item.name,
                flag: item.region === 'KR' ? '🇰🇷' : '🇺🇸',
                price: marketDataMap[item.symbol]?.price || "---",
                change: marketDataMap[item.symbol]?.change || "---",
                changePercent: marketDataMap[item.symbol]?.changePercent || "---",
                volume: marketDataMap[item.symbol]?.volume || "---",
                high: "---",
                low: "---"
            })).slice(0, 15);
        }

        // Priority 1: US Screener Data or Regional Filtered
        let processedItems = [];

        if (activeRegion === "US" && screenerData.length > 0) {
            processedItems = screenerData.map(item => ({
                symbol: item.symbol,
                name: item.name || item.symbol,
                flag: '🇺🇸',
                price: item.price,
                change: item.change,
                changePercent: item.changePercent,
                volume: item.volume,
                high: item.high,
                low: item.low
            }));
        } else {
            processedItems = (currentTab.indices as any[]).filter(idx => {
                if (activeRegion && idx.region !== activeRegion) return false;
                return true;
            });
        }

        // Apply Interactive Sorting or Default Dynamic Chip Sorting
        const dynamicChips = ["트렌딩 주식", "최다 거래", "급등주", "급락주", "52주 신고가", "52주 신저가"];

        return [...processedItems].sort((a, b) => {
            const dataA = marketDataMap[a.symbol] || a;
            const dataB = marketDataMap[b.symbol] || b;

            const parseVal = (val: any) => {
                if (typeof val === 'number') return val;
                if (!val || typeof val !== 'string') return 0;
                // Identify the sign based on the arrow indicator
                const sign = (val.includes('▼') || val.includes('-')) ? -1 : 1;
                // Remove all formatting characters including arrows
                const cleaned = val.replace(/,/g, '').replace(/[원USD▲▼%+]/g, '').trim();
                return (parseFloat(cleaned) || 0) * sign;
            };

            // 1. User Manual Sort (Priority)
            if (sortConfig) {
                const key = sortConfig.key;
                // Get values based on source
                let valA = (activeRegion === "US" && screenerData.length > 0) ? a[key] : dataA[key];
                let valB = (activeRegion === "US" && screenerData.length > 0) ? b[key] : dataB[key];

                if (key === 'name') {
                    return sortConfig.direction === 'asc'
                        ? (valA || '').localeCompare(valB || '')
                        : (valB || '').localeCompare(valA || '');
                }

                const numA = parseVal(valA);
                const numB = parseVal(valB);
                return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
            }

            // 2. Default Dynamic Chip Sorting (If no manual sort)
            if (dynamicChips.includes(activeChip)) {
                if (activeChip === "급등주") return parseVal(dataB.changePercent) - parseVal(dataA.changePercent);
                if (activeChip === "급락주") return parseVal(dataA.changePercent) - parseVal(dataB.changePercent);
                if (activeChip === "최다 거래") return parseVal(dataB.volume) - parseVal(dataA.volume);
            }

            return 0;
        }).slice(0, 15);
    }, [currentTab, activeRegion, activeChip, screenerData, marketDataMap, sortConfig]);

    // Fetch detailed data when a card is selected
    useEffect(() => {
        if (!selectedCard) {
            setDetailData(null);
            return;
        }

        const fetchDetail = async () => {
            setIsDetailLoading(true);
            try {
                const res = await fetch(`/api/market-detail?symbol=${encodeURIComponent(selectedCard)}&range=${chartRange}`);
                if (res.ok) {
                    const data = await res.json();
                    setDetailData(data);
                }
            } catch (err) {
                console.error("Failed to fetch detail:", err);
            } finally {
                setIsDetailLoading(false);
            }
        };

        fetchDetail();
    }, [selectedCard, chartRange]);

    // Dynamic Market Screener Logic
    useEffect(() => {
        const dynamicChips = ["트렌딩 주식", "급등주", "급락주", "최다 거래", "52주 신고가", "52주 신저가"];
        // Only fetch US screener for now as Yahoo predefined screeners are US-heavy.
        // For KR, we use the client-side sorting logic implemented in summaryIndices.
        if (!dynamicChips.includes(activeChip) || activeRegion === "KR") {
            setScreenerData([]);
            return;
        }

        const fetchScreener = async () => {
            setIsScreenerLoading(true);
            const chipToScrId: Record<string, string> = {
                "트렌딩 주식": "trending_tickers",
                "급등주": "day_gainers",
                "급락주": "day_losers",
                "최다 거래": "most_actives",
                "52주 신고가": "growth_technology_stocks", // Approximated
                "52주 신저가": "undervalued_growth_stocks" // Approximated
            };
            const scrId = chipToScrId[activeChip];

            try {
                const res = await fetch(`/api/market-screener?scrId=${scrId}&count=15`);
                if (res.ok) {
                    const data = await res.json();
                    setScreenerData(data.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch screener:", err);
            } finally {
                setIsScreenerLoading(false);
            }
        };

        fetchScreener();
    }, [activeChip, activeRegion]);

    // Global Market Search Logic (Debounced)
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/market-search?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data.data || []);
                }
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const formatVolume = (vol: number | null) => {
        if (!vol || vol === 0) return "---";
        if (vol >= 100000000) return (vol / 100000000).toFixed(1) + "억주";
        if (vol >= 10000) return (vol / 10000).toFixed(0) + "만주";
        return vol.toLocaleString() + "주";
    };

    useEffect(() => {
        setIsClient(true);
    }, []);


    const getMarketStatus = (sym: string) => {
        const now = new Date();
        const kstHour = (now.getUTCHours() + 9) % 24;
        const kstMin = now.getUTCMinutes();
        const kstDay = now.getUTCDay();
        const isWeekend = kstDay === 0 || kstDay === 6;

        if (["^KS11", "^KQ11"].includes(sym)) {
            const minutes = kstHour * 60 + kstMin;
            if (!isWeekend && minutes >= 540 && minutes <= 930) return { type: "open", text: "장중" };
            return { type: "closed", text: "장마감" };
        }
        return { type: "realtime", text: "실시간" };
    };

    if (!isClient) return <div className="skeleton-loader" style={{ height: '300px', background: 'rgba(0,0,0,0.05)', borderRadius: '28px' }} />;

    const renderMarketSummary = () => {
        const currentData = detailData?.chartData || [];
        const isPositive = marketDataMap[selectedCard]?.isPositive ?? true;

        return (
            <div className="coinness-chart-main" style={{ background: 'white', border: 'none', marginBottom: '24px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 8px', borderBottom: '1px solid #F2F4F7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 800, color: '#191F28' }}>
                            {selectedCard === 'BTC-USD' ? '비트코인' : selectedCard}
                        </span>
                        <span style={{ fontSize: '13px', color: '#8B95A1', fontWeight: 700 }}>{selectedCard}</span>
                    </div>
                    {marketDataMap[selectedCard] && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 800, color: isPositive ? '#F04452' : '#3182F6' }}>
                            {marketDataMap[selectedCard].price}
                            <span style={{ fontSize: '14px' }}>{isPositive ? '▲' : '▼'} {marketDataMap[selectedCard].changePercent}%</span>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '16px' }}>
                    <ProfessionalChart
                        data={currentData}
                        isPositive={isPositive}
                        initialType="Candlestick"
                        height={500}
                        currentRange={chartRange}
                        onRangeChange={setChartRange}
                    />
                </div>
            </div>
        );
    };

    if (!isLoggedIn) {
        return (
            <div className="dashboard-guest-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {renderMarketSummary()}
            </div>
        );
    }

    return (
        <div className="user-dashboard-v3" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {renderMarketSummary()}
        </div>
    );
}
