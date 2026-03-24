import os
import re

# Read salary-calculator/index.html as template
with open('salary-calculator/index.html', 'r', encoding='utf-8') as f:
    template = f.read()

# Make the directory
os.makedirs('freelancer-calculator', exist_ok=True)

# 1. Replace Title, Meta, and OG tags
html = template.replace(
    '연봉 계산기 2026 - 월 실수령액·4대보험·소득세 자동 계산 | 금융계산기.kr',
    '프리랜서 3.3% 계산기 - 알바·N잡러 실수령액 및 세금 자동 계산 | 금융계산기.kr'
)
html = html.replace(
    '2026년 기준 연봉 실수령액 계산기. 연봉 입력 시 국민연금·건강보험·고용보험·소득세를 자동 계산하여 월 실수령액을 즉시 확인하세요. 시급→월급 변환도 지원합니다.',
    '프리랜서, 아르바이트, N잡러를 위한 3.3% 세금 계산기. 총 수입을 입력하면 3.3% 원천징수 세액(사업소득세, 지방소득세)을 자동 공제하여 정확한 실수령액을 즉시 확인하세요.'
)
html = html.replace(
    '연봉 계산기, 실수령액 계산기, 연봉 실수령, 4대보험 계산기, 소득세 계산기, 2026 최저시급, 시급 계산기',
    '프리랜서 계산기, 3.3% 계산기, 아르바이트 세금, 프리랜서 세금, 실수령액 계산기, 종합소득세, 원천징수'
)
html = html.replace(
    '2026 연봉 계산기 - 월 실수령액·4대보험 자동 계산',
    '프리랜서 3.3% 계산기 - 원천징수 세급 및 실수령액 자동 산출'
)
html = html.replace(
    '연봉 입력만으로 4대보험·소득세 공제 후 월 실수령액을 즉시 계산합니다. 2026년 최신 요율 적용.',
    '프리랜서 수입 입력 시 3.3% 원천징수 세액 공제 후 정확한 실수령액을 즉시 계산합니다.'
)

# 2. Replace Schema.org JSON
html = html.replace('연봉 계산기 (Salary Calculator)', '프리랜서 3.3% 계산기 (Freelancer Tax Calculator)')
html = html.replace('2026년 최신 4대보험 요율과 간이세액표를 반영한 연봉 실수령액 계산기입니다. 비과세 수당, 부양가족 수 등을 설정하여 실제 월 수령액을 정확히 산출합니다.', '프리랜서 및 아르바이트의 3.3% 원천징수 세액을 공제한 실수령액을 정확히 산출합니다.')
html = html.replace('"name": "연봉 계산기"', '"name": "프리랜서 3.3% 계산기"')
html = html.replace('"item": "https://richcalc.kr/salary-calculator/"', '"item": "https://richcalc.kr/freelancer-calculator/"')

# 3. Replace Theme Colors
html = html.replace('--primary: #059669;', '--primary: #8b5cf6;') # Purple
html = html.replace('--primary-dark: #047857;', '--primary-dark: #7c3aed;')
html = html.replace('--primary-light: #ecfdf5;', '--primary-light: #f5f3ff;')
html = html.replace('--primary-mid: #d1fae5;', '--primary-mid: #ede9fe;')

html = html.replace('linear-gradient(135deg, #059669 0%, #047857 100%)', 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)')
html = html.replace('linear-gradient(135deg,\n          #059669 0%,\n          #047857 50%,\n          #065f46 100%)', 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)')
html = html.replace('rgba(5, 150, 105', 'rgba(139, 92, 246') # Shadow/Borders
html = html.replace('#059669', '#8b5cf6')
html = html.replace('#047857', '#7c3aed')
html = html.replace('content="#1a56e8"', 'content="#8b5cf6"')

# 4. Replace Header & Navigation
html = html.replace('<a href="#calculator" class="nav-link active">연봉 계산기</a>', '<a href="#calculator" class="nav-link active">프리랜서 계산기</a>')
html = html.replace('<span class="bc-current">연봉 계산기</span>', '<span class="bc-current">프리랜서 3.3% 계산기</span>')
html = html.replace('연봉 계산기\n          <span style="font-size: 1.2rem; opacity: 0.8">2026</span>', '프리랜서 3.3% 세금 계산기')
html = html.replace('연봉을 입력하면 <strong>국민연금·건강보험·고용보험·소득세</strong>를\n          자동 계산하여 <strong>월 실수령액</strong>을 즉시 확인할 수\n          있습니다. 2026년 최신 요율 적용.', '아르바이트나 프리랜서 등 3.3% 원천징수 근로자의 수입을 입력하면, <strong>사업소득세(3%) 및 지방소득세(0.3%)</strong>를 자동 계산하여 <strong>정확한 실수령액</strong>을 즉시 확인해 줍니다.')

