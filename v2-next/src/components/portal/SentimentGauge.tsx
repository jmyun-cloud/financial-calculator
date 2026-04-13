"use client";

import React, { useEffect, useState } from 'react';

export default function SentimentGauge() {
    const [data, setData] = useState({ value: 50, label: "중립" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSentiment = async () => {
            try {
                const res = await fetch('/api/market-sentiment');
                const result = await res.json();
                setData({
                    value: result.value || 50,
                    label: result.label || "중립"
                });
            } catch (error) {
                console.error("Failed to fetch sentiment", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSentiment();
    }, []);

    const { value, label } = data;
    const angle = (value / 100) * 180 - 180; // Map 0-100 to -180 to 0 degrees for a semi-circle

    const getColor = (v: number) => {
        if (v < 25) return '#0064FF'; // Extreme Fear
        if (v < 45) return '#5DA5FF'; // Fear
        if (v < 55) return '#8B95A1'; // Neutral
        if (v < 75) return '#FF9100'; // Greed
        return '#F04251'; // Extreme Greed
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid #F2F4F7',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#191F28', marginBottom: '20px', alignSelf: 'flex-start' }}>시장 심리 (공포/탐욕)</h3>

            <div style={{ position: 'relative', width: '200px', height: '100px', overflow: 'hidden' }}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                    {/* Gauge Track */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#F2F4F7"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />
                    {/* Gradient Track segments could be added here for more visual flair */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 60 40"
                        fill="none"
                        stroke="#0064FF"
                        strokeWidth="12"
                    />
                    <path
                        d="M 140 40 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#F04251"
                        strokeWidth="12"
                    />

                    {/* Needle */}
                    <g transform={`rotate(${angle + 90}, 100, 100)`}>
                        <line x1="100" y1="100" x2="100" y2="30" stroke="#191F28" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="100" cy="100" r="5" fill="#191F28" />
                    </g>
                </svg>

                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    width: '100%',
                    textAlign: 'center',
                }}>
                    <span style={{ fontSize: '24px', fontWeight: 900, color: getColor(value) }}>{value}</span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#4E5968' }}>{label}</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '20px', fontSize: '11px', color: '#B0B8C1', fontWeight: 600 }}>
                <span>극도의 공포</span>
                <span>극도의 탐욕</span>
            </div>
        </div>
    );
}
