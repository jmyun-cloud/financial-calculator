import { Metadata } from "next";
import Link from "next/link";
import SeveranceCalculator from "@/components/calculators/SeveranceCalculator";

export const metadata: Metadata = {
  title: "퇴직금 계산기 | IRP 퇴직소득세 자동 계산",
  description: "퇴직금과 이연퇴직소득세(IRP)를 자동 계산하고 퇴직급여 수령액을 즉시 확인해보세요."
};

export default function SeverancePage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #FF9100 0%, #E65100 50%, #FF6D00 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">퇴직금 & 퇴직소득세 계산기</h1>
            <p className="main-subtitle">근속연수와 평균임금을 입력하면 예상 퇴직금과 <strong>퇴직소득세(IRP 절세효과)</strong>를 한눈에 볼 수 있습니다.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section">
            <SeveranceCalculator />
          </section>

          <aside className="sidebar">
            <div className="sidebar-widget guide-link-widget" style={{ marginBottom: '20px' }}>
              <h2 className="widget-title">📖 계산기 가이드</h2>
              <p style={{fontSize: '0.9rem', marginBottom: '15px', color: 'var(--text-secondary)'}}>정확한 계산 원리와 필수 상식을 확인하세요!</p>
              <Link href="/guide/severance" className="calc-btn" style={{padding: '12px', fontSize: '0.95rem', background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)'}}>가이드 읽어보기 ▸</Link>
            </div>
                        <div className="sidebar-widget info-widget">
              <h2 className="widget-title">📋 2026 근속연수공제</h2>
              <table className="tax-table">
                <tbody>
                  <tr><td>5년 이하</td><td className="tax-rate">100만원 × 연수</td></tr>
                  <tr><td>6~10년</td><td className="tax-rate">500만 + 200만×(연수-5)</td></tr>
                  <tr><td>11~20년</td><td className="tax-rate">1,500만 + 250만×(연수-10)</td></tr>
                  <tr><td>20년 초과</td><td className="tax-rate">4,000만 + 300만×(연수-20)</td></tr>
                </tbody>
              </table>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
