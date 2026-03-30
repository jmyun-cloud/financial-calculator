import os

# 1. Update style.css
css_path = 'loan-calculator/style.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

form_stack_css = """
/* ===== FORM STACK ===== */
.form-stack {
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-bottom: 24px;
}
"""

if '.form-stack {' not in css:
    css += "\n" + form_stack_css

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

# 2. Update index.html
html_path = 'subscription-calculator/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

if '<form id="subscription-form">' in html:
    html = html.replace('<form id="subscription-form">', '<form id="subscription-form" class="form-stack">')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Form gap spacing injected successfully.")
