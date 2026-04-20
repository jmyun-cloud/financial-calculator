"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const toolGroups = [
    {
        title: "소득 및 세금",
        desc: "연봉부터 퇴직금까지, 나의 소득과 세금을 정확하게 계산하세요.",
        tools: [
            {
                id: "salary", icon: "💰", title: "연봉 계산", desc: "실수령액과 4대보험 계산", url: "/salary-calculator",
                bg: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)", color: "#B45309"
            },
            {
                id: "freelancer", icon: "👨‍💻", title: "프리랜서", desc: "3.3% 공제", url: "/freelancer-calculator",
                bg: "linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)", color: "#4338CA"
            },
            {
                id: "severance", icon: "💼", title: "퇴직금", desc: "예상 퇴직금 및 세금", url: "/severance-calculator",
                bg: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)", color: "#B91C1C"
            },
            {
                id: "tax-interest", icon: "🧾", title: "이자/세금", desc: "예적금 이자와 과세액", url: "/tax-interest-calculator",
                bg: "linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)", color: "#7E22CE"
            },
        ]
    },
    {
        title: "부동산 및 대출",
        desc: "내 집 마련의 첫걸음, 대출 한도와 이자를 미리 확인하세요.",
        tools: [
            {
                id: "loan", icon: "🏠", title: "대출 계산", desc: "원리금 상환액 계산", url: "/loan-calculator",
                bg: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)", color: "#047857"
            },
            {
                id: "dsr", icon: "⚖️", title: "DSR 한도", desc: "총부채비율 계산", url: "/dsr-calculator",
                bg: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)", color: "#0369A1"
            },
            {
                id: "jeonse", icon: "🔑", title: "전월세 계산", desc: "전월세 전환율 알아보기", url: "/jeonse-calculator",
                bg: "linear-gradient(135deg, #FFEDD5 0%, #FDBA74 100%)", color: "#C2410C"
            },
        ]
    },
    {
        title: "저축 및 노후",
        desc: "체계적인 저축 계획과 든든한 노후 자산을 설계하세요.",
        tools: [
            {
                id: "savings", icon: "🏦", title: "적금 계산", desc: "목표 금액 모으기", url: "/savings-calculator",
                bg: "linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)", color: "#15803D"
            },
            {
                id: "compound", icon: "📈", title: "복리 수익", desc: "복리 마법 수익률", url: "/compound-calculator",
                bg: "linear-gradient(135deg, #F5F3FF 0%, #DDD6FE 100%)", color: "#6D28D9"
            },
            {
                id: "exchange", icon: "💱", title: "환율 계산", desc: "실시간 환전 목표액", url: "/exchange-calculator",
                bg: "linear-gradient(135deg, #CCFBF1 0%, #99F6E4 100%)", color: "#0F766E"
            },
            {
                id: "pension", icon: "💎", title: "연금 계산", desc: "예상 국민연금 수령액", url: "/pension-calculator",
                bg: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)", color: "#1D4ED8"
            },
            {
                id: "inflation", icon: "📉", title: "물가/가치", desc: "인플레이션 가치 하락", url: "/inflation-calculator",
                bg: "linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)", color: "#BE185D"
            }
        ]
    }
];

export default function CalculatorsHubPage() {
    return (
        <div className="calculators-page-wrapper" style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: '100px' }}>

            {/* 1) PREMIUM DARK GRID HERO SECTION */}
            <section style={{
                background: 'linear-gradient(145deg, #0B1120 0%, #1E1B4B 50%, #172554 100%)',
                position: 'relative',
                overflow: 'hidden',
                padding: '80px 0 60px',
                color: 'white',
                marginBottom: '60px'
            }}>
                {/* Decoration Grid / Glows */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1,
                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }} />
                <div style={{
                    position: 'absolute', top: '-60%', right: '-20%', width: '800px', height: '800px',
                    background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%', pointerEvents: 'none'
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', marginBottom: '24px', backdropFilter: 'blur(10px)' }}>
                        <span style={{ display: 'block', width: '8px', height: '8px', background: '#38BDF8', borderRadius: '50%', boxShadow: '0 0 10px #38BDF8' }}></span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E0F2FE', letterSpacing: '0.02em' }}>모든 필수 계산기 무료 제공</span>
                    </div>

                    <h1 style={{ fontSize: '3.2rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                        복잡한 금융 계산,<br />
                        <span style={{ background: 'linear-gradient(to right, #38BDF8, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>클릭 한 번</span>으로 끝내세요.
                    </h1>
                    <p style={{ fontSize: '1.15rem', color: '#94A3B8', maxWidth: '600px', lineHeight: 1.65, fontWeight: 500 }}>
                        직장인 연봉부터 내 집 마련을 위한 대출 한도 계산, 은퇴 후 노후 설계 대비 연금까지 모든 도구를 직관적이고 아름다운 환경에서 제공합니다.
                    </p>
                </div>
            </section>

            {/* 2) MAIN CALCULATORS LIST */}
            <div className="container">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
                    {toolGroups.map((group, idx) => (
                        <div key={idx} className="calc-group">
                            {/* Group Header */}
                            <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', margin: 0 }}>
                                    {group.title}
                                </h2>
                                <p style={{ fontSize: '1.05rem', color: '#64748B', margin: 0, fontWeight: 500 }}>
                                    {group.desc}
                                </p>
                            </div>

                            {/* Group Grid - More spacious */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '24px'
                            }}>
                                {group.tools.map(tool => (
                                    <Link href={tool.url} key={tool.id} className="premium-calc-card" style={{ textDecoration: 'none' }}>
                                        <div style={{
                                            background: '#FFFFFF',
                                            borderRadius: '24px',
                                            padding: '30px',
                                            border: '1px solid #E2E8F0',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '20px',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                                        }}>
                                            {/* Subdued Glow matching icon color */}
                                            <div className="card-glow" style={{
                                                position: 'absolute', top: 0, left: 0, right: 0, height: '5px',
                                                background: tool.bg,
                                                opacity: 0, transition: 'opacity 0.3s ease'
                                            }} />

                                            {/* Beautiful Gradient Icon Box */}
                                            <div style={{
                                                width: '64px', height: '64px',
                                                borderRadius: '20px',
                                                background: tool.bg,
                                                color: tool.color,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '30px', flexShrink: 0,
                                                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.05)'
                                            }}>
                                                {tool.icon}
                                            </div>

                                            <div style={{ flex: 1, paddingTop: '6px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', margin: 0, letterSpacing: '-0.02em', flex: 1 }}>
                                                        {tool.title}
                                                    </h3>
                                                    <ArrowUpRight className="hover-arrow" size={20} color="#94A3B8" style={{ transition: 'all 0.3s', flexShrink: 0 }} />
                                                </div>
                                                <p style={{ fontSize: '0.95rem', color: '#64748B', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                                                    {tool.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CSS for Micro-animations and Premium states */}
            <style jsx>{`
                .premium-calc-card > div:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.05);
                    border-color: transparent;
                }
                .premium-calc-card:hover .card-glow {
                    opacity: 1 !important;
                }
                .premium-calc-card:hover .hover-arrow {
                    color: #38BDF8 !important;
                    transform: translate(2px, -2px) scale(1.1);
                }
            `}</style>
        </div>
    );
}
