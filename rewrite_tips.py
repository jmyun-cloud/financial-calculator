import os
import re

calc_dirs = [
    "savings-calculator",
    "loan-calculator",
    "compound-calculator",
    "salary-calculator"
]

base_path = r"c:\Users\E240471\OneDrive - Daeduck Electronics Co., Ltd\01. 업무\02. 개인업무\Project"

def replace_tip_logic(code, func_name, tip_key, old_tip_id):
    # We look for tipEl.innerHTML = `...`; injected via our previous script
    # and replace the whole block with getTipHtml
    
    # Try to find the block
    pattern = r'(tipEl\.innerHTML\s*=\s*`[\s\S]*?`;)'
    
    # To be safe, we only replace inside the specific function
    match = re.search(r'function\s+' + func_name + r'\s*\(', code)
    if not match:
        print(f"Function {func_name} not found.")
        return code
        
    start_idx = match.end()
    brace_count = 1
    idx = start_idx
    while idx < len(code):
        if code[idx] == '{': brace_count += 1
        elif code[idx] == '}':
            brace_count -= 1
            if brace_count == 0: break
        idx += 1
    end_idx = idx
    
    func_body = code[start_idx:end_idx]
    
    if 'getTipHtml(' not in func_body:
        new_func_body = re.sub(pattern, f"tipEl.innerHTML = getTipHtml('{tip_key}', 1);", func_body)
        return code[:start_idx] + new_func_body + code[end_idx:]
    else:
        print(f"Already using getTipHtml in {func_name}")
        return code

for cd in calc_dirs:
    # 1. Update HTML to include tips.js
    html_path = os.path.join(base_path, cd, "index.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()
        
        if "tips.js" not in html:
            html = html.replace(
                '<script src="../reset_form.js?v=4"></script>',
                '<script src="../reset_form.js?v=4"></script>\n  <script src="../js/data/tips.js?v=1"></script>'
            )
            with open(html_path, "w", encoding="utf-8") as f:
                f.write(html)

    # 2. Update JS
    js_path = os.path.join(base_path, cd, "calculator.js")
    if not os.path.exists(js_path):
        continue
        
    with open(js_path, "r", encoding="utf-8") as f:
        code = f.read()

    if cd == "savings-calculator":
        code = replace_tip_logic(code, "displayDepositResult", "savings-deposit", "d-tip")
        code = replace_tip_logic(code, "displayInstallmentResult", "savings-installment", "i-tip")
    elif cd == "loan-calculator":
        code = replace_tip_logic(code, "displayResult", "loan", "l-tip")
    elif cd == "compound-calculator":
        code = replace_tip_logic(code, "displayResult", "compound", "c-tip")
    elif cd == "salary-calculator":
        code = replace_tip_logic(code, "displaySalaryResult", "salary", "s-tip")
        # Hourly logic didn't have a distinct tip defined in tips.js, I will map it to 'salary'
        code = replace_tip_logic(code, "displayHourlyResult", "salary", "h-tip")

    with open(js_path, "w", encoding="utf-8") as f:
        f.write(code)

print("Tips refactoring completed.")
