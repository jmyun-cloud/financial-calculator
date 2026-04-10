"use client";
import React from "react";
import Link from "next/link";

const toolGroups = [
    {
        title: "소득 및 세금",
        cols: 4,
        tools: [
            { id: "salary", icon: "💰", title: "연봉 계산", url: "/salary-calculator", color: "#E8F3FF" },
            { id: "freelancer", icon: "👨‍💻", title: "프리랜서", url: "/freelancer-calculator", color: "#F0F0F0" },
            { id: "severance", icon: "💼", title: "퇴직금", url: "/severance-calculator", color: "#FFE8E8" },
            { id: "tax-interest", icon: "🧾", title: "이자/세금", url: "/tax-interest-calculator", color: "#E8E8FF" },
        ]
    },
    {
        title: "부동산 및 대출",
        cols: 4,
        tools: [
            { id: "loan", icon: "🏠", title: "대출 계산", url: "/loan-calculator", color: "#FFF4E8" },
            { id: "dsr", icon: "⚖️", title: "DSR 한도", url: "/dsr-calculator", color: "#E8FBFF" },
            { id: "jeonse", icon: "🔑", title: "전월세 계산", url: "/jeonse-calculator", color: "#FFFBE8" },
        ]
    },
    {
        title: "저축 및 노후",
        cols: 5,
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
        <div style={{
            background: "white",
            borderRadius: "24px",
            padding: "28px 24px",
            marginBottom: "32px",
            border: "1px solid #F2F4F7",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.02)"
        }}>
            {toolGroups.map((group, gIdx) => (
                <div key={gIdx}>
                    <h4 style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#333D4B",
                        margin: "0 0 16px 2px",
                        letterSpacing: "-0.01em"
                    }}>
                        {group.title}
                    </h4>

                    {/* Flex 방식 – 컬럼 수에 따라 각 아이템 너비 계산 */}
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0"
                    }}>
                        {group.tools.map(tool => (
                            <Link
                                href={tool.url}
                                key={tool.id}
                                style={{
                                    width: `${100 / group.cols}%`,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    textDecoration: "none",
                                    paddingBottom: "20px"
                                }}
                            >
                                <div style={{
                                    width: "56px",
                                    height: "56px",
                                    borderRadius: "18px",
                                    background: tool.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "26px",
                                    marginBottom: "8px",
                                    flexShrink: 0
                                }}>
                                    {tool.icon}
                                </div>
                                <span style={{
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: "#4E5968",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    letterSpacing: "-0.01em"
                                }}>
                                    {tool.title}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
