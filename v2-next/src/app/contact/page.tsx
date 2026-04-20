import { Metadata } from "next";
import Link from "next/link";
import "../guide/guide.css";

export const metadata: Metadata = {
  title: "문의하기 | 금융계산기.kr",
  description: "금융계산기.kr 서비스 이용 문의, 오류 제보, 개선 제안을 받습니다.",
};

export default function ContactPage() {
  return (
    <>
      <section className="top-description" style={{ background: "linear-gradient(135deg, #1a56e8 0%, #1738c8 100%)" }}>
        <div className="container">
          <div className="top-desc-inner">
            <div className="breadcrumb">
              <Link href="/" style={{ color: "inherit" }}>홈</Link> <span className="bc-sep">›</span>
              <span className="bc-current">문의하기</span>
            </div>
            <h1 className="main-title">문의하기</h1>
            <p className="main-subtitle">오류 제보, 기능 제안, 기타 문의를 보내주세요.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article className="guide-article mdx-content">

            <h2>연락처</h2>
            <div className="formula-box">
              <ul>
                <li><strong>이메일:</strong> contact@richcalc.kr</li>
                <li><strong>운영 시간:</strong> 평일 09:00 ~ 18:00 (주말·공휴일 제외)</li>
                <li><strong>답변 기간:</strong> 영업일 기준 2~3일 이내</li>
              </ul>
            </div>

            <h2>문의 유형별 안내</h2>

            <h3>계산기 오류 제보</h3>
            <p>계산 결과가 실제와 다른 경우, 아래 내용을 포함하여 이메일로 보내주세요.</p>
            <ul>
              <li>오류가 발생한 계산기 이름</li>
              <li>입력한 수치와 기대했던 결과</li>
              <li>실제로 표시된 결과</li>
            </ul>

            <h3>기능 개선 제안</h3>
            <p>새로운 계산기 추가, 기존 기능 개선, UI 불편 사항 등 어떤 제안이든 환영합니다. 이용자 의견을 바탕으로 서비스를 지속적으로 개선하고 있습니다.</p>

            <h3>광고 및 제휴 문의</h3>
            <p>금융계산기.kr과의 광고 게재, 콘텐츠 제휴, 데이터 협력 등을 원하시는 기업·기관은 이메일로 문의 주시기 바랍니다.</p>

            <h3>개인정보 관련 문의</h3>
            <p>개인정보 열람, 정정, 삭제 요청 등 개인정보 보호 관련 문의는 <Link href="/privacy">개인정보처리방침</Link>을 먼저 확인하신 후 이메일로 연락 주세요.</p>

            <h2>자주 묻는 질문</h2>

            <details className="faq-item">
              <summary>계산기 결과가 은행과 다른 이유는 무엇인가요?</summary>
              <p style={{ padding: "16px 20px" }}>
                금융계산기.kr은 공식 계산식을 사용하지만, 실제 은행의 결과와 수 원에서 수천 원의 차이가 발생할 수 있습니다. 이는 은행마다 기산일 처리 방식, 원단위 절사 규정, 비과세 항목 설정이 다르기 때문입니다. 본 서비스의 결과는 참고용으로 활용하시고, 정확한 수치는 해당 금융기관에 문의하세요.
              </p>
            </details>

            <details className="faq-item">
              <summary>광고가 너무 많아 불편합니다.</summary>
              <p style={{ padding: "16px 20px" }}>
                금융계산기.kr은 광고 수익으로 무료 서비스를 운영합니다. 광고 위치나 빈도에 대한 불편 사항은 이메일로 알려주시면 개선에 반영하겠습니다.
              </p>
            </details>

            <details className="faq-item">
              <summary>원하는 계산기가 없습니다. 추가해 줄 수 있나요?</summary>
              <p style={{ padding: "16px 20px" }}>
                이메일 또는 커뮤니티 Q&A를 통해 요청해 주시면 검토 후 개발 일정에 반영하겠습니다. 많은 이용자가 필요로 하는 계산기를 우선적으로 개발합니다.
              </p>
            </details>

          </article>
        </div>
      </main>
    </>
  );
}
