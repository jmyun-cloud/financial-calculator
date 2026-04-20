"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import HeaderSearch from './portal/HeaderSearch';
import NewsMegaMenu from './NewsMegaMenu';
import LoginModal from './auth/LoginModal';
import { LogOut, User as UserIcon, Settings, ChevronDown } from 'lucide-react';

export default function Header() {
    const { user, isLoggedIn, logout, setShowLoginModal } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link href="/" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.5rem' }}>rich</span>
                    <span style={{ color: '#191F28', fontWeight: 800, fontSize: '1.5rem' }}>calc</span>
                </Link>

                <nav className="header-nav" style={{ flex: 1, justifyContent: 'center', gap: '32px', marginLeft: '40px' }}>
                    <Link href="/" className="nav-link active">홈</Link>
                    <Link href="/#market" className="nav-link">시장</Link>
                    <Link href="/calculators" className="nav-link">계산기</Link>

                    <div className="nav-item-has-mega">
                        <Link href="/news" className="nav-link">뉴스</Link>
                        <NewsMegaMenu />
                    </div>

                    <Link href="/community" className="nav-link">커뮤니티</Link>
                    <Link href="/guide" className="nav-link">가이드</Link>
                </nav>

                <div className="header-right" style={{ gap: '16px', position: 'relative' }}>
                    <HeaderSearch />

                    {isLoggedIn ? (
                        <div className="user-profile-trigger">
                            <button
                                className="profile-btn"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <img src={user?.avatar} alt="" className="user-avatar" />
                                <span className="user-name">{user?.name}</span>
                                <ChevronDown size={14} className={`arrow ${isProfileOpen ? 'open' : ''}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="profile-dropdown shadow-premium">
                                    <div className="user-info-brief">
                                        <p className="email">{user?.email}</p>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item">
                                        <UserIcon size={16} /> 프로필 설정
                                    </button>
                                    <button className="dropdown-item">
                                        <Settings size={16} /> 환경설정
                                    </button>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item logout" onClick={logout}>
                                        <LogOut size={16} /> 로그아웃
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="login-btn" onClick={() => setShowLoginModal(true)}>로그인</button>
                    )}

                    <button className="menu-btn" style={{ background: '#333', color: 'white', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', marginLeft: '12px' }}>
                        <span style={{ fontSize: '1.2rem', lineHeight: '32px' }}>⋮</span>
                    </button>
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
