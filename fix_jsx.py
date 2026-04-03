import re

output_file = "v2-next/src/app/page.tsx"

with open(output_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace inline mouseover/out with nothing (rely on CSS hover which we can add later, or it's just minor flair)
content = re.sub(r'onmouseover="[^"]*"', '', content)
content = re.sub(r'onmouseout="[^"]*"', '', content)

# Convert onclick window location to <Link> tags
# We have <button onclick="window.location.href='savings-calculator/index.html'">...
# We can just change <button ... onclick="..."> to <Link href="..."> and </button> to </Link>
# Wait, replacing <button> with <Link> is safer.
def replace_button_with_link(match):
    prefix = match.group(1)
    href = match.group(2)
    suffix = match.group(3)
    inner = match.group(4)
    # the href in vanilla was e.g. 'savings-calculator/index.html', we should change to '/savings-calculator'
    href = href.replace('/index.html', '')
    if not href.startswith('/'):
        href = '/' + href
    return f'<Link href="{href}" {prefix} {suffix}>{inner}</Link>'

content = re.sub(r'<button\s*([^>]*?)onclick="window\.location\.href=\'([^\']+)\'"([^>]*?)>(.*?)</button>', replace_button_with_link, content, flags=re.DOTALL)

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Inline event handlers purged.")
