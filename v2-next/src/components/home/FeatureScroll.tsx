"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Wallet, Landmark, TrendingUp, ChevronRight, Activity, PieChart, Bell } from 'lucide-react';

const FEATURES = [
    {
        id: 'salary',
        category: 'Income Analysis',
        title: '연봉 6,000만원,\n진짜 통장에 찍히는 돈은?',
        desc: '단순한 숫자 그 이상. 국민연금부터 고용보험까지, 모든 공제항목을 실시간으로 분석하여 당신의 진짜 구매력을 계산합니다.',
        icon: <Wallet className="text-blue-500" size={32} />,
        color: '#3182F6',
    },
    {
        id: 'loan',
        category: 'Debt Capacity',
        title: 'DSR 40%의 벽,\n당신의 여유 한도는?',
        desc: '은행권의 복잡한 대출 규제를 한눈에. 소득과 기존 부채를 정밀 분석하여 추가 대출 가능 여부를 즉시 시뮬레이션 합니다.',
        icon: <Landmark className="text-emerald-500" size={32} />,
        color: '#00D5AB',
    },
    {
        id: 'pension',
        category: 'Wealth Projection',
        title: '정년 퇴직 후,\n매달 200만원을 받으려면?',
        desc: '65세 이후의 삶을 미리 설계하세요. 물가 상승률과 납입 기간을 고려한 자산 성장 곡선을 통해 완벽한 노후를 준비합니다.',
        icon: <TrendingUp className="text-indigo-500" size={32} />,
        color: '#6366F1',
    }
];

