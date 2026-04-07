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
            { name: '연봉 계산', icon: DollarSign, href: '/salary-calculator' },
            { name: '프리랜서', icon: Laptop, href: '/freelancer-calculator' },
            { name: '퇴직금', icon: Briefcase, href: '/severance-calculator' },
            { name: '이자/세금', icon: Receipt, href: '/tax-interest-calculator' },
        ]
    },
    {
        title: "부동산 및 대출",
        color: "#F04251",
        bg: "#FFF0F0",
        tools: [
            { name: '대출 계산', icon: Home, href: '/loan-calculator' },
            { name: 'DSR 한도', icon: Scale, href: '/dsr-calculator' },
            { name: '전월세 계산', icon: Key, href: '/jeonse-calculator' },
        ]
    },
    {
        title: "저축 및 투자",
        color: "#1B8947",
        bg: "#E8F9F0",
        tools: [
            { name: '적금 계산', icon: PiggyBank, href: '/savings-calculator' },
            { name: '복리 수익', icon: TrendingUp, href: '/compound-calculator' },
            { name: '환율 계산', icon: ArrowLeftRight, href: '/exchange-calculator' },
            { name: '연금 계산', icon: UserCheck, href: '/pension-calculator' },
            { name: '물가/가치', icon: BarChart2, href: '/inflation-calculator' },
        ]
    }
];

export default function MiniToolbox() {
    return (
        <div className="flex flex-col gap-14 mt-10">
            {GROUPS.map((group) => (
                <div key={group.title} className="flex flex-col">
                    <h3 className="text-[17px] font-bold text-[#191F28] mb-8 px-1">
                        {group.title}
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-y-10 gap-x-4">
                        {group.tools.map((tool) => (
                            <Link 
                                key={tool.name} 
                                href={tool.href}
                                className="group flex flex-col items-center no-underline"
                            >
                                <div 
                                    className="w-[64px] h-[64px] rounded-[24px] flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
                                    style={{ backgroundColor: group.bg }}
                                >
                                    <tool.icon size={26} strokeWidth={2.5} style={{ color: group.color }} />
                                </div>
                                <span className="text-[13px] font-medium text-[#4E5968] tracking-tight text-center group-hover:text-[#191F28] transition-colors leading-tight">
                                    {tool.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
