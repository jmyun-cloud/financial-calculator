
import { Metadata } from "next";
import ExchangeCalculator from "@/components/calculators/ExchangeCalculator";

export const metadata: Metadata = {
  title: "실시간 환전 수수료 계산기 | 달러 엔화 유로 살때 팔때 환율",
  description: "실시간 오픈 API 환율을 연동! 여행 갈 때 살 돈, 다녀와서 남은 돈 팔 때 적용되는 무서운 환전 수수료까지 계산해 드립니다."
};

export default function ExchangePage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #172554 100%)' }}>
        <div className="container"><div className="top-desc-inner"><h1 className="main-title">글로벌 환율 마스터</h1><p className="main-subtitle">공항에서 눈뜨고 코 베이지 마세요. <strong>살 때, 팔 때 달라지는 환율과 은행 수수료</strong>를 실시간으로 비교 계산합니다.</p></div></div>
      </section>
      <main className="main-content"><div className="container content-grid"><section className="calculator-section"><ExchangeCalculator /></section></div></main>
    </>
  );
}
