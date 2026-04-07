"use client";

import React from 'react';
import Link from 'next/link';
import { 
    DollarSign, Laptop, Briefcase, Receipt, 
    Home, Scale, Key, PiggyBank, 
    TrendingUp, ArrowLeftRight, UserCheck, BarChart2 
} from 'lucide-react';

const GROUPS = [
    {
        title: "소득 및 세금",
        color: "#0064FF",
        bg: "#EBF3FF",
        tools: [
            { name: '연봉/실수령액', icon: DollarSign, href: '/salary-calculator' },
            { name: '프리랜서 계산', icon: Laptop, href: '/freelancer-calculator' },
            { name: '퇴직금 계산', icon: Briefcase, href: '/severance-calculator' },
            { name: '이자/세금', icon: Receipt, href: '/tax-interest-calculator' },
        ]
    },
    {
        title: "부동산 및 대출",
        color: "#F04251",
        bg: "#FFF0F0",
        tools: [
            { name: '대출/이자', icon: Home, href: '/loan-calculator' },
            { name: 'DSR 한도', icon: Scale, href: '/dsr-calculator' },
            { name: '전월세 대출', icon: Key, href: '/jeonse-calculator' },
        ]
    },
    {
        title: "저축 및 노후",
        color: "#1B8947",
        bg: "#E8F9F0",
        tools: [
            { name: '예·적금', icon: PiggyBank, href: '/savings-calculator' },
            { name: '복리/투자수익', icon: TrendingUp, href: '/compound-calculator' },
            { name: '환율 계산', icon: ArrowLeftRight, href: '/exchange-calculator' },
            { name: '연금 계산', icon: UserCheck, href: '/pension-calculator' },
            { name: '물가/가치', icon: BarChart2, href: '/inflation-calculator' },
        ]
    }
];

export default function MiniToolbox() {
    return (
        <div className="toolbox-wrapper">
            <div className="toolbox-header-row mb-6">
                <h2 className="text-[20px] font-extrabold text-[#191F28] tracking-tight m-0">재무 계산기</h2>
                <span className="text-[14px] font-bold text-[#0064FF] px-3 py-1 bg-[#F0F6FF] rounded-full cursor-pointer hover:bg-[#E1EDFF] transition-colors">
                    전체보기
                </span>
            </div>

            <div className="toolbox-groups">
                {GROUPS.map((group) => (
                    <div key={group.title} className="toolbox-group">
                        <h3 className="group-title">{group.title}</h3>
                        <div className="toolbox-grid">
                            {group.tools.map((tool) => (
                                <Link 
                                    key={tool.name} 
                                    href={tool.href}
                                    className="tool-chip-item no-underline"
                                >
                                    <div 
                                        className="tool-icon-chip"
                                        style={{ backgroundColor: group.bg, color: group.color }}
                                    >
                                        <tool.icon size={26} strokeWidth={2.5} />
                                    </div>
                                    <span className="tool-chip-name">{tool.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .toolbox-wrapper {
                    background: white;
                    border-radius: 32px;
                    padding: 32px;
                    border: 1px solid #F2F4F7;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                    margin-bottom: 40px;
                }
                .toolbox-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .toolbox-groups {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }
                .group-title {
                    font-size: 14px;
                    font-weight: 700;
                    color: #8B95A1;
                    margin-bottom: 16px;
                    padding-left: 4px;
                }
                .toolbox-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 16px 10px;
                }
                .tool-chip-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 0;
                    border-radius: 16px;
                    transition: all 0.2s ease;
                }
                .tool-chip-item:hover {
                    background: var(--surface-2);
                    transform: translateY(-2px);
                }
                .tool-icon-chip {
                    width: 56px;
                    height: 56px;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                }
                .tool-chip-name {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    letter-spacing: -0.01em;
                    text-align: center;
                }
            `}</style>
        </div>
    );
}
