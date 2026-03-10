import glob
import re

count = 0
for fpath in glob.glob('**/*.html', recursive=True):
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Using regex to target the exact whitespace causing the issue
    # The string is `금융계산기\n        <span class="logo-accent">.kr</span>`
    new_content = re.sub(r'(금융계산기)[\r\n\s]+(<span class="logo-accent">\.kr</span>)', r'\1\2', content)

    if new_content != content:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1
        print('Fixed:', fpath)

print('Done. Updated', count, 'files.')
