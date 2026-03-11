(function () {
    // 1. Theme Configuration
    const LIGHT_THEME = 'light';
    const DARK_THEME = 'dark';
    const THEME_STORAGE_KEY = 'richcalc_theme';

    // 2. CSS Overrides for Dark Mode
    const darkThemeStyle = document.createElement('style');
    darkThemeStyle.textContent = `
        /* ===== DARK MODE VARIABLES & OVERRIDES ===== */
        html[data-theme="dark"] {
            --bg: #0f172a;
            --surface: #1e293b;
            --surface-2: #334155;
            --border: #475569;
            --text-primary: #f8fafc;
            --text-secondary: #cbd5e1;
            --text-muted: #94a3b8;
            --text-inverse: #ffffff;
            --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2);
            --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.3);
            --shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        
        /* General dark mode tweaks */
        html[data-theme="dark"] body {
            background-color: var(--bg);
            color: var(--text-primary);
        }

        /* Surfaces */
        html[data-theme="dark"] .calc-card,
        html[data-theme="dark"] .result-card,
        html[data-theme="dark"] .sidebar-widget,
        html[data-theme="dark"] .info-card,
        html[data-theme="dark"] .terms-section,
        html[data-theme="dark"] .toc-box,
        html[data-theme="dark"] .feature-item,
        html[data-theme="dark"] .popular-item,
        html[data-theme="dark"] .ad-slot,
        html[data-theme="dark"] .calculator-card {
            background-color: var(--surface);
            border-color: var(--border);
            color: var(--text-primary);
        }

        /* Inputs */
        html[data-theme="dark"] .form-input,
        html[data-theme="dark"] .currency-helper {
            background-color: var(--surface-2);
            border-color: var(--border);
            color: var(--text-primary);
        }

        html[data-theme="dark"] .input-unit {
            color: var(--text-secondary);
        }

        /* Header */
        html[data-theme="dark"] .site-header {
            background-color: var(--surface);
            border-bottom: 1px solid var(--border);
        }
        
        html[data-theme="dark"] .logo-text,
        html[data-theme="dark"] .nav-link,
        html[data-theme="dark"] .header-desc {
            color: var(--text-primary);
        }

        html[data-theme="dark"] .logo-icon,
        html[data-theme="dark"] .logo-accent {
            /* Keep accent/icons vibrant */
            filter: brightness(1.2);
        }

        html[data-theme="dark"] .nav-link:hover, 
        html[data-theme="dark"] .nav-link.active {
            background-color: var(--surface-2);
        }

        /* Ads Banners */
        html[data-theme="dark"] .ad-banner-top, 
        html[data-theme="dark"] .ad-banner-middle, 
        html[data-theme="dark"] .ad-banner-bottom {
            background-color: var(--surface);
            border-color: var(--border);
        }

        /* Ad Slots */
        html[data-theme="dark"] .ad-slot {
            background-color: #1e293b;
            border: 2px dashed #475569;
        }

        /* Typography Text colors */
        html[data-theme="dark"] .calc-card-desc,
        html[data-theme="dark"] .form-hint,
        html[data-theme="dark"] .result-item-label,
        html[data-theme="dark"] .faq-item p,
        html[data-theme="dark"] .widget-note,
        html[data-theme="dark"] .radio-desc,
        html[data-theme="dark"] .feature-desc,
        html[data-theme="dark"] .footer-disclaimer,
        html[data-theme="dark"] .footer-copy {
            color: var(--text-secondary);
        }

        /* Buttons & Toggles */
        html[data-theme="dark"] .radio-label,
        html[data-theme="dark"] .tab-btn,
        html[data-theme="dark"] .sidebar-link {
            background-color: var(--surface);
            border-color: var(--border);
            color: var(--text-primary);
        }

        html[data-theme="dark"] .tab-btn:not(.active):hover,
        html[data-theme="dark"] .radio-label:hover,
        html[data-theme="dark"] .sidebar-link:hover {
            background-color: var(--surface-2);
        }
        
        html[data-theme="dark"] .sidebar-link.active-link {
            background-color: rgba(255, 255, 255, 0.05);
            border-color: var(--border-focus);
        }

        /* Result Colors */
        html[data-theme="dark"] .cr-value, 
        html[data-theme="dark"] .amount,
        html[data-theme="dark"] .result-item-value {
           color: #fff;
        }

        /* Result Highlight Box (e.g. Total Final Amount) */
        html[data-theme="dark"] .result-highlight {
            background-color: rgba(255, 255, 255, 0.05); /* Subtle dark overlay on primary area */
            border-color: var(--border-focus);
        }
        
        html[data-theme="dark"] .result-highlight .amount {
            color: #fff;
        }
        
        html[data-theme="dark"] .result-highlight .label {
            color: var(--text-secondary);
        }

        /* Footer */
        html[data-theme="dark"] .site-footer {
            background-color: #0b1120;
            border-top: 1px solid var(--border);
        }
        
        html[data-theme="dark"] .footer-logo .logo-text {
            color: var(--text-primary);
        }

        /* Table */
        html[data-theme="dark"] .tax-table th,
        html[data-theme="dark"] .tax-table td {
            border-color: var(--border);
        }
        html[data-theme="dark"] .tax-table th {
            background-color: var(--surface-2);
            color: var(--text-secondary);
        }

        /* Toggle Button Styles */
        .theme-toggle-btn {
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 1.25rem;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s, transform 0.2s;
            margin-left: 12px;
        }
        
        .theme-toggle-btn:hover {
            background-color: var(--surface-2);
            transform: scale(1.05);
        }
        
        @media (max-width: 600px) {
            .theme-toggle-btn {
                margin-left: 4px;
                font-size: 1.15rem;
                padding: 6px;
            }
        }
    `;
    document.head.appendChild(darkThemeStyle);

    // 3. Theme Logic
    function getInitialTheme() {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
            return storedTheme;
        }
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? DARK_THEME : LIGHT_THEME;
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        updateToggleButton(theme);
    }

    // 4. Mount Toggle Button
    function updateToggleButton(theme) {
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) {
            btn.innerHTML = theme === DARK_THEME ? '☀️' : '🌙';
            btn.setAttribute('aria-label', theme === DARK_THEME ? '라이트 모드로 전환' : '다크 모드로 전환');
        }
    }

    function injectToggleButton() {
        // Prevent duplicate injection
        if (document.getElementById('theme-toggle-btn')) return;

        const headerInner = document.querySelector('.header-inner');
        if (!headerInner) return;

        const btn = document.createElement('button');
        btn.id = 'theme-toggle-btn';
        btn.className = 'theme-toggle-btn';
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
            setTheme(newTheme);
        });

        // Add to the right side of the header
        // If there's a header-nav, we can put it there or directly in header-inner
        const headerNav = headerInner.querySelector('.header-nav');
        if (headerNav) {
            headerNav.appendChild(btn);
            headerNav.style.display = 'flex';
            headerNav.style.alignItems = 'center';
        } else {
            headerInner.appendChild(btn);
            headerInner.style.display = 'flex';
            headerInner.style.alignItems = 'center';
        }

        updateToggleButton(document.documentElement.getAttribute('data-theme') || LIGHT_THEME);
    }

    // 5. Initialize
    const initialTheme = getInitialTheme();
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Inject button when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectToggleButton);
    } else {
        injectToggleButton();
    }
})();
