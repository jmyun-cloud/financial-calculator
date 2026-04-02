import Link from 'next/link';

export default function Header() {
    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link href="/" className="logo">
                    <span className="logo-icon">💰</span>
                    <span className="logo-text">금융계산기<span className="logo-accent">.kr</span></span>
                </Link>
                <nav className="header-nav">
                    <Link href="/" className="nav-link">🏠 홈</Link>
                    <Link href="#toolbox" className="nav-link">계산기 도구</Link>
                    <Link href="/guide/salary" className="nav-link">금융 매거진</Link>
                    <a
                        href="#"
                        className="nav-link"
                        style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            background: 'rgba(99,102,241,0.15)',
                            color: '#a5b4fc',
                            padding: '6px 14px',
                            borderRadius: '100px',
                            border: '1px solid rgba(99,102,241,0.3)',
                        }}
                    >
                        로그인 (준비중)
                    </a>
                </nav>
            </div>
        </header>
    );
}
