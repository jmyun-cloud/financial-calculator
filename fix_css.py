import os
import re

with open('loan-calculator/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace hardcoded orange colors with var(--primary) globally!
# This allows each calculator to easily override the color by redefining --primary in its local <style>.
css = css.replace('#e85d1a', 'var(--primary)')
css = css.replace('#c0390a', 'var(--primary-dark)')
css = css.replace('#fff3ee', 'var(--primary-light)')

# Use neutral generic shadows for buttons since they can change color dynamically now.
css = css.replace('rgba(232, 93, 26, 0.4)', 'rgba(0, 0, 0, 0.15)')
css = css.replace('rgba(232, 93, 26, 0.5)', 'rgba(0, 0, 0, 0.25)')

tooltip_css = """
/* ===== TOOLTIP ===== */
.tooltip-icon {
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 50%;
  font-size: 0.75rem;
  font-style: normal;
  color: var(--text-muted);
  margin-left: 6px;
  vertical-align: middle;
}

.tooltip-icon::before {
  content: "?";
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  font-size: 0.7rem;
}

.tooltip-icon::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 150%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  width: max-content;
  max-width: 280px;
  padding: 10px 14px;
  background: rgba(15, 23, 42, 0.95);
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 8px;
  line-height: 1.5;
  white-space: pre-wrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  pointer-events: none;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  text-align: left;
}

.tooltip-icon:hover::after,
.tooltip-icon:active::after {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.dark-mode .tooltip-icon::after {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-primary);
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}
"""

if '.tooltip-icon {' not in css:
    css += "\n" + tooltip_css

with open('loan-calculator/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

# Update Tooltip UX
with open('subscription-calculator/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Swap native title for data-tooltip for our custom CSS to hook into. Remove the emoji.
html = re.sub(
    r'<span class="tooltip-icon" title="(.*?)">ℹ️</span>',
    r'<span class="tooltip-icon" data-tooltip="\1"></span>',
    html
)

with open('subscription-calculator/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("CSS and HTML successfully updated!")
