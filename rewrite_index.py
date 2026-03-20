import os
import re

html_path = r"c:\Users\E240471\OneDrive - Daeduck Electronics Co., Ltd\01. 업무\02. 개인업무\Project\index.html"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# Replace Toolbox Section
toolbox_start = html.find('<section class="widget-panel" id="toolbox">')
toolbox_end = html.find('</section>', toolbox_start) + len('</section>')

if toolbox_start != -1 and toolbox_end != -1:
    new_toolbox = """<section class="widget-panel" id="toolbox">
        <h2 class="widget-title">🧰 금융 계산기 도구모음</h2>
        <div id="toolbox-grid">
          <!-- Rendered dynamically by calculators.js -->
        </div>
      </section>"""
    html = html[:toolbox_start] + new_toolbox + html[toolbox_end:]

# Add script src for calculators.js
if 'js/data/calculators.js' not in html:
    html = html.replace(
        '<script src="./js/market-api.js?v=5"></script>',
        '<script src="./js/data/calculators.js?v=1"></script>\n  <script src="./js/market-api.js?v=5"></script>'
    )

# Add init logic for calculators
if 'renderCalculatorGrid' not in html:
    html = html.replace(
        "if (typeof renderGoalsWidget === 'function') {",
        "if (typeof renderCalculatorGrid === 'function') {\n        renderCalculatorGrid('toolbox-grid');\n      }\n      if (typeof renderGoalsWidget === 'function') {"
    )

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print("index.html rewritten successfully.")
