import { MDXRemote } from 'next-mdx-remote/rsc';
import { getGuideBySlug, getAllGuides } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import remarkGfm from 'remark-gfm';
import { FaqItem, FaqSummary } from "@/components/guide/FaqItem";
import "../guide.css";

export async function generateStaticParams() {
  const guides = await getAllGuides();
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: `${guide.meta.title} - 금융계산기.kr`,
    description: guide.meta.description,
  };
}

// FaqBlock and FaqQ are CAPITALIZED — MDX guarantees these are treated as React components
const mdxComponents = {
  FaqBlock: ({ children }: any) => <FaqItem>{children}</FaqItem>,
  FaqQ: ({ children }: any) => <FaqSummary>{children}</FaqSummary>,
  // Style tables
  table: ({ children }: any) => (
    <div style={{ overflowX: "auto", margin: "24px 0" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "0.9rem",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}>{children}</table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead style={{ background: "linear-gradient(135deg, #1a56e8, #1738c8)", color: "white" }}>{children}</thead>
  ),
  th: ({ children }: any) => (
    <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 700, fontSize: "0.85rem" }}>{children}</th>
  ),
  td: ({ children }: any) => (
    <td style={{ padding: "12px 16px", borderBottom: "1px solid #F2F4F7", color: "#333D4B" }}>{children}</td>
  ),
};

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) notFound();

  return (
    <>
      <section className="top-description">
        <div className="container">
          <div className="top-desc-inner">
            <div className="breadcrumb">
              <Link href="/" style={{ color: 'inherit' }}>홈</Link> <span className="bc-sep">›</span>
              <Link href="/guide" style={{ color: 'inherit' }}>가이드</Link> <span className="bc-sep">›</span>
              <span className="bc-current">{guide!.meta.title}</span>
            </div>
            <h1 className="main-title">{guide!.meta.title}</h1>
            <p className="main-subtitle">{guide!.meta.description}</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article className="guide-article mdx-content">
            <MDXRemote
              source={guide!.content}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </article>
        </div>
      </main>
    </>
  );
}
