import re

with open('guide/salary.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace metadata
html = html.replace('2026 연봉 실수령액 계산 및 4대보험 상세 가이드 - 금융계산기.kr', '프리랜서 3.3% 세금 환급 및 종합소득세 신고 가이드 - 금융계산기.kr')
html = html.replace('2026년 최신 4대보험 요율 적용 연봉 실수령액 계산 방법과 비과세 수당, 연말정산 최적화 연봉 협상 팁을 안내합니다.', '프리랜서, 알바 등 3.3% 원천징수 근로자의 세금 계산 방법과 매년 5월 종합소득세 신고 시 세금 환급 꿀팁을 안내합니다.')
html = html.replace('연봉 계산, 실수령액, 4대보험, 2026 최저시급, 연말정산, 비과세', '프리랜서 3.3% 환급, 알바 세금, 삼쩜삼 원리, 종합소득세 신고, 원천징수 계산')

# Titles and content
html = html.replace('2026 연봉 실수령액 상세 가이드', '프리랜서 3.3% 세금 계산 및 종합소득세 가이드')
html = html.replace('2026년 최신 4대보험 요율부터 연말정산 절세 팁까지, 당신의 실질 소득을 극대화하는 모든 것.', '3.3% 원천징수의 진실, 실수령액 계산법, 그리고 5월 종합소득세 환급을 극대화하는 핵심 전략.')

article_content = """
            <article class="guide-article">
                <h2>💡 프리랜서 3.3% 세금, 왜 떼는 걸까요?</h2>

                <h3>1. 3.3% 원천징수의 의미</h3>
                <p>
                    회사와 근로계약을 맺은 4대보험 직장인과 달리, 아르바이트나 프리랜서 등 <strong>독립된 자격으로 용역을 제공하고 대가를 받는 분들</strong>은 사업소득자로 분류됩니다. 이때 소득을 지급하는 원천징수의무자(회사)가 세액을 미리 떼어 국가에 납부하는 제도를 <strong>원천징수(Withholding)</strong>라고 합니다.
                </p>
                <div class="formula-box">
                    <p>📌 3.3% 세금의 구성</p>
                    <ul>
                        <li><span style="color: #94a3b8;">사업소득세(국세):</span> 수익의 3%</li>
                        <li><span style="color: #94a3b8;">지방소득세(지방세):</span> 사업소득세의 10% (0.3%)</li>
                        <li><span style="color: #38bdf8;">총 공제율: 3.3%</span></li>
                    </ul>
                </div>

                <h3>2. 실수령액과 세전 금액(공급가액) 역산하기</h3>
                <p>
                    프리랜서 계약을 맺을 때 "세후(실수령액) 얼마에 맞춰주겠다"고 하는 경우가 있습니다. 이때 세전 금액(원래 계약금)이 얼마인지 알아야 정확한 종합소득세 신고가 가능합니다.
                </p>
                <div class="formula-box">
                    <p>📌 세전금액 역산 공식</p>
                    <ul>
                        <li><span style="color: #94a3b8;">세전 계약금:</span> 실수령액 ÷ 0.967</li>
                        <li><span style="color: #94a3b8;">(예시) 통장에 1,000,000원이 찍혔다면:</span> 세전 금액은 약 1,034,126원!</li>
                    </ul>
                </div>
                <p>
                    계산이 번거롭다면 상단의 <a href="../freelancer-calculator/index.html" style="color: var(--primary); font-weight: 700;">프리랜서 3.3% 계산기</a>의 <strong>[계약금액 역산]</strong> 탭을 활용해 보세요.
                </p>

                <h2>💸 5월 종합소득세(종소세) 환급의 비밀</h2>
                <p>
                    "3.3% 뗀 세금, 돌려받을 수 있나요?" 많은 프리랜서 분들이 가장 궁금해하시는 대목입니다. 결론부터 말씀드리면, <strong>"대부분 환급받을 수 있습니다."</strong>
                </p>

                <h3>1. 기납부세액과 결정세액의 차이</h3>
                <p>
                    미리 낸 3.3% 세금(기납부세액)이, 5월 종소세 신고 시 내 소득과 필요경비 등을 바탕으로 최종 확정된 진짜 내 세금(결정세액)보다 더 많다면, 국가가 그 차액을 돌려줍니다. 이것이 프리랜서 세금 환급(삼쩜삼 등 앱의 원리)입니다.
                </p>

                <h3>2. 필요경비율과 추계신고</h3>
                <p>
                    프리랜서는 수입을 얻기 위해 쓴 비용(경비)을 인정받아 세금을 줄일 수 있습니다. 장부를 작성하지 않고 정부가 정한 <strong>단순경비율</strong>(약 60~70% 내외)을 적용받아 세금을 계산하는 '추계신고'를 하면, 상대적으로 소득이 낮은 대학생 알바나 초보 프리랜서는 대부분 낸 세금의 전부 또는 상당수를 환급받게 됩니다.
                </p>

                <h2>자주 묻는 질문 (FAQ)</h2>
                <div class="faq-list">
                    <details class="faq-item">
                        <summary>4대보험 가입과 3.3% 원천징수, 어떤 게 좋나요?</summary>
                        <p>
                            단기 알바 등 당장의 현금 흐름(실수령액)이 중요하다면 4대보험(약 9.4% 공제)보다 3.3% 공제가 유리합니다. 하지만 장기적인 노후 준비(국민연금)와 의료비(건강보험), 실업 대비(고용보험) 등 안전망 확보 측면에서는 4대보험 가입이 장기적으로 훨씬 유리합니다.
                        </p>
                    </details>
                    <details class="faq-item">
                        <summary>연 수입이 2,400만원을 넘으면 어떻게 되나요?</summary>
                        <p>
                            프리랜서 소득(사업소득) 2,400만원은 매우 중요한 기준점입니다. 2,400만원 미만은 세금이 많이 깎이는 '단순경비율'을 적용받아 환급률이 높지만, 이를 넘어가면 '기준경비율' 대상자가 되거나 장부를 써야 해서 세금 부담이 크게 늘어날 수 있습니다. 
                        </p>
                    </details>
                    <details class="faq-item">
                        <summary>종합소득세 신고를 안 하면 어떻게 되나요?</summary>
                        <p>
                            신고를 하지 않으면 환급금이 있어도 국세청이 알아서 돌려주지 않습니다. 반대로 환급이 아닌 추가 납부 대상인데 신고를 안 했다면 '무신고 가산세(20%)' 및 납부지연 가산세라는 엄청난 세금 폭탄을 맞게 됩니다. 무조건 5월에 홈택스나 세무대리인을 통해 신고하세요!
                        </p>
                    </details>
                </div>
            </article>
"""

html = re.sub(r'<article class="guide-article">.*?</article>', article_content, html, flags=re.DOTALL)

# Button redirection
html = html.replace('../salary-calculator/index.html', '../freelancer-calculator/index.html')
html = html.replace('연봉 계산기로 돌아가기', '프리랜서 3.3% 계산기로 돌아가기')
html = html.replace('연봉 계산기', '프리랜서 계산기')
html = html.replace('salary.html', 'freelancer.html')

with open('guide/freelancer.html', 'w', encoding='utf-8') as f:
    f.write(html)
