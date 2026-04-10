"use client";

import React from 'react';
import { useMarketData } from '@/hooks/useMarketData';

// Investing.com-style sidebar: unique data NOT shown in main tabs
// Sections: 주요 지수 | 환율 | 원자재 | 암호화폐
const WIDGET_SECTIONS = [
    {
        id: "indices",
        title: "주요 지수",
        icon: "📊",
        symbols: ["^GSPC", "^IXIC", "^DJI", "^N225", "^HSI"],
        names: { "^GSPC": "S&P 500", "^IXIC": "나스닥", "^DJI": "다우존스", "^N225": "닛케이", "^HSI": "항셍" }
    },
    {
        id: "fx",
        title: "환율",
        icon: "💱",
        symbols: ["KRW=X", "JPYKRW=X", "EURKRW=X", "CNYKRW=X"],
        names: { "KRW=X": "달러/원", "JPYKRW=X": "엔/원", "EURKRW=X": "유로/원", "CNYKRW=X": "위안/원" }
    },
    {
        id: "commodity",
        title: "원자재",
        icon: "🛢️",
        symbols: ["GC=F", "SI=F", "CL=F", "HG=F"],
        names: { "GC=F": "금", "SI=F": "은", "CL=F": "WTI유", "HG=F": "구리" }
    },
    {
        id: "crypto",
        title: "암호화폐",
        icon: "₿",
        symbols: ["BTC-USD", "ETH-USD", "XRP-USD"],
        names: { "BTC-USD": "비트코인", "ETH-USD": "이더리움", "XRP-USD": "리플" }
    }
];

export default function MarketWidget() {
    const { data: indicators, loading } = useMarketData();

    if (loading && indicators.length === 0) {
        return (
            <div style={{
                background: 'var(--surface)', borderRadius: '20px',
                border: '1px solid var(--border)', height: '480px',
                animation: 'pulse 1.5s infinite'
            }} />
        );
    }

    return (
        <div style={{
            background: 'var(--surface)',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            {WIDGET_SECTIONS.map((section, sIdx) => {
                const items = section.symbols
                    .map(sym => indicators.find(d => d.symbol === sym))
                    .filter(Boolean) as typeof indicators;

                if (items.length === 0) return null;

                return (
                    <div key={section.id}>
                        {/* Section Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '12px 16px 8px',
                            borderBottom: '1px solid var(--border)',
                            background: sIdx === 0 ? 'transparent' : 'transparent',
                            marginTop: sIdx > 0 ? '4px' : '0'
                        }}>
                            <span style={{ fontSize: '13px' }}>{section.icon}</span>
                            <span style={{
                                fontSize: '12px',
                                fontWeight: 700,
                                color: 'var(--text-secondary)',
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase'
                            }}>
                                {section.title}
                            </span>
                        </div>

                        {/* Rows – Investing.com style */}
                        {items.map((item, idx) => {
                            const name = section.names[item.symbol] || item.symbol;
                            const isPositive = item.isPositive;
                            const changeColor = isPositive ? '#e84545' : '#1f64e7';

                            return (
                                <div
                                    key={item.symbol}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr auto auto',
                                        alignItems: 'center',
                                        padding: '9px 16px',
                                        borderBottom: idx < items.length - 1 ? '1px solid var(--border)' : 'none',
                                        gap: '8px',
                                        cursor: 'default',
                                        transition: 'background 0.15s'
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    {/* Name */}
                                    <span style={{
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: 'var(--text-primary)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {name}
                                    </span>

                                    {/* Price */}
                                    <span style={{
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        color: 'var(--text-primary)',
                                        fontVariantNumeric: 'tabular-nums',
                                        textAlign: 'right'
                                    }}>
                                        {item.price}
                                    </span>

                                    {/* Change % badge */}
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: 'white',
                                        background: changeColor,
                                        borderRadius: '5px',
                                        padding: '2px 6px',
                                        fontVariantNumeric: 'tabular-nums',
                                        whiteSpace: 'nowrap',
                                        minWidth: '54px',
                                        textAlign: 'center'
                                    }}>
                                        {isPositive ? '+' : ''}{item.changePercent}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                );
            })}

            <style jsx>{`
                @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
            `}</style>
        </div>
    );
}
