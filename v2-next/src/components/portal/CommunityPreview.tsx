"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react";

interface CommunityPost {
    id: string;
    title: string;
    author: string;
    timeAgo: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    isHot?: boolean;
}

export default function CommunityPreview() {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // Mocking for now, adjust to real API if needed
        setTimeout(() => {
            setPosts([
                { id: "1", title: "연봉 5천 실수령액 진짜 이정도인가요?", author: "재테크초보", timeAgo: "10분 전", viewCount: 1240, likeCount: 12, commentCount: 45, isHot: true },
                { id: "2", title: "주택담보대출 LTV 계산기 업데이트됐네요. 편합니다.", author: "내집마련가자", timeAgo: "25분 전", viewCount: 850, likeCount: 24, commentCount: 12 },
                { id: "3", title: "복리 계산기로 10년 굴려보니 역시 일찍 시작하는게 답...", author: "파이어족", timeAgo: "1시간 전", viewCount: 2100, likeCount: 56, commentCount: 89, isHot: true },
                { id: "4", title: "직장인 퇴직금 정산할 때 주의할 점 공유합니다.", author: "인사팀장", timeAgo: "2시간 전", viewCount: 450, likeCount: 18, commentCount: 5 }
            ]);
            setIsLoading(false);
        }, 300);
    }, []);

    return (
        <div className="bg-white rounded-[28px] p-8 border border-[#E5E8EB] mb-8">
            <header className="flex justify-between items-center mb-6">
                <h2 className="text-[1.25rem] font-extrabold text-[#191F28] m-0">커뮤니티 인기글</h2>
                <Link href="/community" className="text-[0.85rem] font-bold text-[#0064FF] no-underline hover:underline">더보기 →</Link>
            </header>

            <div className="flex flex-col">
                {isLoading ? (
                    <div className="py-10 text-center text-[#8B95A1] text-[0.9rem]">게시글을 불러오는 중입니다...</div>
                ) : (
                    posts.map((post, idx) => (
                        <Link 
                            key={post.id} 
                            href={`/community/post/${post.id}`}
                            className={`py-5 no-underline block hover:bg-[#F8F9FB] -mx-8 px-8 transition-colors ${idx !== posts.length - 1 ? 'border-b border-[#F2F4F7]' : ''}`}
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 mb-1">
                                    {post.isHot && (
                                        <span className="bg-[#FFF0F0] text-[#F04251] text-[10px] font-extrabold px-1.5 py-0.5 rounded-[4px]">HOT</span>
                                    )}
                                    <h3 className="text-[1.05rem] font-bold text-[#191F28] leading-[1.4] m-0 line-clamp-1 flex-1">
                                        {post.title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-3 text-[0.8rem] text-[#8B95A1] font-medium">
                                    <span className="text-[#4E5968] font-semibold">{post.author}</span>
                                    <span className="text-[#E5E8EB]">|</span>
                                    <span>{post.timeAgo}</span>
                                    <div className="ml-auto flex items-center gap-3 text-[#adb5bd]">
                                        <span className="flex items-center gap-1"><Eye size={14} /> {post.viewCount}</span>
                                        <span className="flex items-center gap-1"><ThumbsUp size={13} /> {post.likeCount}</span>
                                        <span className="flex items-center gap-1 text-[#0064FF] font-bold"><MessageSquare size={13} /> {post.commentCount}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                ))}
            </div>
        </div>
    );
}
