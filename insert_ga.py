import os
import glob

ga_code = """<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-B1TE1JHHE3"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-B1TE1JHHE3');
</script>
"""

adsense_code = """<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
"""

count = 0
for filepath in glob.glob('**/*.html', recursive=True):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content
        
        # Insert GA4
        if 'G-B1TE1JHHE3' not in new_content:
            new_content = new_content.replace('<head>', '<head>\n    ' + ga_code, 1)
            
        # Insert AdSense placeholder if not exist
        if 'ca-pub-XXXXXXXX' not in new_content and 'adsbygoogle.js' not in new_content:
             new_content = new_content.replace('</head>', '    ' + adsense_code + '</head>', 1)

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            print(f"Updated: {filepath}")
    except Exception as e:
        print(f"Error on {filepath}: {e}")

print(f"Total updated files: {count}")
