import { NextResponse } from 'next/server';

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;

// Strip HTML and normalize for comparison
function cleanTitleForDedup(title: string) {
    return title
        .replace(/<[^>]*>/g, '') // Remove HTML
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // Remove punctuation
        .replace(/\s/g, "") // Remove whitespace
        .trim();
}

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

function timeAgo(dateStr: string) {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.max(0, Math.round(diffMs / 60000));
    if (diffMins < 60) return `${diffMins}분 전`;
    const diffHrs = Math.round(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}시간 전`;
    return `${Math.round(diffHrs / 24)}일 전`;
}

function classifyCategory(title: string): { catName: string; color: string } {
    if (title.includes('주식') || title.includes('증시') || title.includes('코스피') || title.includes('코스닥') || title.includes('나스닥') || title.includes('S&P')) {
        return { catName: '증시', color: '#FF4D4D' };
    }
    if (title.includes('부동산') || title.includes('주택') || title.includes('청약') || title.includes('아파트') || title.includes('전세')) {
        return { catName: '부동산', color: '#00D166' };
    }
    if (title.includes('금리') || title.includes('환율') || title.includes('대출') || title.includes('한국은행') || title.includes('달러') || title.includes('기준금리')) {
        return { catName: '금리', color: '#0064FF' };
    }
    return { catName: '재테크', color: '#9B51E0' };
}

// Fetch OG image from article URL with 1.5s timeout
async function fetchOgImage(url: string): Promise<string | null> {
    if (!url) return null;
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1500);
        const res = await fetch(url, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' }
        });
        clearTimeout(timeout);
        if (!res.ok) return null;
        const html = await res.text();
        const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
            || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
            || html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
        return ogMatch ? ogMatch[1] : null;
    } catch {
        return null;
    }
}

export async function GET() {
    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
        return NextResponse.json({
            error: 'API Keys Missing',
            details: 'Please set NAVER_CLIENT_ID and NAVER_CLIENT_SECRET in Vercel settings and redeploy.'
        }, { status: 500 });
    }

    try {
        const queries = ['금융 경제', '주식 증시', '부동산 금리', '재테크'];
        const allItems: any[] = [];

        await Promise.all(queries.map(async (q) => {
            const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(q)}&display=20&start=1&sort=date`;
            try {
                const res = await fetch(url, {
                    headers: {
                        'X-Naver-Client-Id': NAVER_CLIENT_ID,
                        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
                    },
                    next: { revalidate: 300 }
                });
                if (!res.ok) return;
                const data = await res.json();
                allItems.push(...(data.items || []));
            } catch (err) {
                console.error(`Fetch failed for query ${q}:`, err);
            }
        }));

        // Deduplicate using normalized title
        const seen = new Set<string>();
        const sorted = allItems
            .filter(item => {
                const key = cleanTitleForDedup(item.title || "");
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
            .slice(0, 20);

        // Fetch OG images for the top 5 articles in parallel
        const top5Items = sorted.slice(0, 5);
        const images = await Promise.all(top5Items.map(item => fetchOgImage(item.originallink || item.link)));

        const newsItems = sorted.map((item, index) => {
            const title = stripHtml(item.title || '');
            const { catName, color } = classifyCategory(title);
            return {
                id: `${index}-${Date.now()}`,
                category: catName,
                categoryColor: color,
                title,
                description: stripHtml(item.description || ''),
                source: new URL(item.originallink || item.link).hostname.replace('www.', ''),
                timeAgo: timeAgo(item.pubDate),
                link: item.originallink || item.link,
                imageUrl: index < 5 ? images[index] : null,
            };
        });

        return NextResponse.json(newsItems);
    } catch (error) {
        console.error('Error fetching Naver news:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
