import NewsFeed from "@/components/portal/NewsFeed";
import CommunityPreview from "@/components/portal/CommunityPreview";
import MiniToolbox from "@/components/portal/MiniToolbox";
import UserDashboard from "@/components/portal/UserDashboard";
import SentimentGauge from "@/components/portal/SentimentGauge";
import CoinnessAuthCard from "@/components/portal/CoinnessAuthCard";
import MarketIndexCards from "@/components/portal/MarketIndexCards";
import GlobalRanking from "@/components/portal/GlobalRanking";
import EconomicCalendar from "@/components/portal/EconomicCalendar";

export default function Home() {
  return (
    <div className="portal-page-wrapper" style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: '60px' }}>

      {/* Top Banner (AD) */}
      <div className="container" style={{ paddingTop: '20px', marginBottom: '20px' }}>
        <div style={{
          width: '100%',
          height: '110px',
          background: '#F1F3F5',
          borderRadius: '12px',
          border: '1px solid #E5E8EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#8B95A1',
          fontSize: '14px',
          fontWeight: 600
        }}>
          상단 광고 배너 영역 (1160 x 110)
        </div>
      </div>

      {/* Naver Style: Top Indices Bar */}
      <MarketIndexCards />

      {/* ===== PORTAL DASHBOARD (RESTRUCTURED FOR NAVER STYLE) ===== */}
      <main className="container main-content" style={{ padding: '0 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '40px', alignItems: 'start' }}>

          {/* LEFT/CENTER AREA: News, Charts, Rankings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <NewsFeed />

            <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #F2F4F7' }}>
              <UserDashboard />
            </div>

            <GlobalRanking />
          </div>

          {/* RIGHT SIDEBAR: Authentication, Calendar, Widgets */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <CoinnessAuthCard />
            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #F2F4F7' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>시장 심리</h3>
              <SentimentGauge />
            </div>
            <EconomicCalendar />

            {/* AD Placeholder Banner */}
            <div style={{
              height: '400px',
              background: '#F8F9FA',
              borderRadius: '24px',
              border: '1px solid #F2F4F7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B0B8C1',
              fontSize: '13px'
            }}>
              광고 배너 영역
            </div>

            <MiniToolbox />
            <CommunityPreview />
          </aside>
        </div>
      </main>
    </div>
  );
}
