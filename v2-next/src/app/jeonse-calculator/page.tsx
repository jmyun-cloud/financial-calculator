
import { Metadata } from "next";
import JeonseCalculator from "@/components/calculators/JeonseCalculator";

export const metadata: Metadata = {
  title: "전월세 전환 계산기 | 전세보증금을 월세로 계산",
  description: "전월세 전환율(5.5% 상한)을 바탕으로 전세금을 월세로 바꾸거나, 월세를 전세 보증금으로 정확하게 변환해 드립니다."
};

export default function JeonsePage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">전월세 전환 계산기</h1>
            <p className="main-subtitle">계약갱신 및 새로운 임대차 계약 시 <strong>보증금 ↔ 월세 전환금액</strong>을 법정 상한율을 고려해 계산해보세요.</p>
          </div>
        </div>
      </section>
      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section"><JeonseCalculator /></section>
        </div>
      </main>
    </>
  );
}
