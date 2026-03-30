import os

with open('loan-calculator/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

reset_css = """
/* ===== RESET BUTTON ===== */
.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.reset-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
  border-color: transparent;
}

.reset-btn:hover svg {
  transform: rotate(180deg);
}
"""

if '.reset-btn {' not in css:
    css += "\n" + reset_css

with open('loan-calculator/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

# Update HTML
html_path = 'subscription-calculator/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

old_button = """<button class="reset-btn" onclick="resetForm('subscription-form')" title="초기화">
                            <span class="btn-icon">🔄</span>
                        </button>"""

new_button = """<button class="reset-btn" onclick="resetForm('subscription-form')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l5.94 4.54"/></svg>
                            초기화
                        </button>"""

if old_button in html:
    html = html.replace(old_button, new_button)
else:
    print("Warning: old button text not exactly matched.")

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Reset Button CSS and HTML injected successfully.")
