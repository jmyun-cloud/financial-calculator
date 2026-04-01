
import { Metadata } from "next";
import PensionCalculator from "@/components/calculators/PensionCalculator";

export const metadata: Metadata = {
  title: "연금 3층탑 계산기 | 국민, 퇴직, 개인연금 통합 진단",
  description: "국민연금 조기수령 계산부터 퇴직연금, IRP, 개인연금저축까지 노후에 받을 연금 총액을 계산하고 생활비 달성률을 진단해줍니다."
};

export default function PensionPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">연금 3층탑 분석기</h1>
            <p className="main-subtitle">국민연금, 퇴직연금, 개인연금을 한곳에 모아 <strong>내 노후 준비 상태를 한눈에 통과</strong>해보세요.</p>
          </div>
        </div>
      </section>
      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section"><PensionCalculator /></section>
        </div>
      </main>
    </>
  );
}
