"use client";

import React, { useState } from "react";
import Link from "next/link";

interface NewsItem {
    id: string;
    category: "증시" | "부동산" | "금리" | "재테크";
    categoryColor: string;
    title: string;
    source: string;
    timeAgo: string;
}

const MOCK_NEWS: NewsItem[] = [
    {
        id: "1",
        category: "증시",
        categoryColor: "#FF4D4D",
        title: "미국 관세 충격에 코스피 2,500선 위협...외국인 3,200억 순매도",
        source: "연합뉴스",
        timeAgo: "14분 전"
    },
    {
        id: "2",
        category: "금리",
        categoryColor: "#0064FF",
        title: "한국은행 기준금리 2.75% 동결, 5월 인하 가능성 시사",
        source: "한국경제",
        timeAgo: "1시간 전"
    },
    {
        id: "3",
        category: "부동산",
        categoryColor: "#00D166",
        title: "서울 아파트 거래량 3개월 연속 증가...강남 3구 중심 회복세",
        source: "조선비즈",
        timeAgo: "2시간 전"
    },
    {
        id: "4",
        category: "재테크",
        categoryColor: "#9B51E0",
        title: "2026 ISA 개편, 비과세 한도 500만→1000만 상향 확정",
        source: "매일경제",
        timeAgo: "3시간 전"
    }
];

const CATEGORIES = ["전체", "증시", "부동산", "금리/환율"];

export default function NewsFeed() {
    const [activeTab, setActiveTab] = useState("전체");

    const filteredNews = activeTab === "전체"
        ? MOCK_NEWS
        : MOCK_NEWS.filter(item => {
            if (activeTab === "증시") return item.category === "증시";
            if (activeTab === "부동산") return item.category === "부동산";
            if (activeTab === "금리/환율") return item.category === "금리";
            return true;
        });

    return (
        <div className="news-feed-v3 card-premium">
            <header className="feed-header">
                <h2 className="feed-title">오늘의 금융 뉴스</h2>
                <Link href="/news" className="view-all">전체보기 →</Link>
            </header>

            <nav className="news-tabs">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
                        onClick={() => setActiveTab(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </nav>

            <div className="news-list">
                {filteredNews.map(item => (
                    <div key={item.id} className="news-item">
                        <div className="news-content">
                            <div className="news-meta">
                                <span className="cat-badge" style={{ backgroundColor: `${item.categoryColor}15`, color: item.categoryColor }}>
                                    {item.category}
                                </span>
                                <span className="news-source">{item.source}</span>
                                <span className="meta-divider">·</span>
                                <span className="time-ago">{item.timeAgo}</span>
                            </div>
                            <h3 className="news-title">{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .news-feed-v3 {
                    background: var(--surface);
                    border-radius: 28px;
                    padding: 32px;
                    border: 1px solid var(--border);
                    margin-bottom: 32px;
                }
                .feed-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .feed-title {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin: 0;
                }
                .view-all {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--primary);
                    text-decoration: none;
                }
                .news-tabs {
                    display: flex;
                    gap: 8px;
                    background: var(--surface-2);
                    padding: 6px;
                    border-radius: 14px;
                    margin-bottom: 24px;
                }
                .tab-btn {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    background: transparent;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .tab-btn.active {
                    background: var(--surface);
                    color: var(--text-primary);
                    box-shadow: var(--shadow-sm);
                }
                .news-list {
                    display: flex;
                    flex-direction: column;
                }
                .news-item {
                    padding: 20px 0;
                    border-bottom: 1px solid var(--border);
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .news-item:last-child {
                    border-bottom: none;
                }
                .news-item:hover {
                    opacity: 0.7;
                }
                .news-meta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                .cat-badge {
                    font-size: 0.7rem;
                    font-weight: 800;
                    padding: 2px 8px;
                    border-radius: 6px;
                }
                .news-source, .time-ago {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }
                .meta-divider {
                    color: var(--border);
                }
                .news-title {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    line-height: 1.4;
                    margin: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
            `}</style>
        </div>
    );
}
