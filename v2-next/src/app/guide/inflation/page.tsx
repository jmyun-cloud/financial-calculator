import { Metadata } from "next";
import Link from "next/link";
import "../guide.css";

export const metadata: Metadata = {
  title: "인플레이션 자산 방어 및 실질 구매력 보존 가이드 - 금융계산기.kr",
  description: "물가 상승에 따른 화폐 가치 하락에 대비하고 실질 구매력을 보존하기 위한 인플레이션 헤지 수단 및 대응 전략을 소개합니다.",
};

export default function GuidePage() {
  return (
    <>
      <section className="top-description">
        <div className="container">
          <div className="top-desc-inner">
            <div className="breadcrumb">
              <Link href="/" style={{color: 'inherit'}}>홈</Link> <span className="bc-sep">›</span>
              <span className="bc-current">가이드</span>
            </div>
            <h1 className="main-title">인플레이션 방어 및 구매력 보존 가이드</h1>
            <p className="main-subtitle">
                    물가 상승으로 인한 화폐 가치 하락 막기! 인플레이션 시대의 필수 방어 전략과 실질 수익률 분석법.
                </p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article 
            className="guide-article" 
            dangerouslySetInnerHTML={{ __html: `
<h2>💡 경제 지표 대응: 구매력 보존 전문가 가이드</h2>
<h3>1. 인플레이션과 화폐 가치의 하락</h3>
<p>
                    인플레이션(물가상승)은 정지해 있는 현금이 매년 가치를 잃어가는 현상입니다. 연 3%의 물가가 상승한다면 약 24년 후에는 화폐의 구매력이 절반으로 줄어듭니다. 따라서 단순히
                    저축만 하기보다 물가상승률 이상의 수익을 내는 투자가 필수적입니다.
                </p>
<h3>2. 인플레이션 헤지(Hedge) 수단</h3>
<p>
                    물가가 오를 때 가치가 함께 오르는 <strong>실물 자산(부동산, 금)</strong>이나 가격 결정력이 있는 우량 기업의 <strong>주식</strong>은 훌륭한
                    인플레이션 방어 수단입니다. 채권의 경우 물가연동채권(TIPS)을 통해 인플레이션 위험을 직접적으로 방어할 수 있습니다.
                </p>
<h3>3. 실질 수익률의 중요성</h3>
<p>
                    투자의 성패는 명목 수익률이 아닌 <strong>실질 수익률(명목 수익률 - 물가상승률)</strong>로 결정됩니다. 예금 금리가 4%여도 물가가 5% 오른다면 실질적으로는
                    마이너스 성장을 하는 셈입니다. 항상 세금과 물가를 제외한 실질 자산 증가분을 계산하는 습관이 중요합니다.
                </p>
<h3>4. 인플레이션 시대의 부채 관리</h3>
<p>
                    고정 금리 부채는 인플레이션 시기에 실질적인 상환 부담이 줄어드는 효과가 있습니다. 적절한 레버리지를 활용해 인플레이션을 방어할 수 있는 자산에 투자했다면, 인플레이션은 오히려
                    자산 증식의 동력이 될 수도 있습니다.
                </p>
<h3>5. 계산 방법 및 인플레이션 공식</h3>
<div class="formula-box">
<p>미래 화폐 가치(구매력) 계산 공식:</p>
<code>미래 가치 = 현재 가치 ÷ (1 + 물가상승률)^기간</code>
<p style="margin-top: 15px;">미래 필요 금액(명목 가액) 계산 공식:</p>
<code>미래 필요 금액 = 현재 금액 × (1 + 물가상승률)^기간</code>
</div>
<h2>자주 묻는 질문 (FAQ)</h2>
<div class="faq-list">
<details class="faq-item">
<summary>스태그플레이션(Stagflation)이 왜 무서운가요?</summary>
<p>
                            스태그플레이션은 경기 침체를 뜻하는 'Stagnation'과 'Inflation'의 합성어입니다. 경기는 안 좋은데 물가만 오르는 최악의 상황을 말합니다. 소득은
                            줄어드는데 생활비 부담은 커져서 경제 전반에 막대한 타격을 주며, 정책적으로도 금리를 올리기도 내리기도 어려운 난관에 봉착하게 됩니다.
                        </p>
</details>
<details class="faq-item">
<summary>물가연동채권(TIPS)은 무엇인가요?</summary>
<p>
                            물가가 오르는 만큼 채권의 <strong>원금과 이자도 함께 늘어나는</strong> 특수 채권입니다. 인플레이션 위험을 직접적으로 방어할 수 있어 보수적인
                            투자자들에게 인기가 높습니다. 시장의 기대 인플레이션보다 실제 물가가 더 많이 오를 때 큰 혜택을 볼 수 있는 상품입니다.
                        </p>
</details>
<details class="faq-item">
<summary>금(Gold)은 정말 인플레이션을 막아주나요?</summary>
<p>
                            역사적으로 금은 대표적인 안전 자산이자 인플레이션 헤지 수단이었습니다. 화폐 가치가 불안정할 때 금으로 수요가 몰리기 때문입니다. 다만, 금은 배당이나 이자가
                            발생하지 않으므로 전체 자산의 5~10% 내외로 <strong>보험 성격</strong>으로 보유하는 것이 일반적인 전문가들의 조언입니다.
                        </p>
</details>
<details class="faq-item">
<summary>미래 은퇴 자금, 물가상승률을 어떻게 반영하나요?</summary>
<p>
                            현재 생활비 수준을 기준으로, [미래 필요금액 = 현재 생활비 × (1 + 예상 물가상승률)^남은 기간] 공식을 사용하세요. 만약 연 3% 물가상승을 가정하고 24년
                            후 은퇴한다면, 현재 가치의 <strong>딱 2배</strong>에 해당하는 금액이 있어야 지금과 똑같은 생활 수준을 유지할 수 있습니다.
                        </p>
</details>
<details class="faq-item">
<summary>하이퍼인플레이션(Hyperinflation)이 일어날 수도 있나요?</summary>
<p>
                            물가 상승이 통제를 벗어나 단기간에 수백, 수천 %씩 오르는 현상입니다. 과거 독일이나 최근의 베네수엘라 사례가 대표적입니다. 현대 경제 시스템에서는 드문 일이지만,
                            중앙은행의 과도한 화폐 발행이나 국가 신용 붕괴 시 발생할 수 있어 경제 지표를 주의 깊게 살펴야 합니다.
                        </p>
</details>
<details class="faq-item">
<summary>인플레이션 시기에 채권 투자는 불리한가요?</summary>
<p>
                            고점 금리에서 발행된 기존 채권은 물가가 올라 금리가 상승하면 <strong>채권 가격이 하락</strong>하므로 단기적으로 불리할 수 있습니다. 하지만 금리가
                            정점에 도달했을 때 새로 발행된 고금리 채권에 투자한다면, 향후 인플레이션이 꺾일 때 큰 자본 이득을 기대할 수 있는 양날의 검과 같습니다.
                        </p>
</details>
</div>
` }} 
          />
        </div>
      </main>
    </>
  );
}
