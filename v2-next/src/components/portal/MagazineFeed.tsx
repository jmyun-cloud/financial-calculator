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
            <div className="bg-[#FBFCFE] rounded-[32px] p-8 border border-[#F2F4F7] mb-10 animate-pulse h-[400px]" />
        );
    }

    if (articles.length === 0) {
        return (
            <div className="bg-white rounded-[32px] p-8 border border-[#F2F4F7] mb-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <h2 className="text-[20px] font-extrabold text-[#191F28] mb-4">📰 오늘의 금융 트렌드</h2>
                <p className="text-[#8B95A1] font-medium">콘텐츠를 준비 중입니다.</p>
            </div>
        );
    }

    const featured = articles[0];
    const feedList = articles.slice(1, 4);

    return (
        <div className="bg-white rounded-[32px] p-8 border border-[#F2F4F7] shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-10">
            <h2 className="text-[20px] font-extrabold text-[#191F28] mb-7 tracking-tight">지식이 자산이 되는 매거진</h2>

            {/* Featured Article */}
            <Link href={`/guide/${featured.slug}`} className="group block no-underline mb-9">
                <div className="w-full h-56 bg-[#F4F8FF] rounded-[24px] flex items-center justify-center text-6xl mb-5 group-hover:scale-[1.01] transition-all duration-500 shadow-inner overflow-hidden">
                    <span className="transition-transform duration-500 group-hover:scale-110">{featured.thumbnail || "💰"}</span>
                </div>
                <div className="flex flex-col gap-3 px-1">
                    <span className="text-[11px] font-extrabold text-[#0064FF] uppercase tracking-wider bg-[#F0F6FF] self-start px-2 py-0.5 rounded-md">{featured.category}</span>
                    <h3 className="text-[22px] font-extrabold text-[#191F28] leading-[1.3] group-hover:text-[#0064FF] transition-colors line-clamp-2 tracking-tight">
                        {featured.title}
                    </h3>
                    <p className="text-[15px] text-[#4E5968] leading-[1.6] line-clamp-2 font-medium">
                        {featured.description}
                    </p>
                    <div className="flex items-center gap-2 text-[13px] text-[#8B95A1] font-bold mt-1">
                        <span>금융계산기 에디터</span>
                        <span className="text-[#E5E8EB]">·</span>
                        <span>{featured.date}</span>
                    </div>
                </div>
            </Link>

            {/* Feed List */}
            <div className="flex flex-col gap-6">
                {feedList.map(article => (
                    <Link href={`/guide/${article.slug}`} key={article.slug} className="flex gap-5 no-underline group px-1">
                        <div className="flex-1 flex flex-col gap-2 min-width-0">
                            <span className="text-[10px] font-extrabold text-[#0064FF] uppercase tracking-wider">{article.category}</span>
                            <h4 className="text-[16px] font-extrabold text-[#191F28] leading-[1.4] line-clamp-2 group-hover:text-[#0064FF] transition-colors tracking-tight">
                                {article.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[12px] text-[#8B95A1] font-bold">
                                <span>{article.date}</span>
                            </div>
                        </div>
                        <div className="w-20 h-20 shrink-0 bg-[#F9FAFB] rounded-[18px] flex items-center justify-center text-3xl border border-[#F2F4F7] shadow-sm group-hover:scale-105 transition-transform">
                            {article.thumbnail || "📄"}
                        </div>
                    </Link>
                ))}
            </div>

            <Link href="/guide" className="block w-full py-4 bg-[#F2F4F7] text-[#4E5968] text-center text-[15px] font-extrabold rounded-[18px] mt-9 no-underline hover:bg-[#E5E8EB] transition-all hover:text-[#191F28]">
                더 많은 지식 읽어보기
            </Link>
        </div>
    );
}

