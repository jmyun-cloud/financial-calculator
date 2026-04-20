"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface NewsItem {
    id: string;
    category: string;
    categoryColor: string;
    title: string;
    source: string;
    timeAgo: string;
    link: string;
    imageUrl?: string | null;
}

const QUICK_CATS = [
    { label: '증시', cat: '증시' },
    { label: '경제', cat: '경제' },
    { label: '가상화폐', cat: '가상화폐' },
    { label: '부동산', cat: '부동산' },
    { label: '외환', cat: '외환/달러' },
];

export default function NewsMegaMenu() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [activeTab, setActiveTab] = useState('증시');
    const [loaded, setLoaded] = useState(false);

    // Fetch once on hover (loaded flag prevents multiple fetches)
    const handleMouseEnter = async () => {
        if (loaded) return;
        try {
            const res = await fetch('/api/news');
            const data: NewsItem[] = await res.json();
            setNews(data);
            setLoaded(true);
        } catch { /* silently fail */ }
    };

    const filtered = news.filter(n => n.category === activeTab).slice(0, 5);

    return (
        <div className="mega-menu" onMouseEnter={handleMouseEnter}>
            {/* Top bar: category tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid #F2F4F7', paddingBottom: '12px' }}>
                {QUICK_CATS.map(({ label, cat }) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: activeTab === cat ? '#191F28' : 'transparent',
                            color: activeTab === cat ? 'white' : '#4E5968',
                            transition: 'all 0.15s',
                            whiteSpace: 'nowrap',
                        }}
                    >{label}</button>
                ))}
                <Link
                    href="/news"
                    style={{ marginLeft: 'auto', fontSize: '12px', color: '#8B95A1', textDecoration: 'none', alignSelf: 'center', whiteSpace: 'nowrap' }}
                >
                    전체 보기 →
                </Link>
            </div>

            {/* News list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '180px' }}>
                {!loaded ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} style={{ height: '40px', background: '#F2F4F7', borderRadius: '8px', opacity: 0.6 }} />
                    ))
                ) : filtered.length === 0 ? (
                    <p style={{ fontSize: '13px', color: '#8B95A1', margin: 0 }}>뉴스가 없습니다.</p>
                ) : (
                    filtered.map(item => (
                        <a
                            key={item.id}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'flex', gap: '12px', textDecoration: 'none', alignItems: 'flex-start', padding: '6px 4px', borderRadius: '8px', transition: 'background 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFF')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            {item.imageUrl && (
                                <div style={{ width: '60px', height: '42px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#F2F4F7' }}>
                                    <img
                                        src={`https://images.weserv.nl/?url=${encodeURIComponent(item.imageUrl.replace(/^https?:\/\//, ''))}&w=120&fit=cover&output=webp`}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    color: '#191F28',
                                    margin: '0 0 4px',
                                    lineHeight: 1.4,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}>{item.title}</p>
                                <span style={{ fontSize: '11px', color: '#8B95A1' }}>{item.source} · {item.timeAgo}</span>
                            </div>
                        </a>
                    ))
                )}
            </div>

            <style jsx>{`
                .mega-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background: white;
                    border: 1px solid #E5E8EB;
                    border-radius: 0 0 16px 16px;
                    box-shadow: 0 16px 40px rgba(0,0,0,0.12);
                    width: 420px;
                    display: none;
                    z-index: 1001;
                    padding: 20px;
                }
            `}</style>
        </div>
    );
}
