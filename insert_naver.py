import os
import glob

naver_meta = '<meta name="naver-site-verification" content="a06011ac826bc5ab12896ed43961cb7960df04ed" />'

count = 0
for filepath in glob.glob('**/*.html', recursive=True):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content
        
        # Insert Naver Verification Meta Tag
        if 'naver-site-verification' not in new_content:
            new_content = new_content.replace('<head>', f'<head>\n    {naver_meta}', 1)

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            print(f"Updated: {filepath}")
    except Exception as e:
        print(f"Error on {filepath}: {e}")

print(f"Total updated files: {count}")