export default function FeatureScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Background color shifts
    const bgColor = useTransform(smoothProgress, [0, 0.33, 0.66, 1], ['#ffffff', '#f8fbff', '#f6fffb', '#f9f9ff']);

    // Vertical Parallax for the whole content - subtle sense of "moving down" even while sticky
    const contentY = useTransform(smoothProgress, [0, 1], [0, -50]);

    return (
        <motion.section
            ref={containerRef}
            className="relative"
            style={{ height: '300vh', backgroundColor: bgColor }} // Reduced from 400vh for faster flow
        >
            <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">

                {/* Scroll Indicator (Visual Feedback of Movement) */}
                <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-50 hidden lg:flex">
                    <div className="h-40 w-px bg-gray-100 relative">
                        <motion.div
                            className="absolute top-0 left-0 w-full bg-blue-500"
                            style={{ height: useTransform(smoothProgress, [0, 1], ['0%', '100%']) }}
                        />
                    </div>
                    {FEATURES.map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{
                                backgroundColor: useTransform(smoothProgress,
                                    [i / 3, (i + 1) / 3],
                                    ['#E5E8EB', '#3182F6']
                                )
                            }}
                        />
                    ))}
                </div>

                {/* Visual Glows behind components */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none"
                    style={{
                        background: useTransform(smoothProgress,
                            [0, 0.33, 0.66, 1],
                            ['#3182f6', '#00d5ab', '#6366f1', '#3182f6']
                        ),
                        scale: useTransform(smoothProgress, [0, 0.5, 1], [1, 1.2, 1])
                    }}
                />

                <motion.div style={{ y: contentY }} className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">

                    {/* Left: Premium Typography Section */}
                    <div className="relative h-[480px]">
                        {FEATURES.map((feature, idx) => {
                            const start = idx / FEATURES.length;
                            const end = (idx + 1) / FEATURES.length;

                            const opacity = useTransform(smoothProgress,
                                [start, start + 0.1, end - 0.1, end],
                                [0, 1, 1, 0]
                            );
                            const y = useTransform(smoothProgress,
                                [start, start + 0.1, end - 0.1, end],
                                [40, 0, 0, -40]
                            );

                            return (
                                <motion.div
                                    key={feature.id}
                                    className="absolute inset-0 flex flex-col justify-center"
                                    style={{ opacity, y }}
                                >
                                    <div className="mb-8 flex items-center gap-3">
                                        <div className="w-10 h-1px bg-gray-900"></div>
                                        <span className="text-xs font-black tracking-[0.2em] uppercase text-gray-900">{feature.category}</span>
                                    </div>
                                    <h2 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.05] tracking-[-0.04em] mb-10 whitespace-pre-line">
                                        {feature.title}
                                    </h2>
                                    <p className="text-xl lg:text-2xl text-gray-500 font-bold leading-relaxed max-w-[520px] tracking-tight">
                                        {feature.desc}
                                    </p>
                                    <div className="mt-12 flex items-center gap-8">
                                        <button className="flex items-center gap-3 px-8 py-5 bg-gray-900 rounded-[20px] text-white font-black text-lg shadow-2xl shadow-gray-200 hover:scale-105 active:scale-95 transition-all">
                                            지금 바로 계산하기 <ChevronRight size={24} strokeWidth={3} />
                                        </button>
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            <div className="pl-6 text-sm font-black text-gray-400">Join 12k+ users</div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Right: The Mac-style Mockup Window with Parallax Widgets */}
                    <div className="relative flex items-center justify-center">
                        <motion.div
                            className="w-full max-w-[560px] aspect-[4/5] bg-white rounded-[48px] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.12)] border border-gray-100 relative overflow-hidden"
                            style={{
                                rotateY: useTransform(smoothProgress, [0, 1], [-5, 5]),
                                rotateX: useTransform(smoothProgress, [0, 1], [5, -5])
                            }}
                        >
                            {/* Browser/Window Header */}
                            <div className="h-14 border-b border-gray-50 px-8 flex items-center justify-between bg-gray-50/30">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-200"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-200"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-200"></div>
                                </div>
                                <div className="text-[10px] font-black text-gray-300 tracking-widest uppercase">richcalc.kr / intelligence</div>
                                <div className="w-10"></div>
                            </div>

                            {/* Dashboard Static Elements (Sidebar-ish) */}
                            <div className="p-10 flex flex-col gap-10 opacity-20">
                                <div className="flex items-baseline gap-4">
                                    <div className="w-32 h-8 bg-gray-100 rounded-lg"></div>
                                    <div className="w-20 h-4 bg-gray-50 rounded-lg"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="aspect-square bg-gray-50 rounded-3xl"></div>
                                    <div className="aspect-square bg-gray-50 rounded-3xl"></div>
                                </div>
                            </div>

                            {/* FLOATING WIDGETS - TRUE PARALLAX */}

                            {/* Salary Widget (0% - 33%) */}
                            <Widget
                                progress={smoothProgress}
                                range={[0, 0.33]}
                                delay={0}
                                className="absolute top-20 left-10 right-10"
                            >
                                <div className="bg-white p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-50">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Wallet size={28} />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-gray-400 font-black mb-1">TOTAL INCOME</div>
                                            <div className="text-lg font-black text-gray-900">₩5,000,000</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-xs font-bold text-gray-500">
                                            <span>After Tax</span>
                                            <span>₩4,152,430 (83%)</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                                            <motion.div initial={{ width: 0 }} animate={{ width: '83%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-blue-500" />
                                        </div>
                                    </div>
                                </div>
                            </Widget>

                            {/* Loan Widget (33% - 66%) */}
                            <Widget
                                progress={smoothProgress}
                                range={[0.33, 0.66]}
                                delay={0.05}
                                className="absolute bottom-20 left-10 right-10"
                            >
                                <div className="bg-white p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-50">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><Landmark size={24} /></div>
                                        <div className="text-sm font-black text-gray-900 uppercase">DSR Analysis</div>
                                    </div>
                                    <div className="relative h-20 flex items-center justify-center">
                                        <svg viewBox="0 0 100 50" className="w-full h-full">
                                            <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="#f1f3f5" strokeWidth="8" strokeLinecap="round" />
                                            <motion.path
                                                d="M 10 45 A 40 40 0 0 1 65 18"
                                                fill="none"
                                                stroke="#00D5AB"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 1, delay: 0.8 }}
                                            />
                                        </svg>
                                        <div className="absolute bottom-0 text-2xl font-black text-gray-900">40%</div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between">
                                        <div>
                                            <div className="text-[10px] text-gray-400 font-bold mb-1">LIMIT</div>
                                            <div className="text-sm font-black text-emerald-600">₩420,000,000</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-gray-400 font-bold mb-1">RATE</div>
                                            <div className="text-sm font-black text-gray-900">4.52%</div>
                                        </div>
                                    </div>
                                </div>
                            </Widget>

                            {/* Pension Widget (66% - 100%) */}
                            <Widget
                                progress={smoothProgress}
                                range={[0.66, 0.95]}
                                delay={0.1}
                                className="absolute inset-x-10 top-1/2 -translate-y-1/2"
                            >
                                <div className="bg-gray-900 p-8 rounded-[40px] shadow-2xl text-white">
                                    <div className="flex justify-between mb-10">
                                        <TrendingUp className="text-indigo-400" size={32} />
                                        <div className="flex gap-1">
                                            <div className="w-1 h-3 bg-white/20 rounded"></div>
                                            <div className="w-1 h-5 bg-white/40 rounded"></div>
                                            <div className="w-1 h-4 bg-indigo-500 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-indigo-300 font-black uppercase tracking-widest mb-2">Retirement Goal</div>
                                    <div className="text-3xl font-black mb-6">₩2,850,000,000</div>
                                    <div className="h-20 w-full">
                                        <svg viewBox="0 0 200 80" className="w-full h-full">
                                            <motion.path
                                                d="M 0 60 Q 50 55, 100 35 T 200 10"
                                                fill="none"
                                                stroke="#6366F1"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 1.5, delay: 1 }}
                                            />
                                        </svg>
                                    </div>
                                    <div className="mt-6 flex justify-between text-[10px] font-black uppercase text-white/30">
                                        <span>2024</span>
                                        <span>2054</span>
                                    </div>
                                </div>
                            </Widget>

                        </motion.div>

                        {/* Secondary floating icons for even more parallax depth */}
                        <FloatingIcon progress={smoothProgress} icon={<PieChart size={20} />} range={[0, 0.5]} className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-blue-500 z-50 translate-x-1/2" />
                        <FloatingIcon progress={smoothProgress} icon={<Activity size={20} />} range={[0.3, 0.8]} className="absolute top-1/2 -left-20 w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-emerald-500 z-50" />
                        <FloatingIcon progress={smoothProgress} icon={<Bell size={20} />} range={[0.6, 1]} className="absolute -bottom-10 right-20 w-24 h-24 rounded-[40px] bg-indigo-600 shadow-xl flex items-center justify-center text-white z-50" />
                    </div>

            </div>
        </div>
        </motion.section >
    );
}

function Widget({ children, progress, range, delay, className }: { children: React.ReactNode, progress: any, range: [number, number], delay: number, className: string }) {
    const opacity = useTransform(progress, [range[0] - 0.05, range[0], range[1], range[1] + 0.05], [0, 1, 1, 0]);
    const y = useTransform(progress, [range[0] - 0.05, range[0], range[1], range[1] + 0.05], [60, 0, 0, -60]); // Reduced y shift
    const scale = useTransform(progress, [range[0] - 0.05, range[0], range[1], range[1] + 0.05], [0.95, 1, 1, 0.95]); // Subtler scale

    return (
        <motion.div style={{ opacity, y, scale }} className={className}>
            {children}
        </motion.div>
    );
}

function FloatingIcon({ icon, progress, range, className }: { icon: React.ReactNode, progress: any, range: [number, number], className: string }) {
    const y = useTransform(progress, range, [100, -100]);
    const opacity = useTransform(progress, [range[0], range[0] + 0.1, range[1] - 0.1, range[1]], [0, 1, 1, 0]);

    return (
        <motion.div style={{ y, opacity }} className={className}>
            {icon}
        </motion.div>
    );
}
