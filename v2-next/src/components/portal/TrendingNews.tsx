"use client";

import React, { useState, useEffect } from "react";

interface NewsItem {
    id: string;
    title: string;
    source: string;
    link: string;
}

export default function TrendingNews() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch("/api/news");
                const data = await res.json();
                if (res.ok) {
                    setNews(data.slice(10, 15)); // Get 5 trending items
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (isLoading) return <div style={{ height: '200px', background: '#F8F9FA', borderRadius: '24px' }} />;

    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #F2F4F7' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#191F28', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#F04452' }}>⚡</span> 가장 많이 본 뉴스
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {news.map((item, idx) => (
                    <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '12px', textDecoration: 'none' }}>
                        <span style={{ fontSize: '18px', fontWeight: 900, color: idx < 3 ? '#3182F6' : '#B0B8C1', width: '20px', flexShrink: 0, textAlign: 'center' }}>{idx + 1}</span>
                        <div style={{ flex: 1 }}>
                            <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#333D4B', margin: '0 0 4px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h5>
                            <div style={{ fontSize: '11px', color: '#8B95A1' }}>{item.source}</div>
                        </div>
                    </a>
                ))}
            </div>

            <button
                onClick={() => window.location.href = '/news'}
                style={{
                    width: '100%',
                    marginTop: '20px',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #E5E8EB',
                    background: 'white',
                    color: '#4E5968',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                }}
            >
                전체보기 →
            </button>
        </div>
    );
}
