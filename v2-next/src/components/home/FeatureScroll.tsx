"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Landmark, TrendingUp, ChevronRight, Activity, PieChart, Bell, ArrowUpRight } from 'lucide-react';

const FEATURES = [
    {
        id: 'salary',
        category: 'Income Analysis',
        title: '연봉 6,000만원,\n진짜 통장에 찍히는 돈은?',
        desc: '단순한 숫자 그 이상. 국민연금부터 고용보험까지, 모든 공제항목을 실시간으로 분석하여 당신의 진짜 구매력을 계산합니다.',
        icon: <Wallet className="text-blue-500" size={32} />,
        color: '#3182F6',
        layout: 'left'
    },
    {
        id: 'loan',
        category: 'Debt Capacity',
        title: 'DSR 40%의 벽,\n당신의 여유 한도는?',
        desc: '은행권의 복잡한 대출 규제를 한눈에. 소득과 기존 부채를 정밀 분석하여 추가 대출 가능 여부를 즉시 시뮬레이션 합니다.',
        icon: <Landmark className="text-emerald-500" size={32} />,
        color: '#00D5AB',
        layout: 'right'
    },
    {
        id: 'pension',
        category: 'Wealth Projection',
        title: '정년 퇴집 후,\n매달 200만원을 받으려면?',
        desc: '65세 이후의 삶을 미리 설계하세요. 물가 상승률과 납입 기간을 고려한 자산 성장 곡선을 통해 완벽한 노후를 준비합니다.',
        icon: <TrendingUp className="text-indigo-500" size={32} />,
        color: '#6366F1',
        layout: 'left'
    }
];

export default function FeatureScroll() {
    return (
        <div className="bg-white">
            {FEATURES.map((feature, idx) => (
                <FeatureSection key={feature.id} feature={feature} index={idx} />
            ))}
        </div>
    );
}

function FeatureSection({ feature, index }: { feature: typeof FEATURES[0], index: number }) {
    const isLeft = feature.layout === 'left';

    return (
        <section className={`py-32 lg:py-48 overflow-hidden relative ${index % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}>
            {/* Background Decorative Element */}
            <div className={`absolute top-1/2 ${isLeft ? '-right-20' : '-left-20'} -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] opacity-10 pointer-events-none`}
                style={{ backgroundColor: feature.color }} />

            <div className="container mx-auto px-6 relative z-10">
                <div className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24`}>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1"
                    >
                        <div className="mb-8 flex items-center gap-3">
                            <div className="w-10 h-1px bg-gray-900"></div>
                            <span className="text-xs font-black tracking-[0.2em] uppercase text-gray-900">{feature.category}</span>
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-[-0.04em] mb-10 whitespace-pre-line">
                            {feature.title}
                        </h2>
                        <p className="text-lg lg:text-xl text-gray-500 font-bold leading-relaxed max-w-[520px] tracking-tight mb-12">
                            {feature.desc}
                        </p>
                        <div className="flex flex-wrap items-center gap-6">
                            <button className="flex items-center gap-3 px-8 py-5 bg-gray-900 rounded-[24px] text-white font-black text-lg shadow-xl shadow-gray-200 hover:scale-105 active:scale-95 transition-all">
                                지금 바로 계산하기 <ArrowUpRight size={24} strokeWidth={3} />
                            </button>
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + index * 5 + 10}`} alt="user" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="pl-6 text-sm font-black text-gray-400 italic">Join 12k+ users</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Dashboard Mockup Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1 w-full max-w-[600px]"
                    >
                        <div className="bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden relative">
                            {/* Browser Header */}
                            <div className="h-12 border-b border-gray-50 px-8 flex items-center justify-between bg-gray-50/20">
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-200"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-200"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-200"></div>
                                </div>
                                <div className="text-[9px] font-black text-gray-300 tracking-[0.2em] uppercase">richcalc / overview</div>
                                <div className="w-8"></div>
                            </div>

                            {/* Dashboard Content Mockup (simplified for this section) */}
                            <div className="p-8 lg:p-12">
                                {feature.id === 'salary' && <SalaryWidgetMockup />}
                                {feature.id === 'loan' && <LoanWidgetMockup />}
                                {feature.id === 'pension' && <PensionWidgetMockup />}
                            </div>

                            {/* Floating Decorative Elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 w-20 h-20 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-blue-500"
                            >
                                {feature.id === 'salary' ? <Activity size={24} /> : feature.id === 'loan' ? <PieChart size={24} /> : <Bell size={24} />}
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

function SalaryWidgetMockup() {
    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Monthly Salary</h3>
                    <div className="text-3xl font-black text-gray-900">₩5,000,000</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl text-blue-600"><Wallet size={24} /></div>
            </div>
            <div className="space-y-6">
                <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-500">실 수령액 (세후)</span>
                    <span className="text-blue-600 font-black">₩4,152,430 (83%)</span>
                </div>
                <div className="h-4 bg-gray-50 rounded-full overflow-hidden flex">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '83%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="text-[10px] font-black text-gray-400 uppercase mb-1">Tax (Income)</div>
                        <div className="text-sm font-black text-gray-700">₩285,420</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="text-[10px] font-black text-gray-400 uppercase mb-1">Insurance</div>
                        <div className="text-sm font-black text-gray-700">₩562,150</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoanWidgetMockup() {
    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">DSR Capacity Analysis</h3>
                <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase">Low Risk</div>
            </div>
            <div className="flex items-center justify-center py-4 scale-110">
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f3f5" strokeWidth="10" />
                        <motion.circle
                            cx="50" cy="50" r="45" fill="none" stroke="#00D5AB" strokeWidth="10"
                            strokeDasharray="283"
                            strokeDashoffset="170"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center rotate-[90deg]">
                        <span className="text-3xl font-black text-gray-900 leading-none">40%</span>
                        <span className="text-[10px] font-bold text-gray-400 mt-1">DSR Ratio</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase mb-1">Max Loan limit</div>
                    <div className="text-xl font-black text-gray-900">₩4.25억</div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black text-gray-400 uppercase mb-1">Monthly Payment</div>
                    <div className="text-xl font-black text-emerald-600">₩192만원</div>
                </div>
            </div>
        </div>
    );
}

function PensionWidgetMockup() {
    return (
        <div className="space-y-10">
            <div className="p-6 bg-indigo-600 rounded-3xl text-white">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-black">RC</div>
                    <Bell size={24} className="opacity-40" />
                </div>
                <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">Projected Asset Value (65yo)</div>
                <div className="text-3xl font-black mb-1">₩2,850,000,000</div>
                <div className="text-[11px] font-medium opacity-60 italic">*연평균 수익률 4.2% 가정</div>
            </div>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">A</div>
                    <div className="flex-1">
                        <div className="h-2 bg-indigo-50 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600" style={{ width: '65%' }}></div>
                        </div>
                    </div>
                    <div className="text-xs font-black text-gray-900">₩1,920,000/mo</div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-black text-xs">B</div>
                    <div className="flex-1">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gray-300" style={{ width: '35%' }}></div>
                        </div>
                    </div>
                    <div className="text-xs font-black text-gray-900">₩760,000/mo</div>
                </div>
            </div>
        </div>
    );
}
