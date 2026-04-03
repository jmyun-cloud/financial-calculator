import os
import glob

files = glob.glob('v2-next/src/app/guide/*/page.tsx')
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = content.replace('import "./guide.css";', 'import "../guide.css";')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
print("Fixed guide.css imports")
