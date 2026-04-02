"use client";
import React from "react";
import Link from "next/link";

const calculators = [
    { id: "salary", icon: "🧾", title: "연봉/실수령액", url: "/salary-calculator" },
    { id: "loan", icon: "🏠", title: "대출 이자", url: "/loan-calculator" },
    { id: "savings", icon: "🏦", title: "만기 적금", url: "/savings-calculator" },
    { id: "compound", icon: "📈", title: "복리 수익", url: "/compound-calculator" },
    { id: "dsr", icon: "⚖️", title: "DSR 한도", url: "/dsr-calculator" },
    { id: "subscription", icon: "🏆", title: "주택청약", url: "/guide/subscription" },
    { id: "freelancer", icon: "👩‍💻", title: "3.3% 프리랜서", url: "/freelancer-calculator" },
    { id: "severance", icon: "💼", title: "퇴직금 계산", url: "/severance-calculator" },
    { id: "pension", icon: "👴", title: "국민연금", url: "/pension-calculator" },
    { id: "global-tax", icon: "📊", title: "종합소득세", url: "/guide/global-tax" },
    { id: "jeonse", icon: "🏢", title: "전월세 전환", url: "/jeonse-calculator" },
    { id: "exchange", icon: "💱", title: "환율 계산", url: "/exchange-calculator" }
];

export default function MiniToolbox() {
    return (
        <div className="mini-toolbox widget-panel">
            <div className="widget-header">
                <h3 className="widget-title" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>🧰 유틸리티 도구</h3>
                <Link href="/sitemap-page" className="view-all-link">전체보기</Link>
            </div>
            <div className="mini-tool-grid">
                {calculators.map(calc => (
                    <Link href={calc.url} key={calc.id} className="mini-tool-item">
                        <span className="mini-tool-icon">{calc.icon}</span>
                        <span className="mini-tool-title">{calc.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
