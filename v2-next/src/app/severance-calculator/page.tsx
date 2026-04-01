
import { Metadata } from "next";
import SeveranceCalculator from "@/components/calculators/SeveranceCalculator";

export const metadata: Metadata = {
  title: "퇴직금 계산기 2026 - 퇴직소득세·DB/DC형 비교 자동 계산 | 금융계산기.kr",
  description: "2026년 기준 퇴직금 계산기. 근속기간과 평균임금 입력으로 퇴직금·퇴직소득세·실수령액을 자동 계산합니다.",
  openGraph: {
    title: "2026 퇴직금 계산기 - 퇴직소득세·실수령액 자동 계산",
    description: "근속기간·평균임금 입력으로 퇴직금과 퇴직소득세를 자동 계산합니다."
  }
};

export default function SeverancePage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">퇴직금 계산기 <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>2026</span></h1>
            <p className="main-subtitle">근속기간과 평균임금 입력으로 <strong>퇴직금·퇴직소득세·실수령액</strong>을 자동 계산합니다.</p>
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
              <a href="/guide/severance" className="calc-btn" style={{padding: '12px', fontSize: '0.95rem', background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)'}}>가이드 읽어보기 ▸</a>
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
