import os
import re

def bump_versions(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
            
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Update .css and .js links with ?v=4
                # Handles both existing ?v=X and no version
                
                # regex to find href/src ending in .css or .js
                # Group 1: href/src="
                # Group 2: path/file.css/js
                # Group 3: ?v=X (optional)
                # Group 4: "
                pattern = r'(href="|src=")([^" ]+\.(?:css|js))(\?v=\d+)?(")'
                
                new_content = re.sub(pattern, r'\1\2?v=4\4', content)
                
                if content != new_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated: {filepath}")

if __name__ == "__main__":
    bump_versions('.')
