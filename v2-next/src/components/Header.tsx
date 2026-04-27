"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HeaderSearch from './portal/HeaderSearch';
import NewsMegaMenu from './NewsMegaMenu';
import LoginModal from './auth/LoginModal';
import { LogOut, User as UserIcon, Settings, ChevronDown } from 'lucide-react';

export default function Header() {
    const { user, isLoggedIn, logout, setShowLoginModal } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const pathname = usePathname() || '/';

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    return (
        <header className="site-header" style={{ borderBottom: '1px solid #E5E8EB', background: 'white' }}>
            {/* Top Bar: Logo + Search + Icons */}
            <div className="container" style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #1a56e8 0%, #1738c8 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 950, fontSize: '22px', boxShadow: '0 4px 12px rgba(26, 86, 232, 0.2)' }}>R</div>
                    <span style={{ color: '#191F28', fontWeight: 800, fontSize: '24px', letterSpacing: '-1px' }}>richcalc</span>
                </Link>

                {/* Search Bar */}
                <div style={{ flex: 1, maxWidth: '480px', margin: '0 40px' }}>
                    <HeaderSearch />
                </div>

                <div className="header-right" style={{ gap: '24px' }}>
                    {isLoggedIn ? (
                        <div className="user-profile-trigger">
                            <button
                                className="profile-btn"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                style={{ border: 'none', background: 'transparent' }}
                            >
                                <img src={user?.avatar} alt="" className="user-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                            </button>

                            {isProfileOpen && (
                                <div className="profile-dropdown shadow-premium">
                                    <div className="user-info-brief">
                                        <p className="email">{user?.email}</p>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item" onClick={logout}>
                                        <LogOut size={16} /> 로그아웃
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="login-btn" onClick={() => setShowLoginModal(true)}>로그인</button>
                    )}
                </div>
            </div>

            {/* Sub Navigation Bar */}
            <div style={{ borderTop: '1px solid #F2F4F7' }}>
                <div className="container" style={{ display: 'flex', height: '52px', alignItems: 'center', gap: '36px' }}>
                    {[
                        { label: '홈', path: '/' },
                        { label: '금융 계산기', path: '/calculators' },
                        { label: '금융 가이드', path: '/guide' },
                        { label: '시장 데이터', path: '/#market' },
                        { label: '서비스 소개', path: '/about' }
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.path}
                            style={{
                                textDecoration: 'none',
                                color: isActive(item.path) ? '#1a56e8' : '#4E5968',
                                fontSize: '15px',
                                fontWeight: isActive(item.path) ? 800 : 600,
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative',
                                transition: 'all 0.2s',
                                padding: '0 4px'
                            }}
                        >
                            {item.label}
                            {isActive(item.path) && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: '#1a56e8',
                                    borderRadius: '2px 2px 0 0'
                                }} />
                            )}
                        </Link>
                    ))}
                </div>
            </div>
            <LoginModal />

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

                /* User Profile Styles */
                .user-profile-trigger {
                    position: relative;
                }
                .profile-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #F8F9FA;
                    border: 1px solid #F2F4F7;
                    padding: 6px 14px 6px 6px;
                    border-radius: 100px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .profile-btn:hover { background: #F2F4F6; }
                .user-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 1px solid white;
                    object-fit: cover;
                }
                .user-name {
                    font-size: 14px;
                    font-weight: 700;
                    color: #191F28;
                }
                .arrow { color: #8B95A1; transition: transform 0.2s; }
                .arrow.open { transform: rotate(180deg); }

                .profile-dropdown {
                    position: absolute;
                    top: calc(100% + 12px);
                    right: 0;
                    width: 240px;
                    background: white;
                    border: 1px solid #F2F4F7;
                    border-radius: 20px;
                    padding: 8px;
                    z-index: 1001;
                    animation: slideDown 0.2s ease;
                }
                .user-info-brief { padding: 12px 16px; }
                .email { font-size: 13px; color: #8B95A1; margin: 0; }
                .dropdown-divider { height: 1px; background: #F2F4F7; margin: 8px 0; }
                .dropdown-item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 16px;
                    border: none;
                    background: none;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #4E5968;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .dropdown-item:hover { background: #F2F4F6; color: #191F28; }
                .dropdown-item.logout { color: #F04452; }
                .dropdown-item.logout:hover { background: #FFF0F0; }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </header>
    );
}
