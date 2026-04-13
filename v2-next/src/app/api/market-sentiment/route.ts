import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://api.alternative.me/fng/?limit=1', {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        const data = await response.json();

        if (data && data.data && data.data[0]) {
            const val = parseInt(data.data[0].value);
            let label = "중립";
            if (val < 25) label = "극도의 공포";
            else if (val < 45) label = "공포";
            else if (val < 55) label = "중립";
            else if (val < 75) label = "탐욕";
            else label = "극도의 탐욕";

            return NextResponse.json({
                value: val,
                label: label,
                timestamp: data.data[0].timestamp
            });
        }

        throw new Error("Invalid API response");
    } catch (error) {
        console.error("Sentiment API Error:", error);
        // Fallback to a realistic mock value if API fails
        return NextResponse.json({
            value: 48,
            label: "중립",
            isFallback: true
        });
    }
}
