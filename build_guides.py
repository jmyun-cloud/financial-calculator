import os
import glob
from bs4 import BeautifulSoup

guide_files = glob.glob('guide/*.html')
os.makedirs('v2-next/src/app/guide', exist_ok=True)

page_template = """import { Metadata } from "next";
import Link from "next/link";
import "./guide.css";

export const metadata: Metadata = {
  title: "[TITLE]",
  description: "[DESC]",
};

export default function GuidePage() {
  return (
    <>
      <section className="top-description">
        <div className="container">
          <div className="top-desc-inner">
            <div className="breadcrumb">
              <Link href="/" style={{color: 'inherit'}}>홈</Link> <span className="bc-sep">›</span>
              <span className="bc-current">가이드</span>
            </div>
            <h1 className="main-title">[MAIN_TITLE]</h1>
            <p className="main-subtitle">[SUBTITLE]</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article 
            className="guide-article" 
            dangerouslySetInnerHTML={{ __html: `[ARTICLE_HTML]` }} 
          />
        </div>
      </main>
    </>
  );
}
"""

css_content = """
.guide-article {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 40px;
    box-shadow: var(--shadow-md);
    color: var(--text-secondary);
    line-height: 1.8;
    font-size: 1.05rem;
}
.guide-article h2 {
    color: var(--text-primary);
    font-size: 1.6rem;
    margin-top: 40px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
}
.guide-article h2:first-child { margin-top: 0; }
.guide-article h2::before {
    content: ""; display: block; width: 4px; height: 24px;
    background: var(--primary); border-radius: 2px;
}
.guide-article h3 {
    color: var(--text-primary);
    font-size: 1.25rem;
    margin-top: 30px;
    margin-bottom: 15px;
}
.guide-article p { margin-bottom: 20px; }
.guide-article strong { color: var(--primary); font-weight: 700; }
.guide-article ul { margin-bottom: 20px; padding-left: 20px; }
.guide-article li { margin-bottom: 10px; }
.formula-box {
    background: var(--surface-2); padding: 24px; border-radius: 12px;
    margin: 20px 0; border: 1px solid var(--border);
}
.formula-box ul { list-style: none; padding: 0; margin: 0; }
.formula-box li { margin-bottom: 12px; }
.formula-box li:last-child { margin-bottom: 0; }

.faq-list { margin-top: 30px; }
.faq-item {
    background: var(--surface-2); border-radius: 12px;
    margin-bottom: 12px; border: 1px solid var(--border); overflow: hidden;
}
.faq-item summary {
    padding: 18px 24px; font-weight: 700; font-size: 1.05rem;
    color: var(--text-primary); cursor: pointer; list-style: none;
    display: flex; justify-content: space-between; align-items: center;
    transition: all 0.2s;
}
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item summary::after {
    content: "﹀"; font-size: 0.9rem; color: var(--primary); transition: transform 0.3s ease;
}
.faq-item[open] summary::after { transform: rotate(180deg); }
.faq-item[open] summary { border-bottom: 1px solid var(--border); }
.faq-item p {
    padding: 20px 24px; margin: 0; color: var(--text-secondary);
    font-size: 0.95rem; line-height: 1.7;
}

@media (max-width: 768px) {
  .guide-article { padding: 25px; }
  .guide-article h2 { font-size: 1.3rem; }
  .guide-article h3 { font-size: 1.15rem; }
}
"""

with open('v2-next/src/app/guide/guide.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

for file in guide_files:
    slug = os.path.basename(file).replace('.html', '')
    
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
        
    soup = BeautifulSoup(html, 'html.parser')
    
    title_tag = soup.find('title')
    title = title_tag.text if title_tag else "가이드"
    
    desc_tag = soup.find('meta', {'name': 'description'})
    desc = desc_tag['content'] if desc_tag else ""
    
    h1 = soup.find('h1', class_='main-title')
    main_title = h1.text if h1 else title
    
    subtitle = soup.find('p', class_='main-subtitle')
    main_subtitle = subtitle.text if subtitle else ""
    
    article = soup.find('article', class_='guide-article')
    if not article:
        continue
        
    article_html = "".join([str(tag) for tag in article.contents])
    
    # Escape backticks and brackets if needed for Next.js JSX template literal
    article_html = article_html.replace('`', '\\`').replace('${', '\\${')
    
    content = (page_template.replace('[TITLE]', title.replace('"', '\\"'))
                           .replace('[DESC]', desc.replace('"', '\\"'))
                           .replace('[MAIN_TITLE]', main_title)
                           .replace('[SUBTITLE]', main_subtitle)
                           .replace('[ARTICLE_HTML]', article_html))
                           
    os.makedirs(f'v2-next/src/app/guide/{slug}', exist_ok=True)
    with open(f'v2-next/src/app/guide/{slug}/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
        
print(f"Successfully migrated {len(guide_files)} guide files.")
