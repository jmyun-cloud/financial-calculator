import glob
import os

count = 0
for fpath in glob.glob('**/*.html', recursive=True):
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already injected
    if 'loader.js' in content:
        continue

    # Determine relative path.
    # If file is 'index.html', there are no slashes. If 'savings-calculator/index.html', there is 1 slash.
    normalized_path = fpath.replace('\\', '/')
    depth = normalized_path.count('/')
    
    if depth == 0:
        script_tag = '  <script src="./loader.js"></script>\n'
    else:
        script_tag = '  <script src="../loader.js"></script>\n'

    # Inject immediately before </head>
    new_content = content.replace('</head>', script_tag + '</head>', 1)

    if new_content != content:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1
        print('Updated:', fpath)

print(f'Done. Updated {count} files.')
