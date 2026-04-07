"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Goal {
    id: string;
    calcType: string;
    title: string;
    targetAmt: number;
    currentAmt: number;
    dateStr: string;
    isCompleted: boolean;
    link: string;
}

export default function GoalTracker() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("fc_goals");
        if (saved) {
            try {
                setGoals(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse goals", e);
            }
        }

        // Listen to custom event for updates from other pages
        const handleUpdate = () => {
            const updated = localStorage.getItem("fc_goals");
            if (updated) setGoals(JSON.parse(updated));
        };
        window.addEventListener("fc_goal_updated", handleUpdate);
        return () => window.removeEventListener("fc_goal_updated", handleUpdate);
    }, []);

    const deleteGoal = (id: string) => {
        const updated = goals.filter((g) => g.id !== id);
        setGoals(updated);
        localStorage.setItem("fc_goals", JSON.stringify(updated));
        window.dispatchEvent(new Event("fc_goal_updated"));
    };

    const formatNumber = (num: number) => num.toLocaleString("ko-KR");

    if (!mounted) return <div className="goal-empty">수집 중입니다...</div>;

    if (goals.length === 0) {
        return (
            <div className="goal-empty" style={{
                padding: "32px 20px",
                background: "linear-gradient(135deg, rgba(0,100,255,0.02) 0%, rgba(0,100,255,0.05) 100%)",
                borderRadius: "20px",
                border: "1px dashed rgba(0, 100, 255, 0.2)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px"
            }}>
                <div style={{ fontSize: "2.2rem", marginBottom: "4px" }}>🎯</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                    <strong style={{ color: "var(--text-primary)" }}>아직 저장된 목표가 없습니다.</strong><br />
                    계산기를 활용해 나만의 재무 목표를 세워보세요!
                </div>
                <Link href="/savings-calculator" style={{
                    background: "var(--primary)",
                    color: "white",
                    fontWeight: 700,
                    padding: "12px 24px",
                    borderRadius: "100px",
                    fontSize: "0.9rem",
                    marginTop: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 4px 12px rgba(0, 100, 255, 0.2)",
                    textDecoration: "none"
                }}>
                    <span>예적금 계산해보기</span>
                    <span>→</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="goal-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {goals.map((g) => {
                const percent = Math.min(100, Math.max(0, (g.currentAmt / g.targetAmt) * 100)) || 0;
                return (
                    <div key={g.id} className="goal-item" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", position: "relative" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <div>
                                <span style={{ fontSize: "0.75rem", background: "var(--primary-light)", color: "var(--primary)", padding: "2px 8px", borderRadius: "100px", fontWeight: 700, marginRight: "6px" }}>
                                    {g.calcType}
                                </span>
                                <span className="goal-date" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{g.dateStr}</span>
                            </div>
                            <button
                                onClick={() => deleteGoal(g.id)}
                                title="삭제"
                                style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1rem", opacity: 0.5 }}
                            >
                                ✕
                            </button>
                        </div>

                        <Link href={g.link || "/"} style={{ display: "block" }}>
                            <h4 style={{ fontSize: "1rem", color: "var(--text-primary)", marginBottom: "4px", fontWeight: 700 }}>
                                {g.title}
                            </h4>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                                <span>{formatNumber(g.currentAmt)}원 보유</span>
                                <span style={{ fontWeight: 600, color: "var(--primary)" }}>목표 {formatNumber(g.targetAmt)}원</span>
                            </div>

                            <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.05)", borderRadius: "100px", overflow: "hidden" }}>
                                <div style={{ width: `${percent}%`, height: "100%", background: "linear-gradient(90deg, #0064FF 0%, #00C6FF 100%)", transition: "width 0.5s ease" }}></div>
                            </div>
                            <div style={{ textAlign: "right", fontSize: "0.75rem", color: "var(--primary)", marginTop: "6px", fontWeight: 700 }}>
                                {percent.toFixed(1)}% 달성
                            </div>
                        </Link>
                    </div>
                );
            })}

            {/* CTA Banner for Anonymous Users */}
            <div className="sync-cta-banner" style={{
                marginTop: "8px",
                padding: "20px 16px",
                background: "linear-gradient(135deg, #F4F8FF 0%, #E8F0FF 100%)",
                borderRadius: "16px",
                border: "1px solid rgba(0, 100, 255, 0.15)",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                alignItems: "center",
                textAlign: "center"
            }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    <strong style={{ color: "var(--primary)", fontSize: "0.95rem" }}>이 데이터는 임시 보관 중이에요!</strong><br />
                    동기화하고 내 전체 자산과 연동해보세요.
                </div>
                <button style={{
                    width: "100%",
                    padding: "12px 0",
                    background: "var(--primary)",
                    color: "white",
                    fontWeight: 700,
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    boxShadow: "0 4px 12px rgba(0, 100, 255, 0.2)",
                    transition: "all 0.2s"
                }} onClick={() => {
                    alert("가상 로그인 기능이 작동되었습니다! 전체 자산 화면으로 전환됩니다.");
                    window.dispatchEvent(new Event("fc_mock_login"));
                }}>
                    3초만에 가입/로그인하기 🚀
                </button>
            </div>
        </div>
    );
}
