import { MDXRemote } from 'next-mdx-remote/rsc';
import { getGuideBySlug, getAllGuides } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import "../guide.css";

export async function generateStaticParams() {
  const guides = await getAllGuides();
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: { params: any }) {
  const { slug } = params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: `${guide.meta.title} - 금융계산기.kr`,
    description: guide.meta.description,
  };
}

export default async function GuidePage({ params }: { params: any }) {
  const { slug } = params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <>
      <section className="top-description">
        <div className="container">
          <div className="top-desc-inner">
            <div className="breadcrumb">
              <Link href="/" style={{ color: 'inherit' }}>홈</Link> <span className="bc-sep">›</span>
              <span className="bc-current">가이드</span>
            </div>
            <h1 className="main-title">{guide.meta.title}</h1>
            <p className="main-subtitle">{guide.meta.description}</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article className="guide-article mdx-content">
            <MDXRemote source={guide.content} />
          </article>
        </div>
      </main>
    </>
  );
}
