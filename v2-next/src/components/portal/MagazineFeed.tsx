import React from "react";
import Link from "next/link";
import { getAllGuides } from "@/lib/mdx";

export default async function MagazineFeed() {
    const allArticles = await getAllGuides();
    
    // Sort by date descending
    const articles = allArticles.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (articles.length === 0) {
        return (
            <div className="magazine-feed">
                <h2 className="feed-header">📰 오늘의 금융 트렌드</h2>
                <p>콘텐츠를 준비 중입니다.</p>
            </div>
        );
    }

    const featured = articles[0];
    const feedList = articles.slice(1);

    return (
        <div className="magazine-feed">
            <h2 className="feed-header">📰 오늘의 금융 트렌드</h2>

            {/* Featured Article */}
            <Link href={`/guide/${featured.slug}`} className="featured-article">
                <div className="featured-image-placeholder">
                    {featured.thumbnail || "💰"}
                </div>
                <div className="featured-content">
                    <span className="mag-category-text">{featured.category}</span>
                    <h3 className="featured-title">{featured.title}</h3>
                    <p className="featured-excerpt">{featured.description}</p>
                    <div className="article-meta">
                        <span>금융계산기 에디터</span> · <span>{featured.date}</span>
                    </div>
                </div>
            </Link>

            {/* Feed List */}
            <div className="feed-list">
                {feedList.map(article => (
                    <Link href={`/guide/${article.slug}`} key={article.slug} className="feed-item">
                        <div className="feed-item-content">
                            <span className="mag-category-text">{article.category}</span>
                            <h4 className="feed-item-title">{article.title}</h4>
                            <div className="article-meta">
                                <span>금융계산기 에디터</span> · <span>{article.date}</span>
                            </div>
                        </div>
                        <div className="feed-item-thumb">
                            {article.thumbnail || "📄"}
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
