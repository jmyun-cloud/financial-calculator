import os
import re

# Base template (salary-calculator/index.html because it has a clean format, but I'll use guide/salary.html as before)
with open('guide/salary.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make directory
os.makedirs('dsr-calculator', exist_ok=True)

# Replace head tags
html = html.replace('2026 연봉 실수령액 계산 가이드', '2026 DSR 대출 한도 계산기 (40% 규제 적용)')
html = html.replace('2026년 기준 연봉 및 실수령액 관련 상세 가이드, 4대보험 요율 계산법, 비과세 수당 활용법 및 연말정산 전략을 안내해 드립니다.', '2026 DSR(총부채원리금상환비율) 대출 한도 계산기입니다. 내 연소득과 기존 부채를 바탕으로 추가로 받을 수 있는 최대 주택담보대출/신용대출 한도를 정확히 계산해보세요.')
html = html.replace('연봉 계산 방법, 4대보험 요율, 2026 실수령액, 비과세 수당, 연말정산', 'DSR 계산기, 대출 한도 계산, 주담대 한도, 총부채원리금상환비율, LTV, 신용대출 한도')
# Bust cache globally
html = html.replace('../loan-calculator/style.css?v=5', '../loan-calculator/style.css?v=7')

# Primary colors (Blue theme for DSR/Finance)
html = html.replace("""        :root {
            --primary: #059669;
            --primary-dark: #047857;
            --primary-light: #ecfdf5;
            --primary-mid: #d1fae5;
        }""", """        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --primary-light: #eff6ff;
            --primary-mid: #dbeafe;
        }""")

html = html.replace("""        .top-description {
            background: linear-gradient(135deg,
                    #059669 0%,
                    #047857 50%,
                    #065f46 100%);
        }""", """        .top-description {
            background: linear-gradient(135deg,
                    #2563eb 0%,
                    #1d4ed8 50%,
                    #1e3a8a 100%);
        }""")

html = html.replace('#059669', '#2563eb')

# Breadcrumbs
html = html.replace("""<div class="breadcrumb">
                    <a href="../index.html" style="color: inherit;">홈</a> <span class="bc-sep">›</span>
                    <a href="../salary-calculator/index.html" style="color: inherit;">연봉 계산기</a> <span class="bc-sep">›</span>
                    <span class="bc-current">가이드</span>
                </div>""", """<div class="breadcrumb">
                    <a href="../index.html" style="color: inherit;">홈</a> <span class="bc-sep">›</span>
                    <span class="bc-current">DSR 대출 한도 계산기</span>
                </div>""")

# Nav
html = html.replace("""<nav class="header-nav">
                <a href="../index.html" class="nav-link">🏠 홈</a>
                <a href="../salary-calculator/index.html" class="nav-link active">계산기로 돌아가기 ▸</a>
            </nav>""", """<nav class="header-nav">
                <a href="../index.html" class="nav-link">🏠 홈</a>
                <a href="../guide/dsr.html" class="nav-link active">DSR 규제 가이드북 ▸</a>
            </nav>""")

# Title
html = html.replace('연봉 실수령액 계산 가이드', 'DSR 대출 한도 계산기')
html = html.replace('2026년 기준 4대보험 요율, 비과세 수당 활용법, 그리고 실수령액 계산 원리를 자세히 알려드립니다.', '내 연소득과 기존 부채를 입력하여 추가 대출(주담대/신용)의 최대 한도를 확인해보세요.')

# Main Body replacement
main_body = """
            <!-- Calculator Container -->
            <div class="calc-container" style="background:transparent; border:none; box-shadow:none; padding:0; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                
                <!-- Left: Inputs -->
                <div class="input-section" style="background: var(--surface); padding: 30px; border-radius: 20px; box-shadow: var(--shadow-md); border: 1px solid var(--border);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                        <h2 style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin: 0;">조건 입력</h2>
                        <button class="reset-btn" onclick="resetForm('dsr-form')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l5.94 4.54"/></svg>
                            초기화
                        </button>
                    </div>

                    <form id="dsr-form" class="form-stack">
                        <div class="form-group">
                            <label class="form-label" for="income">1. 세전 연소득 <span class="tooltip-icon" data-tooltip="대출 신청자 본인의 세전 연소득을 입력하세요."></span></label>
                            <div class="input-wrap">
                                <input type="text" id="income" class="form-input" placeholder="50,000,000" inputmode="numeric" oninput="formatAndCalculate(this)">
                                <span class="input-unit">원</span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="existing-debt">2. 기존 대출의 연간 원리금 상환액 <span class="tooltip-icon" data-tooltip="이미 보유중인 모든 대출(신용대출, 학자금대출, 타 주담대 등)의 1년간 원금+이자 상환액 총합입니다. 없으면 0을 입력하세요."></span></label>
                            <div class="input-wrap">
                                <input type="text" id="existing-debt" class="form-input" placeholder="0" inputmode="numeric" oninput="formatAndCalculate(this)">
                                <span class="input-unit">원/년</span>
                            </div>
                        </div>

                        <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div>
                                <label class="form-label" for="new-rate">3. 신규 대출 금리</label>
                                <div class="input-wrap">
                                    <input type="number" id="new-rate" class="form-input" placeholder="4.0" step="0.1" min="0.1" oninput="calculateDSR()">
                                    <span class="input-unit">%</span>
                                </div>
                            </div>
                            <div>
                                <label class="form-label" for="new-term">4. 대출 기간</label>
                                <div class="input-wrap">
                                    <input type="number" id="new-term" class="form-input" placeholder="30" step="1" min="1" max="50" oninput="calculateDSR()">
                                    <span class="input-unit">년</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">5. 목표 DSR 규제 비율 <span class="tooltip-icon" data-tooltip="일반적인 은행권(1금융)의 DSR 규제 한도는 40%입니다. 2금융권은 50%가 적용됩니다."></span></label>
                            <div class="input-wrap">
                                <select id="dsr-limit" class="form-input" onchange="calculateDSR()">
                                    <option value="40">1금융권 (DSR 40% 적용)</option>
                                    <option value="50">2금융권 (DSR 50% 적용)</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Right: Result -->
                <div class="result-section" id="result-dsr">
                    <div class="result-card" style="margin-top:0;">
                        <h3 class="result-title" style="display:flex; justify-content:space-between; align-items:center;">
                            <span>📊 대출 가능 한도 분석</span>
                            <div class="result-btn-group"></div>
                        </h3>
                        
                        <div class="result-summary" id="dsr-summary-box" style="display:flex; flex-direction:column; justify-content:center; align-items:center; min-height: 180px; text-align: center;">
                            <div style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 5px;">추가로 받을 수 있는 최대 한도</div>
                            <div id="result-max-loan" style="font-size: 2.8rem; font-weight: 800; letter-spacing: -0.02em; color: var(--primary);">
                                0원
                            </div>
                            <div id="result-dsr-status" style="font-size: 1rem; margin-top: 10px; font-weight: 600; color: var(--text-secondary);">
                                (현재 DSR: 0%)
                            </div>
                        </div>
                        
                        <div style="position: relative; height: 260px; width: 100%; margin-top: 20px; display: none;" id="chart-container">
                            <canvas id="chart-dsr"></canvas>
                        </div>
                        <div id="legend-dsr" class="chart-legend" style="margin-top:20px; display:flex; gap:10px; justify-content:center;"></div>

                        <div class="deduction-details" style="margin-top: 25px;">
                            <table class="deduction-table">
                                <thead>
                                    <tr>
                                        <th>분석 항목</th>
                                        <th style="text-align: right;">결과/금액</th>
                                    </tr>
                                </thead>
                                <tbody id="score-table-t">
                                    <tr>
                                        <td>규제 허용 연간 원리금 총액</td>
                                        <td id="td-max-yearly-repay">0원</td>
                                    </tr>
                                    <tr>
                                        <td>기존 부채 연간 상환액 빼기</td>
                                        <td id="td-existing-repay" style="color: var(--danger)">- 0원</td>
                                    </tr>
                                    <tr class="deduction-total">
                                        <td>신규 대출 가능 상환액 (여유분)</td>
                                        <td id="td-available-repay" style="color: var(--primary)">0원/년</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="result-notice">
                            ※ 원리금균등상환 방식을 기준으로 역산한 최대 한도입니다. 거치기간 유무나 체증식/원금균등 선택 시 실제 한도는 다를 수 있습니다.<br>
                            ※ 이 결과는 단순 참고용이며, 실제 대출 가능 여부와 한도는 해당 금융기관의 신용평가 및 정책(LTV, DTI 등)에 따라 최종 결정됩니다.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Inject Top Banner to Guide -->
            <div style="margin-top: 50px; text-align: center;">
                <a href="../guide/dsr.html" class="calc-btn"
                    style="display: inline-flex; align-items: center; justify-content: center; padding: 16px 32px; font-size: 1.05rem; width: auto;">
                    <span class="btn-icon">💡</span> DSR/LTV 계산 원리 및 대출 한도 늘리는 꿀팁 바로가기
                </a>
            </div>
"""

# Replace existing article to standard calculator style
html = re.sub(r'<article class="guide-article">.*?</article>.*?<div style="text-align: center; margin-top: 40px;">.*?</div>', main_body, html, flags=re.DOTALL)

# Inject JS
script_tag = """
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="calculator.js?v=7"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            // Optional initial calc if we have default values
        });
    </script>
"""
html = html.replace('</body>', script_tag + '\n</body>')

with open('dsr-calculator/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("DSR HTML Scaffold completely generated.")
