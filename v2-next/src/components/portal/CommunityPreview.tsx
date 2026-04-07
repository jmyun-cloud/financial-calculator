"use client";

import React from "react";
import Link from "next/link";

interface QnAItem {
    id: string;
    question: string;
    votes: number;
    answers: number;
    timeAgo: string;
}

const MOCK_QNA: QnAItem[] = [
    {
        id: "q1",
        question: "월급 350만원인데 청약 vs ETF 적금 어떤 게 나을까요?",
        votes: 24,
        answers: 8,
        timeAgo: "30분 전"
    },
    {
        id: "q2",
        question: "전세 만기 앞두고 DSR 40% 걸려 대출 못 받을 것 같은데 방법이 있을까요?",
        votes: 18,
        answers: 12,
        timeAgo: "1시간 전"
    },
    {
        id: "q3",
        question: "연말정산 카드 vs 현금영수증 30% 넘었을 때 더 유리한 것은?",
        votes: 31,
        answers: 15,
        timeAgo: "3시간 전"
    }
];

export default function CommunityPreview() {
    return (
        <div className="community-preview-v3">
            <header className="section-header">
                <div className="title-group">
                    <h2 className="section-title">재테크 Q&A</h2>
                    <span className="new-badge">NEW</span>
                </div>
                <Link href="/community" className="view-all">질문하기 →</Link>
            </header>

            <div className="qna-list">
                {MOCK_QNA.map(item => (
                    <div key={item.id} className="qna-item">
                        <h3 className="qna-title">{item.question}</h3>
                        <div className="qna-meta">
                            <span className="vote-count">▲ {item.votes}</span>
                            <span className="answer-count">답변 {item.answers}개</span>
                            <span className="time-ago">{item.timeAgo}</span>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .community-preview-v3 {
                    background: var(--surface);
                    border-radius: 28px;
                    padding: 32px;
                    border: 1px solid var(--border);
                    margin-bottom: 32px;
                }
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .title-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .section-title {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin: 0;
                }
                .new-badge {
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: white;
                    background: #FF5C00;
                    padding: 2px 6px;
                    border-radius: 4px;
                }
                .view-all {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--primary);
                    text-decoration: none;
                }
                .qna-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }
                .qna-item {
                    padding: 20px 0;
                    border-bottom: 1px solid var(--border);
                    cursor: pointer;
                }
                .qna-item:last-child {
                    border-bottom: none;
                }
                .qna-title {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin: 0 0 8px 0;
                    line-height: 1.5;
                }
                .qna-meta {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    font-weight: 600;
                }
                .vote-count {
                    color: var(--primary);
                }
            `}</style>
        </div>
    );
}
