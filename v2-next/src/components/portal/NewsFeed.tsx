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
        <div className="bg-white rounded-[32px] p-8 border border-[#F2F4F7] shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-10">
            <header className="flex justify-between items-center mb-7">
                <h2 className="text-[20px] font-extrabold text-[#191F28] tracking-tight">오늘의 핵심 뉴스</h2>
                <Link href="/news" className="text-[14px] font-bold text-[#0064FF] no-underline hover:underline px-3 py-1 bg-[#F0F6FF] rounded-full">전체보기</Link>
            </header>

            <nav className="flex gap-2 bg-[#F9FAFB] p-1.5 rounded-[18px] mb-8">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`flex-1 py-2.5 px-3 border-none rounded-[14px] text-[15px] font-bold cursor-pointer transition-all duration-300 ${
                            activeTab === cat 
                            ? 'bg-white text-[#191F28] shadow-[0_2px_10px_rgba(0,0,0,0.06)]' 
                            : 'bg-transparent text-[#8B95A1] hover:text-[#4E5968]'
                        }`}
                        onClick={() => setActiveTab(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </nav>

            <div className="flex flex-col">
                {isLoading ? (
                    <div className="py-16 text-center text-[#8B95A1] text-[15px] font-medium">뉴스를 불러오는 중입니다...</div>
                ) : filteredNews.length === 0 ? (
                    <div className="py-16 text-center text-[#8B95A1] text-[15px] font-medium">관련 뉴스가 없습니다.</div>
                ) : (
                    filteredNews.map((item, idx) => (
                        <a 
                            key={item.id} 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`group py-6 no-underline block hover:opacity-80 transition-all ${idx !== filteredNews.length - 1 ? 'border-b border-[#F2F4F7]' : ''}`}
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2.5">
                                    <span 
                                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-[6px] uppercase tracking-wider"
                                        style={{ backgroundColor: `${item.categoryColor}12`, color: item.categoryColor }}
                                    >
                                        {item.category}
                                    </span>
                                    <span className="text-[13px] text-[#8B95A1] font-bold">{item.source || '뉴스'}</span>
                                    <span className="text-[#E5E8EB]">·</span>
                                    <span className="text-[13px] text-[#8B95A1] font-bold">{item.timeAgo}</span>
                                </div>
                                <h3 className="text-[17px] font-extrabold text-[#191F28] leading-[1.5] m-0 group-hover:text-[#0064FF] transition-colors line-clamp-2 tracking-tight">
                                    {item.title}
                                </h3>
                            </div>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
}

