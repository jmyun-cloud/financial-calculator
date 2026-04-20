import { Metadata } from "next";
import Link from "next/link";
import "../guide/guide.css";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 금융계산기.kr",
  description: "금융계산기.kr의 개인정보 수집·이용·보호 방침을 안내합니다.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="top-description" style={{ background: "linear-gradient(135deg, #1a56e8 0%, #1738c8 100%)" }}>
        <div className="container">
          <div className="top-desc-inner">
            <div className="breadcrumb">
              <Link href="/" style={{ color: "inherit" }}>홈</Link> <span className="bc-sep">›</span>
              <span className="bc-current">개인정보처리방침</span>
            </div>
            <h1 className="main-title">개인정보처리방침</h1>
            <p className="main-subtitle">금융계산기.kr은 이용자의 개인정보를 소중히 여깁니다.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article className="guide-article mdx-content">
            <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
              시행일: 2026년 4월 20일
            </p>

            <h2>제1조 (개인정보의 처리 목적)</h2>
            <p>금융계산기.kr(이하 &quot;서비스&quot;)은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <ul>
              <li>서비스 제공 및 계정 관리 (회원 식별, 서비스 이용 관리)</li>
              <li>서비스 개선 및 통계 분석 (이용 패턴 분석, 오류 개선)</li>
              <li>마케팅 및 광고 게재 (Google AdSense를 통한 맞춤형 광고)</li>
            </ul>

            <h2>제2조 (개인정보의 처리 및 보유 기간)</h2>
            <p>서비스는 법령에 따른 개인정보 보유·이용 기간 또는 이용자로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.</p>
            <ul>
              <li><strong>회원 정보:</strong> 회원 탈퇴 시까지 (탈퇴 후 즉시 파기)</li>
              <li><strong>서비스 이용 기록:</strong> 3개월</li>
              <li><strong>전자상거래 관련 기록:</strong> 관련 법령에 따라 5년</li>
            </ul>

            <h2>제3조 (개인정보의 제3자 제공)</h2>
            <p>서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.</p>
            <ul>
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>

            <h2>제4조 (쿠키의 설치·운영 및 거부)</h2>
            <p>서비스는 이용자에게 개인화된 서비스를 제공하기 위하여 쿠키(cookie)를 사용합니다.</p>
            <ul>
              <li><strong>쿠키란?</strong> 웹사이트를 운영하는 데 이용되는 서버가 이용자의 브라우저에 보내는 소량의 정보이며, 이용자 PC 컴퓨터 내의 하드디스크에 저장됩니다.</li>
              <li><strong>Google Analytics:</strong> 서비스 이용 통계 수집 목적으로 사용됩니다.</li>
              <li><strong>Google AdSense:</strong> 이용자 맞춤형 광고 제공 목적으로 사용됩니다.</li>
            </ul>
            <p>이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹 브라우저 설정을 통해 쿠키를 허용하거나 거부할 수 있습니다. 단, 쿠키 저장을 거부할 경우 일부 서비스 이용이 어려울 수 있습니다.</p>

            <h2>제5조 (개인정보의 안전성 확보 조치)</h2>
            <p>서비스는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
            <ul>
              <li>개인정보 암호화: HTTPS/SSL을 적용하여 전송 구간 암호화</li>
              <li>접근 통제: 개인정보처리시스템에 대한 접근 권한 관리</li>
              <li>비밀번호 암호화: 이용자 비밀번호는 암호화 저장</li>
            </ul>

            <h2>제6조 (이용자의 권리·의무 및 행사 방법)</h2>
            <p>이용자는 개인정보 주체로서 언제든지 다음과 같은 권리를 행사할 수 있습니다.</p>
            <ul>
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ul>
            <p>위 권리 행사는 아래 이메일로 요청하시면 지체 없이 조치하겠습니다.</p>

            <h2>제7조 (개인정보 보호책임자)</h2>
            <div className="formula-box">
              <ul>
                <li><strong>서비스명:</strong> 금융계산기.kr (richcalc.kr)</li>
                <li><strong>개인정보 보호책임자:</strong> 서비스 운영팀</li>
                <li><strong>이메일:</strong> contact@richcalc.kr</li>
                <li><strong>처리 시간:</strong> 평일 09:00 ~ 18:00 (주말·공휴일 제외)</li>
              </ul>
            </div>
            <p>이용자는 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만 처리, 피해 구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다. 서비스는 이용자의 문의에 지체 없이 답변 및 처리해드릴 것입니다.</p>

            <h2>제8조 (개인정보처리방침의 변경)</h2>
            <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
          </article>
        </div>
      </main>
    </>
  );
}
