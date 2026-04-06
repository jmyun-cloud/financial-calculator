import MagazineFeed from "@/components/portal/MagazineFeed";
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
            <MagazineFeed />
            {/* Q&A section will be added here in Phase 4 */}
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
