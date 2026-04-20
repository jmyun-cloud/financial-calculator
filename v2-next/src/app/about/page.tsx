import { Metadata } from "next";
import Link from "next/link";
import "../guide/guide.css";

export const metadata: Metadata = {
  title: "서비스 소개 | 금융계산기.kr",
  description: "금융계산기.kr은 대한민국 누구나 무료로 사용할 수 있는 종합 금융 유틸리티 플랫폼입니다.",
};

export default function AboutPage() {
  return (
    <>
      <section className="top-description" style={{ background: "linear-gradient(135deg, #1a56e8 0%, #1738c8 100%)" }}>
        <div className="container">
          <div className="top-desc-inner">
            <div className="breadcrumb">
              <Link href="/" style={{ color: "inherit" }}>홈</Link> <span className="bc-sep">›</span>
              <span className="bc-current">서비스 소개</span>
            </div>
            <h1 className="main-title">금융계산기.kr 소개</h1>
            <p className="main-subtitle">복잡한 금융 계산, 이제 쉽게 해결하세요.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <article className="guide-article mdx-content">

            <h2>서비스 목적</h2>
            <p>금융계산기.kr은 대출 이자, 연봉 실수령액, 적금 수익, 퇴직금, 연금 등 일상적인 금융 계산을 누구나 쉽고 빠르게 할 수 있도록 돕는 <strong>무료 금융 유틸리티 플랫폼</strong>입니다.</p>
            <p>복잡한 금융 공식을 직접 계산하거나, 은행 창구를 방문하거나, 전문가에게 문의하지 않아도 됩니다. 몇 가지 숫자를 입력하면 결과를 바로 확인할 수 있습니다.</p>

            <h2>제공 서비스</h2>
            <ul>
              <li><strong>금융 계산기 10종:</strong> 대출 이자, DSR 한도, 연봉 실수령액, 프리랜서 세금, 퇴직금, 적금, 복리 수익, 환율, 연금, 물가 계산기</li>
              <li><strong>실시간 시장 데이터:</strong> 주요 주가지수, 환율, 원자재, 암호화폐 실시간 현황</li>
              <li><strong>금융 뉴스:</strong> 증시, 경제, 부동산, 금리, 가상화폐 등 분야별 뉴스</li>
              <li><strong>금융 가이드:</strong> 계산기 활용법과 금융 지식을 쉽게 풀어쓴 콘텐츠</li>
              <li><strong>재테크 Q&A:</strong> 이용자들이 직접 묻고 답하는 금융 커뮤니티</li>
              <li><strong>경제 캘린더:</strong> 주요 경제 지표 발표 일정</li>
            </ul>

            <h2>계산 결과의 정확성</h2>
            <p>금융계산기.kr의 모든 계산기는 금융감독원 및 관련 기관이 공시하는 공식 계산 공식을 바탕으로 설계되었습니다.</p>
            <div className="formula-box">
              <ul>
                <li>4대보험 요율: 국민건강보험공단·국민연금공단 공시 요율 반영</li>
                <li>대출 계산: 금융감독원 표준 원리금 산정 방식 적용</li>
                <li>세금 계산: 국세청 근로소득 간이세액표 기준</li>
                <li>환율: 실시간 외환 데이터 연동</li>
              </ul>
            </div>
            <p>단, 계산 결과는 <strong>정보 제공 목적의 참고치</strong>이며 실제 금융기관 또는 공공기관의 결과와 수 원에서 수천 원 정도 차이가 발생할 수 있습니다. 정확한 결과는 해당 금융기관에 직접 문의하시기 바랍니다.</p>

            <h2>운영 원칙</h2>
            <ul>
              <li><strong>완전 무료:</strong> 모든 계산기와 콘텐츠는 무료로 제공됩니다.</li>
              <li><strong>광고 기반 운영:</strong> 서비스는 Google AdSense 광고 수익으로 운영됩니다.</li>
              <li><strong>투자 조언 불제공:</strong> 본 서비스는 특정 투자 상품을 추천하거나 법적·세무적 조언을 제공하지 않습니다.</li>
              <li><strong>지속적 업데이트:</strong> 법령·요율 변경 시 계산기 내용을 신속히 업데이트합니다.</li>
            </ul>

            <h2>문의 및 피드백</h2>
            <p>계산기 오류 제보, 기능 개선 제안, 기타 문의사항은 언제든지 환영합니다.</p>
            <div className="formula-box">
              <ul>
                <li><strong>이메일:</strong> contact@richcalc.kr</li>
                <li><strong>운영 시간:</strong> 평일 09:00 ~ 18:00</li>
                <li><strong>도메인:</strong> richcalc.kr / 금융계산기.kr</li>
              </ul>
            </div>

          </article>
        </div>
      </main>
    </>
  );
}
