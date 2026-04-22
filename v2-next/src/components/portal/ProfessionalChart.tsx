"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
    createChart,
    ColorType,
    CandlestickSeries,
    AreaSeries,
    HistogramSeries,
    CrosshairMode,
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
    initialType = 'Candlestick',
    height = 300,
    currentRange = '1y',
    onRangeChange
}: ProfessionalChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);
    const [chartType, setChartType] = useState<'Candlestick' | 'Area'>(initialType);
    const [hasData, setHasData] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [hasInteractedWithZoom, setHasInteractedWithZoom] = useState(false);

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
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: {
                    width: 1,
                    color: '#B0B8C1',
                    style: 3,
                    labelBackgroundColor: '#191F28',
                },
                horzLine: {
                    width: 1,
                    color: '#B0B8C1',
                    style: 3,
                    labelBackgroundColor: '#191F28',
                }
            },
            localization: {
                timeFormatter: (time: any) => {
                    const d = new Date((time as number) * 1000);
                    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
                }
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
                upColor: '#FF0000',
                downColor: '#0055FF',
                borderUpColor: '#FF0000',
                borderDownColor: '#0055FF',
                wickUpColor: '#FF0000',
                wickDownColor: '#0055FF',
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
            // Coinness logic: Show fewer bars by default to make candles thicker/clearer
            // Defaulting to the last 80 bars
            chart.timeScale().setVisibleLogicalRange({
                from: pointsSet - 80,
                to: pointsSet + 5, // Small buffer at the right
            });
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
        <div style={{ position: 'relative', paddingTop: '0' }}>


            {/* Period buttons (Coinness style plain text) */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '16px'
            }}>
                {['1m', '5m', '15m', '1h', '4h', '1d'].map((range, index) => {
                    const label = ['1분', '5분', '15분', '1시간', '4시간', '날 ▼'][index];
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
                className="professional-chart-inner"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    width: '100%',
                    height: `${height}px`,
                    position: 'relative',
                    background: '#ffffff',
                }}
            />

            {/* Zoom Controls (Visible only on hover) */}
            <div style={{
                position: 'absolute',
                bottom: '36px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                zIndex: 30,
                opacity: isHovered ? 1 : 0,
                visibility: isHovered ? 'visible' : 'hidden',
                transition: 'opacity 0.2s, visibility 0.2s',
                pointerEvents: isHovered ? 'all' : 'none'
            }}>
                {[
                    {
                        label: '−', onClick: () => {
                            const ts = chartRef.current?.timeScale();
                            const r = ts?.getVisibleLogicalRange();
                            if (r) ts.setVisibleLogicalRange({ from: r.from - (r.to - r.from) * 0.2, to: r.to + (r.to - r.from) * 0.2 });
                            setHasInteractedWithZoom(true);
                        }
                    },
                    {
                        label: '+', onClick: () => {
                            const ts = chartRef.current?.timeScale();
                            const r = ts?.getVisibleLogicalRange();
                            if (r) ts.setVisibleLogicalRange({ from: r.from + (r.to - r.from) * 0.2, to: r.to - (r.to - r.from) * 0.2 });
                            setHasInteractedWithZoom(true);
                        }
                    },
                    {
                        label: '↻',
                        visible: hasInteractedWithZoom,
                        onClick: () => {
                            const dataCount = data.length;
                            chartRef.current?.timeScale().setVisibleLogicalRange({
                                from: dataCount - 80,
                                to: dataCount + 5
                            });
                            setHasInteractedWithZoom(false);
                        }
                    }
                ].filter(btn => btn.visible !== false).map((btn, i) => (
                    <button
                        key={i}
                        onClick={btn.onClick}
                        style={{
                            width: '32px', height: '32px',
                            background: 'white',
                            border: '1px solid #E5E8EB',
                            borderRadius: '6px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '16px', fontWeight: 'bold', color: '#191F28'
                        }}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>

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
