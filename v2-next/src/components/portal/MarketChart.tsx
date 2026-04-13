"use client";

import React, { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ChartConfiguration
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

interface ChartDataPoint {
    date: string;
    value: number;
}

interface MarketChartProps {
    data: ChartDataPoint[];
    isPositive: boolean;
}

export default function MarketChart({ data, isPositive }: MarketChartProps) {
    const chartData = {
        labels: data.map(d => new Date(d.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                fill: true,
                label: 'Price',
                data: data.map(d => d.value),
                borderColor: isPositive ? '#F04251' : '#0064FF',
                backgroundColor: isPositive
                    ? 'rgba(240, 66, 81, 0.08)'
                    : 'rgba(0, 100, 255, 0.08)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                tension: 0.3,
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#191F28',
                bodyColor: '#191F28',
                borderColor: '#F2F4F7',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: (context: any) => `${context.parsed.y.toLocaleString()}`
                }
            }
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
                grid: {
                    display: false
                }
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    return (
        <div style={{ width: '100%', height: '100px', marginTop: '12px' }}>
            <Line data={chartData} options={options} />
        </div>
    );
}
