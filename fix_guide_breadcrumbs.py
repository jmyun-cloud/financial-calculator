import os
import glob
import re

calc_names = {
    'salary.html': ('연봉 계산기', '../salary-calculator/index.html'),
    'severance.html': ('퇴직금 계산기', '../severance-calculator/index.html'),
    'tax-interest.html': ('세후 이자 계산기', '../tax-interest-calculator/index.html'),
    'loan.html': ('대출 이자 계산기', '../loan-calculator/index.html'),
    'pension.html': ('연금 수령액 계산기', '../pension-calculator/index.html'),
    'jeonse.html': ('전월세 전환 계산기', '../jeonse-calculator/index.html'),
    'inflation.html': ('물가상승률 계산기', '../inflation-calculator/index.html'),
    'savings.html': ('예적금 계산기', '../savings-calculator/index.html'),
    'compound.html': ('복리 계산기', '../compound-calculator/index.html'),
    'freelancer.html': ('프리랜서 계산기', '../freelancer-calculator/index.html'),
    'global-tax.html': ('종합소득세 계산기', '../global-tax-calculator/index.html'),
    'exchange.html': ('환율 계산기', '../exchange-calculator/index.html')
}

guide_dir = r'c:\Users\E240471\OneDrive - Daeduck Electronics Co., Ltd\01. 업무\02. 개인업무\Project\guide'

count = 0
for file_path in glob.glob(os.path.join(guide_dir, '*.html')):
    filename = os.path.basename(file_path)
    if filename in calc_names:
        calc_title, calc_link = calc_names[filename]
        
        with open(file_path, 'r', encoding='utf-8') as f:
            html = f.read()

        html = re.sub(
            r'<a href="[^"]*\.html" style="color: inherit;">금융 가이드</a>',
            f'<a href="{calc_link}" style="color: inherit;">{calc_title}</a>',
            html
        )
        
        html = re.sub(
            r'<a href="[^"]*\.html" class="nav-link active">금융 가이드</a>',
            f'<a href="{calc_link}" class="nav-link active">계산기로 돌아가기 ▸</a>',
            html
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(html)
        count += 1

print(f"Updated breadcrumbs and nav links across {count} guide files.")
