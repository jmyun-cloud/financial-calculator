import os
import glob

app_dirs = glob.glob('v2-next/src/app/*-calculator')

for calc_dir in app_dirs:
    page_file = os.path.join(calc_dir, 'page.tsx')
    if not os.path.exists(page_file):
        continue
        
    slug_name = os.path.basename(calc_dir).replace('-calculator', '')
    
    # check if a guide exists for this slug
    if not os.path.exists(f'v2-next/src/app/guide/{slug_name}'):
        continue
        
    with open(page_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'guide-link-widget' in content:
        continue # Already injected
        
    guide_widget = f"""<aside className="sidebar">
            <div className="sidebar-widget guide-link-widget" style={{ marginBottom: '20px' }}>
              <h2 className="widget-title">📖 계산기 가이드</h2>
              <p style={{fontSize: '0.9rem', marginBottom: '15px', color: 'var(--text-secondary)'}}>정확한 계산 원리와 필수 상식을 확인하세요!</p>
              <a href="/guide/{slug_name}" className="calc-btn" style={{padding: '12px', fontSize: '0.95rem', background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)'}}>가이드 읽어보기 ▸</a>
            </div>
            """
            
    # Replace <aside className="sidebar"> with the new widget injected inside
    new_content = content.replace('<aside className="sidebar">\n', guide_widget)
    
    with open(page_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
print("Guide links injected successfully.")