# Replace Tags
html = html.replace('<span class="tag">✓ 2026년 4대보험 요율</span>\n          <span class="tag">✓ 간이세액표 소득세</span>\n          <span class="tag">✓ 시급→월급 계산</span>\n          <span class="tag">✓ 부양가족 반영</span>', '<span class="tag">✓ 3.3% 원천징수 계산</span>\n          <span class="tag">✓ 실수령액 및 공급가액 역산</span>\n          <span class="tag">✓ 사업·지방소득세 분리 안내</span>\n          <span class="tag">✓ 월별 차트 시각화</span>')

html = html.replace('<a href="../guide/salary.html" class="nav-link">금융 가이드</a>', '<a href="../guide/freelancer.html" class="nav-link">금융 가이드</a>')

# Replace Guide Promo at bottom
html = html.replace('<a href="../guide/salary.html"', '<a href="../guide/freelancer.html"')
html = html.replace('2026 연봉 실수령액 상세 가이드 보기', '프리랜서 종합소득세 및 환급금(삼쩜삼) 가이드 보기')
html = html.replace('4대보험 구하는 공식, 비과세 수당 활용법, 실수령액 높이는 연말정산 꿀팁들을 확인하세요. 👉', '5월 종합소득세 신고 시 3.3% 세금을 환급받는 방법과 절세 팁을 확인하세요! 👉')

# 5. Build New Calculator Section
calc_html = """
      <section class="calculator-section" id="calculator">
        <!-- 탭 -->
        <div class="tab-switcher" role="tablist">
          <button class="tab-btn active" id="tab-freelancer" role="tab" aria-selected="true" aria-controls="panel-freelancer" onclick="switchTab('freelancer')">
            💸 실수령액 구하기
          </button>
          <button class="tab-btn" id="tab-reverse" role="tab" aria-selected="false" aria-controls="panel-reverse" onclick="switchTab('reverse')">
            🔄 계약금액 역산 (실수령액 입력)
          </button>
        </div>

        <!-- 실수령액 구하기 탭 -->
        <div class="tab-panel active" id="panel-freelancer" role="tabpanel">
          <div class="calc-card">
            <h2 class="calc-card-title">프리랜서 실수령액 계산기<span class="year-badge">3.3% 공제</span></h2>
            <p class="calc-card-desc">세전 수입(계약금액)을 입력하시면 3.3%의 원천징수 세액을 제외한 실제 수령액을 보여줍니다.</p>

            <div class="form-grid">
              <div class="form-group" style="grid-column: span 2">
                <label class="form-label" for="f-gross">세전 총 수입 (계약 금액)</label>
                <div class="input-wrap">
                  <input type="text" id="f-gross" class="form-input large-input" placeholder="10,000,000" inputmode="numeric" onkeyup="formatCurrencyInput(this); updateKoreanHelper(this, 'f-gross-hint', '원');" />
                  <span class="input-unit">원</span>
                </div>
                <span class="form-hint" id="f-gross-hint"></span>
              </div>
            </div>

            <button class="calc-btn" onclick="calculateFreelancer()">
              <span class="btn-icon">⚡</span> 3.3% 계산하기
            </button>
          </div>

          <!-- 결과 -->
          <div class="result-card" id="result-freelancer" style="display: none">
            <h3 class="result-title">💸 프리랜서 계산 결과</h3>
            <div class="result-summary-box" id="result-freelancer-summary"></div>
            
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 12px; margin-top: 24px; color: var(--text-primary);">📋 상세 공제 내역 (3.3%)</h4>
            <table class="deduction-table" id="deduction-table-f"></table>

            <div class="chart-wrap" style="margin-top: 30px;">
              <canvas id="chart-freelancer" width="240" height="240"></canvas>
              <div class="chart-legend" id="legend-freelancer"></div>
            </div>

            <div class="result-notice">
              ※ 프리랜서(인적용역)는 총 지급액의 3.3%(사업소득세 3% + 지방소득세 0.3%)를 원천징수합니다. 이 세금은 매년 5월 종합소득세 신고 시 기납부세액으로 공제되며, 소득 구간 및 필요경비에 따라 <strong>환급</strong>을 받을 수도 있습니다.
            </div>
            
            <div style="margin-top: 15px; text-align: right;">
              <button class="action-btn" onclick="exportToImage('result-freelancer', '프리랜서계산결과.png')">
                <span class="btn-icon">📸</span> 결과 이미지로 저장
              </button>
            </div>
          </div>
        </div>

        <!-- 계약금액 역산 탭 -->
        <div class="tab-panel" id="panel-reverse" role="tabpanel">
          <div class="calc-card">
            <h2 class="calc-card-title">원래 계약금액(세전) 역산 계산기<span class="year-badge">공급가액 도출</span></h2>
            <p class="calc-card-desc">통장에 입금된 <strong>실수령액</strong>을 바탕으로 원래 3.3% 공제 전 계약 금액을 거꾸로 계산합니다.</p>

            <div class="form-grid">
              <div class="form-group" style="grid-column: span 2">
                <label class="form-label" for="r-net">입금된 실수령액</label>
                <div class="input-wrap">
                  <input type="text" id="r-net" class="form-input large-input" placeholder="9,670,000" inputmode="numeric" onkeyup="formatCurrencyInput(this); updateKoreanHelper(this, 'r-net-hint', '원');" />
                  <span class="input-unit">원</span>
                </div>
                <span class="form-hint" id="r-net-hint"></span>
              </div>
            </div>

            <button class="calc-btn" onclick="calculateReverse()">
              <span class="btn-icon">⚡</span> 세전 금액 역산하기
            </button>
          </div>

          <!-- 역산 결과 -->
          <div class="result-card" id="result-reverse" style="display: none">
            <h3 class="result-title">🔄 세전 계약금액 역산 결과</h3>
            <div class="result-summary-box" id="result-reverse-summary"></div>
            
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 12px; margin-top: 24px; color: var(--text-primary);">📋 세금 도출 내역 (3.3%)</h4>
            <table class="deduction-table" id="deduction-table-r"></table>

            <div class="result-notice">
              ※ 통장에 찍힌 실수령액을 0.967로 나누어(÷) 세전 금액을 도출합니다. 원 단위 절사 방식에 따라 1~10원의 미세한 단수 차이가 발생할 수 있습니다.
            </div>
          </div>
        </div>
      </section>
"""

