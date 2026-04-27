import { Metadata } from "next";
import Link from "next/link";
import "../guide/guide.css";

export const metadata: Metadata = {
  title: "이용약관 | richcalc.kr",
  description: "richcalc.kr 서비스 이용약관을 안내합니다.",
};

export default function TermsPage() {
  return (
    <>
      <section className="top-description" style={{ background: "linear-gradient(135deg, #1a56e8 0%, #1738c8 100%)" }}>
        <div className="container">
          <div className="top-desc-inner">
            <div className="breadcrumb">
              <Link href="/" style={{ color: "inherit" }}>홈</Link> <span className="bc-sep">›</span>
              <span className="bc-current">이용약관</span>
            </div>
            <h1 className="main-title">이용약관</h1>
            <p className="main-subtitle">richcalc.kr 서비스 이용에 관한 약관입니다.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article className="guide-article mdx-content">
            <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
              시행일: 2026년 4월 20일
            </p>

            <h2>제1조 (목적)</h2>
            <p>본 약관은 richcalc.kr(이하 &quot;서비스&quot;)이 제공하는 금융 계산, 시장 정보, 뉴스 등 인터넷 관련 서비스의 이용과 관련하여 서비스와 이용자 간의 권리·의무 및 책임사항, 서비스 이용조건 및 절차에 관한 기본적인 사항을 규정함을 목적으로 합니다.</p>

            <h2>제2조 (약관의 효력 및 변경)</h2>
            <ul>
              <li>본 약관은 서비스를 이용하는 모든 이용자에게 적용됩니다.</li>
              <li>서비스는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지를 통해 고지합니다.</li>
              <li>이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다. 변경 후에도 계속 서비스를 이용하면 변경된 약관에 동의한 것으로 간주합니다.</li>
            </ul>

            <h2>제3조 (서비스 이용)</h2>
            <p>서비스가 제공하는 금융 계산 결과, 시장 정보, 뉴스 등은 정보 제공을 목적으로 하며 다음 사항에 유의하시기 바랍니다.</p>
            <div className="formula-box">
              <ul>
                <li>본 서비스의 모든 계산 결과는 <strong>참고용 정보</strong>로, 실제 금융 거래 결과와 다를 수 있습니다.</li>
                <li>본 서비스는 투자 권유, 법률·세무 조언을 제공하지 않습니다.</li>
                <li>정확한 금융 정보는 관련 금융기관 또는 공인 전문가에게 확인하시기 바랍니다.</li>
                <li>시장 데이터는 일정 시간 지연될 수 있으며, 실시간 거래에 사용하지 마십시오.</li>
              </ul>
            </div>

            <h2>제4조 (이용자의 의무)</h2>
            <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul>
              <li>서비스의 정보를 무단으로 복제·배포·판매하는 행위</li>
              <li>서비스 운영을 방해하는 행위 (크롤링, DDoS 등)</li>
              <li>타인의 개인정보를 무단으로 수집·이용하는 행위</li>
              <li>허위 정보를 등록하거나 타인을 사칭하는 행위</li>
              <li>관련 법령을 위반하는 행위</li>
            </ul>

            <h2>제5조 (서비스 제공의 중단)</h2>
            <p>서비스는 다음과 같은 경우 서비스 제공을 중단할 수 있습니다.</p>
            <ul>
              <li>시스템 점검, 유지보수 등 기술적 필요가 있을 때</li>
              <li>천재지변, 국가비상사태 등 불가항력적 상황이 발생한 경우</li>
              <li>서비스 운영상 필요한 경우</li>
            </ul>

            <h2>제6조 (면책조항)</h2>
            <p>서비스는 다음과 같은 사항에 대해 책임을 지지 않습니다.</p>
            <ul>
              <li>본 서비스의 계산 결과를 이용한 투자·금융 거래로 인한 손실</li>
              <li>시장 데이터의 오류 또는 지연으로 인한 손해</li>
              <li>이용자의 귀책사유로 인한 서비스 이용 장애</li>
              <li>제3자 사이트(뉴스 원문, 외부 링크 등)의 콘텐츠</li>
            </ul>

            <h2>제7조 (저작권)</h2>
            <p>서비스가 제작한 콘텐츠(계산기, 가이드 등)의 저작권은 서비스에 귀속됩니다. 이용자는 서비스의 사전 허락 없이 이를 복제·배포·수정할 수 없습니다. 단, 개인적·비상업적 용도의 이용은 허용됩니다.</p>

            <h2>제8조 (준거법 및 분쟁 해결)</h2>
            <p>본 약관은 대한민국 법령에 따라 해석되며, 서비스와 이용자 간에 발생한 분쟁은 대한민국 법원을 관할 법원으로 합니다.</p>

            <h2>문의</h2>
            <div className="formula-box">
              <ul>
                <li><strong>서비스명:</strong> richcalc.kr (richcalc.kr)</li>
                <li><strong>이메일:</strong> contact@richcalc.kr</li>
              </ul>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
