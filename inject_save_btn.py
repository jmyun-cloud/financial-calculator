#!/usr/bin/env python3
"""
inject_save_btn.py - 각 calculator.js의 결과 표시 직후 addSaveImageButton() 호출 삽입
"""
import os
import re

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

# 계산기별 결과 카드 ID 매핑 (js파일경로 -> (display_pattern, result_card_id))
CALC_MAP = {
    "savings-calculator/calculator.js": [
        ("result.style.display = 'block';", "result-deposit"),
    ],
    "loan-calculator/calculator.js": [
        ("document.getElementById('result-loan').style.display = 'block';", "result-loan"),
    ],
    "salary-calculator/calculator.js": [
        ('resultEl.style.display = "block";', "result-salary"),
    ],
    "tax-interest-calculator/calculator.js": [
        ("el.style.display = 'block'; el.scrollIntoView", "result-ti"),
    ],
    "severance-calculator/calculator.js": [
        ("resultEl.style.display = 'block';", "result-basic"),
    ],
    "compound-calculator/calculator.js": [
        ("document.getElementById('result-compound').style.display = 'block';", "result-compound"),
    ],
    "jeonse-calculator/calculator.js": [
        ('el.style.display = "block";', "result-tm"),
    ],
    "inflation-calculator/calculator.js": [
        ("el.style.display = 'block'; el.scrollIntoView", "result-fv"),
    ],
    "exchange-calculator/calculator.js": [
        ('el.style.display = "block";', "result-ex"),
    ],
    "pension-calculator/calculator.js": [
        ("el.style.display = 'block'; el.scrollIntoView", "result-national"),
    ],
}

def inject_js(filepath, patterns):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'addSaveImageButton' in content:
        return False  # 이미 주입됨

    changed = False
    # 첫 번째 패턴만 사용해서 주입 (모든 show display 패턴에 다 붙이면 중복될 수 있음)
    for display_line, card_id in patterns:
        # display_line 이 있는 첫 번째 위치 뒤에만 삽입
        idx = content.find(display_line)
        if idx == -1:
            continue
        # 해당 라인 끝 찾기
        end_of_line = content.find('\n', idx)
        if end_of_line == -1:
            end_of_line = len(content)
        
        inject_code = f"\n  if (typeof addSaveImageButton === 'function') addSaveImageButton('{card_id}');"
        content = content[:end_of_line] + inject_code + content[end_of_line:]
        changed = True
        break  # 첫 번째 매칭만

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
    return changed


def main():
    updated = []
    for rel_path, patterns in CALC_MAP.items():
        filepath = os.path.join(PROJECT_ROOT, rel_path.replace('/', os.sep))
        if not os.path.exists(filepath):
            print(f"[MISS] Not found: {rel_path}")
            continue
        try:
            if inject_js(filepath, patterns):
                updated.append(rel_path)
                print(f"[OK] Updated: {rel_path}")
            else:
                print(f"[SKIP] Already done: {rel_path}")
        except Exception as e:
            print(f"[ERROR] {rel_path}: {e}")

    print(f"\nTotal: {len(updated)} files updated")


if __name__ == "__main__":
    main()
