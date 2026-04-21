"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
    createChart,
    ColorType,
    CandlestickSeries,
    AreaSeries,
    HistogramSeries,
} from 'lightweight-charts';

interface ProfessionalChartProps {
    data: any[];
    isPositive: boolean;
    initialType?: 'Candlestick' | 'Area';
    height?: number;
    currentRange?: string;
    onRangeChange?: (range: string) => void;
}

export default function ProfessionalChart({
    data,
    isPositive,
    initialType = 'Area',
    height = 300,
    currentRange = '1y',
    onRangeChange
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
                tickMarkFormatter: (time: any) => {
                    const date = new Date((time as number) * 1000);
                    const month = date.getMonth() + 1;
                    const day = date.getDate();
                    if (day === 1) {
                        return `${month}월`;
                    }
                    return `${month}/${day}`;
                },
            },
            rightPriceScale: {
                borderVisible: false,
                alignLabels: true,
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.25, // Leave room for volume
                },
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

        // ---- Add Volume Histogram ----
        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#E5E8EB',
            priceFormat: { type: 'volume' },
            priceScaleId: 'volume', // Own scale
        });

        chart.priceScale('volume').applyOptions({
            scaleMargins: {
                top: 0.8, // Push to bottom
                bottom: 0,
            },
        });

        const volumeData = data
            .filter(d => d && d.time && d.volume != null)
            .map(d => {
                // Determine color based on price change
                const isPriceUp = d.close >= d.open;
                return {
                    time: d.time as any,
                    value: Number(d.volume),
                    color: isPriceUp ? 'rgba(240, 66, 81, 0.3)' : 'rgba(0, 100, 255, 0.3)',
                };
            })
            .sort((a, b) => (a.time as number) - (b.time as number));

        if (volumeData.length > 0) {
            volumeSeries.setData(volumeData);
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
                top: '-32px',
                right: '0',
                display: 'flex',
                gap: '12px',
                zIndex: 10
            }}>
                {(['Area', 'Candlestick'] as const).map(type => (
                    <button
                        key={type}
                        onClick={() => setChartType(type)}
                        style={{
                            padding: '4px 8px',
                            fontSize: '13px',
                            background: 'transparent',
                            border: 'none',
                            color: chartType === type ? '#0055FB' : '#8B95A1',
                            cursor: 'pointer',
                            fontWeight: chartType === type ? 700 : 500,
                            letterSpacing: '-0.3px',
                            borderBottom: chartType === type ? '2px solid #0055FB' : '2px solid transparent',
                            transition: 'color 0.2s'
                        }}
                    >
                        {type === 'Area' ? 'Line' : 'Candle'}
                    </button>
                ))}
            </div>

            {/* Period buttons (Coinness style plain text) */}
            <div style={{
                position: 'absolute',
                top: '-32px',
                left: '0',
                display: 'flex',
                gap: '8px',
                zIndex: 10
            }}>
                {['1m', '3m', '6m', '1y'].map((range, index) => {
                    const label = ['1분', '1시간', '4시간', '날'][index]; // 코인니스 스타일 한국어 매핑
                    return (
                        <button
                            key={range}
                            onClick={() => onRangeChange?.(range)}
                            style={{
                                padding: '4px 6px',
                                fontSize: '13px',
                                fontWeight: currentRange === range ? 700 : 500,
                                background: 'transparent',
                                color: currentRange === range ? '#0055FB' : '#4E5968',
                                border: 'none',
                                cursor: 'pointer',
                                letterSpacing: '-0.3px'
                            }}
                        >
                            {label}
                        </button>
                    );
                })}
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

            {/* Cover TradingView watermark - CSS + overlay combined */}
            <style>{`
                .tv-lightweight-charts a,
                .tv-lightweight-charts td a {
                    display: none !important;
                    pointer-events: none !important;
                }
            `}</style>
            <div style={{
                position: 'absolute',
                bottom: '26px',
                left: 0,
                width: '80px',
                height: '24px',
                background: '#ffffff',
                zIndex: 20,
                pointerEvents: 'all',
                cursor: 'default'
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
