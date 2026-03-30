import os
import re

with open('guide/salary.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace Head & Meta
html = html.replace('2026 연봉 실수령액 계산 가이드', '2026 DSR 계산기 및 대출 한도 가이드')
html = html.replace('2026년 기준 연봉 및 실수령액 관련 상세 가이드, 4대보험 요율 계산법, 비과세 수당 활용법 및 연말정산 전략을 안내해 드립니다.', 
                    '2026년 DSR(총부채원리금상환비율) 계산법, 주택담보대출(LTV/DTI) 규제 40% 리미트와 대출 한도를 늘리는 핵심 전략을 상세히 안내합니다.')
html = html.replace('연봉 계산 방법, 4대보험 요율, 2026 실수령액, 비과세 수당, 연말정산', 'DSR, DTI, LTV, 주택담보대출, 신용대출, 만기 50년, 스트레스 DSR')

# Replace Theme Colors to DSR Blue (#2563eb)
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
                    <a href="../dsr-calculator/index.html" style="color: inherit;">DSR 대출 계산기</a> <span class="bc-sep">›</span>
                    <span class="bc-current">가이드</span>
                </div>""")

# Nav
html = html.replace("""<nav class="header-nav">
                <a href="../index.html" class="nav-link">🏠 홈</a>
                <a href="../salary-calculator/index.html" class="nav-link active">계산기로 돌아가기 ▸</a>
            </nav>""", """<nav class="header-nav">
                <a href="../index.html" class="nav-link">🏠 홈</a>
                <a href="../dsr-calculator/index.html" class="nav-link active">계산기로 돌아가기 ▸</a>
            </nav>""")

# Title
html = html.replace('연봉 실수령액 계산 가이드', 'DSR / LTV 규제 및 대출 한도 가이드')
html = html.replace('2026년 기준 4대보험 요율, 비과세 수당 활용법, 그리고 실수령액 계산 원리를 자세히 알려드립니다.', 'DSR 40% 규제의 완벽 이해와 내 집 마련을 위해 영끌 한도를 높이는 대응 전략을 알려드립니다.')

# SEO Content
seo_content = """
            <article class="guide-article">
                <h2>1. DSR이란 무엇인가요?</h2>
                <p>
                    <strong>DSR (Debt Service Ratio, 총부채원리금상환비율)</strong>은 대출을 받으려는 사람의 소득 대비 
                    '전체 금융부채의 원리금 상환액' 비율을 의미합니다. 주택담보대출뿐만 아니라 신용대출, 마이너스통장, 자동차할부금, 학자금대출 등 
                    <strong>모든 부채</strong>의 원금과 이자를 더해서 소득으로 나눈 값입니다.
                </p>
                <div class="highlight-box">
                    <strong>💡 DSR 계산 공식</strong><br><br>
                    <strong>DSR (%)</strong> = (연간 총 부채 원리금 상환액 ÷ 연간 총소득) × 100<br><br>
                    ※ 현재 1금융권(시중은행) 대출 시 <strong>DSR 40%</strong> 규제가 적용되고 있습니다. 즉, 1년에 갚아야 할 원금과 이자의 합이 
                    내 연봉의 40%를 넘어서는 대출은 추가로 받을 수 없습니다. (2금융권은 50%)
                </div>

                <h2>2. LTV, DTI와의 차이점</h2>
                <p>
                    대출을 받을 때 자주 등장하는 세 가지 규제 용어의 차이를 아는 것이 중요합니다.
                </p>
                <ul>
                    <li><strong>LTV (주택담보대출비율):</strong> 집값 대비 얼마까지 돈을 빌릴 수 있는가? (예: 집값이 10억, LTV 50% = 5억 대출 가능)</li>
                    <li><strong>DTI (총부채상환비율):</strong> 연소득 대비 [새 주택담보대출의 원리금 + 기타 대출의 <strong>이자</strong>] 상환액 비율.</li>
                    <li><strong>DSR (총부채원리금상환비율):</strong> 연소득 대비 [새 대출의 원리금 + 기타 대출의 <strong>원금과 이자</strong>] 상환액 비율.</li>
                </ul>
                <p>
                    DTI는 기타 대출의 이자만 계산하지만, <strong>DSR은 모든 대출의 원금까지 더하기 때문에 가장 강력한 규제</strong>로 통합니다.
                </p>

                <h2>3. [필독] 대출 한도를 늘리는 합법적 전략 3가지</h2>
                <p>
                    DSR 40%에 걸려 원하는 만큼 대출이 안 나올 때, 한도를 늘리기 위한 방법은 결국 <strong>분모(소득)를 키우거나, 분자(연 상환액)를 줄이는 것</strong>뿐입니다.
                </p>
                <ol>
                    <li>
                        <strong>대출 '만기(기간)'를 최대로 늘리기 (30년 → 40년, 50년)</strong><br>
                        가장 현실적이고 효과적인 방법입니다. 주담대 만기를 30년에서 40년으로 늘리면, 연간 갚아야 할 '원금'이 줄어듭니다. 
                        분자(연 상환액)가 작아지므로 DSR 비율이 뚝 떨어져 추가 대출 한도가 발생합니다.
                    </li>
                    <li>
                        <strong>기존 신용대출 상환하기 (마이너스통장 해지)</strong><br>
                        마이너스통장은 사용하지 않고 뚫어만 놓아도, '한도 전체'를 빌린 것으로 간주하여 연 상환액에 합산됩니다. 
                        주택담보대출을 크게 받기 직전이라면 사용하지 않는 마이너스통장이나 소액 신용대출을 먼저 상환(해지)하는 것이 유리합니다.
                    </li>
                    <li>
                        <strong>맞벌이 부부 소득 합산하기</strong><br>
                        주택담보대출 신청 시 '배우자의 소득'까지 합산하여 DSR을 계산할 수 있습니다. 
                        내 연봉이 5천만 원이고 배우자가 4천만 원이라면, 분모(연소득)가 9천만 원으로 껑충 뛰기 때문에 대출 가능 한도가 2배 가까이 늘어납니다. (단, 배우자의 부채도 함께 더해짐)
                    </li>
                </ol>
                
                <h2>4. 스트레스 DSR 제도의 도입</h2>
                <p>
                    2024년부터 금리 변동 위험을 반영한 <strong>'스트레스 DSR'</strong>이 순차적으로 도입되었습니다. 
                    이는 대출 한도를 산정할 때 실제 금리표에 명시된 금리보다 **'스트레스 금리(가산금리)'**를 더 높게 적용하여 DSR을 빡빡하게 계산하는 것입니다.<br>
                    결과적으로 변동금리 대출을 받을 때 예전보다 대출 가능 금액이 <strong>수천만 원씩 축소</strong>되는 효과가 있습니다. 가급적 주기형(5년 고정) 혼합금리로 신청하는 것이 한도를 지키는데 유리합니다.
                </p>
            </article>

            <div style="text-align: center; margin-top: 40px;">
                <a href="../dsr-calculator/index.html" class="calc-btn"
                    style="display: inline-flex; align-items: center; justify-content: center; padding: 16px 32px; font-size: 1.05rem; width: auto; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);">
                    <span class="btn-icon">📊</span> 내 DSR 및 최대 대출 한도 계산해보기
                </a>
            </div>
"""

# Replace existing article
html = re.sub(r'<article class="guide-article">.*?</article>.*?<div style="text-align: center; margin-top: 40px;">.*?</div>', seo_content, html, flags=re.DOTALL)

with open('guide/dsr.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("DSR Guide successfully generated.")
