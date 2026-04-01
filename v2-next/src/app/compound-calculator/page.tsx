
import { Metadata } from "next";
import CompoundCalculator from "@/components/calculators/CompoundCalculator";

export const metadata: Metadata = {
  title: "눈덩이 복리 계산기 | 매월 투자액 단리 복리 비교 수익률 계산",
  description: "아인슈타인이 극찬한 복리의 마법! 매월 일정한 금액을 꾸준히 투자했을 때 몇 년 뒤 얼마가 되는지 단리와 비교해 차트로 보여드립니다."
};

export default function CompoundPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">눈덩이 복리 계산기</h1>
            <p className="main-subtitle">내 퇴직금, 여윳돈을 꾸준히 굴리면 어떻게 될까요? <strong>시간이 돈을 버는 복리의 마법</strong>을 차트로 경험해 보세요.</p>
          </div>
        </div>
      </section>
      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section"><CompoundCalculator /></section>
        </div>
      </main>
    </>
  );
}
