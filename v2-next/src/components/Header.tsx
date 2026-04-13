"use client";

import Link from 'next/link';
import HeaderSearch from './portal/HeaderSearch';
import NewsMegaMenu from './NewsMegaMenu';

export default function Header() {
    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link href="/" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.5rem' }}>rich</span>
                    <span style={{ color: '#191F28', fontWeight: 800, fontSize: '1.5rem' }}>calc</span>
                </Link>

                <nav className="header-nav" style={{ flex: 1, justifyContent: 'center', gap: '32px', marginLeft: '40px' }}>
                    <Link href="/" className="nav-link active">홈</Link>
                    <Link href="#market" className="nav-link">시장</Link>
                    <Link href="#calculator" className="nav-link">계산기</Link>

                    <div className="nav-item-has-mega">
                        <Link href="/news" className="nav-link">뉴스</Link>
                        <NewsMegaMenu />
                    </div>

                    <Link href="/community" className="nav-link">커뮤니티</Link>
                    <Link href="/guide" className="nav-link">가이드</Link>
                </nav>

                <div className="header-right" style={{ gap: '16px' }}>
                    <HeaderSearch />
                    <button className="login-btn">로그인</button>
                    <button className="menu-btn" style={{ background: '#333', color: 'white', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', marginLeft: '12px' }}>
                        <span style={{ fontSize: '1.2rem', lineHeight: '32px' }}>⋮</span>
                    </button>
                </div>
            </div>

            <style jsx>{`
                .site-header {
                    background: var(--surface);
                    border-bottom: 1px solid var(--border);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }
                .header-inner {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 64px;
                }
                .header-nav {
                    display: flex;
                    align-items: center;
                }
                .nav-link {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #4E5968;
                    text-decoration: none;
                    transition: all 0.2s;
                    padding: 8px 16px;
                    border-radius: 12px;
                }
                .nav-link:hover {
                    color: var(--primary);
                }
                .nav-item-has-mega {
                    position: relative;
                    height: 64px;
                    display: flex;
                    align-items: center;
                }
                .nav-item-has-mega:hover :global(.mega-menu) {
                    display: block;
                }
                .nav-link.active {
                    color: var(--primary);
                    background: #E8F3FF; /* Light blue chip from reference 2301 */
                }
                .header-right {
                    display: flex;
                    align-items: center;
                }
                .login-btn {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: rgba(0,0,0,0.15); /* Match image fade style */
                    background: white;
                    border: 1px solid var(--border);
                    padding: 8px 18px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .login-btn:hover {
                    background: var(--surface-2);
                    color: var(--text-primary);
                }
            `}</style>
        </header>
    );
}
