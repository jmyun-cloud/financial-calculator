
import { Metadata } from "next";
import SalaryCalculator from "@/components/calculators/SalaryCalculator";

export const metadata: Metadata = {
  title: "연봉 계산기 2026 - 월 실수령액·4대보험·소득세 자동 계산 | 금융계산기.kr",
  description: "2026년 기준 연봉 실수령액 계산기. 연봉 입력 시 국민연금·건강보험·고용보험·소득세를 자동 계산하여 월 실수령액을 즉시 확인하세요.",
  openGraph: {
    title: "2026 연봉 계산기 - 월 실수령액·4대보험 자동 계산",
    description: "연봉 입력만으로 4대보험·소득세 공제 후 월 실수령액을 즉시 계산합니다. 2026년 최신 요율 적용.",
  }
};

export default function SalaryPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">연봉 계산기 <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>2026</span></h1>
            <p className="main-subtitle">연봉을 입력하면 <strong>국민연금·건강보험·고용보험·소득세</strong>를 자동 계산하여 <strong>월 실수령액</strong>을 즉시 확인할 수 있습니다.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section">
            <SalaryCalculator />
          </section>
          
          <aside className="sidebar">
            <div className="sidebar-widget guide-link-widget" style={{ marginBottom: '20px' }}>
              <h2 className="widget-title">📖 계산기 가이드</h2>
              <p style={{fontSize: '0.9rem', marginBottom: '15px', color: 'var(--text-secondary)'}}>정확한 계산 원리와 필수 상식을 확인하세요!</p>
              <a href="/guide/salary" className="calc-btn" style={{padding: '12px', fontSize: '0.95rem', background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)'}}>가이드 읽어보기 ▸</a>
            </div>
                        <div className="sidebar-widget info-widget">
              <h2 className="widget-title">📋 2026년 4대보험 요율</h2>
              <table className="tax-table">
                <tbody>
                  <tr><td>국민연금</td><td className="tax-rate">4.50%</td></tr>
                  <tr><td>건강보험</td><td className="tax-rate">3.595%</td></tr>
                  <tr><td>고용보험</td><td className="tax-rate">0.90%</td></tr>
                </tbody>
              </table>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
