import { Metadata } from "next";
import Link from "next/link";
import { getAllGuides } from "@/lib/mdx";
import "./guide.css";

export const metadata: Metadata = {
  title: "금융 가이드 | 금융계산기.kr",
  description: "대출, 연봉, 적금, 연금, 전월세, DSR 등 실생활 금융 지식을 쉽게 설명합니다.",
};

export default async function GuidePage() {
  const guides = await getAllGuides();

  return (
    <>
      <section className="top-description" style={{ background: "linear-gradient(135deg, #1a56e8 0%, #1738c8 100%)" }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">금융 가이드</h1>
            <p className="main-subtitle">복잡한 금융 개념을 쉽게 이해할 수 있도록 정리했습니다.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
            paddingTop: "8px",
          }}>
            {guides.map((guide: any) => (
              <Link
                key={guide.slug}
                href={`/guide/${guide.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  padding: "28px",
                  boxShadow: "var(--shadow-md)",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  height: "100%",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>
                    {guide.thumbnail || "📋"}
                  </div>
                  <div style={{
                    display: "inline-block",
                    background: "#E8F3FF",
                    color: "var(--primary)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "20px",
                    marginBottom: "12px",
                  }}>
                    {guide.category || "금융 가이드"}
                  </div>
                  <h2 style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "10px",
                    lineHeight: 1.4,
                  }}>
                    {guide.title}
                  </h2>
                  <p style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    {guide.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
