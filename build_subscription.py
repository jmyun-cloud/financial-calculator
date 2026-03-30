import os
import re

# Base template (salary.html)
with open('guide/salary.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make directory
os.makedirs('subscription-calculator', exist_ok=True)

# Replace head tags
html = html.replace('2026 연봉 실수령액 계산 가이드', '2026 주택청약 가점 계산기 (84점 만점)')
html = html.replace('2026년 기준 연봉 및 실수령액 관련 상세 가이드, 4대보험 요율 계산법, 비과세 수당 활용법 및 연말정산 전략을 안내해 드립니다.', '2026 주택청약 가점 계산기입니다. 무주택기간, 부양가족수, 통장가입기간을 입력하여 내 청약 점수(최대 84점)를 정확하고 빠르게 확인하세요.')
html = html.replace('연봉 계산 방법, 4대보험 요율, 2026 실수령액, 비과세 수당, 연말정산', '주택청약, 청약가점, 무주택기간, 부양가족, 청약통장, 아파트 청약, 84점 만점')
html = html.replace('../loan-calculator/style.css?v=5', '../loan-calculator/style.css?v=6')

# Primary colors (Teal/Cyan theme for Real Estate)
html = html.replace("""        :root {
            --primary: #059669;
            --primary-dark: #047857;
            --primary-light: #ecfdf5;
            --primary-mid: #d1fae5;
        }""", """        :root {
            --primary: #0d9488;
            --primary-dark: #0f766e;
            --primary-light: #f0fdfa;
            --primary-mid: #ccfbf1;
        }""")

html = html.replace("""        .top-description {
            background: linear-gradient(135deg,
                    #059669 0%,
                    #047857 50%,
                    #065f46 100%);
        }""", """        .top-description {
            background: linear-gradient(135deg,
                    #0d9488 0%,
                    #0f766e 50%,
                    #115e59 100%);
        }""")

html = html.replace('#059669', '#0d9488')

# Breadcrumbs
html = html.replace("""<div class="breadcrumb">
                    <a href="../index.html" style="color: inherit;">홈</a> <span class="bc-sep">›</span>
                    <a href="../salary-calculator/index.html" style="color: inherit;">연봉 계산기</a> <span class="bc-sep">›</span>
                    <span class="bc-current">가이드</span>
                </div>""", """<div class="breadcrumb">
                    <a href="../index.html" style="color: inherit;">홈</a> <span class="bc-sep">›</span>
                    <span class="bc-current">주택청약 가점 계산기</span>
                </div>""")

# Nav
html = html.replace("""<nav class="header-nav">
                <a href="../index.html" class="nav-link">🏠 홈</a>
                <a href="../salary-calculator/index.html" class="nav-link active">계산기로 돌아가기 ▸</a>
            </nav>""", """<nav class="header-nav">
                <a href="../index.html" class="nav-link">🏠 홈</a>
                <a href="../guide/subscription.html" class="nav-link active">청약 가이드북 ▸</a>
            </nav>""")

# Title
html = html.replace('연봉 실수령액 계산 가이드', '주택청약 가점 계산기')
html = html.replace('2026년 기준 4대보험 요율, 비과세 수당 활용법, 그리고 실수령액 계산 원리를 자세히 알려드립니다.', '무주택기간, 부양가족, 통장가입기간을 입력하여 내 청약 점수(최대 84점)를 한눈에 확인하세요.')

# Main Body replacement
main_body = """
            <!-- Calculator Container -->
            <div class="calc-container" style="background:transparent; border:none; box-shadow:none; padding:0; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                
                <!-- Left: Inputs -->
                <div class="input-section" style="background: var(--surface); padding: 30px; border-radius: 20px; box-shadow: var(--shadow-md); border: 1px solid var(--border);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                        <h2 style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin: 0;">조건 입력</h2>
                        <button class="reset-btn" onclick="resetForm('subscription-form')" title="초기화">
                            <span class="btn-icon">🔄</span>
                        </button>
                    </div>

                    <form id="subscription-form">
                        <div class="input-group">
                            <label for="無주택기간">1. 무주택기간 (최고 32점) <span class="tooltip-icon" title="만 30세 이상부터 산정되거나, 혼인신고일 중 빠른 날을 기준으로 1년마다 2점씩 가산됩니다.">ℹ️</span></label>
                            <div class="input-wrapper">
                                <span class="input-icon">🏠</span>
                                <select id="t-homeless" class="calc-input" onchange="calculatePoints()">
                                    <option value="0">만 30세 미만 미혼 무주택자 (0점)</option>
                                    <option value="2">1년 미만 (유주택자 포함) (2점)</option>
                                    <option value="4">1년 이상 ~ 2년 미만 (4점)</option>
                                    <option value="6">2년 이상 ~ 3년 미만 (6점)</option>
                                    <option value="8">3년 이상 ~ 4년 미만 (8점)</option>
                                    <option value="10">4년 이상 ~ 5년 미만 (10점)</option>
                                    <option value="12">5년 이상 ~ 6년 미만 (12점)</option>
                                    <option value="14">6년 이상 ~ 7년 미만 (14점)</option>
                                    <option value="16">7년 이상 ~ 8년 미만 (16점)</option>
                                    <option value="18">8년 이상 ~ 9년 미만 (18점)</option>
                                    <option value="20">9년 이상 ~ 10년 미만 (20점)</option>
                                    <option value="22">10년 이상 ~ 11년 미만 (22점)</option>
                                    <option value="24">11년 이상 ~ 12년 미만 (24점)</option>
                                    <option value="26">12년 이상 ~ 13년 미만 (26점)</option>
                                    <option value="28">13년 이상 ~ 14년 미만 (28점)</option>
                                    <option value="30">14년 이상 ~ 15년 미만 (30점)</option>
                                    <option value="32">15년 이상 (32점 최고점)</option>
                                </select>
                            </div>
                        </div>

                        <div class="input-group">
                            <label for="부양가족수">2. 부양가족 수 (최고 35점) <span class="tooltip-icon" title="본인을 제외한 세대원 수. 1명당 5점씩 가산되며 기본점수는 5점입니다.">ℹ️</span></label>
                            <div class="input-wrapper">
                                <span class="input-icon">👨‍👩‍👧‍👦</span>
                                <select id="t-family" class="calc-input" onchange="calculatePoints()">
                                    <option value="5">0명 (본인 뿐인 경우) (5점)</option>
                                    <option value="10">1명 (10점)</option>
                                    <option value="15">2명 (15점)</option>
                                    <option value="20">3명 (20점)</option>
                                    <option value="25">4명 (25점)</option>
                                    <option value="30">5명 (30점)</option>
                                    <option value="35">6명 이상 (35점 최고점)</option>
                                </select>
                            </div>
                        </div>

                        <div class="input-group">
                            <label for="가입기간">3. 청약통장 가입기간 (최고 17점) <span class="tooltip-icon" title="최초 가입일 기준으로 은행에서 자동 산정됩니다. 1년마다 1점씩 가산.">ℹ️</span></label>
                            <div class="input-wrapper">
                                <span class="input-icon">🏦</span>
                                <select id="t-bank" class="calc-input" onchange="calculatePoints()">
                                    <option value="1">6개월 미만 (1점)</option>
                                    <option value="2">6개월 이상 ~ 1년 미만 (2점)</option>
                                    <option value="3">1년 이상 ~ 2년 미만 (3점)</option>
                                    <option value="4">2년 이상 ~ 3년 미만 (4점)</option>
                                    <option value="5">3년 이상 ~ 4년 미만 (5점)</option>
                                    <option value="6">4년 이상 ~ 5년 미만 (6점)</option>
                                    <option value="7">5년 이상 ~ 6년 미만 (7점)</option>
                                    <option value="8">6년 이상 ~ 7년 미만 (8점)</option>
                                    <option value="9">7년 이상 ~ 8년 미만 (9점)</option>
                                    <option value="10">8년 이상 ~ 9년 미만 (10점)</option>
                                    <option value="11">9년 이상 ~ 10년 미만 (11점)</option>
                                    <option value="12">10년 이상 ~ 11년 미만 (12점)</option>
                                    <option value="13">11년 이상 ~ 12년 미만 (13점)</option>
                                    <option value="14">12년 이상 ~ 13년 미만 (14점)</option>
                                    <option value="15">13년 이상 ~ 14년 미만 (15점)</option>
                                    <option value="16">14년 이상 ~ 15년 미만 (16점)</option>
                                    <option value="17">15년 이상 (17점 최고점)</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Right: Result -->
                <div class="result-section" id="result-subscription">
                    <div class="result-card" style="margin-top:0;">
                        <h3 class="result-title" style="display:flex; justify-content:space-between; align-items:center;">
                            <span>🏆 나의 최종 청약 가점</span>
                            <div class="result-btn-group"></div>
                        </h3>
                        
                        <div class="result-summary" style="display:flex; flex-direction:column; justify-content:center; align-items:center; min-height: 180px;">
                            <div style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 5px;">현재 예상 점수는 84점 만점에</div>
                            <div id="result-total-score" style="font-size: 3.5rem; font-weight: 800; letter-spacing: -0.02em; color: var(--primary);">
                                0점
                            </div>
                        </div>
                        
                        <div style="position: relative; height: 260px; width: 100%; margin-top: 20px; display: none;" id="chart-container">
                            <canvas id="chart-subscription"></canvas>
                        </div>
                        <div id="legend-subscription" class="chart-legend" style="margin-top:20px; display:flex; gap:10px; justify-content:center;"></div>

                        <div class="deduction-details" style="margin-top: 25px;">
                            <table class="deduction-table">
                                <thead>
                                    <tr>
                                        <th>가점 항목</th>
                                        <th style="text-align: right;">획득 점수</th>
                                    </tr>
                                </thead>
                                <tbody id="score-table-t">
                                    <!-- Dynamic Rows -->
                                </tbody>
                            </table>
                        </div>

                        <div class="result-notice">
                            ※ 주택청약 가점 만점은 총 84점입니다. (무주택기간 32점 + 부양가족 35점 + 가입기간 17점)<br>
                            ※ 이 계산 결과는 법적 효력이 없으며, 실제 당첨 시 증빙 서류와 점수가 다를 경우 청약이 취소(부적격 처리)될 수 있으므로 청약홈(Applyhome) 등에서 본인의 정확한 조건을 한 번 더 확인하시기 바랍니다.
                        </div>
                    </div>
                    
                    <!-- Appended Ad slot -->
                    <div style="margin-top: 30px;">
                        <div class="ad-slot ad-slot--square" id="ad-result">
                            <span class="ad-placeholder-text">광고</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Inject Top Banner to Guide -->
            <div style="margin-top: 50px; text-align: center;">
                <a href="../guide/subscription.html" class="calc-btn"
                    style="display: inline-flex; align-items: center; justify-content: center; padding: 16px 32px; font-size: 1.05rem; width: auto;">
                    <span class="btn-icon">💡</span> 청약 가점 꿀팁 및 무주택 기준 가이드 바로가기
                </a>
            </div>
"""

# Replace existing article to standard calculator style
html = re.sub(r'<article class="guide-article">.*?</article>.*?<div style="text-align: center; margin-top: 40px;">.*?</div>', main_body, html, flags=re.DOTALL)

# Inject JS
script_tag = """
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="calculator.js?v=1"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            calculatePoints();
        });
    </script>
"""
html = html.replace('</body>', script_tag + '\n</body>')

with open('subscription-calculator/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
