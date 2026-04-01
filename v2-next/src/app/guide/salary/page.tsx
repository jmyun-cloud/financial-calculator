import { Metadata } from "next";
import Link from "next/link";
import "../guide.css";

export const metadata: Metadata = {
  title: "2026 연봉 실수령액 계산 가이드 - 금융계산기.kr",
  description: "2026년 기준 연봉 및 실수령액 관련 상세 가이드, 4대보험 요율 계산법, 비과세 수당 활용법 및 연말정산 전략을 안내해 드립니다.",
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
            <h1 className="main-title">연봉 실수령액 계산 가이드</h1>
            <p className="main-subtitle">
                    2026년 기준 4대보험 요율, 비과세 수당 활용법, 그리고 실수령액 계산 원리를 자세히 알려드립니다.
                </p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article 
            className="guide-article" 
            dangerouslySetInnerHTML={{ __html: `
<h2>💡 2026년 연봉 실수령액 높이는 법 및 4대보험 가이드</h2>
<h3>1. 2026년 4대보험 요율 및 계산법</h3>
<p>
                    2026년 근로자 부담분 기준 <strong>국민연금은 4.5%</strong>(상한액 637만원), <strong>건강보험은 3.595%</strong>입니다. 여기에
                    건강보험료의 13.14%인
                    장기요양보험료와 0.9%의 고용보험료가 추가로 공제됩니다. 비과세 수당(식대 등)을 제외한 보수월액을 기준으로 산정되므로 실질적인 공제액을 미리 파악하는 것이 중요합니다.
                </p>
<h3>2. 실수령액을 높이는 비과세 수당 활용</h3>
<p>
                    급여 항목 중 <strong>식대(월 20만원 한도)</strong>, 자가운전보조금(월 20만원), 육아수당(월 20만원) 등은 세금을 떼지 않는 <strong>비과세
                        수당</strong>입니다.
                    비과세 항목이 많을수록 4대보험료와 소득세가 줄어들어 실제 내 통장에 찍히는 실수령액이 높아집니다.
                </p>
<h3>3. 연봉 계산 결과의 오차 발생 이유</h3>
<p>
                    연봉 계산기 결과와 실제 급여 명세서가 수 원에서 수천 원 정도 차이 날 수 있습니다. 이는 회사마다 <strong>비과세 항목(식대, 자가운전보조금 등)</strong> 설정이
                    다르고, 부양가족 수에
                    따른 근로소득세 간이세액표 적용 방식이 다르기 때문입니다. 온라인 계산기는 일반적인 기준을 바탕으로 산출된 예측치입니다.
                </p>
<h3>4. 2026년 4대보험 요율 및 계산 방법</h3>
<p>급여 수준에 따라 정확한 공제액을 산출하기 위한 공식은 다음과 같습니다.</p>
<div class="formula-box">
<ul>
<li><strong>국민연금:</strong> 비과세 제외 월 소득액 × 4.5%</li>
<li><strong>건강보험:</strong> 비과세 제외 월 소득액 × 3.595%</li>
<li><strong>장기요양:</strong> 건강보험료 × 13.14%</li>
<li><strong>고용보험:</strong> 비과세 제외 월 소득액 × 0.9%</li>
<li style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed var(--border);">
<strong>실수령액 공식:</strong> [월급(기본급+수당)] - [4대보험 합계] - [소득세(국세)] - [지방소득세(국세의 10%)]
                        </li>
</ul>
</div>
<h3>5. 실수령액보다 중요한 '연말정산' 전략</h3>
<p>
                    매달 떼이는 세금은 임시 금액입니다. 총급여의 25%까지는 신용카드를 쓰고, 초과분은 <strong>체크카드나 현금영수증(30% 공제)</strong>을 활용하는 것이 유리합니다.
                    또한 연금저축이나
                    IRP 계좌를 활용하면 연간 최대 900만원 한도로 세액공제를 받을 수 있어 '13월의 월급'을 챙기는 데 효과적입니다.
                </p>
<h2>자주 묻는 질문 (FAQ)</h2>
<div class="faq-list">
<details class="faq-item">
<summary>월급 날짜가 주말이면 언제 지급되나요?</summary>
<p>
                            근로기준법상 임금은 정해진 날짜에 전액 지급되어야 합니다. 보통 지급일이 휴일인 경우, 대부분의 회사는 <strong>그 전날(평일)</strong>에 앞당겨
                            지급합니다. 이는 회사 내부
                            규정(취업규칙)에 따라 달라질 수 있으므로 본인의 계약 조건을 확인하는 것이 좋습니다.
                        </p>
</details>
<details class="faq-item">
<summary>수습 기간에는 월급의 90%만 받는 게 맞나요?</summary>
<p>
                            네, 법적으로 가능합니다. 1년 이상의 근로 계약을 체결하고 <strong>수습 시작일로부터 3개월 이내</strong>인 경우, 최저임금의 90%까지 지급할 수
                            있습니다. 단, 단순
                            노무직종(편의점, 음식점 등 일부 직종)은 수습 기간이라 하더라도 최저임금 100%를 무조건 지급해야 합니다.
                        </p>
</details>
<details class="faq-item">
<summary>중도 입사하거나 퇴사할 때 급여 계산은 어떻게 하나요?</summary>
<p>
                            보통 <strong>일할 계산(日割計算)</strong> 방식을 따릅니다. [월급 ÷ 해당 월의 총 일수 × 실제 근무 일수]로 계산하는 것이 일반적입니다. 하지만
                            회사에 따라 월급을
                            30일로 고정하여 계산하거나, 유급 휴일을 포함하는 방식이 다를 수 있으므로 급여 명세서의 상세 내역을 확인해야 합니다.
                        </p>
</details>
<details class="faq-item">
<summary>프리랜서(3.3%)와 정규직(4대보험) 중 어느 쪽이 유리한가요?</summary>
<p>
                            당장 통장에 찍히는 돈은 세금을 3.3%만 떼는 프리랜서가 많을 수 있습니다. 하지만 정규직은 <strong>회사가 4대 보험료의 절반</strong>을 부담해주고,
                            퇴직금과 연차 수당이
                            발생하며 건강보험 피부양자 자격 등 유무형의 혜택이 훨씬 큽니다. 장기적인 자산 형성과 사회안전망 측면에서는 정규직이 절대적으로 유리합니다.
                        </p>
</details>
<details class="faq-item">
<summary>포괄임금제면 야근 수당을 아예 못 받나요?</summary>
<p>
                            포괄임금제는 연장·야간·휴일근로 수당을 미리 급여에 포함해 지급하는 방식입니다. 하지만 <strong>미리 정해둔 연장 근로 시간</strong>을 초과하여
                            근무했다면, 그 초과분에 대해서는
                            별도의 수당을 청구할 수 있습니다. 최근 정부 지침에 따라 포괄임금제의 오남용에 대한 감시가 강화되고 있습니다.
                        </p>
</details>
<details class="faq-item">
<summary>육아휴직 중에도 월급이 나오나요? 세금은요?</summary>
<p>
                            회사가 직접 월급을 주지는 않지만, 고용보험에서 <strong>육아휴직 급여</strong>를 지급합니다. 이 급여는 소득세법상 비과세이므로 별도의 세금을 떼지
                            않습니다. 다만 평소 납부하던
                            건강보험료는 휴직 기간 중 납부가 유예되었다가 복직 시 감면된 금액으로 정산하여 납부하게 됩니다.
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
