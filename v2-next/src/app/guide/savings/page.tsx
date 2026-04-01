import { Metadata } from "next";
import Link from "next/link";
import "../guide.css";

export const metadata: Metadata = {
  title: "예금 적금 만기 이자 및 절세 가이드 - 금융계산기.kr",
  description: "목돈 마련을 위한 예금과 적금 전략! 비과세 혜택, 단리/복리 차이, 예금자보호법 등 필승 재테크 가이드를 확인하세요.",
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
            <h1 className="main-title">예적금 만기 이자 및 절세 가이드</h1>
            <p className="main-subtitle">
                    저축 전략부터 절세 혜택, 단리/복리의 차이, 예금자보호법까지 당신의 자산 증식을 위한 핵심 가이드입니다.
                </p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article 
            className="guide-article" 
            dangerouslySetInnerHTML={{ __html: `
<h2>💡 예적금 전문가 가이드: 목돈 마련과 자산 증식을 위한 전략</h2>
<h3>1. 예금 풍차돌리기 전략</h3>
<p>
                    목돈을 한 번에 예금에 묶어두는 것이 부담스럽다면 <strong>'예금 풍차돌리기'</strong> 기법을 활용해 보세요. 자금을 여러 개로 쪼개 매달 하나씩 정기예금에 가입하는
                    방식입니다. 1년 후부터는 매달 만기가 돌아와 필요할 때 자금을 유동적으로 사용할 수 있고, 이자 손실을 최소화할 수 있습니다.
                </p>
<h3>2. 선저축 후지출 원칙</h3>
<p>
                    성공적인 저축의 제1원칙은 <strong>'선저축 후지출'</strong>입니다. 월급이 들어오자마자 가장 먼저 적금 통장으로 자동이체가 되도록 설정하세요. 소비하고 남은 돈을
                    저축하려 하면 절대 목표 금액을 모을 수 없습니다. 납입 금액 자체가 만기 수령액에 가장 큰 영향을 미칩니다.
                </p>
<h3>3. 금리 변동기 파킹통장 활용</h3>
<p>
                    금리 변동기에는 정기 예적금보다 <strong>'파킹통장(수시입출금 고금리 통장)'</strong>이 더 유리할 수 있습니다. 시장 금리가 오르는 추세라면 파킹통장에 자금을 두고
                    금리 추이를 지켜보다가 고점이 확인될 때 예금으로 갈아타는 것이 현명합니다.
                </p>
<h3>4. 비과세 종합저축으로 세금 0원 만들기</h3>
<p>
                    우리나라에서는 이자소득에 대해 기본적으로 <strong>15.4%의 이자소득세</strong>를 부과합니다. 하지만 <strong>만 65세 이상, 장애인,
                        독립유공자</strong> 등 특정 조건을 만족하는 경우 전 금융기관을 통틀어 5,000만 원 한도 내에서 발생하는 이자소득에 대해 세금을 전혀 떼지 않는
                    <strong>비과세 종합저축</strong> 가입이 가능합니다. 이 혜택을 활용하면 약 15% 더 많은 이자를 고스란히 챙길 수 있습니다.
                </p>
<h3>5. 제2금융권 세금우대 (저율과세) 혜택 활용</h3>
<p>
                    비과세 대상자가 아니더라도 실망할 필요는 없습니다. <strong>새마을금고, 신협, 단위농협, 수협</strong> 등의 상호금융기관에서 조합원으로 가입(출자금 납입)할 경우,
                    1인당 3,000만 원 한도 내에서 <strong>농어촌특별세 1.4%</strong>만 떼는 세금우대(저율과세) 혜택을 받을 수 있습니다. 제1금융권의 15.4% 일반과세와
                    비교하면 엄청난 절세 효과가 있습니다.
                </p>
<h3>6. 단리와 복리, 나에게 맞는 선택은?</h3>
<p>
                    단리는 원금에 대해서만 이자가 붙지만, 복리는 '원금+이자'에 다시 이자가 붙는 스노우볼 같은 구조입니다. 예치 기간이 짧을 때는 그 차이가 미미할 수 있으나, 3년, 5년 이상
                    장기 투자할 경우 월복리 상품의 최종 수령액이 압도적으로 커집니다.
                </p>
<h3>7. 예금자보호법 5천만 원의 진실과 분산 투자</h3>
<p>
                    모든 예금과 적금은 예금자보호법에 의해 각 금융기관별로 <strong>원금과 소정의 이자를 합하여 1인당 최고 5,000만 원</strong>까지만 보호받을 수 있습니다. 굴리는
                    목돈이 5천만 원을 초과한다면, <strong>서로 다른 법인의 금융기관(은행)에 예금을 쪼개어 분산 예치</strong>하는 것이 원금 손실 리스크를 차단하는 전략입니다.
                </p>
<h3>8. 계산 방법 및 예적금 공식</h3>
<p>금융기관에서 주로 사용하는 이자 산출 표준 공식입니다.</p>
<div class="formula-box">
<ul>
<li><strong>정기예금(단리):</strong> 이자 = 원금 × 연금리 × (예치개월수 / 12)</li>
<li><strong>정기적금(단리):</strong> 이자 = 월적립액 × [회차별 개월수 합계] × (연금리 / 12)</li>
<li style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed var(--border);">
<strong>세후 수령액:</strong> 원금 + [세전이자 × (1 - 세율)]</li>
</ul>
</div>
<p style="font-size: 0.9rem; margin-top: -10px;">※ 적금의 경우 매월 납입 시점부터 만기까지의 예치 기간이 다르기 때문에, 세전 이자율이 같더라도
                    예금보다 실제 수령하는 이자가 적게 계산됩니다.</p>
<h2>자주 묻는 질문 (FAQ)</h2>
<div class="faq-list">
<details class="faq-item">
<summary>예금과 적금, 동일한 금리면 어떤 것이 더 이자가 많나요?</summary>
<p>
                            결론부터 말씀드리면 <strong>예금이 훨씬 유리합니다.</strong> 예금은 가입한 시점부터 전체 금액에 이자가 붙지만, 적금은 매달 돈을 넣기 때문에 후반부에
                            넣은 돈은 이자가 거의 붙지 않습니다.
                        </p>
</details>
<details class="faq-item">
<summary>파킹통장과 정기예금, 무엇을 선택해야 할까요?</summary>
<p>
                            자금의 <strong>사용 시점</strong>에 따라 다릅니다. 당장 3~6개월 내에 써야 할 돈이라면 입출금이 자유로운 파킹통장이 유리하고, 1년 이상 건드리지
                            않을 목돈이라면 금리가 높은 정기예금이 좋습니다.
                        </p>
</details>
<details class="faq-item">
<summary>적금 만기 후 돈을 바로 찾지 않으면 어떻게 되나요?</summary>
<p>
                            만기일이 지난 후에도 돈을 찾지 않으면 <strong>'만기 후 이율'</strong>이 적용됩니다. 하지만 이 이율은 일반 약정 금리보다 훨씬 낮습니다. 따라서
                            만기 직후에 바로 찾아 새로운 상품에 재투자하는 것이 좋습니다.
                        </p>
</details>
<details class="faq-item">
<summary>중도해지를 하지 않고 급전을 마련할 방법이 있나요?</summary>
<p>
                            만기가 얼마 남지 않았는데 급하게 돈이 필요하다면, 높은 약정 이자를 포기하고 중도해지하는 것보다 <strong>예적금 담보대출(예금의 90~95%
                                한도)</strong>을 받아 단기간 사용하고 갚는 것이 이득일 수 있습니다.
                        </p>
</details>
<details class="faq-item">
<summary>저축은행 예금은 안전한가요?</summary>
<p>
                            예금자보호법에 따라 1인당 원금과 이자를 합해 <strong>5,000만원까지 보호</strong>됩니다. 5,000만원씩 여러 저축은행에 분산하여 예치하면 높은
                            금리와 안정성을 동시에 누릴 수 있습니다.
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
