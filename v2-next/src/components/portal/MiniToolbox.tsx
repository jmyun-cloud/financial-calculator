"use client";
import React from "react";
import Link from "next/link";

const toolGroups = [
    {
        title: "소득 및 세금",
        tools: [
            { id: "salary", icon: "💰", title: "연봉 계산", url: "/salary-calculator", color: "#E8F3FF" },
            { id: "freelancer", icon: "👨‍💻", title: "프리랜서", url: "/freelancer-calculator", color: "#F0F0F0" },
            { id: "severance", icon: "💼", title: "퇴직금", url: "/severance-calculator", color: "#FFE8E8" },
            { id: "tax-interest", icon: "🧾", title: "이자/세금", url: "/tax-interest-calculator", color: "#E8E8FF" },
        ]
    },
    {
        title: "부동산 및 대출",
        tools: [
            { id: "loan", icon: "🏠", title: "대출 계산", url: "/loan-calculator", color: "#FFF4E8" },
            { id: "dsr", icon: "⚖️", title: "DSR 한도", url: "/dsr-calculator", color: "#E8FBFF" },
            { id: "jeonse", icon: "🔑", title: "전월세 계산", url: "/jeonse-calculator", color: "#FFFBE8" },
        ]
    },
    {
        title: "저축 및 노후",
        tools: [
            { id: "savings", icon: "🏦", title: "적금 계산", url: "/savings-calculator", color: "#E8FFF3" },
            { id: "compound", icon: "📈", title: "복리 수익", url: "/compound-calculator", color: "#F3E8FF" },
            { id: "exchange", icon: "💱", title: "환율 계산", url: "/exchange-calculator", color: "#FFFCE8" },
            { id: "pension", icon: "💎", title: "연금 계산", url: "/pension-calculator", color: "#E8F3FF" },
            { id: "inflation", icon: "📉", title: "물가/가치", url: "/inflation-calculator", color: "#FFE8F4" }
        ]
    }
];

export default function MiniToolbox() {
    return (
        <div className="mini-toolbox-v3">
            {toolGroups.map((group, gIdx) => (
                <div key={gIdx} className="toolbox-group">
                    <h4 className="group-title">{group.title}</h4>
                    <div className="toolbox-grid">
                        {group.tools.map(tool => (
                            <Link href={tool.url} key={tool.id} className="tool-chip-item">
                                <div className="tool-icon-chip" style={{ background: tool.color }}>
                                    {tool.icon}
                                </div>
                                <span className="tool-chip-name">{tool.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}

            <style jsx>{`
                .mini-toolbox-v3 {
                    background: white;
                    border-radius: 24px;
                    padding: 32px;
                    margin-bottom: 32px;
                    border: 1px solid #F2F4F7;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.02);
                }
                .toolbox-group {
                    display: flex;
                    flex-direction: column;
                }
                .group-title {
                    font-size: 16px;
                    font-weight: 800;
                    color: #191F28;
                    margin-bottom: 20px;
                    padding-left: 4px;
                }
                .toolbox-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    row-gap: 24px;
                    column-gap: 12px;
                }
                .tool-chip-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-decoration: none;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .tool-chip-item:hover {
                    transform: translateY(-4px);
                }
                .tool-icon-chip {
                    width: 64px;
                    height: 64px;
                    border-radius: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    margin-bottom: 12px;
                    transition: all 0.2s;
                }
                .tool-chip-item:hover .tool-icon-chip {
                    box-shadow: 0 8px 20px rgba(0,0,0,0.06);
                }
                .tool-chip-name {
                    font-size: 14px;
                    font-weight: 500;
                    color: #4E5968;
                    text-align: center;
                    white-space: nowrap;
                }
            `}</style>
        </div>
    );
}
