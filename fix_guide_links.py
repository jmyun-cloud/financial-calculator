import os
import glob

app_dirs = glob.glob('v2-next/src/app/*-calculator')

for calc_dir in app_dirs:
    page_file = os.path.join(calc_dir, 'page.tsx')
    if not os.path.exists(page_file):
        continue
        
    with open(page_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Fix the bracket issues
    new_content = content.replace("style={ marginBottom: '20px' }", "style={{ marginBottom: '20px' }}")
    new_content = new_content.replace("style={fontSize: '0.9rem', marginBottom: '15px', color: 'var(--text-secondary)'}", "style={{fontSize: '0.9rem', marginBottom: '15px', color: 'var(--text-secondary)'}}")
    new_content = new_content.replace("style={padding: '12px', fontSize: '0.95rem', background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)'}", "style={{padding: '12px', fontSize: '0.95rem', background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)'}}")
    
    # Also fix any other ones just in case
    new_content = new_content.replace("style={", "style={{").replace("}'}", "}'}}")
    # Actually, replacing that generically might break things. I will just stick to the specific ones above.
    
    with open(page_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
print("Fixed JSX style brackets.")
