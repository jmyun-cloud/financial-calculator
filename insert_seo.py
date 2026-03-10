import os

injection = """
    <!-- SEO & Favicon for Google Search -->
    <meta property="og:site_name" content="금융계산기.kr" />
    <link rel="icon" href="/favicon.svg" />
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "금융계산기.kr",
      "url": "https://richcalc.kr/"
    }
    </script>"""

updated = 0
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            if 'og:site_name' not in content:
                content = content.replace('</head>', f'{injection}\n</head>')
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                updated += 1

print(f"Updated {updated} files.")
