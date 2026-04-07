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
        <div className="bg-white rounded-[28px] p-8 border border-[#E5E8EB] mb-8">
            <header className="flex justify-between items-center mb-6">
                <h2 className="text-[1.25rem] font-extrabold text-[#191F28] m-0">오늘의 금융 뉴스</h2>
                <Link href="/news" className="text-[0.85rem] font-bold text-[#0064FF] no-underline hover:underline">전체보기 →</Link>
            </header>

            <nav className="flex gap-2 bg-[#F9FAFB] p-[6px] rounded-[14px] mb-6">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`flex-1 py-2.5 px-2 border-none rounded-[10px] text-[0.9rem] font-bold cursor-pointer transition-all duration-200 ${
                            activeTab === cat 
                            ? 'bg-white text-[#191F28] shadow-[0_1px_3px_rgba(0,0,0,0.04)]' 
                            : 'bg-transparent text-[#4E5968] hover:text-[#191F28]'
                        }`}
                        onClick={() => setActiveTab(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </nav>

            <div className="flex flex-col">
                {isLoading ? (
                    <div className="py-10 text-center text-[#8B95A1] text-[0.9rem]">뉴스를 불러오는 중입니다...</div>
                ) : filteredNews.length === 0 ? (
                    <div className="py-10 text-center text-[#8B95A1] text-[0.9rem]">관련 뉴스가 없습니다.</div>
                ) : (
                    filteredNews.map((item, idx) => (
                        <a 
                            key={item.id} 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`py-5 no-underline block hover:opacity-70 transition-opacity ${idx !== filteredNews.length - 1 ? 'border-b border-[#E5E8EB]' : ''}`}
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span 
                                        className="text-[0.7rem] font-extrabold px-2 py-0.5 rounded-[6px]"
                                        style={{ backgroundColor: `${item.categoryColor}15`, color: item.categoryColor }}
                                    >
                                        {item.category}
                                    </span>
                                    <span className="text-[0.8rem] text-[#8B95A1] font-medium">{item.source || '뉴스'}</span>
                                    <span className="text-[#E5E8EB]">·</span>
                                    <span className="text-[0.8rem] text-[#8B95A1] font-medium">{item.timeAgo}</span>
                                </div>
                                <h3 className="text-[1.05rem] font-bold text-[#191F28] leading-[1.4] m-0 line-clamp-2">
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
