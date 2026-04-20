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

export default function NewsFeed() {
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
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px)",
            borderRadius: "32px",
            padding: "32px",
            border: "1px solid rgba(242, 244, 247, 0.8)",
            marginBottom: "32px",
            position: "relative",
            width: "100%",
            boxShadow: "0 20px 50px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>
            {/* Newspaper Masthead */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginBottom: "28px",
                borderBottom: "2px solid #191F28",
                paddingBottom: "16px"
            }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <h1 style={{
                            fontSize: "28px",
                            fontWeight: 900,
                            color: "#191F28",
                            margin: 0,
                            letterSpacing: "-0.03em",
                            textTransform: "uppercase",
                            fontFamily: "'Inter', sans-serif",
                            whiteSpace: "nowrap"
                        }}>
                            Financial Times
                        </h1>
                    </div>
                    <div style={{ fontSize: "13px", color: "#8B95A1", fontWeight: 600, paddingBottom: "4px" }}>
                        {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                    </div>
                </div>

                <div style={{ display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none", width: "100%", paddingBottom: "4px" }} className="hide-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            style={{
                                border: activeTab === cat ? "none" : "1px solid #E5E8EB",
                                padding: "8px 18px",
                                borderRadius: "100px",
                                fontSize: "13px",
                                fontWeight: 700,
                                cursor: "pointer",
                                background: activeTab === cat ? "#191F28" : "white",
                                color: activeTab === cat ? "white" : "#4E5968",
                                transition: "all 0.2s",
                                whiteSpace: "nowrap",
                                flexShrink: 0
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

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
                    <div className="main-news-col">
                        {isListView ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                                {filtered.map(item => (
                                    <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: "flex", gap: "24px", textDecoration: "none" }}>
                                        <div style={{ width: "240px", height: "160px", flexShrink: 0, borderRadius: "16px", overflow: "hidden" }}>
                                            <Thumbnail cat={item.category} imageUrl={item.imageUrl} large />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ color: getTheme(item.category).gradient.split(',')[1].split(' ')[1], fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
                                                {item.category}
                                            </div>
                                            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#191F28", marginBottom: "12px", lineHeight: 1.4 }}>{item.title}</h3>
                                            <p style={{ fontSize: "14px", color: "#4E5968", lineHeight: 1.6, marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                {item.description}
                                            </p>
                                            <div style={{ fontSize: "12px", color: "#8B95A1" }}>{item.source} · {item.timeAgo}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* BIG HERO STORY */}
                                {hero && (
                                    <a href={hero.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", marginBottom: "40px" }}>
                                        <div style={{ position: "relative", height: "440px", borderRadius: "24px", overflow: "hidden", marginBottom: "24px" }}>
                                            <Thumbnail cat={hero.category} imageUrl={hero.imageUrl} large />
                                            <div style={{
                                                position: "absolute",
                                                bottom: 0, left: 0, right: 0,
                                                padding: "40px",
                                                background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                                                color: "white"
                                            }}>
                                                <span style={{
                                                    background: "#F04452",
                                                    padding: "4px 12px",
                                                    borderRadius: "6px",
                                                    fontSize: "12px",
                                                    fontWeight: 900,
                                                    marginBottom: "16px",
                                                    display: "inline-block"
                                                }}>
                                                    TOP STORY
                                                </span>
                                                <h2 style={{ fontSize: "32px", fontWeight: 900, lineHeight: 1.2, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
                                                    {hero.title}
                                                </h2>
                                                <p style={{ fontSize: "16px", opacity: 0.9, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                    {hero.description}
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                )}

                                {/* SECONDARY GRID */}
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
                                    {filtered.slice(1, 5).map(item => (
                                        <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                                            <div style={{ height: "180px", borderRadius: "16px", overflow: "hidden", marginBottom: "12px" }}>
                                                <Thumbnail cat={item.category} imageUrl={item.imageUrl} />
                                            </div>
                                            <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#191F28", lineHeight: 1.4, margin: "0 0 8px" }}>{item.title}</h4>
                                            <div style={{ fontSize: "12px", color: "#8B95A1" }}>{item.source} · {item.timeAgo}</div>
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}
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
                                        <span style={{ fontSize: "20px", fontWeight: 900, color: "#E5E8EB", flexShrink: 0, width: "24px" }}>{idx + 1}</span>
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
