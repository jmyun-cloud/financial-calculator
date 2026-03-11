(function () {
    const style = document.createElement('style');
    style.textContent = `
        .seo-accordion-container {
            max-width: 800px;
            margin: 40px auto 20px;
            padding: 0 20px;
        }
        .seo-toggle-btn {
            background: transparent;
            border: none;
            width: 100%;
            text-align: left;
            font-size: 1.05rem;
            font-weight: 600;
            color: var(--text-secondary);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            border-top: 1px solid var(--border);
            transition: color 0.2s;
            font-family: inherit;
        }
        .seo-toggle-btn:hover {
            color: var(--text-primary);
        }
        .seo-toggle-icon {
            transition: transform 0.3s ease;
            font-size: 1.2rem;
            color: var(--text-muted);
        }
        .seo-toggle-btn.open .seo-toggle-icon {
            transform: rotate(180deg);
        }
        .seo-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s cubic-bezier(0, 1, 0, 1), opacity 0.3s ease;
            opacity: 0;
            color: var(--text-secondary);
            font-size: 0.95rem;
            line-height: 1.8;
        }
        .seo-content.open {
            max-height: 2500px; /* enough to cover content */
            opacity: 1;
            transition: max-height 0.6s ease-in-out, opacity 0.5s ease-in-out 0.1s;
            margin-bottom: 30px;
            padding-top: 10px;
        }
        .seo-content h3 {
            font-size: 1.1rem;
            color: var(--text-primary);
            margin: 24px 0 12px 0;
        }
        .seo-content h3:first-child {
            margin-top: 0;
        }
        .seo-content p {
            margin-bottom: 16px;
        }
        .seo-content strong {
            color: var(--text-primary);
            font-weight: 700;
        }
        
        html[data-theme="dark"] .seo-toggle-btn {
            border-top-color: var(--border);
        }
    `;
    document.head.appendChild(style);

    function initSEO() {
        // Find existing buttons (if we inject them late, we might need event delegation, but doing it on DOMContentLoaded is fine)
        const btns = document.querySelectorAll('.seo-toggle-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('aria-controls');
                const target = document.getElementById(targetId);
                if (!target) return;

                const isOpen = btn.classList.contains('open');
                if (isOpen) {
                    btn.classList.remove('open');
                    btn.setAttribute('aria-expanded', 'false');
                    target.classList.remove('open');
                } else {
                    btn.classList.add('open');
                    btn.setAttribute('aria-expanded', 'true');
                    target.classList.add('open');
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSEO);
    } else {
        initSEO();
    }
})();
