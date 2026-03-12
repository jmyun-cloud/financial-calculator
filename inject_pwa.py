#!/usr/bin/env python3
"""
inject_pwa.py - 모든 HTML 파일에 PWA 메타태그와 export_image.js 스크립트 주입
"""
import os
import re

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

# 주입할 PWA 메타 태그 (</head> 바로 앞에 삽입)
PWA_META_TAGS = '''    <!-- PWA -->
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#1a56e8" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="금융계산기" />
    <link rel="apple-touch-icon" href="/icons/icon-192.png" />
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js').catch(function(err) {
            console.log('SW registration failed: ', err);
          });
        });
      }
    </script>'''

# 주입할 export_image.js 스크립트 (</body> 바로 앞에 삽입)
EXPORT_SCRIPT = '    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>\n'

# 루트에서는 /export_image.js, 서브디렉토리에서는 ../export_image.js
def get_export_script_tag(filepath):
    rel = os.path.relpath(filepath, PROJECT_ROOT)
    depth = rel.count(os.sep)
    if depth == 0:
        src = "/export_image.js"
    else:
        src = "../" * depth + "export_image.js"
    return f'    <script src="{src}"></script>\n'

def inject_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    # 1. PWA 메타태그 삽입 (이미 있으면 건너뜀)
    if 'rel="manifest"' not in content and '</head>' in content:
        content = content.replace('</head>', PWA_META_TAGS + '\n  </head>', 1)
        changed = True

    # 2. html2canvas CDN 삽입
    if 'html2canvas' not in content and '</body>' in content:
        content = content.replace('</body>', EXPORT_SCRIPT + '  </body>', 1)
        changed = True

    # 3. export_image.js 삽입
    export_tag = get_export_script_tag(filepath)
    export_src = export_tag.strip()
    if 'export_image.js' not in content and '</body>' in content:
        content = content.replace('</body>', export_tag + '  </body>', 1)
        changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    updated = []
    skipped = []

    for root, dirs, files in os.walk(PROJECT_ROOT):
        # .git, node_modules 등 제외
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__']]

        for filename in files:
            if not filename.endswith('.html'):
                continue

            filepath = os.path.join(root, filename)
            try:
                if inject_file(filepath):
                    rel = os.path.relpath(filepath, PROJECT_ROOT)
                    updated.append(rel)
                    print(f"[OK] Updated: {rel}")
                else:
                    rel = os.path.relpath(filepath, PROJECT_ROOT)
                    skipped.append(rel)
                    print(f"[SKIP] Already done: {rel}")
            except Exception as e:
                print(f"[ERROR] ({filepath}): {e}")

    print(f"\nTotal: {len(updated)} updated, {len(skipped)} skipped")

if __name__ == "__main__":
    main()
