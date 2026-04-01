import { Metadata } from "next";
import Link from "next/link";
import "../guide.css";

export const metadata: Metadata = {
  title: "2026 종합소득세 예상세액 계산 가이드 - 금융계산기.kr",
  description: "2026년 기준 5월 종합소득세 누진세율표 적용 및 프리랜서 종합소득세 예상세액 계산법, 추계신고와 기납부세액 등 종소세 기초 가이드.",
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
            <h1 className="main-title">종합소득세 환급 및 누진세율 가이드</h1>
            <p className="main-subtitle">
                    2026년 기준 5월 종합소득세(종소세) 누진세율 6~45% 구조와 사업소득 환급의 비밀을 알아봅니다.
                </p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article 
            className="guide-article" 
            dangerouslySetInnerHTML={{ __html: `
<h2>💡 종합소득세(종소세)란 무엇인가요?</h2>
<h3>1. 종합소득세의 개념</h3>
<p>
                    매년 1월 1일부터 12월 31일까지 개인이 경제활동을 통해 얻은 <strong>모든 소득(이자, 배당, 사업(프리랜서), 근로, 연금, 기타소득)</strong>을 종합하여 다음
                    해 5월에 신고하고 납부하는 세금입니다. 직장에서 연말정산을 끝낸 근로소득만 있는 직장인이라면 안 해도 되지만, 사업자나 프리랜서, N잡러(투잡)라면 무조건 신고해야 합니다.
                </p>
<div class="formula-box">
<p>📌 세금 결정 구조</p>
<ul>
<li><span style="color: #94a3b8;">과세표준:</span> 총수입 - 필요경비 - 소득공제(기본공제 등)</li>
<li><span style="color: #94a3b8;">산출세액:</span> 과세표준 × 누진세율(6%~45%) - 누진공제액</li>
<li><span style="color: #e11d48;">결정세액:</span> 산출세액 - 세액공제(자녀, 월세 등)</li>
<li><span style="color: #10b981;">납부/환급세액:</span> 결정세액 - 기납부세액(이미 낸 세금)</li>
</ul>
</div>
<h3>2. 과세표준에 따른 '누진세율' (2026년 기준)</h3>
<p>
                    우리나라 세금은 돈을 많이 벌수록 세금 비율이 껑충껑충 뛰는 <strong>'누진세율'</strong> 구조입니다.
                </p>
<ul>
<li><strong>1,400만원 이하:</strong> 6%</li>
<li><strong>5,000만원 이하:</strong> 15% (누진공제액 126만원)</li>
<li><strong>8,800만원 이하:</strong> 24% (누진공제액 576만원)</li>
<li><strong>1.5억원 이하:</strong> 35% (누진공제액 1,544만원)</li>
<li><strong>3억원 이하:</strong> 38% (누진공제액 1,994만원)</li>
<li><strong>5억원 이하:</strong> 40%</li>
<li><strong>10억원 이하:</strong> 42%</li>
<li><strong>10억원 초과:</strong> 45% 최고세율</li>
</ul>
<p>상단의 <a href="../global-tax-calculator/index.html" style="color: var(--primary); font-weight: 700;">종합소득세 계산기</a>를 활용하면 이 복잡한 누진세율과 지방소득세 10%를
                    원클릭으로 계산해 줍니다.</p>
<h2>💸 토해내는 세금 vs 돌려받는 세금(환급)</h2>
<h3>1. 왜 세금을 돌려주나요 (환급의 원리)?</h3>
<p>
                    수입의 3.3%를 꼬박꼬박 미리 떼인 프리랜서라면, 이미 낸 세금(기납부세액)이 실제 결정된 세금보다 많은 경우가 흔합니다. 특히, 소득이 낮아 6% 최저구간에 속하거나 경비
                    처리를 많이 받았다면 대부분 환급 릴레이를 경험합니다. (이때 환급되는 세금에는 지방소득세 0.3%도 포함!)
                </p>
<h3>2. 추계신고 (단순경비율 vs 기준경비율)</h3>
<p>
                    장부(가계부 같은 것)를 쓰지 않았다면, 국세청이 업종별로 정해진 비율만큼을 경비로 쳐줍니다. 단순경비율은 대략 수입의 60~70% 내외를 그냥 경비로 인정해주므로 세금이 확
                    줄어듭니다. 하지만 연 수입이 2,400만원(업종별 상이)을 넘겨 '기준경비율' 대상자가 되면, 주요 경비 증빙 자료를 제출하지 않는 한 <strong>세금 폭탄</strong>을
                    맞을 수 있으니 유의해야 합니다.
                </p>
<h2>자주 묻는 질문 (FAQ)</h2>
<div class="faq-list">
<details class="faq-item">
<summary>제가 환급 대상인지 어떻게 아나요?</summary>
<p>
                            매년 5월 1일부터 홈택스에 로그인하시면, <strong>'종합소득세 신고안내문'</strong>을 볼 수 있습니다. 거기서 기납부세액(먼저 낸 세금)이 얼마인지
                            확인 가능합니다. 간편장부 대상자나 단순경비율 대상자인 경우, 홈택스의 '모두채움 신고서'를 클릭 몇 번만 진행하면 예상 환급세액(마이너스 금액)을 바로 알려줍니다.
                        </p>
</details>
<details class="faq-item">
<summary>직장인인데 부업으로 스마트스토어나 알바를 해요. 어떻게 신고하나요?</summary>
<p>
                            이른바 'N잡러'는 연말정산을 했더라도 5월 종합소득세 신고 시 <strong>근로소득과 사업소득을 합산</strong>해서 다시 신고해야 합니다. 근로소득(직장
                            월급) 때문에 출발 지점(과세표준 구간)이 이미 높아진 상태라, 세금을 토해낼(추가 납부) 가능성이 단일 프리랜서보다 훨씬 큽니다. 사업소득 신고 시 비용 처리를
                            최대한 증빙하는 게 절세의 핵심입니다!
                        </p>
</details>
<details class="faq-item">
<summary>수납 및 신고 대행 앱(삼쩜삼 등)을 써도 되나요?</summary>
<p>
                            수입 증빙이 복잡하지 않은 대학생, 단기 알바 등은 수수료를 지불하더라도 앱을 이용해 간편하게 묻혀있던 환급금을 찾을 수 있어 유용합니다. 하지만 프리랜서 전업으로
                            소득이 크거나 환급액 단위가 큰 경우 세무 대리인(세무사)을 통하거나 본인이 직접 홈택스에서 신고하는 것이 수수료를 크게 아낄 수 있습니다. (홈택스 너무
                            쉬워졌어요!)
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
