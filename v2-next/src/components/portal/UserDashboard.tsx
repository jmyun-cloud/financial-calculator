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

export default function UserDashboard() {
    const [isClient, setIsClient] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    const [selectedCard, setSelectedCard] = useState<string>("");
    const [detailData, setDetailData] = useState<any>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [chartRange, setChartRange] = useState("1y");
    const [screenerData, setScreenerData] = useState<any[]>([]);
    const [isScreenerLoading, setIsScreenerLoading] = useState(false);

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
                { symbol: "005930.KS", name: "삼성전자", flag: "🇰🇷", unit: "원", region: "KR", type: "trending" },
                { symbol: "000660.KS", name: "SK하이닉스", flag: "🇰🇷", unit: "원", region: "KR", type: "trending" },
                { symbol: "373220.KS", name: "LG에너지솔루션", flag: "🇰🇷", unit: "원", region: "KR", type: "trending" },
                { symbol: "207940.KS", name: "삼성바이오로직스", flag: "🇰🇷", unit: "원", region: "KR", type: "trending" },
                { symbol: "068270.KS", name: "셀트리온", flag: "🇰🇷", unit: "원", region: "KR", type: "trending" },
                { symbol: "005490.KS", name: "POSCO홀딩스", flag: "🇰🇷", unit: "원", region: "KR", type: "trending" },
                { symbol: "051910.KS", name: "LG화학", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "005380.KS", name: "현대차", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "000270.KS", name: "기아", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "012330.KS", name: "현대모비스", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "035420.KS", name: "NAVER", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "035720.KS", name: "카카오", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "066570.KS", name: "LG전자", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "096770.KS", name: "SK이노베이션", flag: "🇰🇷", unit: "원", region: "KR" },
                { symbol: "036570.KS", name: "엔씨소프트", flag: "🇰🇷", unit: "원", region: "KR" },
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
        // Priority 1: Screener Data (for dynamic chips)
        if (screenerData.length > 0) {
            return screenerData.map(s => ({
                ...s,
                flag: activeRegion === "US" ? "🇺🇸" : "🌐",
                unit: activeRegion === "US" ? "USD" : ""
            }));
        }

        // Priority 2: Standard Hardcoded indices
        return (currentTab.indices as any[]).filter(idx => {
            // Region filter
            if (activeRegion && idx.region !== activeRegion) return false;

            // Static Chip filter (basic implementation for now)
            if (activeChip && activeChip !== "전체 지수" && activeChip !== "트렌딩 주식" && activeChip !== "주요 지수" && activeChip !== "메이저 코인" && activeChip !== "주요 통화" && activeChip !== "귀금속" && activeChip !== "지수 추종") {
                // For now, if a specialized chip is selected, we filter by type if present, 
                // but since we expanded the hardcoded list, we'll just show the relevant assets.
                // In a real app, this would query a database.
            }

            return true;
        });
    }, [currentTab, activeRegion, activeChip, screenerData, activeMarketTab]);

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
        const dynamicChips = ["트렌딩 주식", "급등주", "급락주", "최다 거래"];
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
                "최다 거래": "most_actives"
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

    const formatVolume = (vol: number | null) => {
        if (!vol || vol === 0) return "---";
        if (vol >= 100000000) return (vol / 100000000).toFixed(1) + "억주";
        if (vol >= 10000) return (vol / 10000).toFixed(0) + "만주";
        return vol.toLocaleString() + "주";
    };

    useEffect(() => {
        setIsClient(true);
        const handleLogin = () => setIsLoggedIn(true);
        window.addEventListener("fc_mock_login", handleLogin);
        return () => window.removeEventListener("fc_mock_login", handleLogin);
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

    const renderMarketSummary = (showCta: boolean = true) => {
        return (
            <div className="market-summary-container">
                <div className="market-summary-card shadow-premium-clean">
                    <div className="summary-section-header">
                        <div className="header-left">
                            <h2 className="summary-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                시장 <span style={{ color: '#8B95A1', fontSize: '18px', fontWeight: 400 }}>&gt;</span>
                            </h2>
                        </div>
                        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="region-selector" style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    className={`region-btn ${activeRegion === 'KR' ? 'active' : ''}`}
                                    onClick={() => setActiveRegion('KR')}
                                    style={{ background: activeRegion === 'KR' ? '#EBF3FF' : 'transparent', border: 'none', padding: '4px', borderRadius: '4px', cursor: 'pointer', opacity: activeRegion === 'KR' ? 1 : 0.5 }}
                                >
                                    🇰🇷
                                </button>
                                <button
                                    className={`region-btn ${activeRegion === 'US' ? 'active' : ''}`}
                                    onClick={() => setActiveRegion('US')}
                                    style={{ background: activeRegion === 'US' ? '#EBF3FF' : 'transparent', border: 'none', padding: '4px', borderRadius: '4px', cursor: 'pointer', opacity: activeRegion === 'US' ? 1 : 0.5 }}
                                >
                                    🇺🇸
                                </button>
                            </div>
                            <div className="live-status-badge" style={{ background: '#F8F9FA', color: '#8B95A1' }}>
                                실시간
                            </div>
                        </div>
                    </div>

                    <div className="market-tabs-nav" style={{ background: 'transparent', padding: 0, borderBottom: '1px solid #F2F4F7', borderRadius: 0, marginBottom: '20px' }}>
                        {marketTabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-item-v3 ${activeMarketTab === tab.id ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveMarketTab(tab.id);
                                    setActiveChip(tab.chips?.[0] || "");
                                    setSelectedCard(""); // clear on tab switch
                                }}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    padding: '12px 16px',
                                    fontSize: '15px',
                                    fontWeight: activeMarketTab === tab.id ? 800 : 500,
                                    color: activeMarketTab === tab.id ? '#191F28' : '#8B95A1',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'color 0.2s'
                                }}
                            >
                                {tab.id}
                                {activeMarketTab === tab.id && (
                                    <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: '2px', background: '#0055FB' }} />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Secondary Navigation (Chips) */}
                    {currentTab.chips && (
                        <div className="market-chips-nav" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
                            {currentTab.chips.map(chip => (
                                <button
                                    key={chip}
                                    className={`chip-item ${activeChip === chip ? 'active' : ''}`}
                                    onClick={() => setActiveChip(chip)}
                                    style={{
                                        whiteSpace: 'nowrap',
                                        padding: '8px 16px',
                                        borderRadius: '100px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        border: activeChip === chip ? '1px solid #0055FB' : '1px solid #F2F4F7',
                                        background: activeChip === chip ? '#F0F5FF' : '#F9FAFB',
                                        color: activeChip === chip ? '#0055FB' : '#4E5968',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Market Data View (High-Density Table) */}
                    {isScreenerLoading ? (
                        <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#8B95A1' }}>
                            <div className="loading-spinner-v2" style={{ width: '32px', height: '32px', border: '3px solid #F2F4F7', borderTop: '3px solid #0055FB', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            <span style={{ fontSize: '13px', fontWeight: 500 }}>최신 시장 데이터 가져오는 중...</span>
                            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                        </div>
                    ) : (
                        <div className="market-table-container" style={{ overflowX: 'auto', background: 'white', borderRadius: '16px', border: '1px solid #F2F4F7', marginBottom: '24px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #F2F4F7', color: '#8B95A1' }}>
                                        <th style={{ padding: '12px 16px', fontWeight: 700 }}>종목명</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>현재가</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>고가 / 저가</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>변동</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>변동 %</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>거래량</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>시간</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {summaryIndices.map(idx => {
                                        const m = marketDataMap[idx.symbol];
                                        const isScreenerSource = (idx as any).price !== undefined;

                                        const item = isScreenerSource ? {
                                            price: (idx as any).price?.toLocaleString() || "---",
                                            change: typeof (idx as any).change === 'number' ? (idx as any).change.toFixed(2) : (idx as any).change || "0.00",
                                            changePercent: typeof (idx as any).changePercent === 'number' ? (idx as any).changePercent.toFixed(2) : (idx as any).changePercent || "0.00",
                                            isPositive: ((idx as any).change ?? 0) >= 0,
                                            high: (idx as any).high?.toLocaleString() || "---",
                                            low: (idx as any).low?.toLocaleString() || "---",
                                            volume: formatVolume((idx as any).volume)
                                        } : {
                                            price: m ? Number(m.price).toLocaleString() : "---",
                                            change: m ? Number(m.change).toFixed(2) : "0.00",
                                            changePercent: m ? Number(m.changePercent).toFixed(2) : "0.00",
                                            isPositive: (Number(m?.change) ?? 0) >= 0,
                                            high: m?.high ? Number(m.high).toLocaleString() : "---",
                                            low: m?.low ? Number(m.low).toLocaleString() : "---",
                                            volume: m ? formatVolume(Number(m.volume)) : "---"
                                        };
                                        const isSelected = selectedCard === idx.symbol;
                                        return (
                                            <tr
                                                key={idx.symbol}
                                                onClick={() => setSelectedCard(isSelected ? "" : idx.symbol)}
                                                style={{
                                                    borderBottom: '1px solid #F8FAFF',
                                                    cursor: 'pointer',
                                                    background: isSelected ? '#F0F5FF' : 'transparent',
                                                    transition: 'background 0.2s ease'
                                                }}
                                                className="table-row-hover"
                                            >
                                                <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '14px' }}>{idx.flag}</span>
                                                        <span style={{ color: '#191F28' }}>{idx.name}</span>
                                                        <span style={{ fontSize: '11px', color: '#B0B8C1', fontWeight: 400, marginLeft: '4px' }}>{idx.symbol.split('.')[0]}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#1B1C1D' }}>{item.price}</td>
                                                <td style={{ padding: '14px 16px', textAlign: 'right', color: '#4E5968' }}>
                                                    <span style={{ color: '#00D17E' }}>{item.high}</span>
                                                    <span style={{ margin: '0 4px', color: '#E5E8EB' }}>/</span>
                                                    <span style={{ color: '#FF4D4D' }}>{item.low}</span>
                                                </td>
                                                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: item.isPositive ? '#00D17E' : '#FF4D4D' }}>
                                                    {item.isPositive ? '+' : ''}{item.change}
                                                </td>
                                                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                                    <span style={{
                                                        background: item.isPositive ? 'rgba(0, 209, 126, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                                                        color: item.isPositive ? '#00D17E' : '#FF4D4D',
                                                        padding: '4px 8px',
                                                        borderRadius: '6px',
                                                        fontWeight: 800
                                                    }}>
                                                        {item.isPositive ? '▲' : '▼'} {item.changePercent}%
                                                    </span>
                                                </td>
                                                <td style={{ padding: '14px 16px', textAlign: 'right', color: '#8B95A1' }}>{item.volume}</td>
                                                <td style={{ padding: '14px 16px', textAlign: 'right', color: '#8B95A1', fontSize: '11px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                        {new Date().toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1px solid #00D17E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <div style={{ width: '4px', height: '1px', background: '#00D17E', transform: 'rotate(45deg) translate(0px, 1.5px)' }}></div>
                                                            <div style={{ width: '1px', height: '3px', background: '#00D17E' }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div style={{ padding: '16px', borderTop: '1px solid #F2F4F7', textAlign: 'right' }}>
                                <button style={{ border: 'none', background: 'transparent', color: '#0055FB', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}>
                                    모든 {activeMarketTab} 보기 <ArrowRight size={14} style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
                                </button>
                            </div>
                        </div>
                    )}




                    {/* Market Detail Panel (Investing.com Style) */}
                    <div
                        className="detail-preview-section"
                        style={{
                            maxHeight: selectedCard ? '450px' : '0',
                            opacity: selectedCard ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease, margin 0.3s ease',
                            marginBottom: selectedCard ? '24px' : '0',
                            padding: selectedCard ? '24px' : '0 24px',
                            background: '#F8FAFF',
                            border: '1px solid #E8EFFD',
                            borderRadius: '24px'
                        }}
                    >
                        <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="detail-title" style={{ fontSize: '16px', fontWeight: 800, color: '#0055FB' }}>
                                    {currentTab.indices.find((i: any) => i.symbol === selectedCard)?.name} 실시간 분석
                                </span>
                                <span style={{ fontSize: '11px', color: '#8B95A1', fontWeight: 500 }}>(일봉, 30일)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                {isDetailLoading && <span className="loading-spinner">데이터 갱신 중...</span>}
                                <Link
                                    href={`/market/${selectedCard}`}
                                    style={{
                                        color: '#4E5968',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        background: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #E5E8EB'
                                    }}
                                >
                                    심층 분석 <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Chart Area */}
                        {detailData && Array.isArray(detailData.chartData) && detailData.chartData.length > 0 && (
                            <>
                                <div style={{ background: 'white', borderRadius: '16px', padding: '16px 20px 0', marginBottom: '20px', border: '1px solid #F2F4F7', minHeight: '300px' }}>
                                    <ProfessionalChart
                                        data={detailData.chartData}
                                        isPositive={(detailData.change || 0) >= 0}
                                        currentRange={chartRange}
                                        onRangeChange={(range) => setChartRange(range)}
                                    />
                                </div>
                                <TechnicalSummary data={detailData.chartData} />
                            </>
                        )}

                        {/* Analysis Grid */}
                        <div className="detail-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            {/* Day Range visualizer */}
                            <div className="range-box" style={{ gridColumn: 'span 2', background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #F2F4F7' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '11px', color: '#8B95A1', fontWeight: 700 }}>일일 변동 폭</span>
                                    <span style={{ fontSize: '11px', fontWeight: 800 }}>{(detailData?.price || 0).toLocaleString()}</span>
                                </div>
                                <div style={{ height: '4px', background: '#F2F4F7', borderRadius: '2px', position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: `${(() => {
                                            const high = detailData?.regularMarketDayHigh || 0;
                                            const low = detailData?.regularMarketDayLow || 0;
                                            const current = detailData?.price || 0;
                                            if (high === low) return 50;
                                            const pos = ((current - low) / (high - low)) * 100;
                                            return Math.max(0, Math.min(100, pos));
                                        })()}%`,
                                        width: '8px', height: '8px', borderRadius: '50%', background: '#0055FB', top: '-2px', transform: 'translateX(-50%)',
                                        boxShadow: '0 0 0 3px rgba(0, 85, 251, 0.1)'
                                    }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                                    <span style={{ fontSize: '10px', color: '#B0B8C1' }}>최저 {(detailData?.regularMarketDayLow || 0).toLocaleString()}</span>
                                    <span style={{ fontSize: '10px', color: '#B0B8C1' }}>최고 {(detailData?.regularMarketDayHigh || 0).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="metric-item-v3" style={{ background: 'white', padding: '12px 16px', borderRadius: '14px', border: '1px solid #F2F4F7' }}>
                                <span className="m-label" style={{ fontSize: '11px', color: '#8B95A1', display: 'block', marginBottom: '4px' }}>52주 최고</span>
                                <span className="m-value" style={{ fontSize: '14px', fontWeight: 800 }}>{(detailData?.fiftyTwoWeekHigh || 0).toLocaleString()}</span>
                            </div>
                            <div className="metric-item-v3" style={{ background: 'white', padding: '12px 16px', borderRadius: '14px', border: '1px solid #F2F4F7' }}>
                                <span className="m-label" style={{ fontSize: '11px', color: '#8B95A1', display: 'block', marginBottom: '4px' }}>52주 최저</span>
                                <span className="m-value" style={{ fontSize: '14px', fontWeight: 800 }}>{(detailData?.fiftyTwoWeekLow || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {
                        showCta && (
                            <div className="slim-login-cta">
                                <span className="slim-cta-text">📊 로그인하면 자산 현황 · DSR · 재무 목표를 볼 수 있어요</span>
                                <button className="slim-cta-btn" onClick={() => setIsLoggedIn(true)}>
                                    무료 시작하기 →
                                </button>
                            </div>
                        )
                    }

                    <style jsx>{`
                    .market-summary-container { margin-bottom: 40px; }
                    .market-summary-card {
                        background: white;
                        border-radius: 32px;
                        padding: 32px;
                        border: 1px solid #F2F4F7;
                    }
                    .shadow-premium-clean { box-shadow: 0 8px 30px rgba(0,0,0,0.04); }
                    .summary-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                    .summary-title { font-size: 20px; font-weight: 800; color: #191F28; margin: 0; }
                    .summary-date { font-size: 14px; color: #8B95A1; font-weight: 500; margin-left: 12px; }
                    .live-status-badge { background: #E8F9F0; color: #1B8947; padding: 6px 12px; border-radius: 100px; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 4px; }
                    .live-status-badge .dot { width: 6px; height: 6px; background: #1B8947; border-radius: 50%; animation: pulse 1.5s infinite; }
                    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

                    .market-tabs-nav {
                        display: flex;
                        background: #F2F4F6;
                        padding: 4px;
                        border-radius: 12px;
                        gap: 4px;
                        margin-bottom: 32px;
                    }
                    .tab-item {
                        flex: 1;
                        border: none;
                        background: transparent;
                        padding: 10px;
                        font-size: 14px;
                        font-weight: 700;
                        color: #8B95A1;
                        cursor: pointer;
                        border-radius: 8px;
                        transition: all 0.2s;
                    }
                    .tab-item.active { background: white; color: #0055FB; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

                    .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
                    .summary-card-v2 { background: #F9FAFB; border: 1.5px solid transparent; border-radius: 20px; padding: 20px; cursor: pointer; transition: all 0.2s; position: relative; }
                    .summary-card-v2:hover { background: #F2F4F6; }
                    .summary-card-v2.selected { background: white; border-color: #0055FB; box-shadow: 0 4px 12px rgba(0, 85, 251, 0.08); }

                    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                    .card-name-group { display: flex; align-items: center; gap: 4px; }
                    .symbol-name { font-size: 13px; font-weight: 700; color: #8B95A1; }
                    .symbol-flag { font-size: 14px; }
                    .status-badge { font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 6px; }
                    .status-badge.open { background: #FFF0F0; color: #F04251; }
                    .status-badge.closed { background: #F2F4F6; color: #8B95A1; }
                    .status-badge.realtime { background: #EBF3FF; color: #0064FF; }

                    .card-main { margin-bottom: 16px; }
                    .price-val { font-size: 24px; font-weight: 800; color: #191F28; margin-bottom: 4px; }
                    .change-val { font-size: 14px; font-weight: 700; }
                    .change-val.positive { color: #F04251; }
                    .change-val.negative { color: #0064FF; }

                    .card-unit-row { display: flex; align-items: center; margin-top: 8px; }
                    .unit-label { font-size: 11px; font-weight: 600; color: #B0B8C1; letter-spacing: 0.02em; }

                    .detail-preview-section { background: #F4F8FF; border-radius: 16px; }
                    .detail-header { display: flex; align-items: center; margin-bottom: 12px; }
                    .detail-title { font-size: 14px; font-weight: 800; color: #0055FB; }
                    .loading-spinner { font-size: 11px; color: #0055FB; margin-left: 10px; font-weight: 500; opacity: 0.8; animation: pulse 1.5s infinite; }
                    .detail-metrics-grid { display: flex; gap: 32px; }
                    .metric-item { display: flex; align-items: center; gap: 8px; }
                    .metric-label { font-size: 12px; color: #8B95A1; font-weight: 600; }
                    .metric-value { font-size: 14px; font-weight: 800; color: #191F28; }

                    .slim-login-cta { display: flex; align-items: center; justify-content: space-between; background: #F4F8FF; border: 1px solid #DDEEFF; border-radius: 14px; padding: 12px 20px; gap: 12px; }
                    .slim-cta-text { font-size: 13px; color: #4E5968; font-weight: 500; }
                    .slim-cta-btn { background: #0055FB; color: white; border: none; padding: 8px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background 0.2s; }
                    .slim-cta-btn:hover { background: #0046D9; }
                    .section-title { font-size: 18px; font-weight: 800; color: #191F28; margin-bottom: 16px; }

                    .market-table-container th { border-top: none; }
                    .table-row-hover:hover { background: #F8FAFF !important; }
                `}</style>
                </div >
            </div >

        );
    };

    if (!isLoggedIn) {
        return (
            <>
                {renderMarketSummary(true)}
                <div className="dashboard-sidebar-widgets" style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 32px 32px' }}>
                    <SentimentGauge />
                    <div className="widget-section">
                        <EconomicCalendar />
                    </div>
                    <div className="widget-section" style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #F2F4F7' }}>
                        <h3 className="section-title">내 재무 목표</h3>
                        <GoalTracker />
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="user-dashboard-v3">
            <div className="hero-asset-card shadow-premium">
                <div className="asset-label">내 총 자산</div>
                <div className="asset-amount">₩ 48,320,000</div>

                <div className="asset-sub-grid">
                    <div className="asset-sub-item">
                        <span className="sub-label">이번 달 수익</span>
                        <span className="sub-value highlight">+ ₩320,000</span>
                    </div>
                    <div className="asset-sub-item">
                        <span className="sub-label">DSR 잔여</span>
                        <span className="sub-value">35.2%</span>
                    </div>
                    <div className="asset-sub-item">
                        <span className="sub-label">목표 달성률</span>
                        <span className="sub-value">68%</span>
                    </div>
                </div>
            </div>

            {/* Global Market Hub integration for members */}
            <div style={{ marginTop: '32px' }}>
                {renderMarketSummary(false)}
            </div>

            <div className="dashboard-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '32px', alignItems: 'start' }}>
                <div className="dashboard-main-col">
                    <div className="widget-section">
                        <EconomicCalendar />
                    </div>
                </div>

                <div className="dashboard-sidebar-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <SentimentGauge />
                    <div className="widget-section">
                        <h3 className="section-title">내 재무 목표</h3>
                        <GoalTracker />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .user-dashboard-v3 { display: flex; flex-direction: column; gap: 24px; margin-bottom: 32px; }
                .hero-asset-card {
                    background: linear-gradient(135deg, #0064FF 0%, #0046B3 100%);
                    border-radius: 28px;
                    padding: 32px;
                    color: white;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 20px 40px -10px rgba(0, 100, 255, 0.3);
                }
                .hero-asset-card::after {
                    content: '';
                    position: absolute;
                    top: -20%;
                    right: -10%;
                    width: 250px;
                    height: 250px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 50%;
                }
                .asset-label { font-size: 1rem; opacity: 0.8; margin-bottom: 8px; font-weight: 600; color: rgba(255, 255, 255, 0.9); }
                .asset-amount { font-size: 2.8rem; font-weight: 800; margin-bottom: 40px; letter-spacing: -0.02em; }
                .asset-sub-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
                .asset-sub-item {
                    background: rgba(255,255,255,0.12);
                    padding: 18px 16px;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .sub-label { font-size: 0.8rem; opacity: 0.75; font-weight: 500; color: rgba(255, 255, 255, 0.8); }
                .sub-value { font-size: 1.1rem; font-weight: 700; }
                .sub-value.highlight { color: #FFD363; }
                .section-title { font-size: 1.1rem; font-weight: 800; margin-bottom: 16px; color: var(--text-primary); }
            `}</style>
        </div>
    );
}
