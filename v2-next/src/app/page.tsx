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

export default function Home() {
  return (
    <div className="portal-page-wrapper" style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: '60px' }}>



      {/* Naver Style: Top Indices Bar (주요 지수) */}
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

            {/* Secondary Content Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <CommunityPreview />
              <MiniToolbox />
            </div>
          </div>

          {/* RIGHT SIDEBAR: Restructured for Naver Alignment */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 1. Login/Profile */}
            <CoinnessAuthCard />

            {/* 2. Trending News */}
            <TrendingNews />

            {/* 3. Global Economic Calendar */}
            <EconomicCalendar />

            {/* 4. Market Sentiment */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #F2F4F7' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>시장 심리</h3>
              <SentimentGauge />
            </div>


          </aside>
        </div>
      </main>
    </div>
  );
}
