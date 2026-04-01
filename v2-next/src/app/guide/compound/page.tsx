import { Metadata } from "next";
import Link from "next/link";
import "../guide.css";

export const metadata: Metadata = {
  title: "단리와 복리의 차이 및 72의 법칙 전문 가이드 - 금융계산기.kr",
  description: "복리 수익률 극대화 전략! 단리와 복리의 근본적인 차이, 72의 법칙 활용법, 투자의 복리 효과를 배우고 자산을 똑똑하게 늘려보세요.",
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
            <h1 className="main-title">단리와 복리의 차이 및 72의 법칙 가이드</h1>
            <p className="main-subtitle">
                    기하급수적인 성장을 만드는 복리! 단리와 복리를 비교하고 투자 기간의 강점(72의 법칙)을 쉽게 풀어드립니다.
                </p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article 
            className="guide-article" 
            dangerouslySetInnerHTML={{ __html: `
<h2>💡 복리의 마법: 시간과 수익률이 만드는 자산 증식</h2>
<h3>1. 절세 계좌를 활용한 복리 극대화</h3>
<p>
                    세금과 수수료는 복리의 적입니다. ISA, 연금저축, IRP와 같은 절세 계좌를 활용하여 세금으로 나갈 자금까지 온전히 재투자하면, 시간이 흐를수록 일반 계좌와의 자산 격차는
                    기하급수적으로 벌어지게 됩니다.
                </p>
<h3>2. 계산 방법 및 상세 공식</h3>
<div class="formula-box">
<p style="margin-bottom: 20px; font-weight: 600; border-bottom: 1px solid var(--border); padding-bottom: 10px;">
                        📈 복리 (Compound Interest) 공식</p>
<code style="display: block; background: var(--surface); padding: 12px; border-radius: 6px; font-family: monospace; margin-bottom: 15px;">A = P × (1 + r/n)^(n×t)</code>
<p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">P=원금 | r=연이율 |
                        n=복리주기/년 | t=기간(년)</p>
<p style="margin-bottom: 10px; font-weight: 600;">월 추가투자 포함 시:</p>
<code style="display: block; background: var(--surface); padding: 12px; border-radius: 6px; font-family: monospace; margin-bottom: 5px;">A = P×(1+r/n)^(n×t) + M×[(1+r/n)^(n×t)-1]/(r/n)</code>
<p style="font-size: 0.85rem; color: var(--text-muted);">M = 월 추가 투자금</p>
</div>
<div class="formula-box" style="margin-top: 30px;">
<p style="margin-bottom: 20px; font-weight: 600; border-bottom: 1px solid var(--border); padding-bottom: 10px;">
                        📐 단리 (Simple Interest) 공식</p>
<code style="display: block; background: var(--surface); padding: 12px; border-radius: 6px; font-family: monospace; margin-bottom: 15px;">A = P × (1 + r × t)</code>
<p style="font-size: 0.85rem; color: var(--text-muted);">
                        📌 <strong>핵심 차이:</strong> 동일한 조건에서 기간이 길수록 복리가 단리보다 훨씬 큰 수익을 냅니다.
                        1,000만원을 연 7%로 30년 투자 시 <strong>복리는 약 7,612만원</strong>으로 단리(3,100만원)보다 2배 이상 수익액이 높습니다.
                    </p>
</div>
<h2>72의 법칙 (Rule of 72)</h2>
<p>
                    72의 법칙은 투자금이 <strong>2배가 되는 기간</strong>을 간단하게 계산하는 방법입니다. 72를 연간 수익률(%)로 나누면 자산이 2배가 되는 대략적인 기간(년)을
                    알 수 있습니다.
                </p>
<div class="info-grid three-col">
<div class="info-card">
<h3>📌 계산 방법</h3>
<p><strong>2배 기간 ≈ 72 ÷ 연이율(%)</strong></p>
<p>연 6% 수익률이라면 72 ÷ 6 = <strong>12년</strong>마다 자산이 2배가 됩니다.</p>
</div>
<div class="info-card">
<h3>📌 활용 예시</h3>
<ul>
<li>연 4% → 18년 후 2배</li>
<li>연 6% → 12년 후 2배</li>
<li>연 8% → 9년 후 2배</li>
<li>연 10% → 7.2년 후 2배</li>
<li>연 12% → 6년 후 2배</li>
</ul>
</div>
<div class="info-card">
<h3>📌 인플레이션 응용</h3>
<p>물가상승률에도 적용할 수 있습니다. 물가가 연 3% 오른다면 72 ÷ 3 = <strong>24년</strong> 후에 현재 화폐 가치의 절반으로 줄어들 수 있습니다.
                        </p>
</div>
</div>
<h2>자주 묻는 질문 (FAQ)</h2>
<div class="faq-list">
<details class="faq-item">
<summary>복리 효과가 눈에 띄게 나타나는 시점은 언제인가요?</summary>
<p>
                            일반적으로 <strong>10년~15년</strong> 이상 경과했을 때 자산 성장 곡선이 가팔라지는 '변곡점'이 나타납니다. 초기에는 원금이 이자보다 훨씬 크지만,
                            시간이 지날수록 이자가 원금을 추월하는 '스노우볼 효과'가 본격화됩니다. 인내심을 갖고 이 한계점을 넘기는 것이 중요합니다.
                        </p>
</details>
<details class="faq-item">
<summary>월복리와 연복리, 실제 수령액 차이가 많이 나나요?</summary>
<p>
                            수익률 10%로 20년 투자 시, 월복리가 연복리보다 최종 자산이 약 3~4% 정도 더 높습니다. 단기적으로는 무시할 수준일 수 있으나, <strong>투자 금액이
                                크고 기간이 길어질수록</strong> 그 절대적인 금액 차이는 무시할 수 없는 수준이 됩니다.
                        </p>
</details>
<details class="faq-item">
<summary>하이이익(High Risk) 복리 투자는 위험한가요?</summary>
<p>
                            연 20% 이상의 고수익 복리 계획은 실현 가능성이 매우 낮습니다. 복리는 <strong>안정적이고 지속 가능한 수익률</strong>일 때 가장 강력합니다. 한
                            해에 50% 수익을 내고 다음 해에 40% 손실을 보는 것보다, 매년 꾸준히 7~8% 수익을 내는 것이 장기 복리 관점에서는 훨씬 유리합니다.
                        </p>
</details>
<details class="faq-item">
<summary>추가 투자 없이 원금만으로도 복리 효과가 있나요?</summary>
<p>
                            물론입니다. 원금에서 발생한 이자가 다시 재투자되는 구조이므로 원금만으로도 복리 효과는 발생합니다. 하지만 <strong>월 추가 투자</strong>를 병행하면
                            복리의 바퀴가 더 빨리 돌아가게 되어 최종 목표 금액에 도달하는 시간을 획기적으로 단축할 수 있습니다.
                        </p>
</details>
<details class="faq-item">
<summary>배당금 재투자가 복리에 왜 중요한가요?</summary>
<p>
                            주식 투자의 경우 주가 상승 수익뿐만 아니라 <strong>배당금</strong>을 찾아 쓰지 않고 다시 주식을 사는 데 투입하면, 보유 주식 수가 기하급수적으로
                            늘어나는 또 다른 복리의 축이 형성됩니다. 장기 투자 성과의 절반 이상이 배당 재투자에서 나온다는 연구 결과도 있습니다.
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
