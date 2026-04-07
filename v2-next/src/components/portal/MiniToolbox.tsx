"use client";
import React from "react";
import Link from "next/link";
import { 
    DollarSign, Laptop, Briefcase, Receipt, 
    Home, Scale, Key, 
    PiggyBank, TrendingUp, ArrowLeftRight, UserCheck, BarChart2 
} from "lucide-react";

const toolGroups = [
    {
        title: "소득 및 세금",
        themeName: "income",
        iconColor: "#0064FF",
        bgColor: "#EBF3FF",
        tools: [
            { id: "salary", icon: DollarSign, title: "연봉 계산", url: "/salary-calculator" },
            { id: "freelancer", icon: Laptop, title: "프리랜서", url: "/freelancer-calculator" },
            { id: "severance", icon: Briefcase, title: "퇴직금", url: "/severance-calculator" },
            { id: "tax-interest", icon: Receipt, title: "이자/세금", url: "/tax-interest-calculator" },
        ]
    },
    {
        title: "부동산 및 대출",
        themeName: "realestate",
        iconColor: "#F04251",
        bgColor: "#FFF0F0",
        tools: [
            { id: "loan", icon: Home, title: "대출 계산", url: "/loan-calculator" },
            { id: "dsr", icon: Scale, title: "DSR 한도", url: "/dsr-calculator" },
            { id: "jeonse", icon: Key, title: "전월세 계산", url: "/jeonse-calculator" },
        ]
    },
    {
        title: "저축 및 노후",
        themeName: "savings",
        iconColor: "#1B8947",
        bgColor: "#E8F9F0",
        tools: [
            { id: "savings", icon: PiggyBank, title: "적금 계산", url: "/savings-calculator" },
            { id: "compound", icon: TrendingUp, title: "복리 수익", url: "/compound-calculator" },
            { id: "exchange", icon: ArrowLeftRight, title: "환율 계산", url: "/exchange-calculator" },
            { id: "pension", icon: UserCheck, title: "연금 계산", url: "/pension-calculator" },
            { id: "inflation", icon: BarChart2, title: "물가/가치", url: "/inflation-calculator" }
        ]
    }
];

export default function MiniToolbox() {
    return (
        <div className="mini-toolbox-v4">
            {toolGroups.map((group, gIdx) => (
                <div key={gIdx} className="toolbox-group">
                    <h4 className="group-title">
                        <span className="group-dot" style={{ backgroundColor: group.iconColor }}></span>
                        {group.title}
                    </h4>
                    <div className="toolbox-grid">
                        {group.tools.map(tool => {
                            const Icon = tool.icon;
                            return (
                                <Link href={tool.url} key={tool.id} className="tool-chip-item">
                                    <div className="tool-icon-chip" style={{ backgroundColor: group.bgColor }}>
                                        <Icon size={22} color={group.iconColor} strokeWidth={2.5} />
                                    </div>
                                    <span className="tool-chip-name">{tool.title}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}

            <style jsx>{`
                .mini-toolbox-v4 {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }
                .toolbox-group {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 20px;
                }
                .group-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 12px;
                }
                .group-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: inline-block;
                }
                .toolbox-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                }
                .tool-chip-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: #fff;
                    border: 1px solid #ECEEF2;
                    border-radius: 14px;
                    padding: 16px 12px;
                    transition: all 0.15s ease;
                    text-decoration: none;
                }
                .tool-chip-item:hover {
                    border-color: #0064FF;
                    background: #F8FBFF;
                }
                .tool-icon-chip {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 10px;
                }
                .tool-chip-name {
                    font-size: 13px;
                    font-weight: 600;
                    color: #191F28;
                    letter-spacing: -0.01em;
                    text-align: center;
                }
                
                @media (max-width: 600px) {
                    .toolbox-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            `}</style>
        </div>
    );
}
