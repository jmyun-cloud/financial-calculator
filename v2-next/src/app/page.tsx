import NewsFeed from "@/components/portal/NewsFeed";
import CommunityPreview from "@/components/portal/CommunityPreview";
import MiniToolbox from "@/components/portal/MiniToolbox";
import UserDashboard from "@/components/portal/UserDashboard";
import MarketWidget from "@/components/portal/MarketWidget";
import GoalTracker from "@/components/GoalTracker";
import SentimentGauge from "@/components/portal/SentimentGauge";
import CoinnessAuthCard from "@/components/portal/CoinnessAuthCard";

export default function Home() {
  return (
    <div className="portal-page-wrapper" style={{ background: '#F8F9FA', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* ===== PORTAL DASHBOARD (3-COLUMN COINNESS STYLE) ===== */}
      <div className="main-content portal-main" style={{ paddingTop: "20px" }}>
        <div className="container portal-grid">

          {/* LEFT COLUMN: Breaking News Feed */}
          <aside className="portal-left-sidebar">
            {/* compact 속성을 넘겨서 코인니스처럼 작게 렌더링하도록 유도할 예정 */}
            <NewsFeed compactMode={true} />
          </aside>

          {/* CENTER COLUMN: Main Dashboard (Chart, Snapshot) */}
          <div className="portal-content">
            <UserDashboard />
          </div>

          {/* RIGHT COLUMN: Sidebar Widgets */}
          <aside className="portal-right-sidebar">
            <CoinnessAuthCard />

            <MarketWidget />

            {/* 기존 위젯은 스크린샷 1:1 리뷰를 위해 임시 렌더링 제외 (또는 하단 배치) */}
            <div style={{ marginTop: "24px", display: "none" }}>
              <div className="widget-section" style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #F2F4F7', marginBottom: '24px' }}>
                <h3 className="section-title">내 재무 목표</h3>
                <GoalTracker />
              </div>
              <div className="widget-section" style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #F2F4F7', marginBottom: '24px' }}>
                <h3 className="section-title">시장 심리</h3>
                <SentimentGauge />
              </div>
              <MiniToolbox />
              <CommunityPreview />
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
