import os

ad_script = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4050732935545035" crossorigin="anonymous"></script>'

def insert_ad_script(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'adsbygoogle.js' in content:
        return False

    if '</head>' in content:
        content = content.replace('</head>', f'    {ad_script}\n</head>')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

updated_count = 0
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            if insert_ad_script(os.path.join(root, file)):
                updated_count += 1
                print(f'Updated {file}')

print(f'Total {updated_count} files updated.')
