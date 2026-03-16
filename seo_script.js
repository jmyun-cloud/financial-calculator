(function () {
    const style = document.createElement('style');
    style.textContent = `
        .seo-accordion-container {
            max-width: 900px;
            margin: 20px auto;
            padding: 0;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            backdrop-filter: blur(10px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        /* Light mode adjustments */
        html:not([data-theme="dark"]) .seo-accordion-container {
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(0, 0, 0, 0.05);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
        }

        .seo-accordion-container:hover {
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(99, 102, 241, 0.3);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }
        
        html:not([data-theme="dark"]) .seo-accordion-container:hover {
            background: #fff;
            border-color: rgba(99, 102, 241, 0.2);
        }

        .seo-toggle-btn {
            background: transparent;
            border: none;
            width: 100%;
            text-align: left;
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--text-primary);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 22px 28px;
            transition: all 0.2s;
            font-family: inherit;
        }

        .seo-toggle-icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(99, 102, 241, 0.1);
            color: #818cf8;
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 0.9rem;
        }
        
        .seo-toggle-btn.open .seo-toggle-icon {
            transform: rotate(180deg);
            background: #6366f1;
            color: white;
        }

        .seo-content {
            max-height: 0;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            color: var(--text-secondary);
            font-size: 0.98rem;
            line-height: 1.8;
            padding: 0 28px;
        }

        .seo-content.open {
            max-height: 3000px;
            opacity: 1;
            padding-bottom: 32px;
            margin-top: -10px;
        }

        .seo-content h3 {
            font-size: 1.15rem;
            color: var(--text-primary);
            margin: 28px 0 12px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .seo-content h3::before {
            content: "";
            display: block;
            width: 4px;
            height: 18px;
            background: #6366f1;
            border-radius: 2px;
        }

        .seo-content h3:first-child {
            margin-top: 15px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        html:not([data-theme="dark"]) .seo-content h3:first-child {
            border-top-color: rgba(0, 0, 0, 0.05);
        }

        .seo-content p {
            margin-bottom: 18px;
            color: var(--text-secondary);
        }

        .seo-content strong {
            color: #818cf8;
            font-weight: 700;
        }
        
        .seo-content ul {
            margin: 15px 0;
            list-style: none;
            padding-left: 0;
        }
        
        .seo-content li {
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
        }
        
        .seo-content li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #6366f1;
            font-weight: bold;
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
