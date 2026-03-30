import os

html_path = 'sitemap-page/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace (8종) with (12종)
html = html.replace('금융 계산기 (8종)', '금융 계산기 (12종)')

new_calcs = """
          <a href="../subscription-calculator/index.html" class="sitemap-item">
            <div class="sitemap-item-icon">🏆</div>
            <div class="sitemap-item-content">
              <div class="sitemap-item-title">주택청약 가점 계산기</div>
              <div class="sitemap-item-desc">
                무주택기간, 부양가족 수, 청약통장 가입기간 기반 84점 만점 산정
              </div>
              <div class="sitemap-item-url">
                richcalc.kr/subscription-calculator/
              </div>
            </div>
            <span class="sitemap-item-arrow">›</span>
          </a>
          <a href="../dsr-calculator/index.html" class="sitemap-item">
            <div class="sitemap-item-icon">📊</div>
            <div class="sitemap-item-content">
              <div class="sitemap-item-title">DSR 대출 한도 계산기</div>
              <div class="sitemap-item-desc">
                연소득과 기존 부채 기반으로 40% 규제 적용 최대 대출 가능 금액 역산
              </div>
              <div class="sitemap-item-url">
                richcalc.kr/dsr-calculator/
              </div>
            </div>
            <span class="sitemap-item-arrow">›</span>
          </a>
          <a href="../freelancer-calculator/index.html" class="sitemap-item">
            <div class="sitemap-item-icon">💸</div>
            <div class="sitemap-item-content">
              <div class="sitemap-item-title">프리랜서 실급여 계산기</div>
              <div class="sitemap-item-desc">
                3.3% 원천징수 세금 공제 계산 및 환급금 조회, 입금액 역산
              </div>
              <div class="sitemap-item-url">
                richcalc.kr/freelancer-calculator/
              </div>
            </div>
            <span class="sitemap-item-arrow">›</span>
          </a>
          <a href="../global-tax-calculator/index.html" class="sitemap-item">
            <div class="sitemap-item-icon">📑</div>
            <div class="sitemap-item-content">
              <div class="sitemap-item-title">종합소득세 계산기</div>
              <div class="sitemap-item-desc">
                2026년 최신 6%~45% 누진세율 적용 5월 종소세 예상 납부액 산출
              </div>
              <div class="sitemap-item-url">
                richcalc.kr/global-tax-calculator/
              </div>
            </div>
            <span class="sitemap-item-arrow">›</span>
          </a>
"""

if 'global-tax-calculator' not in html:
    split_str = '<!-- 법적 안내 / 고객지원 -->'
    parts = html.split(split_str)
    
    last_div_idx = parts[0].rfind('</div>')
    parts[0] = parts[0][:last_div_idx] + new_calcs + parts[0][last_div_idx:]
    
    # Also add Guides section
    guides_html = """
      <!-- 금융 가이드 -->
      <div class="sitemap-group">
        <div class="group-title">📚 금융 가이드 및 매거진</div>
        <div class="sitemap-list">
          <a href="../guide/subscription.html" class="sitemap-item">
            <div class="sitemap-item-icon">🏆</div>
            <div class="sitemap-item-content">
              <div class="sitemap-item-title">주택청약 무주택 및 부양가족 기준 가이드</div>
              <div class="sitemap-item-desc">청약 가점 84점 만점 기준 상세 해설</div>
              <div class="sitemap-item-url">richcalc.kr/guide/subscription.html</div>
            </div>
            <span class="sitemap-item-arrow">›</span>
          </a>
          <a href="../guide/dsr.html" class="sitemap-item">
            <div class="sitemap-item-icon">📊</div>
            <div class="sitemap-item-content">
              <div class="sitemap-item-title">DSR 40% 규제와 대출 한도 늘리는 법</div>
              <div class="sitemap-item-desc">LTV/DTI와 DSR의 차이 및 스트레스 DSR 완벽 분석</div>
              <div class="sitemap-item-url">richcalc.kr/guide/dsr.html</div>
            </div>
            <span class="sitemap-item-arrow">›</span>
          </a>
          <a href="../guide/global-tax.html" class="sitemap-item">
            <div class="sitemap-item-icon">📑</div>
            <div class="sitemap-item-content">
              <div class="sitemap-item-title">프리랜서 종소세 계산법과 환급 전략</div>
              <div class="sitemap-item-desc">5월 종합소득세 누진세율과 기납부세액 정산 안내</div>
              <div class="sitemap-item-url">richcalc.kr/guide/global-tax.html</div>
            </div>
            <span class="sitemap-item-arrow">›</span>
          </a>
          <a href="../guide/freelancer.html" class="sitemap-item">
            <div class="sitemap-item-icon">💸</div>
            <div class="sitemap-item-content">
              <div class="sitemap-item-title">프리랜서 3.3% 원천징수의 모든 것</div>
              <div class="sitemap-item-desc">N잡러와 알바가 알아야 할 종합소득세 환급의 비밀</div>
              <div class="sitemap-item-url">richcalc.kr/guide/freelancer.html</div>
            </div>
            <span class="sitemap-item-arrow">›</span>
          </a>
        </div>
      </div>
"""
    
    html = parts[0] + guides_html + split_str + parts[1]

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
    
print('sitemap-page/index.html updated successfully with new calculators and guides.')
