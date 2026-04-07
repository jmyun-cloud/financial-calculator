"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAllGuides } from "@/lib/mdx";

export default function MagazineFeed() {
    const [articles, setArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getAllGuides().then(data => {
            const sorted = data.sort((a, b) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setArticles(sorted);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-[28px] p-8 border border-[#E5E8EB] mb-8 animate-pulse h-[400px]" />
        );
    }

    if (articles.length === 0) {
        return (
            <div className="bg-white rounded-[28px] p-8 border border-[#E5E8EB] mb-8">
                <h2 className="text-[1.25rem] font-extrabold text-[#191F28] mb-4">📰 오늘의 금융 트렌드</h2>
                <p className="text-[#8B95A1]">콘텐츠를 준비 중입니다.</p>
            </div>
        );
    }

    const featured = articles[0];
    const feedList = articles.slice(1, 4);

    return (
        <div className="bg-white rounded-[28px] p-8 border border-[#E5E8EB] mb-8">
            <h2 className="text-[1.25rem] font-extrabold text-[#191F28] mb-6">📰 오늘의 금융 트렌드</h2>

            {/* Featured Article */}
            <Link href={`/guide/${featured.slug}`} className="group block no-underline mb-8">
                <div className="w-full h-48 bg-[#F4F8FF] rounded-[20px] flex items-center justify-center text-5xl mb-4 group-hover:scale-[1.02] transition-transform duration-300">
                    {featured.thumbnail || "💰"}
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-[0.75rem] font-extrabold text-[#0064FF] uppercase tracking-wider">{featured.category}</span>
                    <h3 className="text-[1.3rem] font-extrabold text-[#191F28] leading-[1.3] group-hover:text-[#0064FF] transition-colors line-clamp-2">
                        {featured.title}
                    </h3>
                    <p className="text-[0.95rem] text-[#4E5968] leading-[1.6] line-clamp-2">
                        {featured.description}
                    </p>
                    <div className="flex items-center gap-2 text-[0.85rem] text-[#8B95A1] font-medium mt-1">
                        <span>금융계산기 에디터</span>
                        <span className="text-[#E5E8EB]">·</span>
                        <span>{featured.date}</span>
                    </div>
                </div>
            </Link>

            {/* Feed List */}
            <div className="flex flex-col gap-6">
                {feedList.map(article => (
                    <Link href={`/guide/${article.slug}`} key={article.slug} className="flex gap-4 no-underline group">
                        <div className="flex-1 flex flex-col gap-1.5 min-width-0">
                            <span className="text-[0.7rem] font-extrabold text-[#0064FF] uppercase">{article.category}</span>
                            <h4 className="text-[1.05rem] font-bold text-[#191F28] leading-[1.4] line-clamp-1 group-hover:text-[#0064FF] transition-colors">
                                {article.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[0.8rem] text-[#8B95A1] font-medium">
                                <span>{article.date}</span>
                            </div>
                        </div>
                        <div className="w-16 h-16 shrink-0 bg-[#F9FAFB] rounded-[12px] flex items-center justify-center text-2xl border border-[#F2F4F7]">
                            {article.thumbnail || "📄"}
                        </div>
                    </Link>
                ))}
            </div>

            <Link href="/guide" className="block w-full py-4 bg-[#F2F4F7] text-[#4E5968] text-center text-[0.9rem] font-bold rounded-[14px] mt-8 no-underline hover:bg-[#E5E8EB] transition-colors">
                더 많은 아티클 보기 ↓
            </Link>
        </div>
    );
}