html = re.sub(r'<section class="calculator-section" id="calculator">.*?</section>', calc_html, html, flags=re.DOTALL)

# Adjust active side link
html = html.replace('class="sidebar-link active-link"><span class="link-icon">💼</span>\n                <div class="link-info">\n                  <strong>연봉 계산기</strong>', 'class="sidebar-link"><span class="link-icon">💼</span>\n                <div class="link-info">\n                  <strong>연봉 계산기</strong>')
html = re.sub(r'<ul class="sidebar-links">', '<ul class="sidebar-links">\n            <li>\n              <a href="#" class="sidebar-link active-link"><span class="link-icon">💸</span>\n                <div class="link-info">\n                  <strong>프리랜서 계산기</strong><small>현재 페이지</small>\n                </div>\n              </a>\n            </li>', html)

# Modify Sidebar widgets targeting Freelancers!
sidebar_widgets = """
        <!-- 프리랜서 3.3% 정보 위젯 -->
        <div class="sidebar-widget info-widget">
          <h2 class="widget-title">📋 3.3% 원천징수란?</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 15px;">
            고용 관계 없이 독립된 자격으로 용역을 제공하고 대가를 받는 경우, 지급하는 자가 금액의 3.3%를 미리 떼어 국가에 납부하는 제도입니다.
          </p>
          <table class="tax-table">
            <thead>
              <tr>
                <th>공제 항목</th>
                <th>적용 요율</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>사업 소득세</td>
                <td class="tax-rate preferred">수입금액의 3%</td>
              </tr>
              <tr>
                <td>지방 소득세</td>
                <td class="tax-rate exempt">사업소득세의 10% (0.3%)</td>
              </tr>
              <tr style="border-top: 2px solid var(--border);">
                <td><strong>총 공제율</strong></td>
                <td class="tax-rate" style="color: var(--danger);"><strong>3.3%</strong></td>
              </tr>
            </tbody>
          </table>
          <p class="widget-note">
            ※ 원천징수된 세금은 이듬해 5월 <strong>종합소득세 신고</strong>를 통해 환급받을 가능성이 높습니다!
          </p>
        </div>
"""
html = re.sub(r'<!-- 2026 요율 위젯 -->.*?<!-- ===== MIDDLE AD ===== -->', sidebar_widgets + '\n      </aside>\n    </div>\n  </main>\n\n  <!-- ===== MIDDLE AD ===== -->', html, flags=re.DOTALL)

with open('freelancer-calculator/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
