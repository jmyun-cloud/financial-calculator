"use client";

import { useState, Children, isValidElement, ReactNode } from "react";

interface Props {
    children: ReactNode;
    className?: string;
}

export function FaqItem({ children }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    // Extract <summary> text from children
    const childArray = Children.toArray(children);
    let summaryContent: ReactNode = null;
    const bodyContent: ReactNode[] = [];

    for (const child of childArray) {
        if (
            isValidElement(child) &&
            (child.type === "summary" || (child.props as any)?.mdxType === "summary")
        ) {
            summaryContent = (child.props as any).children;
        } else if (child !== "\n" && child !== " ") {
            bodyContent.push(child);
        }
    }

    return (
        <div
            style={{
                background: "white",
                border: `1.5px solid ${isOpen ? "#1a56e8" : "#E9ECF0"}`,
                borderRadius: "16px",
                marginBottom: "10px",
                overflow: "hidden",
                boxShadow: isOpen ? "0 0 0 4px rgba(26,86,232,0.07)" : "none",
                transition: "all 0.2s ease",
            }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: "100%",
                    padding: "20px 24px",
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
                onMouseEnter={e => {
                    if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = "#F8FAFF";
                }}
                onMouseLeave={e => {
                    if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
            >
                <span style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: isOpen ? "#1a56e8" : "#191F28",
                    lineHeight: 1.5,
                }}>{summaryContent}</span>
                <span style={{
                    fontSize: "1.3rem",
                    fontWeight: 400,
                    color: isOpen ? "#1a56e8" : "#B0B8C1",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: isOpen ? "#EEF3FF" : "#F2F4F7",
                    flexShrink: 0,
                    lineHeight: 1,
                    transition: "all 0.2s",
                }}>
                    {isOpen ? "−" : "+"}
                </span>
            </button>

            {isOpen && (
                <div style={{
                    padding: "4px 24px 22px",
                    color: "#4E5968",
                    fontSize: "0.95rem",
                    lineHeight: 1.75,
                    borderTop: "1px solid #F2F4F7",
                }}>
                    {bodyContent}
                </div>
            )}
        </div>
    );
}
