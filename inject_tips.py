import os
import re

calc_dirs = [
    "savings-calculator",
    "loan-calculator",
    "compound-calculator",
    "salary-calculator"
]

base_path = r"c:\Users\E240471\OneDrive - Daeduck Electronics Co., Ltd\01. 업무\02. 개인업무\Project"

def insert_tip_logic(code, func_name, container_id, tip_id, title, desc, link_text, link_url):
    # Find the end of the specified display function
    # The function ends with:   renderDonutChart(...) // or similar\n}
    # We will search for the function definition, then find its closing brace.
    # A simple regex to find the display function
    match = re.search(r'function\s+' + func_name + r'\s*\([^)]*\)\s*\{', code)
    if not match:
        print(f"Function {func_name} not found.")
        return code
    
    start_idx = match.end()
    brace_count = 1
    idx = start_idx
    while idx < len(code):
        if code[idx] == '{':
            brace_count += 1
        elif code[idx] == '}':
            brace_count -= 1
            if brace_count == 0:
                break
        idx += 1
    
    end_idx = idx
    
    # Check if tip logic is already there
    if 'id = "' + tip_id + '"' in code[start_idx:end_idx]:
        print(f"Tip already injected in {func_name}")
        return code
    
    tip_code = f"""
  // Dwell Time Enhancement: Quick Tip
  let tipEl = document.getElementById('{tip_id}');
  if (!tipEl) {{
    tipEl = document.createElement('div');
    tipEl.id = '{tip_id}';
    tipEl.className = 'quick-tip fade-in';
    tipEl.style.cssText = 'margin-top: 24px; padding: 20px; background: rgba(5, 150, 105, 0.08); border-left: 4px solid #059669; border-radius: 8px;';
    document.getElementById('{container_id}').appendChild(tipEl);
  }}
  tipEl.innerHTML = `
    <h4 style="margin: 0 0 8px 0; color: #059669; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;"><span style="font-size: 1.2rem;">💡</span> <strong>{title}</strong></h4>
    <p style="margin: 0 0 16px 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">{desc}</p>
    <a href="../{link_url}" class="btn-next-step" style="display: inline-flex; align-items: center; justify-content: center; padding: 10px 18px; background: var(--surface-1); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); text-decoration: none; transition: all 0.2s;" onmouseover="this.style.background='var(--surface-2)';" onmouseout="this.style.background='var(--surface-1)';">{link_text} &rarr;</a>
  `;
"""
    new_code = code[:end_idx] + tip_code + code[end_idx:]
    print(f"Injected into {func_name}")
    return new_code

for cd in calc_dirs:
    js_path = os.path.join(base_path, cd, "calculator.js")
    if not os.path.exists(js_path):
        continue
    with open(js_path, "r", encoding="utf-8") as f:
        code = f.read()
        
    if cd == "savings-calculator":
        code = insert_tip_logic(code, "displayDepositResult", "result-deposit", "d-tip", "다음 단계: 복리로 굴리기", "예금 만기 후 이 목돈을 어떻게 굴릴지 고민이신가요? 복리 수익률 계산기로 재투자 계획을 세워보세요.", "복리 계산기로 이동", "compound-calculator/index.html")
        code = insert_tip_logic(code, "displayInstallmentResult", "result-installment", "i-tip", "다음 단계: 목돈 굴리기", "적금 만기 후 모인 돈을 다시 굴릴 계획이 필요합니다. 모은 돈이 복리로 얼마나 불어날지 시뮬레이션 해보세요.", "복리 계산기로 이동", "compound-calculator/index.html")
    elif cd == "loan-calculator":
        code = insert_tip_logic(code, "displayResult", "result-loan", "l-tip", "대출 상환 달성 후 계획", "무사히 상환을 마친 뒤, 대출금 상환에 쓰던 돈을 그대로 적금에 넣는다면? 엄청난 목돈이 됩니다.", "적금 계산기로 시뮬레이션", "savings-calculator/index.html")
    elif cd == "compound-calculator":
        code = insert_tip_logic(code, "displayResult", "result-compound", "c-tip", "투자 은퇴 계획 세우기", "이 시드머니로 노후를 준비한다면 연금을 얼마나 받을 수 있을까요?", "연금 수령액 알아보기", "pension-calculator/index.html")
    elif cd == "salary-calculator":
        code = insert_tip_logic(code, "displaySalaryResult", "result-salary", "s-tip", "실수령액 모으기", "이번 달 실수령액 중 일부를 먼저 저축하세요. 매달 일정액을 적금하면 만기에 얼마가 되는지 확인해보세요.", "정기적금 계산해보기", "savings-calculator/index.html")
        code = insert_tip_logic(code, "displayHourlyResult", "result-hourly", "h-tip", "시급을 월급처럼", "시급으로 환산한 월 급여를 적금으로 모은다면 목돈이 될 수 있습니다.", "적금 계산해보기", "savings-calculator/index.html")

    with open(js_path, "w", encoding="utf-8") as f:
        f.write(code)

print("All tips injected successfully.")
