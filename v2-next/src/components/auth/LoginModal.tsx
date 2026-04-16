"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { X, Mail, Lock, LogIn } from "lucide-react";

export default function LoginModal() {
    const { login, showLoginModal, setShowLoginModal } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!showLoginModal) return null;

    const handleMockLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate network delay
        setTimeout(() => {
            login({
                id: "user_123",
                name: "테스트 주주",
                email: email || "test@richcalc.kr",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=test"
            });
            setIsSubmitting(false);
        }, 800);
    };

    const handleSocialLogin = (provider: string) => {
        setIsSubmitting(true);
        setTimeout(() => {
            login({
                id: `user_${provider}`,
                name: `${provider === 'google' ? '구글' : provider === 'kakao' ? '카카오' : '네이버'} 사용자`,
                email: `${provider}@social.com`,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`
            });
            setIsSubmitting(false);
        }, 800);
    };

    return (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
            <div className="modal-content shadow-premium" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setShowLoginModal(false)}>
                    <X size={20} />
                </button>

                <div className="login-header">
                    <h2 className="login-title">시작하기</h2>
                    <p className="login-subtitle">로그인하고 나만의 금융 비서를 만나보세요</p>
                </div>

                <div className="social-login-grid">
                    <button className="social-btn google" onClick={() => handleSocialLogin('google')}>
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" width="18" height="18" />
                        Google로 계속하기
                    </button>
                    <button className="social-btn kakao" onClick={() => handleSocialLogin('kakao')}>
                        <span className="social-icon">💬</span>
                        카카오로 계속하기
                    </button>
                    <button className="social-btn naver" onClick={() => handleSocialLogin('naver')}>
                        <span className="social-icon">N</span>
                        네이버로 계속하기
                    </button>
                </div>

                <div className="divider">
                    <span>또는 이메일로 시작</span>
                </div>

                <form className="login-form" onSubmit={handleMockLogin}>
                    <div className="input-group">
                        <label>이메일</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                placeholder="example@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>비밀번호</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <div className="login-footer">
                    <span>아직 계정이 없으신가요?</span>
                    <button className="text-btn">회원가입</button>
                </div>

                <style jsx>{`
                    .modal-overlay {
                        position: fixed;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0, 0, 0, 0.4);
                        backdrop-filter: blur(8px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 9999;
                        animation: fadeIn 0.3s ease;
                    }
                    .modal-content {
                        background: white;
                        width: 100%;
                        max-width: 440px;
                        border-radius: 32px;
                        padding: 48px;
                        position: relative;
                        animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .close-btn {
                        position: absolute;
                        top: 24px; right: 24px;
                        background: #F2F4F6;
                        border: none;
                        width: 36px; height: 36px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        color: #4E5968;
                        transition: all 0.2s;
                    }
                    .close-btn:hover { background: #E5E8EB; transform: rotate(90deg); }

                    .login-header { text-align: center; margin-bottom: 32px; }
                    .login-title { font-size: 24px; font-weight: 800; color: #191F28; margin-bottom: 8px; }
                    .login-subtitle { font-size: 15px; color: #4E5968; font-weight: 500; }

                    .social-login-grid { display: flex; flexDirection: column; gap: 12px; margin-bottom: 24px; }
                    .social-btn {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        padding: 14px;
                        border-radius: 14px;
                        font-size: 14px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.2s;
                        border: 1px solid #F2F4F7;
                        background: white;
                    }
                    .social-btn.google:hover { background: #F9FAFB; }
                    .social-btn.kakao { background: #FEE500; border: none; color: #3C1E1E; }
                    .social-btn.kakao:hover { background: #FDD100; }
                    .social-btn.naver { background: #03C75A; border: none; color: white; }
                    .social-btn.naver:hover { background: #02B351; }
                    .social-icon { font-size: 18px; line-height: 1; }

                    .divider {
                        display: flex;
                        align-items: center;
                        gap: 16px;
                        margin-bottom: 24px;
                        color: #B0B8C1;
                        font-size: 13px;
                        font-weight: 500;
                    }
                    .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: #F2F4F7; }

                    .login-form { display: flex; flex-direction: column; gap: 20px; }
                    .input-group label { display: block; font-size: 13px; font-weight: 700; color: #4E5968; margin-bottom: 8px; }
                    .input-wrapper {
                        position: relative;
                        display: flex;
                        align-items: center;
                    }
                    .input-icon { position: absolute; left: 16px; color: #B0B8C1; }
                    .input-wrapper input {
                        width: 100%;
                        padding: 14px 16px 14px 44px;
                        border-radius: 14px;
                        border: 1px solid #F2F4F7;
                        background: #F9FAFB;
                        font-size: 15px;
                        transition: all 0.2s;
                        outline: none;
                    }
                    .input-wrapper input:focus { border-color: #0055FB; background: white; box-shadow: 0 0 0 4px rgba(0, 85, 251, 0.1); }

                    .submit-btn {
                        background: #0055FB;
                        color: white;
                        border: none;
                        padding: 16px;
                        border-radius: 14px;
                        font-size: 16px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: background 0.2s;
                        margin-top: 8px;
                    }
                    .submit-btn:hover { background: #0046D9; }
                    .submit-btn:disabled { background: #B0B8C1; cursor: not-allowed; }

                    .login-footer { margin-top: 24px; text-align: center; font-size: 14px; color: #8B95A1; }
                    .text-btn { background: none; border: none; color: #0055FB; font-weight: 700; cursor: pointer; margin-left: 8px; }

                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                `}</style>
            </div>
        </div>
    );
}
