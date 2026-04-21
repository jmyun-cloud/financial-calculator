"use client";

import React, { useMemo } from 'react';
import { useMarketData } from '@/hooks/useMarketData';

const WIDGET_SECTIONS = [
    {
        id: "indices",
        title: "주요 지수",
        icon: "📊",
        symbols: ["^GSPC", "^IXIC", "^DJI", "^N225", "^HSI"],
        names: { "^GSPC": "S&P 500", "^IXIC": "나스닥", "^DJI": "다우존스", "^N225": "닛케이", "^HSI": "항셍" } as Record<string, string>
    },
    {
        id: "fx",
        title: "환율",
        icon: "💱",
        symbols: ["KRW=X", "JPYKRW=X", "EURKRW=X", "CNYKRW=X"],
        names: { "KRW=X": "달러/원", "JPYKRW=X": "엔/원", "EURKRW=X": "유로/원", "CNYKRW=X": "위안/원" } as Record<string, string>
    },
    {
        id: "commodity",
        title: "원자재",
        icon: "🛢️",
        symbols: ["GC=F", "SI=F", "CL=F", "HG=F"],
        names: { "GC=F": "금", "SI=F": "은", "CL=F": "WTI유", "HG=F": "구리" } as Record<string, string>
    },
    {
        id: "crypto",
        title: "암호화폐",
        icon: "₿",
        symbols: ["BTC-USD", "ETH-USD", "XRP-USD"],
        names: { "BTC-USD": "BTC", "ETH-USD": "ETH", "XRP-USD": "USDT" } as Record<string, string> // 코인니스 스타일 이름
    }
];

export default function MarketWidget() {
    const { data: indicators, loading } = useMarketData();

    const flattenedItems = useMemo(() => {
        const items: any[] = [];
        WIDGET_SECTIONS.forEach(section => {
            section.symbols.forEach(sym => {
                const found = indicators.find(d => d.symbol === sym);
                if (found) {
                    items.push({
                        ...found,
                        displayName: section.names[sym] || sym,
                        icon: section.icon
                    });
                }
            });
        });
        return items;
    }, [indicators]);

    if (loading && indicators.length === 0) {
        return (
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E8EB', height: '400px', animation: 'pulse 1.5s infinite' }} />
        );
    }

    return (
        <div id="market" className="coinness-market-widget" style={{ width: '100%', background: 'white', borderRadius: '12px', border: '1px solid #E5E8EB', overflow: 'hidden' }}>
            <div style={{ padding: '20px 20px 12px' }}>
                {/* Tabs -> Coinness style */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <button style={{ border: 'none', background: 'transparent', fontSize: '15px', fontWeight: 800, color: '#191F28', cursor: 'pointer', padding: 0 }}>인기 코인</button>
                    <button style={{ border: 'none', background: 'transparent', fontSize: '15px', fontWeight: 700, color: '#8B95A1', cursor: 'pointer', padding: 0 }}>해외 지수</button>
                    <button style={{ border: 'none', background: 'transparent', fontSize: '15px', fontWeight: 700, color: '#8B95A1', cursor: 'pointer', padding: 0 }}>원자재</button>
                </div>

                {/* Table Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '32px minmax(0, 1.2fr) minmax(0, 1fr) 80px', gap: '8px', fontSize: '12px', color: '#868E96', fontWeight: 600, paddingBottom: '8px', borderBottom: '1px solid #F1F3F5', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>🔥</div>
                    <div>페어명</div>
                    <div style={{ textAlign: 'center' }}>현재가</div>
                    <div style={{ textAlign: 'right' }}>24H 변동</div>
                </div>

                {/* Table Rows */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {flattenedItems.slice(0, 8).map((item, idx) => {
                        const isPositive = item.isPositive;
                        const changeColor = isPositive ? '#F04438' : '#2F80ED'; // 코인니스 Red/Blue

                        return (
                            <div key={item.symbol} style={{ display: 'grid', gridTemplateColumns: '24px minmax(0, 1.2fr) minmax(0, 1fr) 80px', gap: '8px', padding: '14px 0', borderBottom: '1px solid #F8F9FA', alignItems: 'center' }}>
                                <div style={{ fontSize: '13px', fontWeight: 800, color: '#191F28', textAlign: 'center' }}>
                                    {idx + 1}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                                    <div style={{ width: '18px', height: '18px', background: '#F2F4F7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                        {item.icon}
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#212529', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.displayName}
                                    </span>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: 600, color: changeColor, whiteSpace: 'nowrap' }}>
                                    {item.price}
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: 700, color: changeColor }}>
                                    {item.changePercent}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <button style={{ width: '100%', padding: '14px', background: 'white', border: 'none', borderTop: '1px solid #F1F3F5', fontSize: '13px', fontWeight: 700, color: '#868E96', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                더보기 <span style={{ fontSize: '10px' }}>›</span>
            </button>
        </div>
    );
}
