import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "금융계산기.kr - 대한민국 대표 금융 유틸리티",
  description: "연봉, 대출, 세금, 예적금, 종소세, 프리랜서 등 12종의 핵심 금융 계산기를 제공합니다.",
  openGraph: {
    title: "금융계산기.kr - 종합 금융 플랫폼",
    description: "은퇴부터 대출 규제(DSR) 한도, 월 실수령액까지 모든 금융 계산을 쉽고 빠르게.",
    siteName: "금융계산기.kr",
    type: "website",
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
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
