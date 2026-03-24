import glob
import re
import os

count = 0
for filepath in glob.glob('guide/*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace broken CSS references (e.g. "../pension-calculator/style.css") with the valid one: "../loan-calculator/style.css?v=5"
    new_content = re.sub(
        r'<link\s+rel="stylesheet"\s+href="\.\./[^/]+/style\.css[^\"]*"\s*/>',
        '<link rel="stylesheet" href="../loan-calculator/style.css?v=5" />',
        content
    )
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed CSS in {filepath}")
        count += 1

print(f"Completed! Fixed {count} pages.")
