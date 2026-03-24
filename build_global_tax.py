import os
import re

# Read salary-calculator/index.html as template
with open('salary-calculator/index.html', 'r', encoding='utf-8') as f:
    template = f.read()

# Make the directory
os.makedirs('global-tax-calculator', exist_ok=True)

# 1. Replace Title, Meta, and OG tags
html = template.replace(
    '연봉 계산기 2026 - 월 실수령액·4대보험·소득세 자동 계산 | 금융계산기.kr',
    '종합소득세 계산기 2026 (예상세액) - 프리랜서·개인사업자 | 금융계산기.kr'
)
html = html.replace(
    '2026년 기준 연봉 실수령액 계산기. 연봉 입력 시 국민연금·건강보험·고용보험·소득세를 자동 계산하여 월 실수령액을 즉시 확인하세요. 시급→월급 변환도 지원합니다.',
    '프리랜서, 개인사업자를 위한 2026년 종합소득세 예상세액 계산기. 총수입과 필요경비, 소득공제를 입력하면 5월 종소세 신고 시 내야 할 예상 세금(또는 환급금)을 즉시 계산합니다.'
)
html = html.replace(
    '연봉 계산기, 실수령액 계산기, 연봉 실수령, 4대보험 계산기, 소득세 계산기, 2026 최저시급, 시급 계산기',
    '종합소득세 계산기, 종소세 계산, 프리랜서 종소세, 5월 종합소득세, 삼쩜삼 환급, 사업소득세, 누진세율'
)
html = html.replace(
    '2026 연봉 계산기 - 월 실수령액·4대보험 자동 계산',
    '종합소득세 계산기 (2026년 신고분) - 예상세액 3초 확인'
)
html = html.replace(
    '연봉 입력만으로 4대보험·소득세 공제 후 월 실수령액을 즉시 계산합니다. 2026년 최신 요율 적용.',
    '사업소득, 프리랜서 등 총수입과 경비를 입력하여 5월 종합소득세 신고 시 나의 예상 세액(또는 환급금)을 빠르고 정확하게 계산합니다.'
)

# 2. Replace Schema.org JSON
html = html.replace('연봉 계산기 (Salary Calculator)', '종합소득세 계산기 (Global Income Tax Calculator)')
html = html.replace('2026년 최신 4대보험 요율과 간이세액표를 반영한 연봉 실수령액 계산기입니다. 비과세 수당, 부양가족 수 등을 설정하여 실제 월 수령액을 정확히 산출합니다.', '대한민국 프리랜서 및 개인사업자를 위해 최신 누진세율(6%~45%)을 반영하여 종합소득세 예상세액을 계산합니다.')
html = html.replace('"name": "연봉 계산기"', '"name": "종합소득세 계산기"')
html = html.replace('"item": "https://richcalc.kr/salary-calculator/"', '"item": "https://richcalc.kr/global-tax-calculator/"')

# 3. Replace Theme Colors to Rose (Pinkish Red)
html = html.replace('--primary: #059669;', '--primary: #e11d48;') # Rose 600
html = html.replace('--primary-dark: #047857;', '--primary-dark: #be123c;') # Rose 700
html = html.replace('--primary-light: #ecfdf5;', '--primary-light: #fff1f2;') # Rose 50
html = html.replace('--primary-mid: #d1fae5;', '--primary-mid: #ffe4e6;') # Rose 100

html = html.replace('linear-gradient(135deg, #059669 0%, #047857 100%)', 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)')
html = html.replace('linear-gradient(135deg,\n          #059669 0%,\n          #047857 50%,\n          #065f46 100%)', 'linear-gradient(135deg, #e11d48 0%, #be123c 50%, #9f1239 100%)')
html = html.replace('rgba(5, 150, 105', 'rgba(225, 29, 72') # Shadow/Borders
html = html.replace('#059669', '#e11d48')
html = html.replace('#047857', '#be123c')
html = html.replace('content="#1a56e8"', 'content="#e11d48"')

# 4. Replace Header & Navigation
html = html.replace('<a href="#calculator" class="nav-link active">연봉 계산기</a>', '<a href="#calculator" class="nav-link active">종합소득세 계산기</a>')
html = html.replace('<span class="bc-current">연봉 계산기</span>', '<span class="bc-current">종합소득세 예상세액 계산기</span>')
html = html.replace('연봉 계산기\n          <span style="font-size: 1.2rem; opacity: 0.8">2026</span>', '종합소득세 계산기')
html = html.replace('연봉을 입력하면 <strong>국민연금·건강보험·고용보험·소득세</strong>를\n          자동 계산하여 <strong>월 실수령액</strong>을 즉시 확인할 수\n          있습니다. 2026년 최신 요율 적용.', '매년 5월 신고하는 <strong>종합소득세 예상세액</strong>(프리랜서, 개인사업자 중심)을<br>쉽고 빠르게 계산해 드립니다. 2026년 기준 누진세율 및 기본공제 적용.')

