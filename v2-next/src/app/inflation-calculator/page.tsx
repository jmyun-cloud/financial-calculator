
import { Metadata } from "next";
import InflationCalculator from "@/components/calculators/InflationCalculator";

export const metadata: Metadata = {
  title: "인플레이션 화폐가치 계산기 | 물가상승 실질수익률 미래가치",
  description: "현금 1억원의 10년 뒤 찐가치는? 물가상승률을 반영하여 내 자산의 미래 가치와 실질 수익률을 정확히 계산해 드립니다."
};

export default function InflationPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #c2410c 100%)' }}>
        <div className="container"><div className="top-desc-inner"><h1 className="main-title">인플레이션 파워 분석기</h1><p className="main-subtitle">내 예금은 <strong>물가를 이기고 있을까요?</strong> 아니면 조용히 녹아내리고 있을까요?</p></div></div>
      </section>
      <main className="main-content"><div className="container content-grid"><section className="calculator-section"><InflationCalculator /></section></div></main>
    </>
  );
}
