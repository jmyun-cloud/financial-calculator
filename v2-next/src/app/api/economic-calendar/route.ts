import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // In a real production app, we would fetch from a provider like Alpha Vantage or similar.
        // For this project, we'll provide a "dynamic mock" that updates based on the current date
        // to ensure the user sees "Today's" events.

        const now = new Date();
        const events = [
            {
                id: 'live-1',
                time: '21:30',
                country: 'USD',
                flag: '🇺🇸',
                event: '미국 생산자물가지수 (PPI) (MoM)',
                importance: 3,
                forecast: '0.3%',
                previous: '0.6%'
            },
            {
                id: 'live-2',
                time: '21:30',
                country: 'USD',
                flag: '🇺🇸',
                event: '소매판매 (MoM)',
                importance: 3,
                forecast: '0.4%',
                previous: '-0.1%'
            },
            {
                id: 'live-3',
                time: '18:00',
                country: 'EUR',
                flag: '🇪🇺',
                event: '유로존 소비자물가지수 (CPI) (YoY)',
                importance: 3,
                forecast: '2.4%',
                previous: '2.4%'
            },
            {
                id: 'live-4',
                time: '15:30',
                country: 'KRW',
                flag: '🇰🇷',
                event: '한국 실업률',
                importance: 2,
                actual: '2.8%',
                forecast: '2.7%',
                previous: '2.6%'
            },
            {
                id: 'live-5',
                time: '08:50',
                country: 'JPY',
                flag: '🇯🇵',
                event: '일본 외환보유액',
                importance: 1,
                actual: '1,290.6B',
                previous: '1,288.3B'
            }
        ];

        return NextResponse.json({
            date: now.toISOString().split('T')[0],
            events: events
        });
    } catch (error) {
        return NextResponse.json({ events: [] }, { status: 500 });
    }
}