# Replace Tags
html = html.replace('<span class="tag">✓ 2026년 4대보험 요율</span>\n          <span class="tag">✓ 간이세액표 소득세</span>\n          <span class="tag">✓ 시급→월급 계산</span>\n          <span class="tag">✓ 부양가족 반영</span>', '<span class="tag">✓ 2026년 누진세율(6%~45%)</span>\n          <span class="tag">✓ 프리랜서 기납부 3.3% 반영</span>\n          <span class="tag">✓ 인적·소득공제</span>\n          <span class="tag">✓ 환급/납부 예상세액 도출</span>')

html = html.replace('<a href="../guide/salary.html" class="nav-link">금융 가이드</a>', '<a href="../guide/global-tax.html" class="nav-link">종소세 가이드</a>')

# Replace Guide Promo at bottom
html = html.replace('<a href="../guide/salary.html"', '<a href="../guide/global-tax.html"')
html = html.replace('2026 연봉 실수령액 상세 가이드 보기', '5월 종합소득세 신고 & 환급 액수 늘리는 비법 안내')
html = html.replace('4대보험 구하는 공식, 비과세 수당 활용법, 실수령액 높이는 연말정산 꿀팁들을 확인하세요. 👉', '프리랜서 추계신고, 인적공제 기준, 그리고 절세 노하우를 총망라했습니다. 👉')

# 5. Build New Calculator Section
calc_html = """
      <section class="calculator-section" id="calculator">
        <!-- 탭 -->
        <div class="tab-switcher" role="tablist">
          <button class="tab-btn active" id="tab-globaltax" role="tab" aria-selected="true" aria-controls="panel-globaltax" onclick="switchTab('globaltax')">
            📑 종합소득세 예상세액 계산
          </button>
        </div>

        <!-- 실수령액 구하기 탭 -->
        <div class="tab-panel active" id="panel-globaltax" role="tabpanel">
          <div class="calc-card">
            <h2 class="calc-card-title">종합소득세 간편 계산<span class="year-badge">2026년 신고분</span></h2>
            <p class="calc-card-desc">작년 한해 동안 벌어들인 총 수입과 필요경비, 기초공제 항목을 입력하세요.</p>
            <div class="mw-badge">
              📌 본 계산기는 프리랜서 및 소규모 개인사업자의 <strong>'사업소득'</strong>을 중심으로 한 간편 예상 계산기입니다.
            </div>

            <div class="form-grid">
              <div class="form-group" style="grid-column: span 2">
                <label class="form-label" for="t-gross">연간 총 수입 (매출)</label>
                <div class="input-wrap">
                  <input type="text" id="t-gross" class="form-input large-input" placeholder="30,000,000" inputmode="numeric" onkeyup="formatCurrencyInput(this); updateKoreanHelper(this, 't-gross-hint', '원');" />
                  <span class="input-unit">원</span>
                </div>
                <span class="form-hint" id="t-gross-hint">세전 총 수입금액</span>
              </div>

              <div class="form-group" style="grid-column: span 2">
                <label class="form-label" for="t-expense">필요경비 (단순/기준경비율 적용 후 금액 또는 장부상 지출액)</label>
                <div class="input-wrap">
                  <input type="text" id="t-expense" class="form-input" placeholder="10,000,000" inputmode="numeric" onkeyup="formatCurrencyInput(this);" />
                  <span class="input-unit">원</span>
                </div>
                <span class="form-hint">총 수입에서 차감될 업무상 비용</span>
              </div>

              <div class="form-group">
                <label class="form-label" for="t-deduction">소득공제 (인적공제 등)</label>
                <div class="input-wrap">
                  <input type="text" id="t-deduction" class="form-input" placeholder="1,500,000" inputmode="numeric" onkeyup="formatCurrencyInput(this);" value="1,500,000" />
                  <span class="input-unit">원</span>
                </div>
                <span class="form-hint">기본 인적공제 본인 150만원 자동적용</span>
              </div>

              <div class="form-group">
                <label class="form-label" for="t-paid">기납부세액 (미리 낸 세금)</label>
                <div class="input-wrap">
                  <input type="text" id="t-paid" class="form-input" placeholder="0" inputmode="numeric" onkeyup="formatCurrencyInput(this);" />
                  <span class="input-unit">원</span>
                </div>
                <span class="form-hint">프리랜서 3.3% 떼인 총액 등</span>
              </div>
            </div>

            <button class="calc-btn" onclick="calculateTax()">
              <span class="btn-icon">⚡</span> 종합소득세 예상 확인하기
            </button>
          </div>

          <!-- 결과 -->
          <div class="result-card" id="result-tax" style="display: none">
            <h3 class="result-title" id="tax-result-title">📑 예상 납부/환급 결과</h3>
            <div class="result-summary-box" id="result-tax-summary"></div>
            
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 12px; margin-top: 24px; color: var(--text-primary);">📋 과세표준 및 세금 산출 내역</h4>
            <table class="deduction-table" id="deduction-table-t"></table>

            <div class="chart-wrap" style="margin-top: 30px;">
              <canvas id="chart-tax" width="240" height="240"></canvas>
              <div class="chart-legend" id="legend-tax"></div>
            </div>

            <div class="result-notice">
              ※ 누진세율은 현행 6% ~ 45% 누진 공제 방식을 채택하고 있습니다.<br>
              ※ 지방소득세 10%가 최종 산출세액에 자동으로 합산·계산되었습니다.<br>
              ※ 세액공제(자녀, 연금계좌, 의료비 등)가 있다면 이 계산기가 산출한 금액보다 최종 세금이 더 <strong>적게(또는 환급액이 더 많게)</strong> 나올 수 있습니다.
            </div>
            
            <div style="margin-top: 15px; text-align: right;">
              <button class="action-btn" onclick="exportToImage('result-tax', '종합소득세예상결과.png')">
                <span class="btn-icon">📸</span> 결과 이미지로 저장
              </button>
            </div>
          </div>
        </div>
      </section>
"""

