import { Metadata } from "next";
import Link from "next/link";
import "../guide.css";

export const metadata: Metadata = {
  title: "2026 주택청약 가점 계산 완벽 가이드 - 금융계산기.kr",
  description: "아파트 청약 당첨을 위한 무주택기간, 부양가족, 청약통장 가입기간 84점 만점 가점 계산법과 특별공급 전략을 자세히 알려드립니다.",
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
            <h1 className="main-title">주택청약 가점 만점 공략 가이드</h1>
            <p className="main-subtitle">
                    내 집 마련의 첫걸음, 무주택기간과 부양가족 산정 기준부터 청약통장 84점 만점의 비밀까지 완벽히 해부합니다.
                </p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article 
            className="guide-article" 
            dangerouslySetInnerHTML={{ __html: `
<h2>💡 주택청약 가점제란 무엇인가요?</h2>
<h3>1. 가점제(총 84점 만점)의 핵심 구성</h3>
<p>
                    민영주택 청약 시, 경쟁이 발생하면 점수가 높은 순으로 당첨자를 선정하는 제도를 <strong>가점제</strong>라고 합니다. 가점은 크게 3가지 항목으로 구성되며, 합산 시
                    <strong>만점은 84점</strong>입니다.
                </p>
<div class="formula-box">
<p>📌 청약 가점 산정 항목 (총 84점)</p>
<ul>
<li><span style="color: #0d9488;">무주택기간 (최고 32점):</span> 만 30세부터 산정, 1년마다 2점 가산</li>
<li><span style="color: #0d9488;">부양가족 수 (최고 35점):</span> 기본 5점 + 1명당 5점 가산</li>
<li><span style="color: #0d9488;">가입기간 (최고 17점):</span> 통장 가입일로부터 1년마다 1점 가산</li>
</ul>
</div>
<h3>2. '무주택기간' 산정의 함정 피하기</h3>
<p>
                    많은 분들이 가장 헷갈려하시는 부분이 무주택기간 산정입니다. 평생 집을 한 번도 안 샀다고 해서 태어날 때부터 무주택기간으로 쳐주지 않습니다.
                    <strong>만 30세가 되는 날</strong>부터 산정되는 것이 원칙입니다. 단, 만 30세 이전에 결혼(혼인신고일 기준)했다면 혼인신고일부터 계산됩니다.
                    (만일 집을 소유했다가 팔았다면 가장 최근에 집을 판 날부터 다시 계산합니다.)
                </p>
<h3>3. '부양가족 수'에 부모님을 포함하려면?</h3>
<p>
                    부양가족 수는 점수 배점이 1명당 5점으로 가장 큽니다. 배우자, 직계존속(부모, 조부모), 직계비속(자녀)이 포함됩니다.
                    단, 부모님(직계존속)을 부양가족으로 인정받으려면 <strong>만 3년 이상 동일한 주민등록등본에 등재</strong>되어 있어야 하며, 부모님 모두 무주택자여야 합니다.
                </p>
<h2>💸 가점이 낮다면 어떻게 해야 할까? (추첨제 &amp; 특공)</h2>
<h3>1. 추첨제 공략 (운에 맡긴다)</h3>
<p>
                    가점이 40점 이하라면 인기 지역의 원픽 아파트 가점제로 당첨되는 것은 사실상 불가능에 가깝습니다. 이 경우 <strong>'추첨제'</strong> 비율이 높은 평형이나
                    특화/비규제 지역을 노려야 합니다. 청약홈 공고문에서 (가점제 40%, 추첨제 60%)와 같은 비율을 반드시 확인하세요.
                </p>
<h3>2. 특별공급 (신혼부부, 생애최초, 다자녀)</h3>
<p>
                    결혼한 지 7년 이내라면 <strong>신혼부부 특별공급</strong>을, 일생에 단 한 번도 집을 산 적이 없고 미혼이라면 <strong>생애최초 특별공급</strong>을
                    적극 노려야 합니다. 특별공급은 가점 점수가 아닌 '소득 기준', '자녀 수', '거주지' 혹은 완전한 '추첨'으로 진행되기 때문에 2030에게 가장 유리한 문입니다.
                </p>
<h2>자주 묻는 질문 (FAQ)</h2>
<div class="faq-list">
<details class="faq-item">
<summary>소형/저가 주택을 소유하고 있는데 무주택으로 인정되나요?</summary>
<p>
                            예, 민영주택 일반공급 청약 시 <strong>전용면적 60㎡ 이하이며, 공시가격이 수도권 1.3억 원(지방 8천만 원) 이하</strong>인 주택 1채만 보유한
                            경우 예외적으로 무주택자로 간주하여 가점을 계산할 수 있습니다. (※ 특별공급에서는 유주택으로 봅니다.)
                        </p>
</details>
<details class="faq-item">
<summary>아내가 결혼 전에 집을 팔았는데 무주택기간은 어떻게 되나요?</summary>
<p>
                            혼인신고 전에 배우자가 집을 처분했다면, 청약 신청자(본인) 및 배우자 모두 현재 무주택이므로 <strong>본인의 기준(만 30세 또는 혼인신고일 중 빠른
                                날)</strong>으로 무주택기간을 온전히 산정받을 수 있습니다. 하지만 혼인신고 후 처분했다면 처분일로부터 산정됩니다.
                        </p>
</details>
<details class="faq-item">
<summary>부모님이 유주택자인데 같이 살면 제 가점이 깎이나요?</summary>
<p>
                            가점이 깎인다기보다는, <strong>부모님을 부양가족 수(+5점)에서 제외</strong>하고 계산해야 합니다. 또한 청약 종류나 특공 조건에 따라 세대원 전체가
                            무주택이어야 신청할 수 있는 경우가 있으니 모집공고의 (무주택세대구성원) 자격 요건을 꼭 확인하세요.
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
