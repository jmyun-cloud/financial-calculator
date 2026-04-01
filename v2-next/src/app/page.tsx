import Link from "next/link";
import MarketWidget from "@/components/MarketWidget";
import ToolboxClient from "@/components/ToolboxClient";
import GoalTracker from "@/components/GoalTracker";

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="container hero-inner">
          <span className="hero-badge">⚡ 2026 최신 세법 업데이트 완료</span>
          <h1>
            나의 자산을 깨우는 <br />
            <span className="gradient">가장 완벽한 금융계산기</span>
          </h1>
          <p className="hero-subtitle">
            예적금, 대출, 연봉, 세금까지 — 복잡한 계산식은 저희에게 맡기세요.<br />
            전문가 수준의 결과 리포트를 단 3초 만에 무료로 받아보세요.
          </p>
          <div className="hero-buttons">
            <Link href="#toolbox" className="btn-primary">
              내게 맞는 계산기 찾기
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== MAIN DASHBOARD ===== */}
      <main className="main-content">
        <div className="container content-grid">

          <div className="dashboard-main">

            <section className="widget-panel" id="dashboard-goals-panel">
              <h2 className="widget-title">📌 나의 재무 목표 <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>저장된 계산 결과</span></h2>
              <GoalTracker />
            </section>

            {/* Toolbox Client Component */}
            <ToolboxClient />

            {/* Financial Magazine */}
            <section className="widget-panel" id="magazine">
              <h2 className="widget-title">🗞️ 추천 금융 매거진 & 가이드</h2>
              <div className="mag-grid">
                <Link href="/guide/pension" className="mag-card">
                  <div className="mag-img">👴</div>
                  <div className="mag-content">
                    <span className="mag-tag">노후 준비</span>
                    <h3 className="mag-title">퇴직금 vs 퇴직연금 절세 비법</h3>
                    <p>DB형과 DC형 중 나에게 맞는 선택은?</p>
                  </div>
                </Link>
                <Link href="/guide/global-tax" className="mag-card">
                  <div className="mag-img">📑</div>
                  <div className="mag-content">
                    <span className="mag-tag">세금 절세</span>
                    <h3 className="mag-title">종합소득세 누진세율 가이드</h3>
                    <p>5월 종소세 구간과 프리랜서 환급의 비밀</p>
                  </div>
                </Link>
                <Link href="/guide/subscription" className="mag-card">
                  <div className="mag-img">🏆</div>
                  <div className="mag-content">
                    <span className="mag-tag">내집마련</span>
                    <h3 className="mag-title">주택청약 무주택/부양가족 기준</h3>
                    <p>청약 가점 84점 만점 완벽 해부</p>
                  </div>
                </Link>
                <Link href="/guide/dsr" className="mag-card">
                  <div className="mag-img">📊</div>
                  <div className="mag-content">
                    <span className="mag-tag">대출 규제</span>
                    <h3 className="mag-title">DSR 40% 규제 완벽 대응법</h3>
                    <p>대출 한도 늘리는 영끌 방어 전략</p>
                  </div>
                </Link>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <aside className="dashboard-sidebar">
            <MarketWidget />

            <div className="widget-panel">
              <h2 className="widget-title">🚀 빠른 실행</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link href="/savings-calculator" style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: '#e2e8f0', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  + 정기적금 이자 확인
                </Link>
                <Link href="/loan-calculator" style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: '#e2e8f0', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  + 주택담보대출 한도 조회
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
