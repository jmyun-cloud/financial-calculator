"use client";

import React from 'react';
import { calculateIndicators, TechnicalIndicators } from '@/lib/calculators/technical-analysis';

interface TechnicalSummaryProps {
    data: { close: number }[];
}

export default function TechnicalSummary({ data }: TechnicalSummaryProps) {
    const indicators = calculateIndicators(data);

    const getSignalColor = (signal: TechnicalIndicators['signal']) => {
        switch (signal) {
            case 'Strong Buy': return '#F04251';
            case 'Buy': return '#F04251';
            case 'Strong Sell': return '#0064FF';
            case 'Sell': return '#0064FF';
            default: return '#8B95A1';
        }
    };

    if (!indicators.ma5) return null;

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #F2F4F7',
            marginTop: '16px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#191F28' }}>기술 지표 요약</span>
                <span style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: 'white',
                    background: getSignalColor(indicators.signal),
                    padding: '4px 10px',
                    borderRadius: '8px'
                }}>
                    {indicators.signal}
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {/* MA Section */}
                <div>
                    <div style={{ fontSize: '11px', color: '#8B95A1', fontWeight: 700, marginBottom: '8px' }}>이동평균선</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {[
                            { label: 'MA5', value: indicators.ma5 },
                            { label: 'MA20', value: indicators.ma20 },
                            { label: 'MA60', value: indicators.ma60 },
                            { label: 'MA120', value: indicators.ma120 }
                        ].map((ma, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                <span style={{ color: '#4E5968', fontWeight: 500 }}>{ma.label}</span>
                                <span style={{ fontWeight: 700, color: '#191F28' }}>{ma.value?.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Oscillators Section (RSI) */}
                <div>
                    <div style={{ fontSize: '11px', color: '#8B95A1', fontWeight: 700, marginBottom: '8px' }}>보조 지표</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span style={{ color: '#4E5968', fontWeight: 500 }}>RSI (14)</span>
                            <span style={{ fontWeight: 700, color: indicators.rsi && indicators.rsi > 70 ? '#0064FF' : indicators.rsi && indicators.rsi < 30 ? '#F04251' : '#191F28' }}>
                                {indicators.rsi?.toFixed(1)}
                            </span>
                        </div>
                        <div style={{ marginTop: '4px', height: '4px', background: '#F2F4F7', borderRadius: '2px', position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: `${indicators.rsi}%`,
                                width: '6px',
                                height: '6px',
                                background: '#191F28',
                                borderRadius: '50%',
                                top: '-1px',
                                transform: 'translateX(-50%)'
                            }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#B0B8C1', marginTop: '2px' }}>
                            <span>침체(30)</span>
                            <span>과열(70)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
