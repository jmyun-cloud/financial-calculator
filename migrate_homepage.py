import re

input_file = "index.html"
output_file = "v2-next/src/app/page.tsx"

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# EXTRACT BODY STRUCTURE between </header> and <footer class="site-footer">
body_match = re.search(r'</header>(.*?)<footer class="site-footer">', content, re.DOTALL)
if body_match:
    html_content = body_match.group(1).strip()
else:
    print("Could not extract body content")
    exit(1)

jsx_content = html_content

# Only replace specific SVG attributes, DO NOT blind convert foo-bar
svg_attrs = [
    'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule',
    'clip-rule', 'clip-path'
]

for attr in svg_attrs:
    camel = ''.join(word.capitalize() for word in attr.split('-'))
    camel = camel[0].lower() + camel[1:]
    jsx_content = jsx_content.replace(attr, camel)

# Convert class= to className=
jsx_content = jsx_content.replace('class=', 'className=')
jsx_content = jsx_content.replace('for=', 'htmlFor=')

# Clean up inline styles
jsx_content = re.sub(r'style="([^"]*?)"', r'style={{}}', jsx_content)

# Fix HTML comments
jsx_content = jsx_content.replace('<!--', '{/*')
jsx_content = jsx_content.replace('-->', '*/}')

# Close unclosed tags
for tag in ['img', 'input', 'br', 'hr']:
    # Replace <img ...> with <img ... />
    jsx_content = re.sub(rf'<{tag}([^>]*?)(?<!/)>', rf'<{tag}\1 />', jsx_content)

page_tsx_blueprint = f"""import Link from 'next/link';

export default function Home() {{
  return (
    <>
      {jsx_content}
    </>
  );
}}
"""

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(page_tsx_blueprint)

print("page.tsx generated successfully with protected CSS classNames.")
