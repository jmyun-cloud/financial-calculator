"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const toolGroups = [
    {
        title: "소득 및 세금",
        desc: "연봉부터 퇴직금까지, 나의 소득과 세금을 정확하게 계산하세요.",
        tools: [
            { id: "salary", icon: "💰", title: "연봉 계산", desc: "실수령액과 4대보험 계산", url: "/salary-calculator", color: "#E8F3FF" },
            { id: "freelancer", icon: "👨‍💻", title: "프리랜서", desc: "3.3% 공제 후 실수령액", url: "/freelancer-calculator", color: "#F0F0F0" },
            { id: "severance", icon: "💼", title: "퇴직금", desc: "예상 퇴직금 및 세금", url: "/severance-calculator", color: "#FFE8E8" },
            { id: "tax-interest", icon: "🧾", title: "이자/세금", desc: "예적금 이자와 과세액", url: "/tax-interest-calculator", color: "#E8E8FF" },
        ]
    },
    {
        title: "부동산 및 대출",
        desc: "내 집 마련의 첫걸음, 대출 한도와 이자를 미리 확인하세요.",
        tools: [
            { id: "loan", icon: "🏠", title: "대출 계산", desc: "원리금 상환액 계산", url: "/loan-calculator", color: "#FFF4E8" },
            { id: "dsr", icon: "⚖️", title: "DSR 한도", desc: "총부채원리금상환비율", url: "/dsr-calculator", color: "#E8FBFF" },
            { id: "jeonse", icon: "🔑", title: "전월세 계산", desc: "전월세 전환율 계산", url: "/jeonse-calculator", color: "#FFFBE8" },
        ]
    },
    {
        title: "저축 및 노후",
        desc: "체계적인 저축 계획과 든든한 노후 자산을 설계하세요.",
        tools: [
            { id: "savings", icon: "🏦", title: "적금 계산", desc: "목표 금액 모으기", url: "/savings-calculator", color: "#E8FFF3" },
            { id: "compound", icon: "📈", title: "복리 수익", desc: "복리 마법 수익률", url: "/compound-calculator", color: "#F3E8FF" },
            { id: "exchange", icon: "💱", title: "환율 계산", desc: "실시간 환전 목표액", url: "/exchange-calculator", color: "#FFFCE8" },
            { id: "pension", icon: "💎", title: "연금 계산", desc: "예상 국민연금 수령액", url: "/pension-calculator", color: "#E8F3FF" },
            { id: "inflation", icon: "📉", title: "물가/가치", desc: "인플레이션 가치 하락", url: "/inflation-calculator", color: "#FFE8F4" }
        ]
    }
];

export default function CalculatorsHubPage() {
    return (
        <div className="portal-page-wrapper" style={{ background: '#F8F9FA', minHeight: '100vh', paddingBottom: '80px' }}>
            {/* HERO SECTION */}
            <section style={{
                background: 'linear-gradient(135deg, #1a56e8 0%, #1738c8 100%)',
                padding: '60px 0 40px',
                color: 'white',
                marginBottom: '40px'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
                        금융 계산기 허브
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', maxWidth: '600px', lineHeight: 1.6 }}>
                        내 집 마련부터 노후 설계까지, 복잡한 금융 계산을 하나의 페이지에서 직관적이고 정확하게 해결하세요.
                    </p>
                </div>
            </section>

            <div className="container">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {toolGroups.map((group, idx) => (
                        <div key={idx} className="calc-group">
                            <div style={{ marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#191F28', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                                    {group.title}
                                </h2>
                                <p style={{ fontSize: '1rem', color: '#8B95A1' }}>
                                    {group.desc}
                                </p>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '20px'
                            }}>
                                {group.tools.map(tool => (
                                    <Link href={tool.url} key={tool.id} className="calc-card shadow-premium" style={{ textDecoration: 'none' }}>
                                        <div style={{
                                            background: 'white',
                                            borderRadius: '20px',
                                            padding: '24px',
                                            border: '1px solid #F2F4F7',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '20px',
                                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: '64px', height: '64px',
                                                borderRadius: '16px', background: tool.color,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '32px', flexShrink: 0
                                            }}>
                                                {tool.icon}
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#333D4B', marginBottom: '4px' }}>
                                                    {tool.title}
                                                </h3>
                                                <p style={{ fontSize: '0.85rem', color: '#8B95A1', margin: 0, lineHeight: 1.4 }}>
                                                    {tool.desc}
                                                </p>
                                            </div>

                                            <div className="card-arrow" style={{
                                                width: '32px', height: '32px',
                                                borderRadius: '50%', background: '#F2F4F7',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#8B95A1', transition: 'all 0.2s'
                                            }}>
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .calc-card > div:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
                    border-color: #1a56e8;
                }
                .calc-card:hover .card-arrow {
                    background: #1a56e8 !important;
                    color: white !important;
                }
            `}</style>
        </div>
    );
}
