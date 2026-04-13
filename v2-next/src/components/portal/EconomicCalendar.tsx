"use client";

import React from 'react';

interface EconomicEvent {
    id: string;
    time: string;
    country: string;
    flag: string;
    event: string;
    importance: 1 | 2 | 3;
    actual?: string;
    forecast?: string;
    previous?: string;
}

const MOCK_EVENTS: EconomicEvent[] = [
    { id: '1', time: '21:30', country: 'USD', flag: '🇺🇸', event: '소비자물가지수 (CPI) (YoY)', importance: 3, forecast: '3.1%', previous: '3.2%' },
    { id: '2', time: '21:30', country: 'USD', flag: '🇺🇸', event: '근원 소비자물가지수 (MoM)', importance: 3, forecast: '0.3%', previous: '0.4%' },
    { id: '3', time: '16:00', country: 'EUR', flag: '🇪🇺', event: '독일 ZEW 경기전망지수', importance: 2, forecast: '35.0', previous: '31.7' },
    { id: '4', time: '08:50', country: 'JPY', flag: '🇯🇵', event: '기계수주 (MoM)', importance: 1, actual: '2.1%', forecast: '0.8%', previous: '-1.2%' },
    { id: '5', time: '10:00', country: 'KRW', flag: '🇰🇷', event: '수출입물가지수', importance: 2, actual: '1.2%', forecast: '0.5%', previous: '0.8%' },
];

export default function EconomicCalendar() {
    return (
        <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid #F2F4F7',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#191F28', margin: 0 }}>경제 캘린더</h3>
                <span style={{ fontSize: '12px', color: '#0055FB', fontWeight: 700 }}>전체보기 →</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 40px 1fr 60px',
                    padding: '8px 4px',
                    fontSize: '11px',
                    color: '#8B95A1',
                    fontWeight: 700,
                    borderBottom: '1px solid #F2F4F7'
                }}>
                    <span>시간</span>
                    <span>국가</span>
                    <span>경제 지표</span>
                    <span style={{ textAlign: 'right' }}>중요도</span>
                </div>

                {MOCK_EVENTS.map((event) => (
                    <div key={event.id} style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 40px 1fr 60px',
                        padding: '12px 4px',
                        fontSize: '13px',
                        alignItems: 'center',
                        borderBottom: '1px solid #F9FAFB'
                    }}>
                        <span style={{ color: '#4E5968', fontWeight: 500 }}>{event.time}</span>
                        <span>{event.flag}</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, color: '#191F28', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {event.event}
                            </span>
                            <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: '#B0B8C1', marginTop: '2px' }}>
                                {event.actual && <span>실제: <b style={{ color: '#191F28' }}>{event.actual}</b></span>}
                                {event.forecast && <span>예측: {event.forecast}</span>}
                                {event.previous && <span>이전: {event.previous}</span>}
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2px' }}>
                            {[1, 2, 3].map(i => (
                                <span key={i} style={{
                                    color: i <= event.importance ? '#FFB800' : '#E5E8EB',
                                    fontSize: '12px'
                                }}>
                                    ●
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
