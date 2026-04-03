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
          
          {/* LEFT COLUMN: Content Feed (Toss Feed Style) */}
          <div className="portal-content">
            <MagazineFeed />
          </div>

          {/* RIGHT COLUMN: User Dashboard & Tools (BankSalad Style) */}
          <aside className="portal-sidebar">
            <UserDashboard />
            <MiniToolbox />
            <MarketWidget />
          </aside>
          
        </div>
      </div>
    </div>
  );
}
