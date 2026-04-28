"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, ChevronRight, TrendingUp, Wallet, Landmark, ArrowUpRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default function PremiumHero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-white">
            {/* Background Gradient & Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_#f0f7ff_0%,_transparent_50%)] op-50" />
                <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-40 animate-pulse" />
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] opacity-30" />
            </div>

            <div className="container relative z-10 mx-auto px-6 flex flex-col items-center text-center">

                {/* Brand Label */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black tracking-widest uppercase mb-8"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                    Professional Intelligence
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-[-0.05em] mb-8"
                >
                    당신의 금융 데이터를<br />
                    <span className="text-blue-600">가장 정확하고 아름답게.</span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl lg:text-2xl text-gray-500 font-bold max-w-3xl mx-auto mb-12 leading-relaxed tracking-tight"
                >
                    연봉 계산부터 대출 한도 조회, 노후 연금 설계까지.<br />
                    복잡한 금융 수식을 richcalc의 직관적인 대시보드로 한눈에 확인하세요.
                </motion.p>

                {/* Main CTA / Input UI */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center justify-center gap-6 mb-20"
                >
                    <div className="relative group w-full max-w-[440px]">
                        <input
                            type="text"
                            placeholder="연봉 6,000만원 실수령액은?"
                            className="w-full px-8 py-5 bg-white rounded-[24px] border-2 border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] focus:border-blue-500 focus:outline-none text-lg font-bold transition-all placeholder:text-gray-300"
                        />
                        <button className="absolute right-3 top-3 bottom-3 px-6 bg-gray-900 rounded-[18px] text-white font-black text-sm hover:bg-black transition-colors">
                            검색
                        </button>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/calculators" className="flex items-center gap-2 text-gray-400 font-bold text-sm group hover:text-gray-900 transition-colors">
                            모든 계산기 보기 <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                        <Link href="/guide" className="text-gray-400 font-bold text-sm hover:text-gray-900 transition-colors">
                            금융 가이드 읽기
                        </Link>
                    </div>
                </motion.div>

                {/* THE DASHBOARD PREVIEW CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="relative w-full max-w-5xl mx-auto"
                >
                    <div className="bg-white rounded-[56px] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden text-left">
                        {/* Windows UI Header */}
                        <div className="h-16 border-b border-gray-50 px-10 flex items-center justify-between bg-gray-50/20">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-200" />
                                <div className="w-3 h-3 rounded-full bg-yellow-200" />
                                <div className="w-3 h-3 rounded-full bg-green-200" />
                            </div>
                            <div className="text-[10px] font-black text-gray-300 tracking-[0.2em] uppercase">richcalc system / overview</div>
                            <div className="w-10"></div>
                        </div>

                        {/* Card Content Grid */}
                        <div className="p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10">

                            {/* Main Analysis (Left) */}
                            <div className="lg:col-span-7 flex flex-col gap-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Detailed Analysis</h3>
                                        <div className="text-4xl font-black text-gray-900 leading-tight">₩4,152,430</div>
                                        <div className="text-sm font-bold text-gray-500 mt-1">예상 월 실수령액 (연봉 6,000만원 기준)</div>
                                    </div>
                                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Activity size={32} />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between text-xs font-black text-gray-400">
                                            <span>실수령액</span>
                                            <span className="text-blue-600">83.4%</span>
                                        </div>
                                        <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{ width: '83.4%' }}></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between text-xs font-black text-gray-400">
                                            <span>공제 총액 (4대보험 + 세금)</span>
                                            <span className="text-red-400">16.6%</span>
                                        </div>
                                        <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-400" style={{ width: '16.6%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mt-4">
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 italic font-medium text-gray-500 text-sm">
                                        "귀하의 소득 수준은 동종 업계 상위 12%에 해당하며, 내년도 세율 변경분을 반영한 결과입니다."
                                    </div>
                                    <div className="p-6 bg-blue-600 rounded-3xl text-white">
                                        <div className="text-[10px] font-black opacity-60 mb-2 uppercase">Next Step</div>
                                        <div className="text-sm font-bold leading-relaxed mb-4">보험료 절감을 통한 세후 소득 증대 방안을 확인하시겠습니까?</div>
                                        <ArrowUpRight size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Stats (Right) */}
                            <div className="lg:col-span-5 flex flex-col gap-8">
                                <div className="p-8 bg-gray-900 rounded-[40px] text-white">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                            <Landmark size={24} className="text-indigo-400" />
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-indigo-500 text-[10px] font-black uppercase">Active</div>
                                    </div>
                                    <div className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">DSR Capacity</div>
                                    <div className="text-3xl font-black mb-1 tracking-tighter">4.2억원 한도</div>
                                    <div className="text-[11px] font-bold text-white/40 italic">연 4.5% 원리금 균등상환 기준</div>
                                </div>

                                <div className="p-8 bg-indigo-50 rounded-[40px] border border-indigo-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <TrendingUp className="text-indigo-600" size={24} />
                                        <span className="text-xs font-black text-indigo-900 uppercase tracking-widest">Growth Plan</span>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-gray-500">65세 예상 자산</span>
                                            <span className="text-lg font-black text-indigo-900">₩28.5억+</span>
                                        </div>
                                        <div className="h-1px bg-indigo-200"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-gray-500">월 고정 저축액</span>
                                            <span className="text-lg font-black text-indigo-900">₩195만원</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-[100px] opacity-20" />
                    <div className="absolute -z-10 -top-10 -left-10 w-64 h-64 bg-emerald-500 rounded-full blur-[120px] opacity-20" />
                </motion.div>

            </div>
        </section>
    );
}

function StatItem({ icon, label, val }: { icon: React.ReactNode, label: string, val: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                {icon}
            </div>
            <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</div>
                <div className="text-sm font-black text-gray-900 leading-none">{val}</div>
            </div>
        </div>
    );
}
