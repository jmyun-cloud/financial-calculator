
import { Metadata } from "next";
import SavingsCalculator from "@/components/calculators/SavingsCalculator";

export const metadata: Metadata = {
  title: "예적금 만기 수령액 계산기 | 예금/적금 이자 및 세금 계산 자동 산출",
  description: "목돈 만들기 필수! 예금과 적금 만기 시 수령하는 이자와 세금을 계산하여 실 수령액을 정확히 알려드립니다."
};

export default function SavingsPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #1a56e8 0%, #1738c8 50%, #1e2898 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">예적금 이자 계산기</h1>
            <p className="main-subtitle">예금/적금 목표 달성 시 이자소득세가 공제된 실제 만기 수령액을 계산해드립니다.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section">
            <SavingsCalculator />
          </section>
        </div>
      </main>
    </>
  );
}
