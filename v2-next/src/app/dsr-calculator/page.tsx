
import { Metadata } from "next";
import DsrCalculator from "@/components/calculators/DsrCalculator";

export const metadata: Metadata = {
  title: "DSR 대출한도 계산기 | 총부채원리금상환비율",
  description: "연봉과 기존 대출을 바탕으로 나의 DSR(총부채원리금상환비율) 한도를 확인하고 추가로 받을 수 있는 최대 대출 금액을 역산해보세요."
};

export default function DsrPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e3a8a 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">DSR 대출한도 계산기</h1>
            <p className="main-subtitle">총부채원리금상환비율! 나의 <strong>기준 연소득과 기존 대출</strong>을 평가하여 은행에서 추가로 얼마까지 빌려줄 수 있는지 알려드립니다.</p>
          </div>
        </div>
      </section>
      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section"><DsrCalculator /></section>
        </div>
      </main>
    </>
  );
}
