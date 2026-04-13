"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
    createChart,
    ColorType,
    CandlestickSeries,
    AreaSeries,
} from 'lightweight-charts';

interface ProfessionalChartProps {
    data: any[];
    isPositive: boolean;
    initialType?: 'Candlestick' | 'Area';
    height?: number;
}

export default function ProfessionalChart({
    data,
    isPositive,
    initialType = 'Area',
    height = 300
}: ProfessionalChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);
    const [chartType, setChartType] = useState<'Candlestick' | 'Area'>(initialType);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Cleanup previous instance
        if (chartRef.current) {
            try { chartRef.current.remove(); } catch { }
            chartRef.current = null;
        }

        if (!Array.isArray(data) || data.length === 0) {
            setHasData(false);
            return;
        }

        // ---- Create chart ----
        const chart = createChart(container, {
            layout: {
                background: { type: ColorType.Solid, color: '#ffffff' },
                textColor: '#4E5968',
                fontSize: 12,
            },
            grid: {
                vertLines: { color: '#F2F4F7' },
                horzLines: { color: '#F2F4F7' },
            },
            width: container.clientWidth,
            height: height,
            timeScale: {
                borderVisible: false,
                timeVisible: true,
                secondsVisible: false,
                rightOffset: 5,
            },
            rightPriceScale: {
                borderVisible: false,
                alignLabels: true,
            },
        });

        chartRef.current = chart;

        // ---- Add series using v5 API ----
        let pointsSet = 0;

        if (chartType === 'Candlestick') {
            const series = chart.addSeries(CandlestickSeries, {
                upColor: '#F04251',
                downColor: '#0064FF',
                borderUpColor: '#F04251',
                borderDownColor: '#0064FF',
                wickUpColor: '#F04251',
                wickDownColor: '#0064FF',
            });

            const validData = data
                .filter(d => d && d.time && d.open != null && d.high != null && d.low != null && d.close != null
                    && !isNaN(Number(d.open)) && !isNaN(Number(d.high)) && !isNaN(Number(d.low)) && !isNaN(Number(d.close)))
                .map(d => ({
                    time: d.time as any,
                    open: Number(d.open),
                    high: Number(d.high),
                    low: Number(d.low),
                    close: Number(d.close),
                }))
                .sort((a, b) => (a.time as number) - (b.time as number));

            if (validData.length > 0) {
                series.setData(validData);
                pointsSet = validData.length;
            }
        } else {
            const series = chart.addSeries(AreaSeries, {
                lineColor: isPositive ? '#F04251' : '#0064FF',
                topColor: isPositive ? 'rgba(240, 66, 81, 0.15)' : 'rgba(0, 100, 255, 0.15)',
                bottomColor: 'rgba(255,255,255,0)',
                lineWidth: 2,
            });

            const validData = data
                .filter(d => d && d.time && d.close != null && !isNaN(Number(d.close)))
                .map(d => ({
                    time: d.time as any,
                    value: Number(d.close),
                }))
                .sort((a, b) => (a.time as number) - (b.time as number));

            if (validData.length > 0) {
                series.setData(validData);
                pointsSet = validData.length;
            }
        }

        if (pointsSet > 0) {
            chart.timeScale().fitContent();
            setHasData(true);
        } else {
            setHasData(false);
        }

        // ---- Resize handler ----
        const handleResize = () => {
            if (container && chartRef.current) {
                chartRef.current.applyOptions({ width: container.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            try { chart.remove(); } catch { }
            chartRef.current = null;
        };
    }, [data, isPositive, chartType, height]);

    return (
        <div style={{ position: 'relative', paddingTop: '44px' }}>
            {/* Toggle buttons */}
            <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                display: 'flex',
                gap: '6px',
                zIndex: 10
            }}>
                {(['Area', 'Candlestick'] as const).map(type => (
                    <button
                        key={type}
                        onClick={() => setChartType(type)}
                        style={{
                            padding: '5px 12px',
                            fontSize: '12px',
                            borderRadius: '8px',
                            border: '1px solid #E5E8EB',
                            background: chartType === type ? '#0055FB' : 'white',
                            color: chartType === type ? 'white' : '#8B95A1',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        {type === 'Area' ? 'Line' : 'Candle'}
                    </button>
                ))}
            </div>

            {/* Chart container — plain block element, no flex/grid */}
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: `${height}px`,
                    position: 'relative',
                    background: '#ffffff',
                }}
            />

            {/* Cover TradingView watermark */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '80px',
                height: '28px',
                background: '#ffffff',
                zIndex: 10,
                pointerEvents: 'auto',
            }} />

            {/* No-data overlay */}
            {!hasData && (
                <div style={{
                    position: 'absolute',
                    top: '44px',
                    left: 0,
                    right: 0,
                    height: `${height}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#B0B8C1',
                    fontSize: '13px',
                    fontWeight: 500,
                    pointerEvents: 'none',
                }}>
                    차트 데이터를 불러오는 중...
                </div>
            )}
        </div>
    );
}
