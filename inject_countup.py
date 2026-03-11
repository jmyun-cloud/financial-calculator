import glob
import os

count = 0
for fpath in glob.glob('**/*.html', recursive=True):
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already injected
    if 'countup.js' in content:
        continue

    # Determine relative path.
    normalized_path = fpath.replace('\\', '/')
    depth = normalized_path.count('/')
    
    if depth == 0:
        script_tag = '  <script src="./countup.js"></script>\n'
    else:
        script_tag = '  <script src="../countup.js"></script>\n'

    # Inject immediately before </head> or at the end of body
    # countup uses MutationObserver so anywhere works, but end of body is safer for DOM
    # let's inject before </body>
    new_content = content.replace('</body>', script_tag + '</body>', 1)

    if new_content != content:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1
        print('Updated:', fpath)

print(f'Done. Updated {count} files.')
