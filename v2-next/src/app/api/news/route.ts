import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '경제';

    try {
        const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(category + ' (주식 OR 증시 OR 아파트 OR 부동산 OR 금리 OR 환율)')}&hl=ko&gl=KR&ceid=KR:ko`;
        const feed = await parser.parseURL(feedUrl);

        const timeAgo = (dateStr: string) => {
            const diffMs = Date.now() - new Date(dateStr).getTime();
            const diffMins = Math.max(0, Math.round(diffMs / 60000));
            if (diffMins < 60) return `${diffMins}분 전`;
            const diffHrs = Math.round(diffMins / 60);
            if (diffHrs < 24) return `${diffHrs}시간 전`;
            return `${Math.round(diffHrs / 24)}일 전`;
        };

        const newsItems = feed.items.slice(0, 20).map((item, index) => {
            const t = item.title || '';
            let catName = '재테크';
            let color = '#9B51E0'; // Purple

            if (t.includes('주식') || t.includes('증시') || t.includes('코스피') || t.includes('코스닥')) {
                catName = '증시'; color = '#FF4D4D';
            } else if (t.includes('부동산') || t.includes('주택') || t.includes('청약') || t.includes('아파트')) {
                catName = '부동산'; color = '#00D166';
            } else if (t.includes('금리') || t.includes('환율') || t.includes('대출') || t.includes('한국은행') || t.includes('달러')) {
                catName = '금리'; color = '#0064FF';
            }

            // Google News titles end with " - Source"
            const parts = t.split(' - ');
            const source = parts.length > 1 ? parts.pop() : '뉴스';
            const cleanTitle = parts.join(' - ');

            return {
                id: String(Date.now() + index),
                category: catName,
                categoryColor: color,
                title: cleanTitle,
                source: source?.trim(),
                timeAgo: item.pubDate ? timeAgo(item.pubDate) : '방금 전',
                link: item.link
            };
        });

        return NextResponse.json(newsItems);
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
