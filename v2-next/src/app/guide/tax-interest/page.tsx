import { Metadata } from "next";
import Link from "next/link";
import "../guide.css";

export const metadata: Metadata = {
  title: "세후 수익률 극대화 및 절세 전략 가이드 - 금융계산기.kr",
  description: "일반과세, 세금우대, 비과세 비교 및 ISA, 상호금융 저율과세 활용법, 금융소득종합과세 대비 전략을 확인하세요.",
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
            <h1 className="main-title">세후 수익률 극대화 절세 전략</h1>
            <p className="main-subtitle">
                    세후 수익률을 높이는 핵심 기술! 일반과세, 세금우대, 비과세 비교 및 ISA, 상호금융 활용법 총정리.
                </p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article 
            className="guide-article" 
            dangerouslySetInnerHTML={{ __html: `
<h2>💡 세후 수익률을 높이는 투자 전문가 제언</h2>
<h3>1. 세후 수익률이 '진짜' 수익이다</h3>
<p>
                    금융 상품 가입 시 표기된 금리보다 중요한 것은 세금을 떼고 난 뒤의 <strong>실수령액</strong>입니다. 일반과세 15.4%를 적용받으면 실제 수익률은 크게 낮아지므로,
                    항상 세금 우대나 비과세 혜택을 우선적으로 고려해야 합니다.
                </p>
<h3>2. ISA(개인종합관리계좌) 활용법</h3>
<p>
                    ISA는 비과세와 분리과세 혜택을 동시에 제공하는 <strong>'절세 바구니'</strong>입니다. 200~400만원까지의 수익에 대해 세금이 없고, 초과분도 9.9% 저율
                    과세되므로 장기 투자 시 필수적인 계좌입니다.
                </p>
<h3>3. 상호금융 저율과세(세금우대) 혜택</h3>
<p>
                    신협, 새마을금고 등 상호금융권의 <strong>조합원 예탁금(3,000만원 한도)</strong>은 이자소득세 14%가 면제되고 농특세 1.4%만 부과됩니다. 시중은행보다 실질
                    수익률을 높일 수 있는 가장 확실한 방법 중 하나입니다.
                </p>
<h3>4. 금융소득종합과세 대비 전략</h3>
<p>
                    연간 이자와 배당 소득 합계가 <strong>2,000만원</strong>을 넘으면 누진세율이 적용되므로, 자산 명의를 분산하거나 만기 시점을 조절하여 과세 표준을 관리하는 전략이
                    필요합니다.
                </p>
<h3>5. 계산 방법 및 세후 이자 공식</h3>
<div class="formula-box">
<p style="margin-bottom: 10px; font-weight: 600;">세후 이자 계산 공식:</p>
<code>세후 이자 = 세전 이자 × (1 - 이자소득세율)</code>
<ul style="list-style: none; padding: 0;">
<li><strong style="color: #38bdf8;">일반과세:</strong> 15.4% (소득세 14% + 지방소득세 1.4%)</li>
<li><strong style="color: #38bdf8;">세금우대:</strong> 9.5% ~ 9.9% (상호금융 조합원 등)</li>
<li><strong style="color: #38bdf8;">비과세:</strong> 0% (ISA, 비과세종합저축 등)</li>
</ul>
</div>
<h2>자주 묻는 질문 (FAQ)</h2>
<div class="faq-list">
<details class="faq-item">
<summary>세금우대 9.9%와 일반과세 15.4%, 실제 이득은 얼마인가요?</summary>
<p>
                            단순 계산으로 이자의 약 <strong>5.5%</strong>를 더 가져가는 셈입니다. 이자가 100만원이라면 일반과세는 15.4만원을 떼고 84.6만원을 받지만,
                            세금우대는 9.9만원만 떼고 90.1만원을 받습니다. 5.5만원의 차이는 예금 금리로 환산하면 약 0.2~0.3%p 금리 인상 효과와 맞먹습니다.
                        </p>
</details>
<details class="faq-item">
<summary>금융소득종합과세 대상이 되면 세금을 얼마나 더 내나요?</summary>
<p>
                            이자·배당 소득이 2,000만원을 넘기면 초과분에 대해 <strong>다른 소득(근로, 사업 등)과 합산</strong>하여 누진세율(6%~45%)을 적용합니다.
                            특히 고소득자의 경우 지방소득세를 포함해 최대 49.5%까지 세율이 올라갈 수 있으므로, 분리과세 상품을 적극 활용해야 합니다.
                        </p>
</details>
<details class="faq-item">
<summary>건강보험료도 이자 소득 때문에 오를 수 있나요?</summary>
<p>
                            네, 그렇습니다. 금융소득이 일정 금액(현재 기준 연 1,000만원 초과)을 넘으면 <strong>지역가입자 건강보험료 산정</strong> 시 합산됩니다.
                            피부양자의 경우에도 금융소득이 기준을 초과하면 자격이 박탈될 수 있으므로, 세후 이자뿐만 아니라 건보료 상승분까지 고려하는 것이 중요합니다.
                        </p>
</details>
<details class="faq-item">
<summary>주식 배당금에도 15.4% 세금을 내나요?</summary>
<p>
                            네, 국내 주식 배당금 역시 <strong>금융소득</strong>으로 분류되어 15.4%가 원천징수됩니다. 다만 국내 상장 주식 매매차익은 현재 비과세(대주주
                            제외)이므로, 시세 차익 비중이 높은 투자자가 세무상 유리할 수 있습니다.
                        </p>
</details>
<details class="faq-item">
<summary>해외 ETF 투자 시 세금은 어떻게 되나요?</summary>
<p>
                            국내 상장 해외 ETF는 배당소득세 15.4%가 과세되며 금융소득종합과세에 포함됩니다. 반면 미국 등 해외에 상장된 ETF는 <strong>양도소득세
                                22%</strong>(연 250만원 공제)를 내며 분류과세되어 종합과세 합산에서 제외됩니다. 투자 금액과 소득 수준에 따라 유리한 계좌가 달라집니다.
                        </p>
</details>
<details class="faq-item">
<summary>미성년 자녀 명의 계좌의 세금 혜택은?</summary>
<p>
                            자녀 명의로 증여(10년 2,000만원 한도 비과세) 후 예적금을 운용하면 자녀의 금융 소득으로 잡히므로 부모의 종합과세를 피할 수 있습니다. 다만 자녀의 소득이
                            많아지면 <strong>피부양자 자격</strong>에 영향이 있을 수 있으니 전문가와 상담이 필요합니다.
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
