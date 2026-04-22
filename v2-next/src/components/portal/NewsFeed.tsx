"use client";

import React, { useState, useEffect } from "react";

interface NewsItem {
    id: string;
    category: string;
    categoryColor: string;
    title: string;
    description?: string;
    source: string;
    timeAgo: string;
    link: string;
    imageUrl?: string | null;
}

// Category-based visual themes (since RSS has no images)
const CATEGORY_THEMES: Record<string, { gradient: string; icon: string }> = {
    "증시": { gradient: "linear-gradient(135deg, #FF4D4D 0%, #FF8C42 100%)", icon: "📈" },
    "부동산": { gradient: "linear-gradient(135deg, #00B09B 0%, #00D166 100%)", icon: "🏠" },
    "금리/채권": { gradient: "linear-gradient(135deg, #0064FF 0%, #5B9BFF 100%)", icon: "💹" },
    "경제": { gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", icon: "🏛️" },
    "가상화폐": { gradient: "linear-gradient(135deg, #F7931A 0%, #FFAB40 100%)", icon: "₿" },
    "외환/달러": { gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)", icon: "💵" },
    "IPO/공시": { gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", icon: "🔖" },
    "재테크": { gradient: "linear-gradient(135deg, #9B51E0 0%, #C48AF7 100%)", icon: "💰" },
};

const getTheme = (cat: string) => CATEGORY_THEMES[cat] || CATEGORY_THEMES["재테크"];

const CATEGORIES = ["전체", "증시", "경제", "부동산", "금리/채권", "가상화폐", "외환/달러", "IPO/공시"];

export default function NewsFeed({ compactMode = false }: { compactMode?: boolean }) {
    const [activeTab, setActiveTab] = useState("전체");
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isListView, setIsListView] = useState(false);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setIsLoading(true);
                setErrorMsg(null);
                const res = await fetch("/api/news");
                const data = await res.json();

                if (!res.ok) {
                    setErrorMsg(data.details || data.error || "뉴스를 불러오지 못했습니다.");
                    setNews([]);
                } else {
                    setNews(data);
                }
            } catch (error) {
                console.error("Error fetching news:", error);
                setErrorMsg("서버 연결에 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

    const filtered = activeTab === "전체"
        ? news
        : news.filter(item =>
            item.category === activeTab
        );

    const hero = filtered[0];
    const cards = filtered.slice(1, 13); // Show up to 12 cards in the slider

    const Thumbnail = ({ cat, imageUrl }: { cat: string; large?: boolean; imageUrl?: string | null }) => {
        const theme = getTheme(cat);
        const size = { width: "100%", height: "100%" };
        const [imgError, setImgError] = useState(false);

        // Use external high-performance image proxy to bypass CORS/hotlink protection
        // weserv.nl is reliable and fast for resizing/proxing
        const proxiedUrl = imageUrl && !imgError
            ? `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl.replace(/^https?:\/\//, ''))}&w=1200&q=85&fit=cover&output=webp`
            : null;

        if (proxiedUrl) {
            return (
                <div style={{
                    ...size,
                    borderRadius: "8px",
                    overflow: "hidden", flexShrink: 0, background: "var(--surface-2)"
                }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={proxiedUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={() => setImgError(true)}
                    />
                </div>
            );
        }
        return (
            <div style={{
                ...size,
                borderRadius: "8px",
                background: theme.gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "32px",
                flexShrink: 0,
            }}>
                {theme.icon}
            </div>
        );
    };

    return (
        <div className="financial-news-hero" style={{
            background: compactMode ? "transparent" : "rgba(255, 255, 255, 0.7)",
            backdropFilter: compactMode ? "none" : "blur(20px)",
            borderRadius: compactMode ? "0" : "32px",
            padding: compactMode ? "0" : "32px",
            border: compactMode ? "none" : "1px solid rgba(242, 244, 247, 0.8)",
            marginBottom: compactMode ? "0" : "32px",
            position: "relative",
            width: "100%",
            boxShadow: compactMode ? "none" : "0 20px 50px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>
            {/* Naver Style: AI Briefing Section */}
            <div style={{
                background: '#F8F9FA',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px',
                border: '1px solid #F2F4F7',
                position: 'relative'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🔮</span>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#191F28', margin: 0 }}>
                        <span style={{ color: '#0055FB' }}>AI 브리핑</span> {news[0] ? `: ${news[0].title.slice(0, 30)}...` : '로딩 중...'}
                    </h2>
                </div>
                <p style={{ fontSize: '15px', color: '#4E5968', lineHeight: 1.6, margin: 0 }}>
                    {news[0]?.description ? news[0].description.slice(0, 150) + "..." : "오늘의 주요 시장 상황을 AI가 요약해 드립니다."}
                </p>
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#B0B8C1' }}>
                    ※ 본 AI 요약은 참고용 자료로 모든 투자에 대한 최종 책임은 투자자 본인에게 있습니다.
                </div>
            </div>

            {/* Newspaper Masthead */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginBottom: "28px",
                borderBottom: "2px solid #191F28",
                paddingBottom: "16px"
            }}>
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none", width: "100%", paddingBottom: "4px" }} className="hide-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            style={{
                                border: 'none',
                                padding: "8px 12px",
                                borderRadius: "4px",
                                fontSize: "15px",
                                fontWeight: activeTab === cat ? 800 : 500,
                                cursor: "pointer",
                                background: 'transparent',
                                color: activeTab === cat ? "#191F28" : "#4E5968",
                                transition: "all 0.2s",
                                borderBottom: activeTab === cat ? '3px solid #191F28' : 'none',
                                whiteSpace: "nowrap",
                                flexShrink: 0
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {compactMode && (
                <div style={{ paddingBottom: "16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#191F28", margin: 0 }}>속보</h2>
                    <span style={{ fontSize: "13px", color: "#8B95A1", fontWeight: 500 }}>24시간 실시간 업데이트</span>
                </div>
            )}

            {isLoading ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px" }}>
                    <div style={{ height: "400px", borderRadius: "24px", background: "#F2F4F7", opacity: 0.5 }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} style={{ height: "120px", borderRadius: "16px", background: "#F2F4F7", opacity: 0.5 }} />
                        ))}
                    </div>
                </div>
            ) : !isLoading && filtered.length > 0 ? (
                <div className="newspaper-layout" style={{ display: "grid", gridTemplateColumns: isListView ? "1fr" : "1fr 320px", gap: "40px" }}>

                    {/* Main Content Area */}
                    <div className="main-news-col" style={{ width: "100%" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: '24px' }}>
                            {filtered.slice(0, 15).map((item) => (
                                <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" style={{
                                    display: "flex",
                                    gap: '24px',
                                    textDecoration: "none",
                                    alignItems: "center",
                                    paddingBottom: '24px',
                                    borderBottom: '1px solid #F2F4F7'
                                }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 700, color: item.categoryColor }}>{item.category}</span>
                                            <span style={{ fontSize: '12px', color: '#B0B8C1' }}>{item.source} · {item.timeAgo}</span>
                                        </div>
                                        <h3 style={{
                                            fontSize: "17px",
                                            fontWeight: 700,
                                            color: "#191F28",
                                            marginBottom: "8px",
                                            lineHeight: 1.4,
                                            letterSpacing: '-0.3px'
                                        }}>{item.title}</h3>
                                        <p style={{
                                            fontSize: "14px",
                                            color: "#4E5968",
                                            margin: 0,
                                            lineHeight: 1.5,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}>{item.description}</p>
                                    </div>
                                    <div style={{ width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden' }}>
                                        <Thumbnail cat={item.category} imageUrl={item.imageUrl} />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar / Trending Area */}
                    {!isListView && (
                        <div className="trending-sidebar" style={{ borderLeft: "1px solid #F2F4F7", paddingLeft: "32px" }}>
                            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#191F28", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ color: "#F04452" }}>⚡</span> 가장 많이 본 뉴스
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                {filtered.slice(5, 12).map((item, idx) => (
                                    <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: "flex", gap: "16px", textDecoration: "none" }}>
                                        <span style={{ fontSize: "20px", fontWeight: 900, color: idx < 3 ? "var(--primary, #3182F6)" : "#8B95A1", flexShrink: 0, width: "24px" }}>{idx + 1}</span>
                                        <div>
                                            <h5 style={{ fontSize: "14px", fontWeight: 700, color: "#333D4B", margin: "0 0 4px", lineHeight: 1.4 }}>{item.title}</h5>
                                            <div style={{ fontSize: "11px", color: "#8B95A1" }}>{item.source}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <button
                                onClick={() => window.location.href = '/news'}
                                style={{
                                    width: "100%",
                                    marginTop: "32px",
                                    padding: "14px",
                                    borderRadius: "12px",
                                    border: "1px solid #E5E8EB",
                                    background: "white",
                                    color: "#191F28",
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    textAlign: "center"
                                }}
                            >
                                전체 뉴스 보기 →
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ padding: "40px", textAlign: "center", color: "#8B95A1" }}>
                    {errorMsg || "뉴스가 없습니다."}
                </div>
            )}

            <style jsx>{`
                .financial-news-hero :global(.hide-scrollbar::-webkit-scrollbar) {
                    display: none;
                }
                .newspaper-layout a:hover h2, 
                .newspaper-layout a:hover h3, 
                .newspaper-layout a:hover h4, 
                .newspaper-layout a:hover h5 {
                    color: #0055FB !important;
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}