html = re.sub(r'<section class="calculator-section" id="calculator">.*?</section>', calc_html, html, flags=re.DOTALL)

# Adjust active side link
html = html.replace('class="sidebar-link active-link"><span class="link-icon">💼</span>\n                <div class="link-info">\n                  <strong>연봉 계산기</strong>', 'class="sidebar-link"><span class="link-icon">💼</span>\n                <div class="link-info">\n                  <strong>연봉 계산기</strong>')
html = re.sub(r'<ul class="sidebar-links">', '<ul class="sidebar-links">\n            <li>\n              <a href="#" class="sidebar-link active-link"><span class="link-icon">📑</span>\n                <div class="link-info">\n                  <strong>종합소득세 계산기</strong><small>현재 페이지</small>\n                </div>\n              </a>\n            </li>', html)

# Modify Sidebar widgets targeting Global Tax
sidebar_widgets = """
        <!-- 누진세율 위젯 -->
        <div class="sidebar-widget info-widget">
          <h2 class="widget-title">📋 최신 종합소득세 세율 (누진공제)</h2>
          <table class="tax-table">
            <thead>
              <tr>
                <th>과세표준 구간</th>
                <th>세율(누진공제)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1,400만원 이하</td>
                <td class="tax-rate exempt">6% (-)</td>
              </tr>
              <tr>
                <td>5,000만원 이하</td>
                <td class="tax-rate preferred">15% (126만)</td>
              </tr>
              <tr>
                <td>8,800만원 이하</td>
                <td class="tax-rate">24% (576만)</td>
              </tr>
              <tr>
                <td>1.5억원 이하</td>
                <td class="tax-rate">35% (1,544만)</td>
              </tr>
              <tr>
                <td>3억원 이하</td>
                <td class="tax-rate" style="color:var(--danger)">38% (1,994만)</td>
              </tr>
              <tr>
                <td>5억원 이하</td>
                <td class="tax-rate" style="color:var(--danger)">40% (2,594만)</td>
              </tr>
              <tr>
                <td>10억원 이하</td>
                <td class="tax-rate" style="color:#b91c1c">42% (3,594만)</td>
              </tr>
              <tr>
                <td>10억원 초과~</td>
                <td class="tax-rate" style="color:#991b1b">45% (6,594만)</td>
              </tr>
            </tbody>
          </table>
          <p class="widget-note">
            과세표준 = 총수입 - 필요경비 - 소득공제<br>
            지방소득세는 위 세율로 산출된 세액의 10% 추가 부과.
          </p>
        </div>
"""
html = re.sub(r'<!-- 2026 요율 위젯 -->.*?<!-- ===== MIDDLE AD ===== -->', sidebar_widgets + '\n      </aside>\n    </div>\n  </main>\n\n  <!-- ===== MIDDLE AD ===== -->', html, flags=re.DOTALL)

with open('global-tax-calculator/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
