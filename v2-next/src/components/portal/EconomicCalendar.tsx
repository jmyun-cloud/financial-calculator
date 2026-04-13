"use client";

import React, { useEffect, useState } from 'react';

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

export default function EconomicCalendar() {
    const [events, setEvents] = useState<EconomicEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/economic-calendar');
                const data = await res.json();
                if (data.events) {
                    setEvents(data.events);
                }
            } catch (error) {
                console.error("Failed to fetch economic calendar", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);
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

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#B0B8C1', fontSize: '13px' }}>
                        캘린더 데이터를 불러오는 중...
                    </div>
                ) : events.map((event) => (
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
