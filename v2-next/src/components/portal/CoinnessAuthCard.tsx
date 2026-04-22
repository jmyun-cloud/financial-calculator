"use client";
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function CoinnessAuthCard() {
    const { isLoggedIn, setShowLoginModal, logout } = useAuth();

    if (isLoggedIn) {
        return (
            <div className="coinness-auth-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E8EB', marginBottom: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '15px', color: '#191F28', fontWeight: 700, marginBottom: '16px' }}>환영합니다, 사용자님!</div>
                <button
                    onClick={logout}
                    style={{
                        width: '100%',
                        background: '#F2F4F7',
                        color: '#4E5968',
                        border: 'none',
                        padding: '14px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '15px',
                        cursor: 'pointer'
                    }}
                >
                    로그아웃
                </button>
            </div>
        );
    }

    return (
        <div className="coinness-auth-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E8EB', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#4E5968', fontWeight: 600, lineHeight: 1.5, marginBottom: '16px' }}>
                <span style={{ color: '#191F28', fontWeight: 800 }}>금융계산기</span>에 로그인 하고<br />다양한 서비스와 혜택을 누리세요!
            </div>
            <button
                onClick={() => setShowLoginModal(true)}
                style={{
                    width: '100%',
                    background: '#4D6DF3', // 코인니스 블루 스타일
                    color: 'white',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
                금융계산기 로그인
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px', color: '#8B95A1' }}>
                <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>비밀번호 찾기</a>
                <span style={{ color: '#E5E8EB' }}>|</span>
                <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>회원가입</a>
            </div>
        </div>
    );
}
