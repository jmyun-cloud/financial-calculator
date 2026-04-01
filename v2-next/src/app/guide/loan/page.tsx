import { Metadata } from "next";
import Link from "next/link";
import "../guide.css";

export const metadata: Metadata = {
  title: "대출 이자 절약과 상환 방식 완벽 가이드 - 금융계산기.kr",
  description: "원리금균등, 원금균등, 만기일시 상환 방식 비교와 중도상환, DSR 관리, 금리인하요구권 활용 등 대출 이자 절약 꿀팁을 안내합니다.",
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
            <h1 className="main-title">대출 이자 및 상환 방식 완벽 가이드</h1>
            <p className="main-subtitle">
                    상환 방식의 차이점부터 중도상환, DSR 관리, 금리인하요구권 활용까지 대출 이자를 줄이는 모든 방법을 알아봅니다.
                </p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article 
            className="guide-article" 
            dangerouslySetInnerHTML={{ __html: `
<h2>💡 대출 이자 절약 전문가 가이드 및 상환 방식 총정리</h2>
<h3>1. 상환 방식별 특징 비교</h3>
<p>
<strong>원리금균등상환</strong>은 매월 납입하는 금액이 동일하여 가계 생활비 계획을 세우기 가장 유리합니다. 초기에는 이자 비중이 높지만 갈수록 원금 비중이 커집니다.
                    <strong>원금균등상환</strong>은 매월 동일한 원금을 갚아나가므로 시간이 지날수록 이자가 줄어들어 총 이자 부담이 가장 적은 방식입니다.
                    <strong>만기일시상환</strong>은 기간 중 이자만 내다가 만기에 원금을 갚는 방식으로, 당장의 부담은 적으나 총 이자는 가장 많이 발생합니다.
                </p>
<h3>2. 중도상환 수수료와 이자 절감 전략</h3>
<p>
                    여유 자금이 생겼을 때 무조건 상환하는 것이 답은 아닙니다. <strong>중도상환 수수료(보통 0.5~1.5%)</strong>가 발생하는 기간이라면, [상환으로 절약되는
                    이자]와 [수수료 비용]을 반드시 비교해야 합니다. 일반적으로 대출 실행 후 3년이 지나면 수수료가 면제되므로, 이 시점을 활용해 원금을 집중적으로 상환하는 것이 효과적입니다.
                </p>
<h3>3. 금리인하요구권 활용</h3>
<p>
                    취업, 승진, 소득 증가, 신용점수 상승 등 <strong>신용 상태가 개선</strong>되었다면 은행에 금리 인하를 요구할 수 있습니다. 이는 법적으로 보장된 권리이며,
                    최근에는 은행 앱을 통해 비대면으로 간편하게 신청할 수 있습니다.
                </p>
<h3>4. DSR 관리의 중요성</h3>
<p>
                    현재 대출 시장의 핵심은 <strong>DSR(총부채원리금상환비율)</strong>입니다. 모든 대출의 원리금을 연 소득의 일정 비율(보통 40%) 이내로 제한하기 때문에,
                    주택담보대출 같은 큰 대출을 앞두고 있다면 불필요한 마이너스 통장이나 카드론을 먼저 정리하여 한도를 확보하는 것이 중요합니다. (2026년 기준)
                </p>
<h3>5. расчет 대출 상환액 계산 공식 (수식 안내)</h3>
<p>금융기관에서 사용하는 표준 산식입니다.</p>
<div class="formula-box">
<ul style="font-size: 0.95rem;">
<li><strong>원리금균등 상환:</strong> 매월 상환액 = [대출원금 × 월금리 × (1+월금리)^기간] ÷ [(1+월금리)^기간 - 1]</li>
<li><strong>원금균등 상환:</strong> 매월 납입원금 = 대출원금 ÷ 기간 (이자는 잔액에 대해 매월 재계산)</li>
<li><strong>이자 계산:</strong> 월 이자 = 대출잔액 × (연금리 ÷ 12)</li>
</ul>
</div>
<p style="font-size: 0.9rem;">※ 모든 계산 결과는 원단위 미만 절사를 원칙으로 하며, 실제 은행의 기산일 및 휴일 규정에 따라 수 원의 오차가 발생할 수
                    있습니다.</p>
<h2>자주 묻는 질문 (FAQ)</h2>
<div class="faq-list">
<details class="faq-item">
<summary>금리인하요구권은 언제 신청할 수 있나요?</summary>
<p>
                            취업, 승진, 소득 증가, 신용등급 상승 등 <strong>본인의 신용 상태가 개선</strong>되었다면 언제든지 신청 가능합니다. 최근에는 은행 앱(App)을
                            통해 비대면으로 간편하게 신청할 수 있으며, 은행은 신청일로부터 10영업일 이내에 수용 여부를 답변해야 합니다.
                        </p>
</details>
<details class="faq-item">
<summary>고정금리와 변동금리 중 무엇이 더 좋은가요?</summary>
<p>
                            향후 금리가 떨어질 것으로 예상되면 <strong>변동금리</strong>, 금리가 오를 것으로 예상되면 <strong>고정금리</strong>가 유리합니다. 보통
                            고정금리가 변동금리보다 시작 금리는 높지만, 불확실한 미래 리스크에 대한 보험료라고 생각하시면 됩니다.
                        </p>
</details>
<details class="faq-item">
<summary>마이너스 통장과 일반 신용대출의 차이는?</summary>
<p>
                            마이너스 통장은 한도를 설정해두고 쓴 만큼만 이자를 내는 방식이라 편리하지만, 일반 신용대출보다 <strong>금리가 0.5%p 내외로 높습니다.</strong>
                            또한 쓰지 않더라도 설정된 한도 전액이 대출 잔액으로 잡혀 DSR 계산 시 불리하게 작용할 수 있습니다.
                        </p>
</details>
<details class="faq-item">
<summary>대출 갈아타기(대환대출) 시 유의할 점은?</summary>
<p>
                            더 낮은 금리로 옮길 때도 <strong>기존 대출의 중도상환 수수료</strong>와 <strong>새 대출의 인지세 등 부대비용</strong>을 고려해야
                            합니다. 최근에는 '대환대출 인프라'를 통해 앱에서 여러 은행의 금리를 비교하고 한 번에 이동할 수 있어 훨씬 간편해졌습니다.
                        </p>
</details>
<details class="faq-item">
<summary>연체하면 이자가 얼마나 무서워지나요?</summary>
<p>
                            정해진 날짜에 이자를 내지 못하면 약정 금리에 3%p 가량 추가되는 <strong>'연체 가산 금리'</strong>가 적용됩니다. 무엇보다 중요한 것은 신용점수
                            하락입니다. 단 몇 만 원이라도 5영업일 이상 연체하면 신용정보망에 공유되어 향후 몇 년간 금융 거래에 막대한 지장을 줄 수 있습니다.
                        </p>
</details>
<details class="faq-item">
<summary>생애최초 주택구입자 혜택이 있나요?</summary>
<p>
                            네, 생애최초 주택구입자는 LTV 한도가 최대 80%까지 완화되며, 취득세 감면 등 다양한 세제 혜택을 받을 수 있습니다. 또한 '디딤돌 대출'이나 '보금자리론'
                            같은 정책 자금 대출에서도 우대 금리를 적용받을 수 있으니 가장 먼저 확인해 보시는 것이 좋습니다.
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
