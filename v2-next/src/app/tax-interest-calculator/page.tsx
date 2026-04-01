
import { Metadata } from "next";
import TaxInterestCalculator from "@/components/calculators/TaxInterestCalculator";

export const metadata: Metadata = {
  title: "세금우대 이자소득세 계산기 | 일반, 세금우대, 비과세 비교",
  description: "예적금 만기 시 부과되는 이자소득세를 15.4% 일반과세, 9.9% 세금우대, 비과세 조건으로 한눈에 비교 계산해 드립니다."
};

export default function TaxInterestPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)' }}>
        <div className="container"><div className="top-desc-inner"><h1 className="main-title">세금우대 이자 계산기</h1><p className="main-subtitle">내 예적금, 비과세나 세금우대를 받으면 <strong>진짜 내 손에 쥐어지는 돈(세후 수령액)</strong>이 어떻게 달라질까요?</p></div></div>
      </section>
      <main className="main-content"><div className="container content-grid"><section className="calculator-section"><TaxInterestCalculator /></section></div></main>
    </>
  );
}
