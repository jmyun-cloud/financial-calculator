"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface NewsItem {
    id: string;
    category: string;
    categoryColor: string;
    title: string;
    description?: string;
    source: string;
    timeAgo: string;
    pubDate?: string;
    link: string;
    imageUrl?: string | null;
}

const CATEGORIES = ["전체", "증시", "경제", "부동산", "금리/채권", "가상화폐", "외환/달러", "IPO/공시"];

function NewsContent() {
    const searchParams = useSearchParams();
    const queryCat = searchParams.get("category");

    const [activeTab, setActiveTab] = useState("전체");
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (queryCat) {
            const catMap: Record<string, string> = {
                'economy': '경제', 'stocks': '증시', 'crypto': '가상화폐',
                'forex': '외환/달러', 'real-estate': '부동산'
            };
            setActiveTab(catMap[queryCat] || queryCat);
        }
    }, [queryCat]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setIsLoading(true);
                const res = await fetch("/api/news");
                const data = await res.json();
                setNews(data);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

    const filtered = activeTab === "전체"
        ? news
        : news.filter(item => item.category === activeTab);

    const isToday = (dateStr: string) => {
        if (!dateStr) return false;
        try {
            const d = new Date(dateStr);
            const today = new Date();
            return d.getDate() === today.getDate() &&
                d.getMonth() === today.getMonth() &&
                d.getFullYear() === today.getFullYear();
        } catch { return false; }
    };

    const newsToday = filtered.filter(item => isToday(item.pubDate || ""));
    const newsPrevious = filtered.filter(item => !isToday(item.pubDate || ""));

    const renderCard = (item: NewsItem) => {
        const proxied = item.imageUrl
            ? `https://images.weserv.nl/?url=${encodeURIComponent(item.imageUrl.replace(/^https?:\/\//, ''))}&w=400&fit=cover&output=webp`
            : null;
        return (
            <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "16px",
                    background: "white",
                    padding: "16px",
                    borderRadius: "16px",
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    border: "1px solid #F2F4F7",
                    alignItems: "flex-start",
                    transition: "all 0.2s ease",
                }}
            >
                {proxied && (
                    <div style={{
                        width: "160px",
                        height: "110px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "#F2F4F7",
                    }}>
                        <img
                            src={proxied}
                            alt=""
                            loading="lazy"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", fontSize: "12px" }}>
                        <span style={{ color: item.categoryColor, fontWeight: 800 }}>{item.category}</span>
                        <span style={{ color: "#E5E8EB" }}>·</span>
                        <span style={{ color: "#4E5968", fontWeight: 500 }}>{item.source}</span>
                        <span style={{ color: "#8B95A1", fontWeight: 500 }}>{item.timeAgo}</span>
                    </div>
                    <h3 style={{
                        fontSize: "16px",
                        fontWeight: 800,
                        color: "#191F28",
                        marginBottom: "8px",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}>{item.title}</h3>
                    <p style={{
                        fontSize: "13px",
                        color: "#4E5968",
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        margin: 0,
                    }}>{item.description}</p>
                </div>
            </a>
        );
    };

    const renderSection = (title: string, items: NewsItem[], borderColor: string) => (
        items.length > 0 ? (
            <div style={{ marginBottom: "40px" }}>
                <h2 style={{
                    fontSize: "17px",
                    fontWeight: 800,
                    color: "#191F28",
                    marginBottom: "16px",
                    paddingLeft: "10px",
                    borderLeft: `4px solid ${borderColor}`,
                }}>{title}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {items.map(item => renderCard(item))}
                </div>
            </div>
        ) : null
    );

    return (
        <div style={{ padding: "40px 0 80px", background: "#F9FAFB", minHeight: "100vh" }}>
            <div className="container">
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "36px" }}>
                    <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#191F28", marginBottom: "8px" }}>
                        금융 뉴스 센터
                    </h1>
                    <p style={{ color: "#4E5968", fontSize: "15px" }}>가장 빠르고 정확한 실시간 경제 소식</p>
                </div>

                {/* Category Tabs */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "40px", overflowX: "auto", paddingBottom: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            style={{
                                padding: "8px 20px",
                                borderRadius: "100px",
                                border: activeTab === cat ? "none" : "1px solid #E5E8EB",
                                background: activeTab === cat ? "#191F28" : "white",
                                color: activeTab === cat ? "white" : "#4E5968",
                                fontSize: "14px",
                                fontWeight: 600,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                transition: "all 0.2s",
                            }}
                        >{cat}</button>
                    ))}
                </div>

                {/* News List */}
                {isLoading ? (
                    <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} style={{ height: "130px", background: "white", borderRadius: "16px", opacity: 0.6 }} />
                        ))}
                    </div>
                ) : (
                    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                        {renderSection("오늘의 주요 뉴스", newsToday, "#F04452")}
                        {newsToday.length === 0 && renderSection("최신 뉴스", newsPrevious, "#3182F6")}
                        {newsToday.length > 0 && renderSection("이전 뉴스", newsPrevious, "#B0B8C1")}
                        {newsToday.length === 0 && newsPrevious.length === 0 && (
                            <p style={{ textAlign: "center", color: "#8B95A1" }}>결과가 없습니다.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function NewsPage() {
    return (
        <main>
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
                <NewsContent />
            </Suspense>
            <Footer />
        </main>
    );
}
