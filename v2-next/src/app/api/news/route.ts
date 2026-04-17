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

    // Niche/Specific categories should come FIRST to avoid being swallowed by broad ones
    if (t.includes('비트코인') || t.includes('가상화폐') || t.includes('암호화폐') || t.includes('이더리움') || t.includes('코인') || t.includes('거래소') || t.includes('디지털자산') || t.includes('업비트') || t.includes('빗썸')) {
        return { catName: '가상화폐', color: '#F7931A' };
    }
    if (t.includes('공시') || t.includes('ipo') || t.includes('공모주') || t.includes('상장예비심사') || t.includes('코스닥상장') || t.includes('기업공개')) {
        return { catName: 'IPO/공시', color: '#6366F1' };
    }
    if (t.includes('환율') || t.includes('달러') || t.includes('원달러') || t.includes('엔화') || t.includes('유로') || t.includes('외환') || t.includes('외환시장') || t.includes('엔저')) {
        return { catName: '외환/달러', color: '#10B981' };
    }
    if (t.includes('경제') || t.includes('거시') || t.includes('지표') || t.includes('성장') || t.includes('수출') || t.includes('무역') || t.includes('물가') || t.includes('산업') || t.includes('고용') || t.includes('실업') || t.includes('gdp') || t.includes('통계청') || t.includes('kdi')) {
        return { catName: '경제', color: '#F59E0B' };
    }
    if (t.includes('부동산') || t.includes('주택') || t.includes('청약') || t.includes('아파트') || t.includes('전세') || t.includes('월세') || t.includes('국토부') || t.includes('건설') || t.includes('분양') || t.includes('매매') || t.includes('재건축') || t.includes('재개발') || t.includes('리츠')) {
        return { catName: '부동산', color: '#00D166' };
    }
    if (t.includes('금리') || t.includes('기준금리') || t.includes('한국은행') || t.includes('채권') || t.includes('국채') || t.includes('연준') || t.includes('fomc') || t.includes('대출') || t.includes('금융권') || t.includes('적금') || t.includes('예금')) {
        return { catName: '금리/채권', color: '#0064FF' };
    }
    if (t.includes('주식') || t.includes('증시') || t.includes('코스피') || t.includes('코스닥') || t.includes('나스닥') || t.includes('다우') || t.includes('s&p') || t.includes('종목') || t.includes('상장') || t.includes('개미') || t.includes('상한가') || t.includes('etf') || t.includes('반도체') || t.includes('엔비디아')) {
        return { catName: '증시', color: '#FF4D4D' };
    }
    return { catName: '재테크', color: '#9B51E0' };
}

// Enhanced fetch OG image (targeted at top items with strict timeout)
async function fetchOgImage(url: string): Promise<string | null> {
    if (!url) return null;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1500); // Relaxed to 1.5s for slower news sites

        const res = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            }
        });
        clearTimeout(timeout);
        if (!res.ok) return null;

        const html = await res.text();
        const imgMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
            html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);

        let img = imgMatch ? imgMatch[1] : null;
        if (img && img.startsWith('//')) img = 'https:' + img;
        if (img && !img.startsWith('http')) {
            try {
                const base = new URL(url).origin;
                img = new URL(img, base).toString();
            } catch { return null; }
        }

        // Filter out tracking pixels and placeholder icons
        if (img && (img.includes('pixel') || img.length < 20)) return null;

        return img;
    } catch {
        return null;
    }
}

// Extract from description (fast fallback)
function extractImageFromDescription(descHtml: string): string | null {
    if (!descHtml) return null;
    const imgMatch = descHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (!imgMatch) return null;
    let src = imgMatch[1];
    src = src.replace(/&amp;/g, '&').replace(/&#x3D;/g, '=').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (src.startsWith('//')) src = 'https:' + src;
    if (src.includes('pixel') || src.includes('icon') || src.length < 20) return null;
    return src;
}

export async function GET() {
    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
        return NextResponse.json({
            error: 'API Keys Missing',
            details: 'Please set NAVER_CLIENT_ID and NAVER_CLIENT_SECRET in Vercel settings and redeploy.'
        }, { status: 500 });
    }

    try {
        const queries = [
            '한국 경제 지표', '거시 경제 금융 뉴스', '코스피 코스닥 증시 주식',
            '뉴욕증시 나스닥 반도체', '부동산 매매 전세 분양 청약',
            '기준금리 채권 환율 달러 외환', '비트코인 가상화폐 암호화폐',
            'IPO 공모주 기업공개 상장 공시', '재테크 절세 예적금'
        ];
        const allItems: any[] = [];

        await Promise.all(queries.map(async (q) => {
            const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(q)}&display=100&start=1&sort=date`;
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

        // Deduplication
        const seen = new Set<string>();
        const sorted = allItems
            .filter(item => {
                const key = cleanTitleForDedup(item.title || "");
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
            .slice(0, 400);

        // Classify first
        const classified = sorted.map((item, index) => {
            const rawTitle = stripHtml(item.title || '');
            const { catName, color } = classifyCategory(rawTitle);
            return { item, index, rawTitle, catName, color };
        });

        // Targeted OG Image Fetch: Top 5 per category to ensure rich visuals
        const CATEGORIES = ['증시', '경제', '부동산', '금리/채권', '가상화폐', '외환/달러', 'IPO/공시', '재테크'];
        const scrapingTargets = new Set<number>();

        for (const cat of CATEGORIES) {
            classified.filter(c => c.catName === cat)
                .slice(0, 5) // Increased from 2 to 5 for better coverage
                .forEach(c => scrapingTargets.add(c.index));
        }

        // Also always scrape absolute top 10 (for the global recent feed)
        classified.slice(0, 10).forEach(c => scrapingTargets.add(c.index));

        const targetItems = classified.filter(c => scrapingTargets.has(c.index));

        // Use the link field which Naver prefers for its own hosted news version if available
        const imageResults = await Promise.all(targetItems.map(c => fetchOgImage(c.item.link || c.item.originallink)));
        const imageMap = new Map<number, string | null>();
        targetItems.forEach((c, idx) => {
            imageMap.set(c.index, imageResults[idx]);
        });

        const newsItems = classified.map(({ item, index, rawTitle, catName, color }) => {
            // Priority: 1. Scraped OG Image, 2. Description Image, 3. null
            const imageUrl = imageMap.get(index) || extractImageFromDescription(item.description || '');

            return {
                id: `${index}-${Date.now()}`,
                category: catName,
                categoryColor: color,
                title: rawTitle,
                description: stripHtml(item.description || ''),
                source: new URL(item.originallink || item.link).hostname.replace('www.', ''),
                timeAgo: timeAgo(item.pubDate),
                link: item.originallink || item.link,
                imageUrl,
            };
        });

        return NextResponse.json(newsItems);
    } catch (error) {
        console.error('Error fetching Naver news:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}


