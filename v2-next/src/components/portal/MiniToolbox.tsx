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
        ]
    },
    {
        title: "부동산 및 대출",
        tools: [
            { id: "loan", icon: "🏠", title: "대출 계산", url: "/loan-calculator", color: "#FFF4E8" },
            { id: "dsr", icon: "⚖️", title: "DSR 한도", url: "/dsr-calculator", color: "#E8FBFF" },
        ]
    },
    {
        title: "저축 및 투자",
        tools: [
            { id: "savings", icon: "🏦", title: "적금 계산", url: "/savings-calculator", color: "#E8FFF3" },
            { id: "compound", icon: "📈", title: "복리 수익", url: "/compound-calculator", color: "#F3E8FF" },
            { id: "exchange", icon: "💱", title: "환율 계산", url: "/exchange-calculator", color: "#FFFCE8" }
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
                    background: var(--surface);
                    border-radius: var(--radius-lg);
                    padding: 24px;
                    margin-bottom: 32px;
                    border: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .toolbox-group {
                    display: flex;
                    flex-direction: column;
                    border-bottom: 1px solid rgba(0,0,0,0.03);
                    padding-bottom: 16px;
                }
                .toolbox-group:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }
                .group-title {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 12px;
                    opacity: 0.8;
                }
                .toolbox-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 12px;
                }
                .tool-chip-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 0;
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
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.6rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                }
                .tool-chip-name {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    letter-spacing: -0.01em;
                }
            `}</style>
        </div>
    );
}
