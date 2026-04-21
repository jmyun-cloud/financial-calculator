import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TickerBar from "@/components/portal/TickerBar";

const GA_ID = "G-B1TE1JHHE3";

export const metadata: Metadata = {
  title: "금융계산기.kr - 대한민국 대표 금융 유틸리티",
  description: "연봉, 대출, 세금, 예적금, 종소세, 프리랜서 등 12종의 핵심 금융 계산기를 제공합니다.",
  metadataBase: new URL("https://www.richcalc.kr"),
  verification: {
    other: {
      "naver-site-verification": "a06011ac826bc5ab12896ed43961cb7960df04ed",
    },
  },
  openGraph: {
    title: "금융계산기.kr - 종합 금융 플랫폼",
    description: "은퇴부터 대출 규제(DSR) 한도, 월 실수령액까지 모든 금융 계산을 쉽고 빠르게.",
    siteName: "금융계산기.kr",
    type: "website",
    url: "https://www.richcalc.kr",
  },
  alternates: {
    canonical: "https://www.richcalc.kr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#1a56e8" />
        <style dangerouslySetInnerHTML={{ __html: `body { background-color: #FFFFFF !important; }` }} />
      </head>
      <body style={{ backgroundColor: '#FFFFFF' }}>
        <AuthProvider>
          <Header />
          <TickerBar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <Analytics />
      </body>
    </html>
  );
}
