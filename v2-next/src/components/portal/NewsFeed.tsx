"use client";

import React, { useState } from "react";
import Link from "next/link";

interface NewsItem {
    id: string;
    category: "증시" | "부동산" | "금리" | "재테크" | string;
    categoryColor: string;
    title: string;
    source: string;
    timeAgo: string;
    link: string;
}

const CATEGORIES = ["전체", "증시", "부동산", "금리/환율"];

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
            .catch(err => {
                console.error("Failed to fetch news", err);
                setIsLoading(false);
            });
    }, []);

    const filteredNews = activeTab === "전체"
        ? news
        : news.filter(item => {
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
                {isLoading ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        뉴스를 불러오는 중입니다...
                    </div>
                ) : filteredNews.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        관련 뉴스가 없습니다.
                    </div>
                ) : (
                    filteredNews.map(item => (
                        <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="news-item" style={{ textDecoration: 'none', display: 'block' }}>
                            <div className="news-content">
                                <div className="news-meta">
                                    <span className="cat-badge" style={{ backgroundColor: `${item.categoryColor}15`, color: item.categoryColor }}>
                                        {item.category}
                                    </span>
                                    <span className="news-source">{item.source || '뉴스'}</span>
                                    <span className="meta-divider">·</span>
                                    <span className="time-ago">{item.timeAgo}</span>
                                </div>
                                <h3 className="news-title">{item.title}</h3>
                            </div>
                        </a>
                    ))
                )}
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
