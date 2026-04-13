"use client";

import React from 'react';
import Link from 'next/link';

const MARKET_NEWS = [
    { name: '경제', href: '/news/economy' },
    { name: '상품과 선물', href: '/news/commodities' },
    { name: '주식 시장', href: '/news/stock-market' },
    { name: '실적', href: '/news/earnings' },
    { name: '애널리스트 투자 의견', href: '/news/analyst-opinion' },
    { name: '스크립트', href: '/news/scripts' },
    { name: '경제 지표', href: '/news/economic-indicators' },
    { name: '외환', href: '/news/forex' },
    { name: '암호화폐', href: '/news/cryptocurrency' },
    { name: '일반', href: '/news/general' },
    { name: 'IPO', href: '/news/ipo' },
    { name: '뉴스 속보', href: '/news/breaking' },
    { name: '프로 뉴스', href: '/news/pro' },
];

const SEE_MORE = [
    { name: '최신', href: '/news/latest' },
    { name: '많이 본', href: '/news/most-read' },
    { name: '개인 금융', href: '/news/personal-finance' },
    { name: '경제 캘린더', href: '/news/calendar' },
    { name: '기업 뉴스', href: '/news/corporate' },
    { name: '내부자 거래', href: '/news/insider' },
    { name: '투자 아이디어', href: '/news/investment-ideas' },
    { name: 'SEC 공시', href: '/news/sec-filings' },
];

export default function NewsMegaMenu() {
    return (
        <div className="mega-menu">
            <div className="mega-menu-content">
                <div className="mega-column">
                    <h4 className="column-title">시장뉴스</h4>
                    <div className="link-grid">
                        {MARKET_NEWS.map((item, idx) => (
                            <Link key={idx} href={item.href} className="mega-link">
                                <span className="arrow">→</span> {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="mega-column border-left">
                    <h4 className="column-title">더 보기</h4>
                    <div className="link-grid">
                        {SEE_MORE.map((item, idx) => (
                            <Link key={idx} href={item.href} className="mega-link">
                                <span className="arrow">→</span> {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .mega-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background: white;
                    border: 1px solid #E5E8EB;
                    border-radius: 0 0 12px 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    width: 580px;
                    display: none;
                    z-index: 1001;
                    padding: 24px;
                }
                .mega-menu-content {
                    display: grid;
                    grid-template-columns: 2fr 1.5fr;
                    gap: 0;
                }
                .mega-column {
                    padding: 0 20px;
                }
                .border-left {
                    border-left: 1px solid #F2F4F7;
                }
                .column-title {
                    font-size: 15px;
                    font-weight: 800;
                    color: #191F28;
                    margin-bottom: 20px;
                    margin-top: 0;
                }
                .link-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 4px;
                }
                .mega-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    color: #4E5968;
                    text-decoration: none;
                    padding: 6px 8px;
                    border-radius: 6px;
                    transition: all 0.2s;
                    font-weight: 500;
                }
                .mega-link:hover {
                    background: #F8FAFF;
                    color: #0055FB;
                }
                .arrow {
                    font-size: 10px;
                    color: #B0B8C1;
                    opacity: 0.6;
                }
                .mega-link:hover .arrow {
                    color: #0055FB;
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}
