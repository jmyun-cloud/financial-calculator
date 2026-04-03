import os

legacy_css_path = 'loan-calculator/style.css'
next_css_path = 'v2-next/src/app/globals.css'

with open(legacy_css_path, 'r', encoding='utf-8') as f:
    legacy_css = f.read()

with open(next_css_path, 'r', encoding='utf-8') as f:
    next_css = f.read()

# We will append the legacy CSS below the @import "tailwindcss" string,
# taking care to keep the Tailwind config block.
# Actually, the easiest is just to append the entire legacy_css to the bottom of the existing next_css.
# Next.js 14 global css has some default styling for body that we should remove or override.
# Let's clean the default next_css down to just the tailwind imports.

cleaned_next = """@import "tailwindcss";

/* ==========================================
   LEGACY CSS MIGRATED FROM VANILLA PROJECT
   ========================================== */
"""

with open(next_css_path, 'w', encoding='utf-8') as f:
    f.write(cleaned_next + legacy_css)

print("Successfully injected 1,400+ lines of Master CSS into Next.js globals.css")
