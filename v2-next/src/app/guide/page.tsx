import { Metadata } from "next";
import Link from "next/link";
import { getAllGuides } from "@/lib/mdx";
import "./guide.css";

export const metadata: Metadata = {
  title: "금융 가이드 | richcalc.kr",
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
          <div className="guide-card-grid">
            {guides.map((guide: any) => (
              <Link key={guide.slug} href={`/guide/${guide.slug}`} className="guide-card">
                <div className="guide-card-emoji">{guide.thumbnail || "📋"}</div>
                <div className="guide-card-badge">{guide.category || "금융 가이드"}</div>
                <h2 className="guide-card-title">{guide.title}</h2>
                <p className="guide-card-desc">{guide.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
