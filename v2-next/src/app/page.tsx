import NewsFeed from "@/components/portal/NewsFeed";
import CommunityPreview from "@/components/portal/CommunityPreview";
import MiniToolbox from "@/components/portal/MiniToolbox";
import UserDashboard from "@/components/portal/UserDashboard";
import SentimentGauge from "@/components/portal/SentimentGauge";
import CoinnessAuthCard from "@/components/portal/CoinnessAuthCard";
import MarketIndexCards from "@/components/portal/MarketIndexCards";
import GlobalRanking from "@/components/portal/GlobalRanking";
import EconomicCalendar from "@/components/portal/EconomicCalendar";
import TrendingNews from "@/components/portal/TrendingNews";
import Link from "next/link";
import { Calculator, FileText, CheckCircle } from "lucide-react";
import FeatureScroll from "@/components/home/FeatureScroll";
import PremiumHero from "@/components/home/PremiumHero";

export default function Home() {
  return (
    <div className="landing-page-container" style={{ background: '#FFFFFF', minHeight: '100vh' }}>

      {/* 1. PREMIUM HERO SECTION */}
      <PremiumHero />

      {/* 2. PILLAR SECTION */}
      <section className="pillar-section">
        <div className="container">
          <span className="section-label">Our Service</span>
          <h2 className="section-title">우리가 하는 일</h2>
          <div className="pillar-grid">
            <div className="pillar-card">
              <div className="pillar-icon">
                <CheckCircle size={28} />
              </div>
              <h3>공식 기준 반영</h3>
              <p>국세청 간이세액표, 국민건강보험 요율, 금융감독원 표준 공식 등 공공기관의 최신 기준을 로직에 반영합니다.</p>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon">
                <FileText size={28} />
              </div>
              <h3>금융 용어 풀이</h3>
              <p>DSR이 무엇인지, 퇴직금이 어떻게 산정되는지 — 어려운 개념을 가이드 형식으로 알기 쉽게 설명해 드립니다.</p>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon">
                <Calculator size={28} />
              </div>
              <h3>무료 계산 도구</h3>
              <p>별도의 로그인 없이도 모든 계산기를 무료로 이용할 수 있습니다. 입력 즉시 정확한 시뮬레이션 결과를 제공합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 SLEEK FEATURE SHOWCASE */}
      <FeatureScroll />

      {/* 3. FEATURED GUIDES */}
      <section className="guide-section">
        <div className="container">
          <span className="section-label">Finance Guides</span>
          <h2 className="section-title">대표 가이드</h2>
          <div className="guide-grid">
            <Link href="/guide/salary" className="guide-card">
              <div>
                <h4>연봉 실수령액 계산 방법</h4>
                <p>월급에서 4대보험과 세금이 공제되는 구조를 완벽하게 정리했습니다.</p>
              </div>
              <span className="guide-anchor">가이드 읽기 ›</span>
            </Link>
            <Link href="/guide/dsr" className="guide-card">
              <div>
                <h4>DSR이란 무엇인가?</h4>
                <p>내 대출 한도를 결정하는 핵심 지표인 DSR의 계산 기준과 사례를 설명합니다.</p>
              </div>
              <span className="guide-anchor">자세히 보기 ›</span>
            </Link>
            <Link href="/guide/severance" className="guide-card">
              <div>
                <h4>퇴직금 계산 완전 정복</h4>
                <p>재직 기간과 평균임금에 따른 퇴직금 산정 방식과 세금 공제 안내입니다.</p>
              </div>
              <span className="guide-anchor">방법 확인하기 ›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. MARKET PULSE (OLD DASHBOARD - RELEGATED) */}
      <section className="market-pulse-section" id="market">
        <div className="container">
          <div className="market-pulse-header">
            <div>
              <h2>Market Pulse</h2>
              <p>실시간 주요 지수 및 시장 현황</p>
            </div>
            <Link href="/news" style={{ color: '#4E5968', fontSize: '14px', fontWeight: 600 }}>전체 보기 ›</Link>
          </div>

          <MarketIndexCards />

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '40px', marginTop: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <NewsFeed />
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #F2F4F7' }}>
                <UserDashboard />
              </div>
              <GlobalRanking />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <CommunityPreview />
                <MiniToolbox />
              </div>
            </div>
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <CoinnessAuthCard />
              <TrendingNews />
              <EconomicCalendar />
              <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #F2F4F7' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>시장 심리</h3>
                <SentimentGauge />
              </div>
            </aside>
          </div>
        </div>
      </section>

    </div>
  );
}
