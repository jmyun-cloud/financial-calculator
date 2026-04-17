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
            // Map common English slugs to Korean categories if needed
            const catMap: Record<string, string> = {
                'economy': '경제',
                'stocks': '증시',
                'crypto': '가상화폐',
                'forex': '외환/달러',
                'real-estate': '부동산'
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

    return (
        <div className="news-page-container">
            <div className="container">
                <div className="news-header">
                    <h1>금융 뉴스 센터</h1>
                    <p>가장 빠르고 정확한 실시간 경제 소식</p>
                </div>

                <div className="category-tabs">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
                            onClick={() => setActiveTab(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="news-list skeleton">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="skeleton-item" />
                        ))}
                    </div>
                ) : (
                    <div className="news-list">
                        {filtered.length > 0 ? (
                            filtered.map(item => (
                                <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="news-card">
                                    {item.imageUrl && (
                                        <div className="news-thumb">
                                            <img
                                                src={`https://images.weserv.nl/?url=${encodeURIComponent(item.imageUrl.replace(/^https?:\/\//, ''))}&w=400&fit=cover`}
                                                alt=""
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <div className="news-info">
                                        <div className="news-meta">
                                            <span className="cat" style={{ color: item.categoryColor }}>{item.category}</span>
                                            <span className="dot">·</span>
                                            <span className="source">{item.source}</span>
                                            <span className="time">{item.timeAgo}</span>
                                        </div>
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <div className="no-news">결과가 없습니다.</div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .news-page-container {
                    padding: 40px 0 80px;
                    background: #F9FAFB;
                    min-height: 100vh;
                }
                .news-header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .news-header h1 {
                    font-size: 32px;
                    font-weight: 800;
                    color: #191F28;
                    margin-bottom: 8px;
                }
                .news-header p {
                    color: #4E5968;
                    font-size: 16px;
                }
                .category-tabs {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 32px;
                    overflow-x: auto;
                    padding-bottom: 8px;
                    justify-content: center;
                }
                .tab-btn {
                    padding: 10px 20px;
                    border-radius: 100px;
                    border: 1px solid #E5E8EB;
                    background: white;
                    font-size: 14px;
                    font-weight: 600;
                    color: #4E5968;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                }
                .tab-btn:hover {
                    background: #F2F4F6;
                }
                .tab-btn.active {
                    background: #191F28;
                    color: white;
                    border-color: #191F28;
                }
                .news-list {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .news-card {
                    display: flex;
                    gap: 24px;
                    background: white;
                    padding: 24px;
                    border-radius: 20px;
                    text-decoration: none;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .news-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                }
                .news-thumb {
                    width: 200px;
                    height: 130px;
                    border-radius: 12px;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .news-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .news-info {
                    flex: 1;
                }
                .news-meta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    margin-bottom: 8px;
                }
                .dot { color: #E5E8EB; }
                .source, .time { color: #8B95A1; font-weight: 500; }
                .news-info h3 {
                    font-size: 18px;
                    font-weight: 700;
                    color: #191F28;
                    margin-bottom: 12px;
                    line-height: 1.5;
                }
                .news-info p {
                    font-size: 14px;
                    color: #4E5968;
                    line-height: 1.6;
                    display: -webkit-box;
                    WebkitLineClamp: 2;
                    WebkitBoxOrient: vertical;
                    overflow: hidden;
                }
                .skeleton-item {
                    height: 150px;
                    background: #E5E8EB;
                    border-radius: 20px;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 0.3; }
                    100% { opacity: 0.6; }
                }
                @media (max-width: 640px) {
                    .news-card { flex-direction: column; }
                    .news-thumb { width: 100%; height: 200px; }
                }
            `}</style>
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
