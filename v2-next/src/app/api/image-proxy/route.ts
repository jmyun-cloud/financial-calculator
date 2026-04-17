import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url');
    if (!url) {
        return new NextResponse('Missing url', { status: 400 });
    }

    // Only allow http/https URLs
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return new NextResponse('Invalid url', { status: 400 });
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/*,*/*',
                'Referer': new URL(url).origin,
            }
        });
        clearTimeout(timeout);

        if (!res.ok) {
            return new NextResponse('Image fetch failed', { status: res.status });
        }

        const contentType = res.headers.get('content-type') || 'image/jpeg';
        if (!contentType.startsWith('image/')) {
            return new NextResponse('Not an image', { status: 400 });
        }

        const imageBuffer = await res.arrayBuffer();

        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch {
        return new NextResponse('Proxy error', { status: 500 });
    }
}
