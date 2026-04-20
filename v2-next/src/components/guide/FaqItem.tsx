"use client";

import { useState, Children, isValidElement, ReactNode } from "react";

// Marker component to identify <summary> content
export function FaqSummary({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
FaqSummary.displayName = "FaqSummary";

interface Props {
    children: ReactNode;
    className?: string;
}

export function FaqItem({ children }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const childArray = Children.toArray(children);
    let summaryContent: ReactNode = null;
    const bodyContent: ReactNode[] = [];

    for (const child of childArray) {
        if (
            isValidElement(child) && (
                // native html summary (type is string "summary")
                child.type === "summary" ||
                // our custom FaqSummary marker
                (child.type as any)?.displayName === "FaqSummary" ||
                // fallback: check function name
                (typeof child.type === "function" && (child.type as any).name === "FaqSummary")
            )
        ) {
            summaryContent = (child.props as any).children;
        } else if (child !== "\n") {
            bodyContent.push(child);
        }
    }

    if (!summaryContent) {
        // Last resort: treat first non-empty text child as summary
        const idx = bodyContent.findIndex(c => !!c);
        if (idx !== -1) summaryContent = bodyContent.splice(idx, 1)[0];
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
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
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
            >
                <span style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: isOpen ? "#1a56e8" : "#191F28",
                    lineHeight: 1.5,
                    flex: 1,
                }}>{summaryContent}</span>
                <span style={{
                    fontSize: "1.2rem",
                    fontWeight: 500,
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
                }}>
                    {isOpen ? "−" : "+"}
                </span>
            </button>

            {isOpen && bodyContent.length > 0 && (
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
