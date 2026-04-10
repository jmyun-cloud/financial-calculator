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

    const Thumbnail = ({ cat, large, imageUrl }: { cat: string; large?: boolean; imageUrl?: string | null }) => {
        const theme = getTheme(cat);
        const size = { width: "100%", height: large ? "130px" : "100px" };
        const [imgError, setImgError] = useState(false);

        if (imageUrl && !imgError) {
            return (
                <div style={{
                    ...size,
                    borderRadius: "8px",
                    overflow: "hidden", flexShrink: 0, background: "var(--surface-2)"
                }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt=""
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
                fontSize: large ? "36px" : "28px",
                flexShrink: 0,
            }}>
                {theme.icon}
            </div>
        );
    };

    return (
        <div style={{
            background: "var(--surface)",
            borderRadius: "24px",
            padding: "24px",
            border: "1px solid var(--border)",
            marginBottom: "32px",
            position: "relative",
            maxWidth: "100%",
            width: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            transition: "all 0.3s ease"
        }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    {isListView && (
                        <button
                            onClick={() => setIsListView(false)}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                fontSize: "18px", color: "var(--text-secondary)", padding: "4px"
                            }}
                        >
                            ←
                        </button>
                    )}
                    <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#333D4B", margin: 0, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
                        {isListView ? "최신 금융 뉴스" : "오늘의 금융 뉴스"}
                    </h2>
                </div>
                {/* Category Tabs (Scrollable) */}
                <div style={{
                    display: "flex", gap: "4px", overflowX: "auto",
                    paddingBottom: "2px", msOverflowStyle: "none", scrollbarWidth: "none",
                    flex: 1, justifyContent: "flex-end"
                }} className="category-tabs-container">
                    <style jsx>{`
                        .category-tabs-container::-webkit-scrollbar { display: none; }
                    `}</style>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            style={{
                                border: "none",
                                padding: "4px 10px",
                                borderRadius: "20px",
                                fontSize: "11px",
                                fontWeight: 700,
                                cursor: "pointer",
                                transition: "all 0.15s",
                                background: activeTab === cat ? "var(--text-primary)" : "var(--surface-2)",
                                color: activeTab === cat ? "var(--surface)" : "var(--text-secondary)",
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
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} style={{ height: "80px", borderRadius: "10px", background: "var(--surface-2)", opacity: 0.5 }} />
                    ))}
                </div>
            ) : !isLoading && (news.length === 0 || filtered.length === 0) ? (
                <div className="news-feed-container" style={{ padding: "40px 20px", textAlign: "center", color: "#666" }}>
                    <div style={{ fontSize: "20px", marginBottom: "12px" }}>📡</div>
                    <div style={{ fontSize: "13px" }}>{errorMsg || "관련 뉴스가 없습니다."}</div>
                </div>
            ) : (
                <>
                    <style jsx global>{`
                        .news-slider-group .slider-nav-btn {
                            opacity: 0;
                            visibility: hidden;
                        }
                        .news-slider-group:hover .slider-nav-btn {
                            opacity: 1;
                            visibility: visible;
                        }
                        .slider-nav-btn:hover {
                            background: white !important;
                            transform: translateY(-50%) scale(1.1) !important;
                            color: var(--primary);
                        }
                        #news-slider-viewport::-webkit-scrollbar {
                            display: none;
                        }
                        .news-list-container::-webkit-scrollbar {
                            width: 6px;
                        }
                        .news-list-container::-webkit-scrollbar-thumb {
                            background: #eee;
                            border-radius: 10px;
                        }
                    `}</style>

                    {isListView ? (
                        /* DETAILED LIST VIEW (User requested design) */
                        <div className="news-list-container" style={{
                            display: "flex", flexDirection: "column", gap: "20px",
                            maxHeight: "600px", overflowY: "auto", paddingRight: "8px"
                        }}>
                            {filtered.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "flex", gap: "20px", paddingBottom: "20px",
                                        borderBottom: "1px solid #f1f3f5", textDecoration: "none"
                                    }}
                                >
                                    <div style={{ width: "140px", flexShrink: 0 }}>
                                        <Thumbnail cat={item.category} imageUrl={item.imageUrl} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <h3 style={{
                                            fontSize: "16px", fontWeight: 700, color: "#333",
                                            margin: "0 0 8px", lineHeight: 1.4, letterSpacing: "-0.01em"
                                        }}>
                                            {item.title}
                                        </h3>
                                        <p style={{
                                            fontSize: "13px", color: "#666", margin: "0 0 12px",
                                            lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical" as const, overflow: "hidden"
                                        }}>
                                            {item.description}
                                        </p>
                                        <div style={{ fontSize: "11px", color: "#888", fontWeight: 500 }}>
                                            By {item.source} · {item.timeAgo}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        /* DASHBOARD VIEW (Original Carousel) */
                        <>
                            {/* HERO ARTICLE */}
                            {hero && (
                                <a
                                    href={hero.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "flex",
                                        gap: "16px",
                                        marginBottom: "16px",
                                        paddingBottom: "16px",
                                        borderBottom: "1px solid var(--border)",
                                        textDecoration: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div style={{ width: "180px", flexShrink: 0 }}>
                                        <Thumbnail cat={hero.category} large imageUrl={hero.imageUrl} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                                            <span style={{
                                                fontSize: "9px", fontWeight: 800,
                                                padding: "1px 5px", borderRadius: "4px",
                                                background: `${hero.categoryColor}18`,
                                                color: hero.categoryColor
                                            }}>
                                                {hero.category}
                                            </span>
                                            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{hero.source}</span>
                                            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>·</span>
                                            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{hero.timeAgo}</span>
                                        </div>
                                        <h3 style={{
                                            fontSize: "16px", fontWeight: 700, color: "var(--text-primary)",
                                            lineHeight: 1.4, margin: "0 0 4px", letterSpacing: "-0.01em",
                                            display: "-webkit-box", WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical" as const, overflow: "hidden"
                                        }}>
                                            {hero.title}
                                        </h3>
                                        <p style={{
                                            fontSize: "12px", color: "var(--text-secondary)",
                                            lineHeight: 1.5, margin: 0,
                                            display: "-webkit-box", WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical" as const, overflow: "hidden"
                                        }}>
                                            {hero.description}
                                        </p>
                                    </div>
                                </a>
                            )}

                            {/* CARD SLIDER */}
                            {cards.length > 0 && (
                                <div style={{
                                    position: "relative",
                                    marginBottom: "12px",
                                    width: "100%",
                                    maxWidth: "100%",
                                    overflow: "hidden"
                                }} className="news-slider-group">
                                    <div
                                        id="news-slider-viewport"
                                        style={{
                                            display: "flex",
                                            gap: "12px",
                                            overflowX: "auto",
                                            scrollBehavior: "smooth",
                                            scrollSnapType: "x mandatory",
                                            msOverflowStyle: "none",
                                            scrollbarWidth: "none",
                                            paddingBottom: "4px",
                                            width: "100%"
                                        }}
                                    >
                                        {cards.map((item) => (
                                            <a
                                                key={item.id}
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    flex: "0 0 170px",
                                                    width: "170px",
                                                    scrollSnapAlign: "start",
                                                    display: "flex", flexDirection: "column", gap: "6px",
                                                    textDecoration: "none", cursor: "pointer",
                                                }}
                                            >
                                                <div style={{ marginBottom: "6px" }}>
                                                    <Thumbnail cat={item.category} imageUrl={item.imageUrl} />
                                                </div>
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                                                        <span style={{
                                                            fontSize: "9px", fontWeight: 800,
                                                            padding: "1px 4px", borderRadius: "3px",
                                                            background: `${item.categoryColor}18`,
                                                            color: item.categoryColor
                                                        }}>
                                                            {item.category}
                                                        </span>
                                                        <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>{item.timeAgo}</span>
                                                    </div>
                                                    <p style={{
                                                        fontSize: "12px", fontWeight: 700,
                                                        color: "var(--text-primary)", margin: 0,
                                                        lineHeight: 1.45, letterSpacing: "-0.01em",
                                                        display: "-webkit-box", WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical" as const, overflow: "hidden"
                                                    }}>
                                                        {item.title}
                                                    </p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>

                                    {/* Slider Navigation Buttons */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById('news-slider-viewport')?.scrollBy({ left: -300, behavior: 'smooth' });
                                        }}
                                        className="slider-nav-btn"
                                        style={{
                                            position: "absolute", left: "-12px", top: "50%", transform: "translateY(-50%)",
                                            width: "28px", height: "28px", borderRadius: "50%",
                                            background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(8px)",
                                            border: "1px solid var(--border)", boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            cursor: "pointer", zIndex: 10, transition: "all 0.2s",
                                            fontSize: "18px", fontWeight: "bold"
                                        }}
                                    >
                                        ‹
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById('news-slider-viewport')?.scrollBy({ left: 300, behavior: 'smooth' });
                                        }}
                                        className="slider-nav-btn"
                                        style={{
                                            position: "absolute", right: "-12px", top: "50%", transform: "translateY(-50%)",
                                            width: "28px", height: "28px", borderRadius: "50%",
                                            background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(8px)",
                                            border: "1px solid var(--border)", boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            cursor: "pointer", zIndex: 10, transition: "all 0.2s",
                                            fontSize: "18px", fontWeight: "bold"
                                        }}
                                    >
                                        ›
                                    </button>
                                </div>
                            )}

                            {/* Footer: 뉴스 더 보기 */}
                            <div style={{ textAlign: "right" }}>
                                <button
                                    onClick={() => setIsListView(true)}
                                    style={{
                                        fontSize: "12px", fontWeight: 700, color: "var(--primary)",
                                        textDecoration: "none", background: "none", border: "none", cursor: "pointer"
                                    }}
                                >
                                    뉴스 더 보기 →
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
