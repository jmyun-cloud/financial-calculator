"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface ProfessionalChartProps {
    data: any[];
    isPositive: boolean;
    initialType?: 'Candlestick' | 'Area';
}

export default function ProfessionalChart({
    data,
    isPositive,
    initialType = 'Area'
}: ProfessionalChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);
    const seriesRef = useRef<any>(null);
    const [chartType, setChartType] = useState<'Candlestick' | 'Area'>(initialType);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth
                });
            }
        };

        // Create Chart
        const chart: any = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#8B95A1',
                fontSize: 11,
            },
            grid: {
                vertLines: { color: 'rgba(139, 149, 161, 0.1)' },
                horzLines: { color: 'rgba(139, 149, 161, 0.1)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 240,
            timeScale: {
                borderVisible: false,
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderVisible: false,
                alignLabels: true,
            },
            handleScroll: { mouseWheel: true, pressedMouseMove: true },
            handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
        });

        chartRef.current = chart;

        // Series setup
        const updateSeries = (type: 'Candlestick' | 'Area') => {
            if (seriesRef.current) {
                chart.removeSeries(seriesRef.current);
            }

            if (type === 'Candlestick') {
                const candleSeries = chart.addCandlestickSeries({
                    upColor: '#F04251',
                    downColor: '#0064FF',
                    borderUpColor: '#F04251',
                    borderDownColor: '#0064FF',
                    wickUpColor: '#F04251',
                    wickDownColor: '#0064FF',
                });
                const validData = data
                    .filter(d => d.time && d.open !== null && d.high !== null && d.low !== null && d.close !== null)
                    .map(d => ({
                        time: d.time,
                        open: Number(d.open),
                        high: Number(d.high),
                        low: Number(d.low),
                        close: Number(d.close),
                    }));

                if (validData.length > 0) {
                    candleSeries.setData(validData);
                }
                seriesRef.current = candleSeries;
            } else {
                const areaSeries = chart.addAreaSeries({
                    lineColor: isPositive ? '#F04251' : '#0064FF',
                    topColor: isPositive ? 'rgba(240, 66, 81, 0.2)' : 'rgba(0, 100, 255, 0.2)',
                    bottomColor: isPositive ? 'rgba(240, 66, 81, 0.0)' : 'rgba(0, 100, 255, 0.0)',
                    lineWidth: 2,
                });
                const validData = data
                    .filter(d => d.time && d.close !== null)
                    .map(d => ({
                        time: d.time,
                        value: Number(d.close),
                    }));

                if (validData.length > 0) {
                    areaSeries.setData(validData);
                }
                seriesRef.current = areaSeries;
            }

            chart.timeScale().fitContent();
        };

        updateSeries(chartType);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, isPositive, chartType]);

    return (
        <div style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                display: 'flex',
                gap: '8px',
                zIndex: 10
            }}>
                <button
                    onClick={() => setChartType('Area')}
                    style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: chartType === 'Area' ? 'var(--primary)' : 'white',
                        color: chartType === 'Area' ? 'white' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    Line
                </button>
                <button
                    onClick={() => setChartType('Candlestick')}
                    style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: chartType === 'Candlestick' ? 'var(--primary)' : 'white',
                        color: chartType === 'Candlestick' ? 'white' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    Candle
                </button>
            </div>
            <div ref={chartContainerRef} style={{ width: '100%' }} />
        </div>
    );
}
