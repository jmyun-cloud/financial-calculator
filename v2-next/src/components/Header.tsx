import Link from 'next/link';

export default function Header() {
    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link href="/" className="logo">
                    <span className="logo-icon" style={{ color: 'var(--primary)' }}>🔵</span>
                    <span className="logo-text">금융계산기<span className="logo-accent" style={{ color: 'var(--primary)' }}>.kr</span></span>
                </Link>

                <div className="header-search">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="어떤 계산기를 찾으시나요?"
                    />
                </div>

                <nav className="header-nav">
                    <Link href="/" className="nav-link active">홈</Link>
                    <Link href="#toolbox" className="nav-link">시장</Link>
                    <Link href="#toolbox" className="nav-link">계산기</Link>
                    <Link href="/guide/salary" className="nav-link">뉴스</Link>
                    <Link href="/guide/salary" className="nav-link">커뮤니티</Link>
                    <Link href="/guide/salary" className="nav-link">가이드</Link>

                    <a
                        href="#"
                        className="nav-link login-btn-nav"
                        style={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            background: 'var(--surface-2)',
                            color: 'var(--text-secondary)',
                            marginLeft: '12px',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                        }}
                    >
                        로그인
                    </a>
                </nav>
            </div>
        </header>
    );
}
