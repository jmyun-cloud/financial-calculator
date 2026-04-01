
import { Metadata } from "next";
import LoanCalculator from "@/components/calculators/LoanCalculator";

export const metadata: Metadata = {
  title: "대출 이자 계산기 | 원리금균등, 원금균등, 만기일시상환 자동 계산",
  description: "다양한 대출 상환 방식에 따른 월 납입금, 총 이자, 잔여 원금을 차트와 함께 시뮬레이션 해보세요."
};

export default function LoanPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #1a56e8 0%, #1738c8 50%, #1e2898 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">대출 이자 상환 계산기</h1>
            <p className="main-subtitle">대출 원금과 금리를 입력하면 <strong>상환 방식별 월 납입 스케줄과 총 이자</strong>를 그래프로 한눈에 비교해드립니다.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section">
            <LoanCalculator />
          </section>
        </div>
      </main>
    </>
  );
}
