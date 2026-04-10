import { NextResponse } from 'next/server';

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;

// Strip HTML and normalize for comparison
function cleanTitleForDedup(title: string) {
    if (!title) return "";
    return title
        .replace(/<[^>]*>/g, '') // Remove HTML
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\"\'\[\]]/g, "") // Remove punctuation
        .replace(/\s+/g, "") // Remove all whitespace
        .toLowerCase()
        .trim();
}

function stripHtml(html: string) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&apos;/g, "'");
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
    const t = title.toLowerCase();
    // Prioritize specific categories first
    if (t.includes('부동산') || t.includes('주택') || t.includes('청약') || t.includes('아파트') || t.includes('전세') || t.includes('월세') || t.includes('국토부') || t.includes('건설') || t.includes('분양') || t.includes('매매') || t.includes('lh') || t.includes('재건축') || t.includes('재개발') || t.includes('오피스텔')) {
        return { catName: '부동산', color: '#00D166' };
    }
    if (t.includes('주식') || t.includes('증시') || t.includes('코스피') || t.includes('코스닥') || t.includes('나스닥') || t.includes('s&p') || t.includes('종목') || t.includes('상장') || t.includes('개미') || t.includes('상한가') || t.includes('공시')) {
        return { catName: '증시', color: '#FF4D4D' };
    }
    if (t.includes('금리') || t.includes('환율') || t.includes('대출') || t.includes('한국은행') || t.includes('달러') || t.includes('기준금리') || t.includes('채권') || t.includes('fomc') || t.includes('연준')) {
        return { catName: '금리', color: '#0064FF' };
    }
    return { catName: '재테크', color: '#9B51E0' };
}

// Enhanced fetch OG image with fallbacks and more robust headers
async function fetchOgImage(url: string, fallbackUrl?: string): Promise<string | null> {
    if (!url) return null;

    const scrape = async (targetUrl: string): Promise<string | null> => {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2000); // Optimized to 2.0s for speed

            const res = await fetch(targetUrl, {
                signal: controller.signal,
                headers: {
                    // Modern Desktop UA
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
                }
            });
            clearTimeout(timeout);
            if (!res.ok) return null;

            const html = await res.text();

            // Expanded regex for various image meta tags
            const imgMatch =
                html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
                html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
                html.match(/<meta[^>]+name=["']twitter:image:src["'][^>]+content=["']([^"']+)["']/i) ||
                html.match(/<meta[^>]+name=["']thumbnail["'][^>]+content=["']([^"']+)["']/i) ||
                html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i);

            let img = imgMatch ? imgMatch[1] : null;

            // Handle URL normalization
            if (img) {
                if (img.startsWith('//')) {
                    img = 'https:' + img;
                } else if (img.startsWith('/')) {
                    try {
                        const urlObj = new URL(targetUrl);
                        img = `${urlObj.protocol}//${urlObj.host}${img}`;
                    } catch { /* ignore */ }
                }
            }

            // Basic validation
            if (img && (img.includes('pixel.gif') || img.includes('icon') || img.length < 10)) return null;

            return img;
        } catch {
            return null;
        }
    };

    // Try primary link first
    let result = await scrape(url);

    // Fallback to secondary link (Naver news link is often more scrapeable)
    if (!result && fallbackUrl && fallbackUrl !== url) {
        result = await scrape(fallbackUrl);
    }

    return result;
}

export async function GET() {
    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
        return NextResponse.json({
            error: 'API Keys Missing',
            details: 'Please set NAVER_CLIENT_ID and NAVER_CLIENT_SECRET in Vercel settings and redeploy.'
        }, { status: 500 });
    }

    try {
        const queries = ['금융 경제', '주식 증시', '부동산 금리', '재테크 절세'];
        const allItems: any[] = [];

        await Promise.all(queries.map(async (q) => {
            const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(q)}&display=50&start=1&sort=date`;
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

        // Strict Deduplication using normalized title
        const seen = new Set<string>();
        const sorted = allItems
            .filter(item => {
                const key = cleanTitleForDedup(item.title || "");
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
            .slice(0, 30);

        // Fetch OG images for the top 6 articles in parallel to fill the initial view quickly
        const top6Items = sorted.slice(0, 6);
        const images = await Promise.all(top6Items.map(item =>
            fetchOgImage(item.originallink || item.link, item.link)
        ));

        const newsItems = sorted.map((item, index) => {
            const rawTitle = stripHtml(item.title || '');
            const { catName, color } = classifyCategory(rawTitle);
            return {
                id: `${index}-${Date.now()}`,
                category: catName,
                categoryColor: color,
                title: rawTitle,
                description: stripHtml(item.description || ''),
                source: new URL(item.originallink || item.link).hostname.replace('www.', ''),
                timeAgo: timeAgo(item.pubDate),
                link: item.originallink || item.link,
                imageUrl: index < 6 ? images[index] : null,
            };
        });

        return NextResponse.json(newsItems);
    } catch (error) {
        console.error('Error fetching Naver news:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
