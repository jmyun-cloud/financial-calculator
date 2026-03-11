import glob
import os

# Inject SEO Text into savings-calculator
savings_path = 'savings-calculator/index.html'
with open(savings_path, 'r', encoding='utf-8') as f:
    content = f.read()

seo_block = """
        <div class="seo-accordion-container">
          <button class="seo-toggle-btn" aria-expanded="false" aria-controls="seo-savings-1">
            💡 예금·적금 이자 100% 환급받는 절세 꿀팁 및 금리 비교 가이드 <span class="seo-toggle-icon">﹀</span>
          </button>
          <div class="seo-content" id="seo-savings-1">
            <h3>1. 비과세 종합저축으로 세금 0원 만들기</h3>
            <p>우리나라에서는 이자소득에 대해 기본적으로 <strong>15.4%의 이자소득세</strong>를 부과합니다. 아무리 이자율이 높아도 세금을 떼고 나면 실제 수령액이 줄어들게 됩니다. 하지만 <strong>만 65세 이상, 장애인, 독립유공자</strong> 등 특정 조건을 만족하는 경우 전 금융기관을 통틀어 5,000만 원 한도 내에서 발생하는 이자소득에 대해 세금을 전혀 떼지 않는 <strong>비과세 종합저축</strong> 가입이 가능합니다. 이 혜택을 활용하면 만기 시 남들보다 약 15% 더 많은 이자를 고스란히 챙길 수 있습니다.</p>

            <h3>2. 제2금융권 세금우대 (저율과세) 혜택 활용</h3>
            <p>비과세 대상자가 아니더라도 실망할 필요는 없습니다. <strong>새마을금고, 신협, 단위농협, 수협</strong> 등의 상호금융기관에서 조합원으로 가입(출자금 납입)할 경우, 1인당 3,000만 원 한도 내에서 <strong>농어촌특별세 1.4%</strong>만 떼는 세금우대(저율과세) 혜택을 받을 수 있습니다. 제1금융권의 15.4% 일반과세와 비교하면 엄청난 절세 효과가 있으며, 기본 이자율 자체도 시중은행보다 높은 경우가 많아 예적금 가입 시 필수적으로 1순위로 고려해야 하는 재테크 전략입니다.</p>

            <h3>3. 단리와 복리, 나에게 맞는 선택은?</h3>
            <p>가입하려는 예적금 상품이 <strong>단리</strong>인지 <strong>월복리</strong>인지 반드시 상품설명서를 통해 확인하세요. 단리는 원금에 대해서만 이자가 붙지만, 복리는 '원금+이자'에 다시 이자가 붙는 눈덩이(스노우볼) 같은 구조입니다. 예치 기간이 1년 이하로 짧을 때는 그 차이가 미미할 수 있으나, 3년, 5년 이상 장기 투자할 경우 월복리 상품의 최종 수령액이 압도적으로 커집니다. 금융계산기.kr을 통해 동일한 금리일 때 단리와 복리의 실수령액 차이를 직접 시뮬레이션 해보고 유리한 상품을 골라보세요.</p>

            <h3>4. 예금자보호법 5천만 원의 진실과 분산 투자</h3>
            <p>아무리 매력적인 고이율 상품이라도 내 돈의 안전성이 최우선입니다. 모든 예금과 적금은 예금자보호법에 의해 각 금융기관별로 <strong>원금과 소정의 이자를 합하여 1인당 최고 5,000만 원</strong>까지만 예금보험공사를 통해 보호받을 수 있습니다. 만약 굴리는 목돈이 5천만 원을 초과한다면, 조금 번거롭더라도 <strong>서로 다른 법인의 금융기관(은행)에 예금을 쪼개어 분산 예치</strong>하는 것이 원금 손실 리스크를 완벽하게 차단하는 가장 스마트한 방법입니다.</p>
          </div>
        </div>
"""

if 'seo-accordion-container' not in content:
    if '</section>\n\n    <!-- ===== FOOTER ===== -->' in content:
        content = content.replace('</section>\n\n    <!-- ===== FOOTER ===== -->', seo_block + '    </section>\n\n    <!-- ===== FOOTER ===== -->')
    else:
        # Fallback
        content = content.replace('<!-- ===== FOOTER ===== -->', seo_block + '\n    <!-- ===== FOOTER ===== -->')

    with open(savings_path, 'w', encoding='utf-8') as f:
        f.write(content)
        print("Injected SEO text into savings-calculator")

# Global script inject
count = 0
for fpath in glob.glob('**/*.html', recursive=True):
    with open(fpath, 'r', encoding='utf-8') as f:
        fcontent = f.read()

    if 'seo_script.js' not in fcontent:
        normalized_path = fpath.replace('\\', '/')
        depth = normalized_path.count('/')
        if depth == 0:
            script_tag = '  <script src="./seo_script.js"></script>\n'
        else:
            script_tag = '  <script src="../seo_script.js"></script>\n'
            
        new_content = fcontent.replace('</body>', script_tag + '</body>', 1)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1

print(f"Injected seo_script.js into {count} files")
