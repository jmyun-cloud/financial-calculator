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
        bgColor: "#F0F6FF",
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
        bgColor: "#FFF5F5",
        tools: [
            { id: "loan", icon: Home, title: "대출 계산", url: "/loan-calculator" },
            { id: "dsr", icon: Scale, title: "DSR 한도", url: "/dsr-calculator" },
            { id: "jeonse", icon: Key, title: "전월세 계산", url: "/jeonse-calculator" },
        ]
    },
    {
        title: "저축 및 노후",
        iconColor: "#1B8947",
        bgColor: "#F0F9F4",
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
        <div className="flex flex-col gap-10 w-full mb-10">
            {toolGroups.map((group, gIdx) => (
                <div key={gIdx} className="flex flex-col">
                    <h4 className="flex items-center gap-2.5 text-[17px] font-extrabold text-[#191F28] mb-5 px-1">
                        <span className="w-1.5 h-6 rounded-full inline-block" style={{ backgroundColor: group.iconColor }}></span>
                        {group.title}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {group.tools.map(tool => {
                            const Icon = tool.icon;
                            return (
                                <Link 
                                    href={tool.url} 
                                    key={tool.id} 
                                    className="group flex flex-col items-center justify-center bg-white border border-[#F2F4F7] rounded-[24px] p-6 aspect-[1.1/1] transition-all duration-300 no-underline shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(0,100,255,0.08)] hover:border-[#0064FF] hover:-translate-y-1"
                                >
                                    <div 
                                        className="w-[52px] h-[52px] rounded-[18px] flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300" 
                                        style={{ backgroundColor: group.bgColor }}
                                    >
                                        <Icon size={26} color={group.iconColor} strokeWidth={2.2} />
                                    </div>
                                    <span className="text-[14px] font-bold text-[#333D4B] tracking-tight group-hover:text-[#0064FF] transition-colors">
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


