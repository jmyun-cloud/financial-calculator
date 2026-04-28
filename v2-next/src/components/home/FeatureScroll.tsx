"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Wallet, Landmark, TrendingUp, ChevronRight } from 'lucide-react';

const FEATURES = [
    {
        id: 'salary',
        title: '연봉 6,000만원,\n실수령액은 얼마일까?',
        desc: '국민연금, 건강보험, 고용보험 그리고 소득세까지. 내 통장에 찍히는 진짜 숫자를 확인하세요.',
        icon: <Wallet className="text-blue-500" size={32} />,
        color: '#3182F6',
        data: {
            label: '월 예상 실수령액',
            value: '4,152,430원',
            detail: '세전 5,000,000원 기준'
        },
        visual: (
            <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-between items-end">
                    <div className="text-sm font-semibold text-gray-500">세전 월급</div>
                    <div className="text-lg font-bold text-gray-800">5,000,000원</div>
                </div>
                <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-blue-500" style={{ width: '83%' }}></div>
                    <div className="h-full bg-red-400" style={{ width: '17%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-gray-600">실수령액 (83%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        <span className="text-gray-600">총 공제액 (17%)</span>
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
        data: {
            label: '예상 월 연금액',
            value: '185만원',
            detail: '30년 납입 / 소득 상승률 3% 가정'
        },
        visual: (
            <div className="flex flex-col gap-4 w-full">
                <div className="h-32 w-full relative pt-4">
                    {/* Simple Line Chart SVG */}
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

    return (
        <section ref={containerRef} className="relative" style={{ height: '400vh' }}>
            <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-white">
                <div className="container grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Left: Text Content */}
                    <div className="relative z-10">
                        <motion.div style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]) }} className="mb-6 inline-flex px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold">
                            Premium Intelligence
                        </motion.div>

                        <div className="relative h-[300px]">
                            {FEATURES.map((feature, idx) => {
                                const start = idx / FEATURES.length;
                                const end = (idx + 1) / FEATURES.length;

                                // Opacity and Y translation for text
                                const opacity = useTransform(scrollYProgress,
                                    [start, start + 0.1, end - 0.1, end],
                                    [0, 1, 1, 0]
                                );
                                const y = useTransform(scrollYProgress,
                                    [start, start + 0.1, end - 0.1, end],
                                    [20, 0, 0, -20]
                                );

                                return (
                                    <motion.div
                                        key={feature.id}
                                        className="absolute inset-0 flex flex-col justify-center"
                                        style={{ opacity, y }}
                                    >
                                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6 whitespace-pre-line">
                                            {feature.title}
                                        </h2>
                                        <p className="text-lg lg:text-xl text-gray-500 font-medium leading-relaxed max-width-[480px]">
                                            {feature.desc}
                                        </p>
                                        <div className="mt-8">
                                            <button className="flex items-center gap-2 text-gray-900 font-black text-lg group">
                                                지금 계산하기 <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Interactive Cards */}
                    <div className="relative h-[500px] flex items-center justify-center">
                        {FEATURES.map((feature, idx) => {
                            const start = idx / FEATURES.length;
                            const end = (idx + 1) / FEATURES.length;

                            // Card Animation
                            const opacity = useTransform(scrollYProgress,
                                [start - 0.05, start + 0.1, end - 0.1, end + 0.05],
                                [0, 1, 1, 0]
                            );
                            const scale = useTransform(scrollYProgress,
                                [start, start + 0.1, end - 0.1, end],
                                [0.9, 1, 1, 1.1]
                            );
                            const rotateZ = useTransform(scrollYProgress,
                                [start, end],
                                [idx % 2 === 0 ? -2 : 2, idx % 2 === 0 ? 2 : -2]
                            );

                            return (
                                <motion.div
                                    key={feature.id}
                                    className="absolute w-full max-w-[400px] h-[480px] bg-white rounded-[40px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.12)] border border-gray-100 p-10 flex flex-col justify-between overflow-hidden"
                                    style={{
                                        opacity,
                                        scale,
                                        rotateZ,
                                        zIndex: FEATURES.length - idx
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                                            {feature.icon}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Status</div>
                                            <div className="px-3 py-1 rounded-full bg-gray-900 text-white text-[10px] font-bold">LIVE DATA</div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex items-center justify-center">
                                        {feature.visual}
                                    </div>

                                    <div className="pt-8 border-t border-gray-50">
                                        <div className="text-sm font-bold text-gray-400 mb-1">{feature.data.label}</div>
                                        <div className="flex items-baseline gap-2">
                                            <div className="text-3xl font-black text-gray-900">{feature.data.value}</div>
                                        </div>
                                        <div className="text-[11px] text-gray-400 mt-2 font-medium">{feature.data.detail}</div>
                                    </div>

                                    {/* Decorative background circle */}
                                    <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-[0.03]" style={{ background: feature.color }}></div>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}
