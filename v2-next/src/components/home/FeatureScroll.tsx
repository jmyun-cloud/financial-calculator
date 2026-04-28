"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Wallet, Landmark, TrendingUp, ChevronRight } from 'lucide-react';

const FEATURES = [
    {
        id: 'salary',
        title: '연봉 6,000만원,\n실수령액은 얼마일까?',
        desc: '국민연금, 건강보험, 고용보험 그리고 소득세까지. 내 통장에 찍히는 진짜 숫자를 확인하세요.',
        icon: <Wallet className="text-blue-500" size={32} />,
        color: '#3182F6',
        bgColor: '#f0f7ff',
        data: {
            label: '월 예상 실수령액',
            value: '4,152,430원',
            detail: '세전 5,000,000원 기준'
        },
        visual: (
            <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-between items-end">
                    <div className="text-sm font-semibold text-gray-400">세전 월급</div>
                    <div className="text-lg font-bold text-gray-800">5,000,000원</div>
                </div>
                <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-blue-500" style={{ width: '83%' }}></div>
                    <div className="h-full bg-red-400" style={{ width: '17%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-gray-500">실수령액 (83%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        <span className="text-gray-500">총 공제액 (17%)</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'loan',
        title: 'DSR 40% 기준,\n내 대출 한도는?',
        desc: '소득과 기존 부채를 분석하여 내가 받을 수 있는 최대 대출 금액을 1초 만에 산출합니다.',
        icon: <Landmark className="text-emerald-500" size={32} />,
        color: '#00D5AB',
        bgColor: '#f0fffb',
        data: {
            label: '예상 대출 한도',
            value: '4억 2,000만원',
            detail: '연소득 6,000만원 / 금리 4.5% 기준'
        },
        visual: (
            <div className="flex flex-col gap-6 w-full py-4">
                <div className="relative h-24 flex items-center justify-center">
                    <svg viewBox="0 0 100 50" className="w-full h-full">
                        <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="#E5E8EB" strokeWidth="8" strokeLinecap="round" />
                        <path d="M 10 45 A 40 40 0 0 1 65 18" fill="none" stroke="#00D5AB" strokeWidth="8" strokeLinecap="round" />
                    </svg>
                    <div className="absolute bottom-0 text-center">
                        <div className="text-2xl font-black text-emerald-600">40%</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Current DSR</div>
                    </div>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <div className="text-[11px] text-emerald-700 font-bold mb-1">💡 전문가 조언</div>
                    <div className="text-[10px] text-emerald-600 leading-relaxed">현재 소득 대비 대출 상환 능력이 안정적입니다. 추가 한도 확보 가능성이 높습니다.</div>
                </div>
            </div>
        )
    },
    {
        id: 'pension',
        title: '65세 은퇴 후,\n매달 얼마를 받을까?',
        desc: '국민연금 납입액과 물가 상승률을 고려한 미래 자산 가치를 시뮬레이션 합니다.',
        icon: <TrendingUp className="text-indigo-500" size={32} />,
        color: '#6366F1',
        bgColor: '#f4f4ff',
        data: {
            label: '예상 월 연금액',
            value: '185만원',
            detail: '30년 납입 / 소득 상승률 3% 가정'
        },
        visual: (
            <div className="flex flex-col gap-4 w-full">
                <div className="h-32 w-full relative pt-4">
                    <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                        <path d="M 0 80 Q 50 75, 100 50 T 200 10" fill="none" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="200" cy="10" r="6" fill="#6366F1" />
                        <rect x="140" y="-30" width="60" height="25" rx="5" fill="#1e1e1e" />
                        <text x="170" y="-13" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">28억 5천</text>
                    </svg>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-gray-400 px-1">
                    <span>현재 (30세)</span>
                    <span>은퇴 (65세)</span>
                </div>
            </div>
        )
    }
];

export default function FeatureScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth background color transition
    const bgColor = useTransform(
        scrollYProgress,
        [0, 0.33, 0.66, 1],
        ['#ffffff', '#f0f7ff', '#f0fffb', '#f4f4ff']
    );

    return (
        <motion.section
            ref={containerRef}
            className="relative transition-colors duration-700"
            style={{ height: '400vh', backgroundColor: bgColor }}
        >
            <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
                <div className="container px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Left: Text Content - Sticky but Swapping */}
                    <div className="relative z-20 h-[400px]">
                        {FEATURES.map((feature, idx) => {
                            const start = idx / FEATURES.length;
                            const end = (idx + 1) / FEATURES.length;

                            const opacity = useTransform(scrollYProgress,
                                [start, start + 0.1, end - 0.1, end],
                                [0, 1, 1, 0]
                            );
                            const y = useTransform(scrollYProgress,
                                [start, start + 0.1, end - 0.1, end],
                                [40, 0, 0, -40]
                            );

                            return (
                                <motion.div
                                    key={feature.id}
                                    className="absolute inset-0 flex flex-col justify-center"
                                    style={{ opacity, y }}
                                >
                                    <div className="mb-6 inline-flex w-fit px-4 py-1.5 rounded-full bg-white/80 border border-gray-100 shadow-sm text-gray-600 text-xs font-black tracking-widest uppercase">
                                        Feature 0{idx + 1}
                                    </div>
                                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-[1.1] mb-8 whitespace-pre-line tracking-tighter">
                                        {feature.title}
                                    </h2>
                                    <p className="text-lg lg:text-xl text-gray-500 font-semibold leading-relaxed max-w-[440px]">
                                        {feature.desc}
                                    </p>
                                    <div className="mt-10">
                                        <button className="flex items-center gap-3 px-8 py-4 bg-gray-900 rounded-2xl text-white font-black text-lg group hover:scale-105 active:scale-95 transition-all">
                                            지금 시작하기 <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Right: The Stacking Cards (TRUE STACKING) */}
                    <div className="relative h-[600px] flex items-center justify-center">
                        {FEATURES.map((feature, idx) => {
                            const start = idx / FEATURES.length;
                            const end = (idx + 1) / FEATURES.length;

                            // This card's major animation
                            // It stays on screen once it arrives (accumulating)
                            const y = useTransform(scrollYProgress,
                                [start - 0.1, start, 1],
                                [800, 0, 0] // Slide from bottom then STAY
                            );

                            const rotate = useTransform(scrollYProgress,
                                [start, start + 0.1],
                                [0, (idx - 1) * 4] // Slight spread as they stack
                            );

                            const scale = useTransform(scrollYProgress,
                                [start, start + 0.1],
                                [0.8, 1]
                            );

                            // Depth effect: Shrink and fade slightly when buried by next cards
                            // Card N starts getting buried when scroll goes beyond its 'end'
                            const depthScale = useTransform(scrollYProgress,
                                [end, end + 0.1],
                                [1, 0.96]
                            );
                            const depthOpacity = useTransform(scrollYProgress,
                                [end, end + 0.1],
                                [1, 0.4]
                            );
                            const depthFilter = useTransform(scrollYProgress,
                                [end, end + 0.1],
                                ['blur(0px)', 'blur(2px)']
                            );

                            return (
                                <motion.div
                                    key={feature.id}
                                    className="absolute w-full max-w-[420px] aspect-[4/5] bg-white rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-white/50 p-12 flex flex-col justify-between overflow-hidden backdrop-blur-xl"
                                    style={{
                                        y,
                                        rotate,
                                        scale: scale, // combine with depthScale logic if needed or wrap
                                        zIndex: idx + 10,
                                        opacity: useTransform(scrollYProgress, [start - 0.1, start], [0, 1])
                                    }}
                                >
                                    {/* Buried Effect Overlay */}
                                    <motion.div
                                        className="absolute inset-0 bg-gray-50/20 pointer-events-none z-50"
                                        style={{ opacity: useTransform(scrollYProgress, [end, end + 0.1], [0, 1]) }}
                                    />

                                    <div className="flex justify-between items-start">
                                        <motion.div
                                            initial={false}
                                            animate={{ backgroundColor: feature.bgColor }}
                                            className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-inner"
                                        >
                                            {feature.icon}
                                        </motion.div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Status</div>
                                            <div className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-900 text-[10px] font-black italic">ULTIMATE CALC</div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex items-center justify-center py-8">
                                        {feature.visual}
                                    </div>

                                    <div className="pt-10 border-t border-gray-100">
                                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{feature.data.label}</div>
                                        <div className="flex items-baseline gap-2">
                                            <div className="text-4xl font-black text-gray-900 tracking-tighter">{feature.data.value}</div>
                                        </div>
                                        <div className="text-[12px] text-gray-400 mt-2 font-bold">{feature.data.detail}</div>
                                    </div>

                                    {/* Glass highlight */}
                                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/40 rounded-full blur-3xl pointer-events-none"></div>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </motion.section>
    );
}
