import NewsFeed from "@/components/portal/NewsFeed";
import CommunityPreview from "@/components/portal/CommunityPreview";
import MiniToolbox from "@/components/portal/MiniToolbox";
import UserDashboard from "@/components/portal/UserDashboard";
import MarketWidget from "@/components/portal/MarketWidget";
import GoalTracker from "@/components/GoalTracker";
import SentimentGauge from "@/components/portal/SentimentGauge";

export default function Home() {
  return (
    <div className="portal-page-wrapper">
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
            <div className="widget-section" style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #F2F4F7', marginBottom: '24px' }}>
              <h3 className="section-title" style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: '#191F28' }}>내 재무 목표</h3>
              <GoalTracker />
            </div>

            <div className="widget-section" style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #F2F4F7', marginBottom: '24px' }}>
              <h3 className="section-title" style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: '#191F28' }}>시장 심리</h3>
              <SentimentGauge />
            </div>

            <MarketWidget />
            <div style={{ marginTop: "24px" }}>
              <MiniToolbox />
            </div>
            <div style={{ marginTop: "24px" }}>
              <CommunityPreview />
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
