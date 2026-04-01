import { Metadata } from "next";
import Link from "next/link";
import "../guide.css";

export const metadata: Metadata = {
  title: "3층 연금 구조 분석 및 노후 대비 가이드 - 금융계산기.kr",
  description: "국민연금, 퇴직연금, 개인연금의 3층 구조 분석 및 예상 수령액 극대화 전략, 세제 혜택 가이드를 확인하세요.",
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
            <h1 className="main-title">3층 연금 구조 분석 및 대비 가이드</h1>
            <p className="main-subtitle">
                    국민·퇴직·개인연금의 구조 분석부터 최적의 연금 수령 전략과 세제 혜택 가이드까지 총정리.
                </p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article 
            className="guide-article" 
            dangerouslySetInnerHTML={{ __html: `
<h2>💡 3층 연금 구조 분석 및 노후 대비 전문가 제언</h2>
<h3>1. 3층 연금 체계의 이해</h3>
<p>
                    안정적인 노후를 위해서는 <strong>국민연금(1층)</strong>, <strong>퇴직연금(2층)</strong>, <strong>개인연금(3층)</strong>의 조화가
                    필수적입니다. 국민연금이 기초 생활을 보장한다면, 퇴직연금은 안정적 노후 생활을, 개인연금은 여유로운 노후 생활을 가능하게 합니다.
                </p>
<h3>2. 국민연금 수령액 극대화 전략</h3>
<p>
                    국민연금은 물가상승률을 반영하는 최강의 인플레이션 방어 수단입니다. 수령액을 높이려면 가입 기간을 최대한 늘리는 것이 핵심이며, 실직 기간에도
                    <strong>추후납부(추납)</strong>를 활용하거나 소득이 없어도 <strong>임의가입</strong>을 통해 가입 기간을 채우는 것이 유리합니다.
                </p>
<h3>3. 사적연금(IRP/연금저축) 세제 혜택</h3>
<p>
                    개인형 퇴직연금(IRP)과 연금저축에 납입하면 연간 최대 900만원까지 세액공제 혜택을 받을 수 있습니다. 또한 수령 시에도 일시금보다 10년 이상 연금으로 나누어 받을 경우
                    <strong>퇴직소득세의 30~40%를 감면</strong>받을 수 있어 절세 효과가 매우 큽니다.
                </p>
<h3>4. 주택연금 활용하기</h3>
<p>
                    연금 자산이 부족하다면 거주 중인 주택을 담보로 평생 연금을 받는 <strong>주택연금</strong>이 대안이 될 수 있습니다. 집을 매각하지 않고도 평생 주거권과 현금 흐름을
                    동시에 확보할 수 있어 최근 은퇴자들 사이에서 인기가 높습니다.
                </p>
<h3>5. 계산 방법 및 연금 산정 원리</h3>
<div class="formula-box">
<ul>
<li><span style="color: #94a3b8;">국민연금:</span> 기본연금액 × (부양가족연금액 + @) × 물가상승률 반영</li>
<li><span style="color: #94a3b8;">퇴직연금:</span> 근속연수 × 평균임금 × 예상 수익률(DC형)</li>
<li><span style="color: #94a3b8;">연금 고갈 대비:</span> 소득 대체율 40~50%를 기준으로 개인연금을 통한 보완적 설계가 필수입니다.
                        </li>
</ul>
</div>
<h2>자주 묻는 질문 (FAQ)</h2>
<div class="faq-list">
<details class="faq-item">
<summary>국민연금을 조기 수령하면 얼마나 줄어드나요?</summary>
<p>
                            조기 수령 시 1년 당 6% 감액됩니다. 정상 수령 나이보다 5년 일찍 받으면 <strong>최대 30% 감액</strong>된 금액을 평생 받게 됩니다. 반대로
                            수령 시기를 늦추는 '연기연금'을 활용하면 1년 당 7.2%(최대 36%)를 더 받을 수 있습니다. 본인의 건강 상태나 자금 상황을 고려하여 신중히 결정해야 합니다.
                        </p>
</details>
<details class="faq-item">
<summary>연금 수령 시 세금(연봉 및 연금소득세)은 어떻게 되나요?</summary>
<p>
                            연금을 받을 때도 세금이 발생합니다. 국민연금은 종합소득에 합산되며, 사적연금(연금저축/IRP)은 연간 수령액이 1,500만원(2026년 기준) 이하일 경우
                            3.3~5.5%의 저율 과세로 분리과세를 선택할 수 있습니다. 수령 시기를 늦출수록 세율이 낮아지는 '연금소득세 이연 효과'를 적극 활용하세요.
                        </p>
</details>
<details class="faq-item">
<summary>전업주부도 국민연금에 가입하는 게 좋은가요?</summary>
<p>
                            매우 추천합니다. <strong>'임의가입'</strong> 제도를 통해 소득이 없어도 가입할 수 있으며, 최소 10년만 납부하면 평생 연금 수령이 가능합니다. 민간
                            연금 상품보다 사업비가 낮고 물가상승률을 반영하기 때문에 가성비와 수익성 측면에서 가장 유리한 노후 준비 수단 중 하나입니다.
                        </p>
</details>
<details class="faq-item">
<summary>연금저축과 IRP 중 무엇을 먼저 가입할까요?</summary>
<p>
                            세액공제 한도를 채우는 게 목적이라면 <strong>연금저축(600만원)</strong>을 우선 활용하고, 추가로 <strong>IRP(300만원)</strong>를
                            채워 총 900만원 한도를 맞추는 것이 일반적입니다. 연금저축은 상대적으로 중도 인출이 자유롭지만, IRP는 법정 사유 외에는 중도 해지만 가능하므로 자금 운용의
                            유연성을 고려해야 합니다.
                        </p>
</details>
<details class="faq-item">
<summary>건강보험료 피부양자 자격이 왜 연금과 관련 있나요?</summary>
<p>
                            공적연금(국민/공무원연금 등) 수령액이 <strong>연 2,000만원을 초과</strong>하면 건강보험 피부양자 자격을 상실하고 지역가입자로 전환됩니다.
                            이때부터는 본인의 소득과 재산에 대해 건강보험료를 직접 납부해야 하므로, 연금 수령액이 기준점을 살짝 넘는다면 수령 시기를 조정하는 등의 전략이 필요합니다.
                        </p>
</details>
<details class="faq-item">
<summary>노후 준비, 최소 얼마부터 시작하면 될까요?</summary>
<p>
                            금액보다 <strong>'시작 시기'</strong>가 중요합니다. 복리의 마법 덕분에 20대에 월 10만원씩 넣는 것이 40대에 월 30만원씩 넣는 것보다 더 큰
                            연금액을 보장할 수 있습니다. 당장 큰돈이 없더라도 국민연금을 유지하면서 소액의 개인연금을 장기간 복리로 운용하는 습관이 노후를 결정짓습니다.
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
