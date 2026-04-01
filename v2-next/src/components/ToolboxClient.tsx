"use client";
import Link from 'next/link';

const calculators = [
    { id: "salary", icon: "🧾", title: "연봉 및 실수령액", desc: "4대보험 및 <strong>26년 최신</strong> 실수령 계산", links: [{ title: "+ 2026 연봉계산", url: "/salary-calculator" }, { title: "+ 연말정산 대비", url: "/guide/salary" }] },
    { id: "severance", icon: "💼", title: "퇴직금 세금 계산", desc: "퇴직소득세와 예상 <strong>실수령 금액</strong> 조회", links: [{ title: "+ 퇴직금 세후 계산", url: "/severance-calculator" }, { title: "+ IRP 절세 가이드", url: "/guide/severance" }] },
    { id: "freelancer", icon: "👩‍💻", title: "프리랜서 3.3% 계산", desc: "단기 알바·프리랜서 <strong>3.3% 원천징수</strong>", links: [{ title: "+ 프리랜서 세후 계산", url: "/freelancer-calculator" }, { title: "+ 종소세 환급금 역산", url: "/guide/freelancer" }] },
    { id: "global-tax", icon: "📊", title: "종합소득세 시뮬레이터", desc: "사업소득 및 프리랜서 <strong>5월 종소세 계산</strong>", links: [{ title: "+ 예상 결정세액 보기", url: "/global-tax-calculator" }, { title: "+ 누진세율 가이드", url: "/guide/global-tax" }] },
    { id: "savings", icon: "🏦", title: "예금적금 만기 이자", desc: "단리/복리 및 <strong>비과세 이자</strong> 정밀 계산", links: [{ title: "+ 정기적금 계산해보기", url: "/savings-calculator" }, { title: "+ 예금 만기 수령액", url: "/savings-calculator" }] },
    { id: "loan", icon: "🏠", title: "대출 이자 및 상환액", desc: "원리금균등, 원금균등 <strong>상환 스케줄러</strong>", links: [{ title: "+ 주담대 상환액 예측", url: "/loan-calculator" }, { title: "+ 전세자금대출 계산", url: "/loan-calculator" }] },
    { id: "dsr", icon: "⚖️", title: "DSR / LTV 대출 한도", desc: "연봉 대비 <strong>최대 대출 가능 금액</strong> 규제", links: [{ title: "+ DSR 40% 한도 조회", url: "/dsr-calculator" }, { title: "+ 영끌 대출 가이드", url: "/guide/dsr" }] },
    { id: "subscription", icon: "🏆", title: "주택청약 가점 확인", desc: "무주택기간 달력, 부양가족 <strong>84점 만점</strong>", links: [{ title: "+ 내 청약 점수 조회", url: "/subscription-calculator" }, { title: "+ 부양가족/무주택 기준", url: "/guide/subscription" }] },
    { id: "pension", icon: "👴", title: "국민연금 예상 수령액", desc: "물가상승률을 반영한 <strong>미래 연금 가치</strong>", links: [{ title: "+ 내 국민연금 수령액", url: "/pension-calculator" }, { title: "+ 조기/연기연금 비교", url: "/guide/pension" }] },
    { id: "compound", icon: "📈", title: "적립식 복리 수익률", desc: "월 적립식 ETF 투자 <strong>장기 복리 결과</strong>", links: [{ title: "+ S&P500 복리 굴리기", url: "/compound-calculator" }, { title: "+ 배당 재투자 효과", url: "/guide/compound" }] },
    { id: "jeonse", icon: "🏢", title: "전세 월세 전환율", desc: "보증금 및 <strong>법정 전월세 전환율</strong> 한도", links: [{ title: "+ 전세 ↔ 월세 전환", url: "/jeonse-calculator" }, { title: "+ 법정 상한액 체크", url: "/guide/jeonse" }] },
    { id: "exchange", icon: "💱", title: "환매수 환차익 시뮬레이터", desc: "환율 우대율 및 수수료 <strong>수익률 분석</strong>", links: [{ title: "+ 환테크 수익 계산", url: "/exchange-calculator" }, { title: "+ 우대율 100% 팁", url: "/guide/exchange" }] }
];

export default function ToolboxClient() {
    return (
        <section className="widget-panel" id="toolbox">
            <h2 className="widget-title">🧰 금융 계산기 도구모음</h2>
            <div className="toolbox-grid">
                {calculators.map(c => (
                    <div className="tool-card" key={c.id}>
                        <div className="tool-header">
                            <div className="tool-icon">{c.icon}</div>
                            <div className="tool-info">
                                <h3>{c.title}</h3>
                                <p dangerouslySetInnerHTML={{ __html: c.desc }}></p>
                            </div>
                        </div>
                        <div className="tool-links">
                            {c.links.map((link, idx) => (
                                <Link key={idx} href={link.url} className="tool-link">
                                    {link.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
