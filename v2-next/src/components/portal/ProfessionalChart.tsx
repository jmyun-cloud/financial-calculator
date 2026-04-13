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
    const [chartType, setChartType] = useState<'Candlestick' | 'Area'>(initialType);

    const [containerSize, setContainerSize] = useState({ width: 0, height: 300 });

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0].contentRect.width > 0) {
                setContainerSize({
                    width: entries[0].contentRect.width,
                    height: entries[0].contentRect.height || 300
                });
            }
        });

        resizeObserver.observe(chartContainerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (!chartContainerRef.current || containerSize.width <= 0) return;

        let chart: any;

        try {
            chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: '#ffffff' },
                    textColor: '#4E5968',
                    fontSize: 12,
                },
                grid: {
                    vertLines: { color: '#F2F4F7' },
                    horzLines: { color: '#F2F4F7' },
                },
                width: containerSize.width,
                height: containerSize.height,
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
                handleScroll: { mouseWheel: true, pressedMouseMove: true },
                handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
            });

            let validDataCount = 0;

            if (chartType === 'Candlestick') {
                const candleSeries = chart.addCandlestickSeries({
                    upColor: '#F04251',
                    downColor: '#0064FF',
                    borderUpColor: '#F04251',
                    borderDownColor: '#0064FF',
                    wickUpColor: '#F04251',
                    wickDownColor: '#0064FF',
                });

                const validData = data
                    .filter(d => d.time && !isNaN(Number(d.open)) && !isNaN(Number(d.high)) && !isNaN(Number(d.low)) && !isNaN(Number(d.close)))
                    .map(d => ({
                        time: d.time,
                        open: Number(d.open),
                        high: Number(d.high),
                        low: Number(d.low),
                        close: Number(d.close),
                    }))
                    .sort((a, b) => (typeof a.time === 'number' && typeof b.time === 'number' ? a.time - b.time : 0));

                if (validData.length > 0) {
                    candleSeries.setData(validData);
                    validDataCount = validData.length;
                }
            } else {
                const areaSeries = chart.addAreaSeries({
                    lineColor: isPositive ? '#F04251' : '#0064FF',
                    topColor: isPositive ? 'rgba(240, 66, 81, 0.2)' : 'rgba(0, 100, 255, 0.2)',
                    bottomColor: isPositive ? 'rgba(240, 66, 81, 0.0)' : 'rgba(0, 100, 255, 0.0)',
                    lineWidth: 2,
                });

                const validData = data
                    .filter(d => d.time && !isNaN(Number(d.close)))
                    .map(d => ({
                        time: d.time,
                        value: Number(d.close),
                    }))
                    .sort((a, b) => (typeof a.time === 'number' && typeof b.time === 'number' ? a.time - b.time : 0));

                if (validData.length > 0) {
                    areaSeries.setData(validData);
                    validDataCount = validData.length;
                }
            }

            if (validDataCount > 0) {
                chart.timeScale().fitContent();
            }

            chartRef.current = chart;

            return () => {
                chart.remove();
                chartRef.current = null;
            };
        } catch (error) {
            console.error('Lightweight Charts Initialization Error:', error);
            return () => { };
        }
    }, [data, isPositive, chartType, containerSize]);

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
                        border: '1px solid #F2F4F7',
                        background: chartType === 'Area' ? '#0055FB' : 'white',
                        color: chartType === 'Area' ? 'white' : '#8B95A1',
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
                        border: '1px solid #F2F4F7',
                        background: chartType === 'Candlestick' ? '#0055FB' : 'white',
                        color: chartType === 'Candlestick' ? 'white' : '#8B95A1',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    Candle
                </button>
            </div>
            <div
                ref={chartContainerRef}
                style={{
                    width: '100%',
                    height: '300px',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {(!data || data.length === 0) && (
                    <div style={{ color: '#B0B8C1', fontSize: '13px' }}>차트 데이터가 없습니다</div>
                )}
            </div>
        </div>
    );
}
