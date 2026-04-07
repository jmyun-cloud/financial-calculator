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
        <div className="flex flex-col gap-0 w-full">
            {toolGroups.map((group, gIdx) => (
                <div key={gIdx} className="flex flex-col mb-6">
                    <h4 className="flex items-center gap-2 text-[15px] font-bold text-[#191F28] mb-3">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: group.iconColor }}></span>
                        {group.title}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px]">
                        {group.tools.map(tool => {
                            const Icon = tool.icon;
                            return (
                                <Link 
                                    href={tool.url} 
                                    key={tool.id} 
                                    className="flex flex-col items-center bg-white border border-[#ECEEF2] rounded-[14px] p-4 transition-all duration-150 no-underline hover:border-[#0064FF] hover:bg-[#F8FBFF] hover:-translate-y-0.5"
                                >
                                    <div 
                                        className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center mb-[10px]" 
                                        style={{ backgroundColor: group.bgColor }}
                                    >
                                        <Icon size={22} color={group.iconColor} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[13px] font-semibold text-[#191F28] tracking-tight text-center whitespace-nowrap">
                                        {tool.title}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

