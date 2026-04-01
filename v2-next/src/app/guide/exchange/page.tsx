import { Metadata } from "next";
import Link from "next/link";
import "../guide.css";

export const metadata: Metadata = {
  title: "글로벌 자산 관리와 환테크 핵심 전략 가이드 - 금융계산기.kr",
  description: "환율 변동의 원리와 달러 투자, 해외 결제 수수료 절약 기술, 환율 우대 혜택을 활용한 환테크 전략을 소개합니다.",
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
            <h1 className="main-title">글로벌 자산 관리 및 환테크 전략</h1>
            <p className="main-subtitle">
                    여행, 직구, 투자 등 다양한 외환 거래 시 수수료를 절감하고 실질적인 이익을 창출하는 환테크 비법 총정리.
                </p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article 
            className="guide-article" 
            dangerouslySetInnerHTML={{ __html: `
<h2>💡 환율 변동과 환테크: 외환 전문가 가이드</h2>
<h3>1. 환율의 기본 이해와 경제 지표</h3>
<p>
                    환율은 국가 간 통화의 교환 비율로, 미국의 <strong>기준금리</strong>와 해당 국가의 <strong>경제 성장률</strong>에 가장 큰 영향을 받습니다. 일반적으로
                    금리가 높은 통화로 자본이 쏠리기 때문에, 미국의 금리 결정(FOMC)은 원/달러 환율 변동의 핵심 변수가 됩니다.
                </p>
<h3>2. 달러 투자(환테크) 핵심 전략</h3>
<p>
                    환차익을 노리는 달러 투자는 현재 <strong>비과세</strong> 혜택이 있어 매력적입니다. 환율 변동성이 크므로 한 번에 전액을 환전하기보다는 <strong>'분할
                        매수/매도'</strong>를 통해 평균 단가를 낮추는 전략이 안전합니다.
                </p>
<h3>3. 해외 결제 시 수수료 절약 기술</h3>
<p>
                    해외 직구나 여행 시 원화(KRW)로 결제하는 DCC(현지 통화 결제 서비스)를 피하고, 반드시 <strong>현지 통화(달러, 유로 등)</strong>로 결제해야 추가 환전
                    수수료(약 3~8%)를 아낄 수 있습니다. 해외 원화 결제 차단 서비스를 미리 신청해 두는 것이 좋습니다.
                </p>
<h3>4. 환전 우대율과 은행 선택</h3>
<p>
                    주요 통화(USD, JPY, EUR)는 은행 앱을 통해 환전 시 최대 90%까지 <strong>환율 우대(스프레드 할인)</strong>를 받을 수 있습니다. 환전 지갑 서비스를
                    활용해 목표 환율 도달 시 미리 환전해 두는 방식도 효율적입니다.
                </p>
<h3>5. 계산 방법 및 환율 수수료 안내</h3>
<div class="formula-box">
<p>기본 환율 계산 공식:</p>
<code>환전 금액 = 보유 금액 × (매매기준율 ± 스프레드)</code>
<p class="note">※ 스프레드(수수료)는 은행별 환전 우대율에 따라 70~90%까지 감면 가능합니다. 본 계산기는 매매기준율을 바탕으로 한 기준 금액을 제공합니다.
                    </p>
</div>
<h2>자주 묻는 질문 (FAQ)</h2>
<div class="faq-list">
<details class="faq-item">
<summary>환율 우대 90%라는 말이 정확히 무슨 뜻인가요?</summary>
<p>
                            은행이 가져가는 <strong>환전 수수료(스프레드)의 90%를 깎아준다</strong>는 뜻입니다. 매매기준율과 살 때 환율의 차이가 20원이라면, 90% 우대를
                            받으면 2원만 수수료로 내고 18원은 아끼는 셈입니다. 주요 통화(USD, JPY, EUR)는 대부분 앱에서 90% 우대를 제공합니다.
                        </p>
</details>
<details class="faq-item">
<summary>엔화(JPY) 환율이 오를 때와 내릴 때, 언제 사야 하나요?</summary>
<p>
                            여행용이라면 <strong>환율이 낮을 때 미리 분할 환전</strong>해 두는 것이 좋습니다. 투자용이라면 차트상 저점 여부를 판단해야 하지만, 엔화는 전통적인
                            안전 자산이므로 글로벌 불안이 커질 때 가치가 오르는 경향이 있습니다.
                        </p>
</details>
<details class="faq-item">
<summary>카드 해외 결제 수수료는 어떻게 붙나요?</summary>
<p>
                            통상 <strong>'현지 결제액 × 전표 매입 시점 환율 + 국제브랜드사 수수료(1~1.1%) + 국내 카드사 수수료(0.18~0.35%)'</strong>가
                            적용됩니다. 원화 결제(DCC)가 발생하면 여기에 추가 수수료가 더 붙으므로 '해외 원화 결제 차단 서비스'를 신청해 두는 것이 안전합니다.
                        </p>
</details>
<details class="faq-item">
<summary>고시 환율이 은행마다 다른 이유는 무엇인가요?</summary>
<p>
                            각 은행은 매매기준율을 바탕으로 <strong>자율적으로 고시 환율</strong>을 결정하기 때문입니다. 수수료율이나 우대 정책이 다르므로 소액은 큰 차이가
                            없으나, 거액 환전 시에는 전국은행연합회나 앱을 통해 환율을 비교해 보는 것이 유리합니다.
                        </p>
</details>
<details class="faq-item">
<summary>환율이 급등할 때 기업들은 어떻게 대비하나요?</summary>
<p>
                            수출입 기업들은 <strong>'환헤지(Exchange Rate Hedging)'</strong>라는 기법을 씁니다. 선물환 거래 등을 통해 미래에 거래할 환율을
                            미리 고정해 두어 환율 변동으로 인한 손실 위험을 방지하는 것입니다. 개인 투자자도 외화 ETF 등을 통해 비슷한 효과를 낼 수 있습니다.
                        </p>
</details>
<details class="faq-item">
<summary>투자용으로 '달러 예금'은 어떤 장점이 있나요?</summary>
<p>
                            원화를 달러로 바꿔 예금에 넣으면 <strong>환차익(비과세)</strong>과 <strong>예금 이자(과세)</strong>를 동시에 누릴 수 있습니다. 환율
                            상승기에는 이자보다 환차익이 훨씬 큰 수익을 가져다주기도 하여 자산가들이 선호하는 안전 자산 포트폴리오의 필수 항목입니다.
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
