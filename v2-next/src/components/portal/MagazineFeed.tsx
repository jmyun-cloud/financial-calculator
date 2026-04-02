"use client";
import React from "react";
import Link from "next/link";

export default function MagazineFeed() {
    const articles = [
        {
            id: "salary-guide",
            category: "연말정산 꿀팁",
            title: "2026 연봉 실수령액 계산 가이드",
            excerpt: "비과세 식대, 부양가족 공제 등 알아두면 실수령이 달라지는 4대보험 요율 계산법 완벽 정리",
            author: "금융계산기 에디터",
            date: "오늘",
            image: "💰",
            url: "/guide/salary"
        },
        {
            id: "dsr-guide",
            category: "대출 규제",
            title: "DSR 40% 규제 완벽 대응법",
            excerpt: "대출 한도 늘리는 영끌 방어 전략과 마이너스 통장이 DSR에 미치는 치명적인 영향 알아보기",
            author: "대출 전문가",
            date: "어제",
            image: "📊",
            url: "/guide/dsr"
        },
        {
            id: "subscription-guide",
            category: "내집마련",
            title: "주택청약 부양가족/무주택 산정 기준",
            excerpt: "청약 가점 84점 만점 완벽 해부. 헷갈리는 무주택 기간 산정법과 청약 통장 활용 가이드",
            author: "청약 청사진",
            date: "2일 전",
            image: "🏆",
            url: "/guide/subscription"
        },
        {
            id: "severance-guide",
            category: "노후준비",
            title: "퇴직금 IRP 수령 시 절세 파급력",
            excerpt: "퇴직금을 일반 계좌가 아닌 IRP로 받았을 때 퇴직소득세율이 얼마나 줄어드는지 팩트체크",
            author: "은퇴 설계사",
            date: "3일 전",
            image: "💼",
            url: "/guide/severance"
        }
    ];

    return (
        <div className="magazine-feed">
            <h2 className="feed-header">📰 오늘의 금융 트렌드</h2>

            {/* Featured Article */}
            <Link href={articles[0].url} className="featured-article">
                <div className="featured-image-placeholder">
                    {articles[0].image}
                </div>
                <div className="featured-content">
                    <span className="mag-tag">{articles[0].category}</span>
                    <h3 className="featured-title">{articles[0].title}</h3>
                    <p className="featured-excerpt">{articles[0].excerpt}</p>
                    <div className="article-meta">
                        <span>{articles[0].author}</span> · <span>{articles[0].date}</span>
                    </div>
                </div>
            </Link>

            {/* Feed List */}
            <div className="feed-list">
                {articles.slice(1).map(article => (
                    <Link href={article.url} key={article.id} className="feed-item">
                        <div className="feed-item-content">
                            <span className="mag-category-text">{article.category}</span>
                            <h4 className="feed-item-title">{article.title}</h4>
                            <div className="article-meta">
                                <span>{article.author}</span> · <span>{article.date}</span>
                            </div>
                        </div>
                        <div className="feed-item-thumb">
                            {article.image}
                        </div>
                    </Link>
                ))}
            </div>

            <button className="load-more-btn">
                더 많은 아티클 보기 ↓
            </button>
        </div>
    );
}
