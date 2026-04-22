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

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setIsLoading(true);
                const res = await fetch("/api/news");
                const data = await res.json();
                if (!res.ok) {
                    setErrorMsg(data.error || "뉴스 로드 실패");
                    setNews([]);
                } else {
                    setNews(data);
                }
            } catch (err) {
                setErrorMsg("서버 통신 오류");
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

    const filtered = activeTab === "전체" ? news : news.filter(n => n.category === activeTab);

    const Thumbnail = ({ cat, imageUrl }: { cat: string; imageUrl?: string | null }) => {
        const [imgError, setImgError] = useState(false);
        const theme = getTheme(cat);
        const proxiedUrl = imageUrl && !imgError
            ? `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl.replace(/^https?:\/\//, ''))}&w=800&q=80&fit=cover`
            : null;

        return (
            <div style={{ width: "100%", height: "100%", background: theme.gradient, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: '8px', overflow: 'hidden' }}>
                {proxiedUrl ? (
                    <img src={proxiedUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setImgError(true)} />
                ) : (
                    <span style={{ fontSize: '24px' }}>{theme.icon}</span>
                )}
            </div>
        );
    };

    return (
        <div style={{ padding: '32px', background: 'white', borderRadius: '24px', border: '1px solid #F2F4F7', width: '100%' }}>
            {/* AI Briefing */}
            <div style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #F2F4F7' }}>
                <div style={{ fontSize: '13px', color: '#8B95A1', fontWeight: 600, marginBottom: '8px' }}>
                    4. 22. 11:00 &gt;
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🌸</span>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#191F28', margin: 0 }}>
                        <span style={{ color: '#9B51E0' }}>AI 브리핑</span> {news[0]?.title ? `: ${news[0].title.slice(0, 45)}...` : '로딩 중...'}
                    </h2>
                </div>
                <p style={{ fontSize: '15px', color: '#4E5968', lineHeight: 1.6, margin: 0 }}>
                    {news[0]?.description ? news[0].description.slice(0, 200) + "..." : "전일 시장의 주요 흐름을 분석하여 요약해 드립니다."}
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #191F28', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        style={{
                            padding: '8px 4px',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '15px',
                            fontWeight: activeTab === cat ? 800 : 500,
                            color: activeTab === cat ? '#191F28' : '#8B95A1',
                            borderBottom: activeTab === cat ? '3px solid #191F28' : 'none',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div style={{ height: '300px', background: '#F8F9FA', borderRadius: '12px', opacity: 0.5 }} />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>
                    {/* Main Content */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 4.5fr) 2.5fr', gap: '32px' }}>
                        {/* 3 Pillar Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            {filtered.slice(1, 4).map(item => (
                                <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    <div style={{ width: '100%', aspectRatio: '16/10', marginBottom: '12px' }}>
                                        <Thumbnail cat={item.category} imageUrl={item.imageUrl} />
                                    </div>
                                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#191F28', lineHeight: 1.4, margin: '0 0 6px' }}>{item.title}</h4>
                                    <div style={{ fontSize: '12px', color: '#8B95A1' }}>{item.source} · {item.timeAgo}</div>
                                </a>
                            ))}
                        </div>
                        {/* Side List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {filtered.slice(4, 9).map(item => (
                                <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', borderBottom: '1px solid #F2F4F7', paddingBottom: '12px' }}>
                                    <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#333D4B', margin: '0 0 4px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h5>
                                    <div style={{ fontSize: '12px', color: '#8B95A1' }}>{item.source} · {item.timeAgo}</div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Trending Sidebar */}
                    <div style={{ borderLeft: '1px solid #F2F4F7', paddingLeft: '32px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px' }}>⚡ 가장 많이 본 뉴스</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {filtered.slice(10, 15).map((item, idx) => (
                                <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '12px', textDecoration: 'none' }}>
                                    <span style={{ fontSize: '18px', fontWeight: 900, color: idx < 3 ? '#3182F6' : '#B0B8C1', width: '20px' }}>{idx + 1}</span>
                                    <div style={{ flex: 1 }}>
                                        <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#333D4B', margin: '0 0 4px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h5>
                                        <div style={{ fontSize: '11px', color: '#8B95A1' }}>{item.source}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
