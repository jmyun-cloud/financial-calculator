import re

with open('subscription-calculator/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. input-group -> form-group
html = html.replace('class="input-group"', 'class="form-group"')

# 2. label -> label class="form-label"
html = html.replace('<label for="無주택기간">', '<label class="form-label" for="無주택기간">')
html = html.replace('<label for="부양가족수">', '<label class="form-label" for="부양가족수">')
html = html.replace('<label for="가입기간">', '<label class="form-label" for="가입기간">')

# 3. Remove native title and emoji for the custom tooltips using DOTALL
# Tooltip 1
html = re.sub(
    r'<span class="tooltip-icon"\s+title="만 30세 이상부터 산정되거나, 혼인신고일 중 빠른 날을 기준으로 1년마다 2점씩 가산됩니다\.">.*?</span>',
    r'<span class="tooltip-icon" data-tooltip="만 30세 이상부터 산정되거나, 혼인신고일 중 빠른 날을 기준으로 1년마다 2점씩 가산됩니다."></span>',
    html, flags=re.DOTALL
)

# Tooltip 2
html = re.sub(
    r'<span class="tooltip-icon"\s+title="본인을 제외한 세대원 수\. 1명당 5점씩 가산되며 기본점수는 5점입니다\.">.*?</span>',
    r'<span class="tooltip-icon" data-tooltip="본인을 제외한 세대원 수. 1명당 5점씩 가산되며 기본점수는 5점입니다."></span>',
    html, flags=re.DOTALL
)

# Tooltip 3
html = re.sub(
    r'<span class="tooltip-icon"\s+title="최초 가입일 기준으로 은행에서 자동 산정됩니다\. 1년마다 1점씩 가산\.">.*?</span>',
    r'<span class="tooltip-icon" data-tooltip="최초 가입일 기준으로 은행에서 자동 산정됩니다. 1년마다 1점씩 가산."></span>',
    html, flags=re.DOTALL
)

# 4. Remove unsupported <span class="input-icon">...</span> completely
html = re.sub(r'<span class="input-icon">.*?</span>\s*', '', html)

with open('subscription-calculator/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("subscription-calculator CSS and Tooltip UX patched!")
