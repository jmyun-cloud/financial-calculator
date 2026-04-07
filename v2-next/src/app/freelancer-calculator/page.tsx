import { Metadata } from "next";
import Link from "next/link";
import FreelancerCalculator from "@/components/calculators/FreelancerCalculator";

export const metadata: Metadata = {
  title: "프리랜서 3.3% 계산기 - 알바·N잡러 실수령액 및 세금 자동 계산 | 금융계산기.kr",
  description: "프리랜서, 아르바이트, N잡러를 위한 3.3% 세금 계산기. 총 수입을 입력하면 3.3% 원천징수 세액을 자동 공제하여 실수령액을 즉시 확인하세요.",
  openGraph: {
    title: "프리랜서 3.3% 계산기 - 원천징수 세급 및 실수령액 자동 산출",
    description: "프리랜서 수입 입력 시 3.3% 원천징수 세액 공제 후 정확한 실수령액을 즉시 계산합니다."
  }
};

export default function FreelancerPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">프리랜서 3.3% 세금 계산기</h1>
            <p className="main-subtitle">아르바이트나 프리랜서 등 3.3% 원천징수 근로자의 수입을 입력하면, <strong>사업소득세(3%) 및 지방소득세(0.3%)</strong>를 자동 계산하여 실수령액을 보여줍니다.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section">
            <FreelancerCalculator />
          </section>

          <aside className="sidebar">
            <div className="sidebar-widget guide-link-widget" style={{ marginBottom: '20px' }}>
              <h2 className="widget-title">📖 계산기 가이드</h2>
              <p style={{fontSize: '0.9rem', marginBottom: '15px', color: 'var(--text-secondary)'}}>정확한 계산 원리와 필수 상식을 확인하세요!</p>
              <Link href="/guide/freelancer" className="calc-btn" style={{padding: '12px', fontSize: '0.95rem', background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)'}}>가이드 읽어보기 ▸</Link>
            </div>
            <div className="sidebar-widget info-widget">
              <h2 className="widget-title">📋 3.3% 원천징수란?</h2>
              <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '15px'}}>
                고용 관계 없이 독립된 자격으로 용역을 제공하고 대가를 받는 경우, 지급하는 자가 금액의 3.3%를 미리 떼어 국가에 납부하는 제도입니다.
              </p>
              <table className="tax-table">
                <tbody>
                  <tr><td>사업 소득세</td><td className="tax-rate preferred">수입금액의 3%</td></tr>
                  <tr><td>지방 소득세</td><td className="tax-rate exempt">사업소득세의 10% (0.3%)</td></tr>
                  <tr style={{borderTop: '2px solid var(--border)'}}><td><strong>총 공제율</strong></td><td className="tax-rate" style={{color: 'var(--danger)'}}><strong>3.3%</strong></td></tr>
                </tbody>
              </table>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
