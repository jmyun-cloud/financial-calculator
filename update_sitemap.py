import os
from datetime import datetime

base_url = "https://richcalc.kr"
today = datetime.now().strftime("%Y-%m-%d")

# Directories that contain calculators
calc_dirs = [d for d in os.listdir('.') 
             if os.path.isdir(d) and d.endswith('-calculator') 
             and os.path.isfile(os.path.join(d, 'index.html'))] 
             
# Find guides
guides = []
if os.path.exists('guide'):
    guides = [g for g in os.listdir('guide') if g.endswith('.html')]

# Start XML
xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n'

# Main Hub
xml += f"""  <url>
    <loc>{base_url}/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>\n\n"""

# Calculators
for calc in sorted(calc_dirs):
    xml += f"""  <url>
    <loc>{base_url}/{calc}/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>\n\n"""

# Guides
for g in sorted(guides):
    xml += f"""  <url>
    <loc>{base_url}/guide/{g}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n\n"""
  
# Misc
misc_pages = ['privacy-policy', 'terms', 'contact', 'about', 'sitemap-page']
for m in misc_pages:
    if os.path.exists(m) and os.path.isfile(os.path.join(m, 'index.html')):
        priority = "0.3" if m == "sitemap-page" else ("0.5" if m == "about" else "0.4")
        xml += f"""  <url>
    <loc>{base_url}/{m}/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>{priority}</priority>
  </url>\n\n"""

xml += "</urlset>\n"

with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(xml)

print("sitemap.xml generated successfully.")
