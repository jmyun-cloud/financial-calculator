"use client";

import React from 'react';
import Link from 'next/link';

const MARKET_NEWS = [
    { name: '경제 동향', href: '/news?category=경제' },
    { name: '국내/해외 주식', href: '/news?category=증시' },
    { name: '가상자산', href: '/news?category=가상화폐' },
    { name: '금리 및 환율', href: '/news?category=금리/채권' },
    { name: '기업 실적', href: '/news?category=IPO/공시' },
];

const SEE_MORE = [
    { name: '실시간 분석', href: '/news' },
    { name: '전문가 칼럼', href: '/news' },
    { name: '많이 본 뉴스', href: '/news' },
    { name: '부동산 뉴스', href: '/news?category=부동산' },
];

export default function NewsMegaMenu() {
    return (
        <div className="mega-menu">
            <div className="mega-menu-content">
                <div className="mega-column">
                    <h4 className="column-title">시장 뉴스</h4>
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
                    width: 480px;
                    display: none;
                    z-index: 1001;
                    padding: 24px;
                }
                .mega-menu-content {
                    display: grid;
                    grid-template-columns: 2fr 1.5fr;
                }
                .mega-column { padding: 0 20px; }
                .border-left { border-left: 1px solid #F2F4F7; }
                .column-title {
                    font-size: 15px;
                    font-weight: 800;
                    color: #191F28;
                    margin: 0 0 16px;
                }
                .link-grid {
                    display: flex;
                    flex-direction: column;
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
                .mega-link:hover { background: #F8FAFF; color: #0055FB; }
                .arrow { font-size: 10px; color: #B0B8C1; }
                .mega-link:hover .arrow { color: #0055FB; }
            `}</style>
        </div>
    );
}
