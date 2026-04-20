"use client";

import { useState, ReactNode } from "react";

interface Props {
    question: ReactNode;
    children: ReactNode;
}

export function FaqItem({ question, children }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            style={{
                background: "white",
                border: `1.5px solid ${isOpen ? "#1a56e8" : "#E9ECF0"}`,
                borderRadius: "16px",
                marginBottom: "10px",
                overflow: "hidden",
                boxShadow: isOpen ? "0 0 0 4px rgba(26,86,232,0.07)" : "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: "100%",
                    padding: "18px 22px",
                    background: isOpen ? "#F0F5FF" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    textAlign: "left",
                    transition: "background 0.15s",
                    fontFamily: "inherit",
                }}
            >
                <span style={{
                    fontSize: "0.97rem",
                    fontWeight: 700,
                    color: isOpen ? "#1a56e8" : "#191F28",
                    lineHeight: 1.5,
                    flex: 1,
                }}>
                    {question}
                </span>
                <span style={{
                    fontSize: "1.1rem",
                    color: isOpen ? "#1a56e8" : "#B0B8C1",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: isOpen ? "#EEF3FF" : "#F2F4F7",
                    flexShrink: 0,
                    transition: "all 0.2s",
                    fontWeight: 500,
                }}>
                    {isOpen ? "−" : "+"}
                </span>
            </button>

            {isOpen && (
                <div style={{
                    padding: "2px 22px 20px",
                    color: "#4E5968",
                    fontSize: "0.93rem",
                    lineHeight: 1.75,
                    borderTop: "1px solid #F2F4F7",
                }}>
                    {children}
                </div>
            )}
        </div>
    );
}
