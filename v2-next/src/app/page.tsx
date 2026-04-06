import NewsFeed from "@/components/portal/NewsFeed";
import CommunityPreview from "@/components/portal/CommunityPreview";
import MiniToolbox from "@/components/portal/MiniToolbox";
import UserDashboard from "@/components/portal/UserDashboard";
import MarketWidget from "@/components/portal/MarketWidget";

export default function Home() {
  return (
    <div className="portal-page-wrapper">
      {/* ===== PORTAL DASHBOARD ===== */}
      <div className="main-content portal-main">
        <div className="container portal-grid">

          {/* LEFT COLUMN: Main Content Feed */}
          <div className="portal-content">
            <UserDashboard />
            <MiniToolbox />
            <NewsFeed />
            <CommunityPreview />
          </div>

          {/* RIGHT COLUMN: Sidebar Widgets */}
          <aside className="portal-sidebar">
            <MarketWidget />
          </aside>

        </div>
      </div>
    </div>
  );
}
