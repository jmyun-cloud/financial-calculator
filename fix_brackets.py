import os
import glob

files = glob.glob('v2-next/src/app/**/*.tsx', recursive=True) + glob.glob('v2-next/src/components/**/*.tsx', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Revert triple brackets back to double brackets
    new_content = content.replace("style={{{", "style={{").replace("style={{{{", "style={{")
    new_content = new_content.replace("}}}", "}}").replace("}}}}", "}}")
    
    # Let's also make sure we didn't miss single brackets that were supposed to be double
    # in the guide link widget injection
    new_content = new_content.replace("style={ ", "style={{ ").replace(" }>", " }}>")
    new_content = new_content.replace("style={margin", "style={{margin").replace("'} >", "'}} >")
    
    # Just to be extremely careful with the injected ones:
    new_content = new_content.replace("style={ marginBottom: '20px' }", "style={{ marginBottom: '20px' }}")
    new_content = new_content.replace("style={fontSize: '0.9rem', marginBottom: '15px', color: 'var(--text-secondary)'}", "style={{fontSize: '0.9rem', marginBottom: '15px', color: 'var(--text-secondary)'}}")
    new_content = new_content.replace("style={padding: '12px', fontSize: '0.95rem', background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)'}", "style={{padding: '12px', fontSize: '0.95rem', background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)'}}")
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
print("Brackets fixed successfully globally.")
