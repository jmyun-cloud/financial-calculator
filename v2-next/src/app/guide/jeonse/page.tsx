import { Metadata } from "next";
import Link from "next/link";
import "../guide.css";

export const metadata: Metadata = {
  title: "전세 vs 월세 완벽 비교 및 전환 가이드 - 금융계산기.kr",
  description: "전월세 전환 시 필수적인 법정 상한 계산법, 기회비용 비교, 그리고 반전세 주의사항까지 주거 안정 가이드를 확인하세요.",
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
            <h1 className="main-title">전세 vs 월세 선택 가이드</h1>
            <p className="main-subtitle">
                    자금 흐름 파악하기! 거주 안정을 위한 전월세 전환 계산, 기회비용 비교, 세액공제 혜택 총정리
                </p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article 
            className="guide-article" 
            dangerouslySetInnerHTML={{ __html: `
<h2>💡 자금 흐름과 주거 안정을 위한 전문가 제언</h2>
<h3>1. 전월세 전환율과 기회비용 비교</h3>
<p>
                    전세와 월세 중 무엇이 유리한지 판단하려면 <strong>전월세 전환율</strong>과 <strong>전세자금대출 금리</strong>를 비교해야 합니다. 대출 금리가 전환율보다
                    낮다면 대출을 받아 전세로 사는 것이 유리하고, 반대로 대출 금리가 너무 높다면 월세를 선택하고 남은 현금을 다른 자산에 투자하는 것이 효율적일 수 있습니다.
                </p>
<h3>2. 주거 안정성과 '깡통전세' 예방</h3>
<p>
                    전세 계약 시에는 매매가 대비 전세가 비중인 <strong>전세가율</strong>을 반드시 확인해야 합니다. 전세가율이 80%를 넘는 지역은 집값 하락 시 보증금 반환이 어려울
                    수 있으므로, 등기부등본 확인과 <strong>보증보험 가입</strong>이 필수적입니다.
                </p>
<h3>3. 월세의 장점과 자금 운용의 유연성</h3>
<p>
                    월세는 매달 고정 비용이 발생하지만, 목돈이 묶이지 않아 자금 운용의 <strong>유연성</strong>이 높습니다. 목돈을 다른 고수익 자산(주식, 채권 등)에 투자하여 월세
                    이상의 수익을 낼 수 있는 투자자라면 월세가 전략적인 선택이 될 수 있습니다.
                </p>
<h3>4. 임대차 보호법과 세액공제 활용</h3>
<p>
                    연봉 7천만원 이하 무주택자라면 월세에 대해 15~17%의 <strong>세액공제</strong>를 받을 수 있습니다. 또한 임대차 갱신 청구권 등 법적 권리를 숙지하여 갑작스러운
                    이사나 임대료 인상 요구에 대비해야 합니다.
                </p>
<h3>5. 계산 방법 및 전월세 전환 공식</h3>
<div class="formula-box">
<p style="margin-bottom: 10px; font-weight: 600;">월세 전환 공식 (전세 → 월세):</p>
<code style="margin-bottom: 25px;">월세 = (전세금 - 보증금) × 전환율 ÷ 12</code>
<p style="margin-bottom: 10px; font-weight: 600;">전세 전환 공식 (월세 → 전세):</p>
<code>전세금 = 보증금 + (월세 × 12 ÷ 전환율)</code>
</div>
<h2>자주 묻는 질문 (FAQ)</h2>
<div class="faq-list">
<details class="faq-item">
<summary>전세 → 월세 전환 시 집주인이 마음대로 전환율을 정할 수 있나요?</summary>
<p>
                            아니요. 임대차 계약 기간 중에는 <strong>법정 전월세 전환율 상한(현재 연 6%)</strong>을 초과할 수 없습니다. 기준 금리 변동에 따라 이 수치는
                            달라지며, 임대인이 이를 위반하여 과도한 월세를 요구할 경우 거부하거나 사후에 반환 청구를 할 수 있습니다.
                        </p>
</details>
<details class="faq-item">
<summary>월세 세액공제와 소득공제의 차이가 무엇인가요?</summary>
<p>
<strong>세액공제</strong>는 내야 할 세금 자체를 깎아주는 것으로 혜택이 큽니다(연봉 7천만원 이하 무주택자 기준 월세의 15~17%). 반면
                            <strong>소득공제(현금영수증)</strong>는 소득 금액을 줄여주는 방식입니다. 본인의 연봉 과 소득 수준에 따라 유리한 방식을 선택해야 하며, 확정일자와
                            전입신고가 필수입니다.
                        </p>
</details>
<details class="faq-item">
<summary>반전세로 계약할 때 주의할 점은?</summary>
<p>
                            반전세는 보증금이 일정 수준 이상이므로 <strong>전세권 설정</strong>이나 <strong>확정일자</strong>를 반드시 받아야 합니다. 또한 보증금을
                            올리고 월세를 낮추는 계약을 할 때 계산기를 통해 조정한 금액이 적정한지, 주변 시세와 비교했을 때 합리적인지 먼저 따져보는 과정이 필요합니다.
                        </p>
</details>
<details class="faq-item">
<summary>묵시적 갱신 후 임대료 인상을 요구한다면?</summary>
<p>
                            묵시적 갱신이 된 경우 이전 계약과 동일한 조건으로 연장된 것으로 봅니다. 임대인은 증액을 요구할 수 있지만, <strong>기존 임대료의 5%
                                이내</strong>로 제한되며 세입자가 반드시 동의해야 하는 것은 아닙니다. 만약 합의가 되지 않는다면 임대차 분쟁 조정 위원회를 통해 해결할 수 있습니다.
                        </p>
</details>
<details class="faq-item">
<summary>계약 만료 전 이사를 가야 한다면 중개수수료는 누가 내나요?</summary>
<p>
                            법적으로는 <strong>임대인이 지불</strong>하는 것이 원칙입니다. 하지만 실무적으로는 다음 세입자를 빨리 구하기 위해 기존 세입자가 부담하는 관례가
                            많습니다. 계약서 작성 시 특약 사항에 관련 내용을 명시해 두면 향후 분쟁을 예방할 수 있습니다.
                        </p>
</details>
<details class="faq-item">
<summary>전세금 반환보증 보험 가입은 필수인가요?</summary>
<p>
                            보증금이 전 재산인 서민들에게는 사실상 <strong>필수 보험</strong>입니다. 특히 다가구 주택이나 빌라의 경우 집주인의 전체 채무를 파악하기 어려우므로,
                            약간의 보험료를 지불하더라도 가입하는 것이 정신 건강과 자산 보호 측면에서 현명한 투자입니다.
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
