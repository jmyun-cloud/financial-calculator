import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container footer-inner">
                <div className="footer-logo">
                    <span className="logo-icon">💰</span>
                    <span className="logo-text">richcalc<span className="logo-accent">.kr</span></span>
                </div>
                <div className="footer-links">
                    <Link href="/">홈</Link>
                    <Link href="/guide/salary">금융 가이드</Link>
                    <Link href="/salary-calculator">연봉 계산기</Link>
                    <Link href="/loan-calculator">대출 계산기</Link>
                    <Link href="/about">서비스 소개</Link>
                    <Link href="/contact">문의하기</Link>
                    <Link href="/privacy">개인정보처리방침</Link>
                    <Link href="/terms">이용약관</Link>
                </div>
                <p className="footer-disclaimer">
                    본 사이트의 콘텐츠는 정보 제공 목적으로 작성되었으며, 전문가의 법적 조언을 대신할 수 없습니다.
                    정확한 세금 및 공제 내역은 관할 기관 또는 세무사 등 전문가에게 확인하시기 바랍니다.
                </p>
                <p className="footer-copy">© 2026 richcalc.kr | All rights reserved.</p>
            </div>
        </footer>
    );
}
