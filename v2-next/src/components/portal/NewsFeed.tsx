"use client";

import React, { useState } from "react";

interface NewsItem {
    id: string;
    category: string;
    categoryColor: string;
    title: string;
    source: string;
    timeAgo: string;
    link: string;
}

// Category-based visual themes (since RSS has no images)
const CATEGORY_THEMES: Record<string, { gradient: string; icon: string }> = {
    "증시": { gradient: "linear-gradient(135deg, #FF4D4D 0%, #FF8C42 100%)", icon: "📈" },
    "부동산": { gradient: "linear-gradient(135deg, #00B09B 0%, #00D166 100%)", icon: "🏠" },
    "금리": { gradient: "linear-gradient(135deg, #0064FF 0%, #5B9BFF 100%)", icon: "💹" },
    "재테크": { gradient: "linear-gradient(135deg, #9B51E0 0%, #C48AF7 100%)", icon: "💰" },
};

const getTheme = (cat: string) => CATEGORY_THEMES[cat] || CATEGORY_THEMES["재테크"];

const CATEGORIES = ["전체", "증시", "부동산", "금리"];

export default function NewsFeed() {
    const [activeTab, setActiveTab] = useState("전체");
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        fetch('/api/news')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setNews(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const filtered = activeTab === "전체"
        ? news
        : news.filter(item =>
            activeTab === "금리" ? item.category === "금리" : item.category === activeTab
        );

    const hero = filtered[0];
    const cards = filtered.slice(1, 5); // 4 cards in the grid

    const Thumbnail = ({ cat, large }: { cat: string; large?: boolean }) => {
        const theme = getTheme(cat);
        return (
            <div style={{
                width: large ? "220px" : "100%",
                minWidth: large ? "220px" : undefined,
                height: large ? "160px" : "120px",
                borderRadius: large ? "12px" : "10px",
                background: theme.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: large ? "48px" : "36px",
                flexShrink: 0,
            }}>
                {theme.icon}
            </div>
        );
    };

    return (
        <div style={{
            background: "var(--surface)",
            borderRadius: "28px",
            padding: "28px 32px 24px",
            border: "1px solid var(--border)",
            marginBottom: "32px"
        }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    오늘의 금융 뉴스
                </h2>
                {/* Category Tabs */}
                <div style={{ display: "flex", gap: "4px" }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            style={{
                                border: "none",
                                padding: "5px 14px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: 700,
                                cursor: "pointer",
                                transition: "all 0.15s",
                                background: activeTab === cat ? "var(--text-primary)" : "var(--surface-2)",
                                color: activeTab === cat ? "var(--surface)" : "var(--text-secondary)",
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} style={{ height: "80px", borderRadius: "12px", background: "var(--surface-2)", opacity: 0.5 }} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                    관련 뉴스가 없습니다.
                </div>
            ) : (
                <>
                    {/* HERO ARTICLE */}
                    {hero && (
                        <a
                            href={hero.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "flex",
                                gap: "20px",
                                marginBottom: "24px",
                                paddingBottom: "24px",
                                borderBottom: "1px solid var(--border)",
                                textDecoration: "none",
                                cursor: "pointer",
                            }}
                        >
                            <Thumbnail cat={hero.category} large />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                                    <span style={{
                                        fontSize: "11px", fontWeight: 800,
                                        padding: "2px 8px", borderRadius: "6px",
                                        background: `${hero.categoryColor}18`,
                                        color: hero.categoryColor
                                    }}>
                                        {hero.category}
                                    </span>
                                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{hero.source}</span>
                                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>·</span>
                                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{hero.timeAgo}</span>
                                </div>
                                <h3 style={{
                                    fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)",
                                    lineHeight: 1.45, margin: "0 0 8px", letterSpacing: "-0.01em",
                                    display: "-webkit-box", WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical" as const, overflow: "hidden"
                                }}>
                                    {hero.title}
                                </h3>
                            </div>
                        </a>
                    )}

                    {/* CARD GRID */}
                    {cards.length > 0 && (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${Math.min(cards.length, 4)}, 1fr)`,
                            gap: "16px",
                            marginBottom: "20px"
                        }}>
                            {cards.map(item => (
                                <a
                                    key={item.id}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "flex", flexDirection: "column", gap: "10px",
                                        textDecoration: "none", cursor: "pointer",
                                    }}
                                >
                                    <Thumbnail cat={item.category} />
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                                            <span style={{
                                                fontSize: "10px", fontWeight: 800,
                                                padding: "1px 6px", borderRadius: "4px",
                                                background: `${item.categoryColor}18`,
                                                color: item.categoryColor
                                            }}>
                                                {item.category}
                                            </span>
                                            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{item.timeAgo}</span>
                                        </div>
                                        <p style={{
                                            fontSize: "13px", fontWeight: 700,
                                            color: "var(--text-primary)", margin: 0,
                                            lineHeight: 1.45, letterSpacing: "-0.01em",
                                            display: "-webkit-box", WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical" as const, overflow: "hidden"
                                        }}>
                                            {item.title}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Footer: 뉴스 더 보기 */}
                    <div style={{ textAlign: "right" }}>
                        <a
                            href={hero?.link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)", textDecoration: "none" }}
                        >
                            뉴스 더 보기 →
                        </a>
                    </div>
                </>
            )}
        </div>
    );
}
