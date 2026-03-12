(function () {
  // 1. Theme Configuration
  var LIGHT_THEME = "light";
  var DARK_THEME = "dark";
  var THEME_STORAGE_KEY = "richcalc_theme";

  // 2. CSS Overrides for Dark Mode
  var darkThemeStyle = document.createElement("style");
  darkThemeStyle.textContent =
    '/* ===== DARK MODE VARIABLES ===== */\n' +
    'html[data-theme="dark"] {\n' +
    '  --bg: #101827;\n' +
    '  --surface: #1a2435;\n' +
    '  --surface-2: #243146;\n' +
    '  --border: #354a65;\n' +
    '  --text-primary: #e8edf5;\n' +
    '  --text-secondary: #9eb3cc;\n' +
    '  --text-muted: #6b8097;\n' +
    '  --shadow-sm: 0 1px 3px rgba(0,0,0,.4);\n' +
    '  --shadow-md: 0 4px 16px rgba(0,0,0,.5);\n' +
    '  --shadow-lg: 0 10px 40px rgba(0,0,0,.55);\n' +
    '}\n' +
    'html[data-theme="dark"] body { background-color: var(--bg); color: var(--text-primary); }\n' +

    /* Cards */
    'html[data-theme="dark"] .calc-card,\n' +
    'html[data-theme="dark"] .result-card,\n' +
    'html[data-theme="dark"] .schedule-card,\n' +
    'html[data-theme="dark"] .sidebar-widget,\n' +
    'html[data-theme="dark"] .info-card,\n' +
    'html[data-theme="dark"] .terms-section,\n' +
    'html[data-theme="dark"] .toc-box,\n' +
    'html[data-theme="dark"] .feature-item,\n' +
    'html[data-theme="dark"] .popular-item,\n' +
    'html[data-theme="dark"] .ad-slot,\n' +
    'html[data-theme="dark"] .calculator-card { background-color: var(--surface); border-color: var(--border); color: var(--text-primary); }\n' +

    /* Bottom description */
    'html[data-theme="dark"] .bottom-description { background-color: var(--bg); color: var(--text-primary); }\n' +
    'html[data-theme="dark"] .bottom-description h2,\n' +
    'html[data-theme="dark"] .bottom-description h3,\n' +
    'html[data-theme="dark"] .info-section h2,\n' +
    'html[data-theme="dark"] .info-section p,\n' +
    'html[data-theme="dark"] .info-section li,\n' +
    'html[data-theme="dark"] .bottom-description p,\n' +
    'html[data-theme="dark"] .bottom-description li { color: var(--text-primary); }\n' +
    'html[data-theme="dark"] .info-card h3 { color: var(--text-primary); }\n' +
    'html[data-theme="dark"] .info-card p, html[data-theme="dark"] .info-card li { color: var(--text-secondary); }\n' +

    /* Highlight card (복리 카드 등) */
    'html[data-theme="dark"] .info-card.highlight-card { background-color: #182a18; border-color: #2a4a2a; }\n' +

    /* Formula boxes */
    'html[data-theme="dark"] .formula-box { background-color: #0f1e10; border-color: #1c3520; }\n' +
    'html[data-theme="dark"] .formula-box code, html[data-theme="dark"] .formula-box p { color: #80cfa0; }\n' +

    /* comparison-note */
    'html[data-theme="dark"] .comparison-note { background-color: var(--surface-2); border-color: var(--border); }\n' +
    'html[data-theme="dark"] .comparison-note p, html[data-theme="dark"] .comparison-note li { color: var(--text-secondary); }\n' +

    /* result-notice, result-item */
    'html[data-theme="dark"] .result-notice { background-color: var(--surface-2); border-color: var(--border); color: var(--text-muted); }\n' +
    'html[data-theme="dark"] .result-item, html[data-theme="dark"] .compare-item { background-color: var(--surface-2); border-color: var(--border); }\n' +

    /* Inputs */
    'html[data-theme="dark"] .form-input, html[data-theme="dark"] .currency-helper { background-color: var(--surface-2); border-color: var(--border); color: var(--text-primary); }\n' +
    'html[data-theme="dark"] .input-unit { color: var(--text-muted); }\n' +

    /* Header */
    'html[data-theme="dark"] .site-header { background-color: var(--surface); border-bottom: 1px solid var(--border); }\n' +
    'html[data-theme="dark"] .logo-text, html[data-theme="dark"] .nav-link, html[data-theme="dark"] .header-desc { color: var(--text-primary); }\n' +
    'html[data-theme="dark"] .nav-link:hover, html[data-theme="dark"] .nav-link.active { background-color: var(--surface-2); color: var(--text-primary); }\n' +

    /* Ads */
    'html[data-theme="dark"] .ad-banner-top, html[data-theme="dark"] .ad-banner-middle, html[data-theme="dark"] .ad-banner-bottom { background-color: var(--surface); border-color: var(--border); }\n' +
    'html[data-theme="dark"] .ad-slot { background-color: var(--surface); border: 2px dashed var(--border); }\n' +

    /* Typography */
    'html[data-theme="dark"] .calc-card-desc, html[data-theme="dark"] .form-hint, html[data-theme="dark"] .result-item-label, html[data-theme="dark"] .faq-item p, html[data-theme="dark"] .widget-note, html[data-theme="dark"] .footer-disclaimer, html[data-theme="dark"] .footer-copy { color: var(--text-secondary); }\n' +
    'html[data-theme="dark"] .faq-item summary, html[data-theme="dark"] .faq-item { border-color: var(--border); color: var(--text-primary); }\n' +

    /* Buttons */
    'html[data-theme="dark"] .radio-label, html[data-theme="dark"] .tab-btn, html[data-theme="dark"] .sidebar-link { background-color: var(--surface); border-color: var(--border); color: var(--text-secondary); }\n' +
    'html[data-theme="dark"] .tab-btn:not(.active):hover, html[data-theme="dark"] .radio-label:hover, html[data-theme="dark"] .sidebar-link:hover { background-color: var(--surface-2); color: var(--text-primary); border-color: #4a6380; }\n' +
    'html[data-theme="dark"] .sidebar-link.active-link { background-color: rgba(255,255,255,.04); border-color: var(--border); }\n' +

    /* Save button */
    'html[data-theme="dark"] .save-image-btn { background: rgba(26,36,53,.9); border-color: var(--border); color: var(--text-muted); }\n' +
    'html[data-theme="dark"] .save-image-btn:hover { background: var(--surface-2); color: var(--text-primary); border-color: #4a6380; }\n' +

    /* Result values */
    'html[data-theme="dark"] .cr-value, html[data-theme="dark"] .amount, html[data-theme="dark"] .result-item-value { color: var(--text-primary); }\n' +
    'html[data-theme="dark"] .result-highlight { background-color: rgba(255,255,255,.04); border-color: var(--border); }\n' +
    'html[data-theme="dark"] .result-highlight .amount { color: var(--text-primary); }\n' +
    'html[data-theme="dark"] .result-highlight .label { color: var(--text-secondary); }\n' +

    /* Tables */
    'html[data-theme="dark"] .tax-table th { background-color: var(--surface-2); color: var(--text-secondary); border-color: var(--border); }\n' +
    'html[data-theme="dark"] .tax-table td { border-color: var(--border); color: var(--text-primary); }\n' +
    'html[data-theme="dark"] .schedule-table th { background-color: var(--surface-2); color: var(--text-secondary); }\n' +
    'html[data-theme="dark"] .schedule-table td { border-color: var(--border); color: var(--text-primary); }\n' +
    'html[data-theme="dark"] .schedule-table tr:nth-child(even) td { background-color: rgba(255,255,255,.02); }\n' +
    'html[data-theme="dark"] .schedule-table tr:hover td { background-color: rgba(255,255,255,.05); }\n' +

    /* Footer */
    'html[data-theme="dark"] .site-footer { background-color: #0a1220; border-top: 1px solid var(--border); }\n' +
    'html[data-theme="dark"] .footer-logo .logo-text { color: var(--text-primary); }\n' +

    /* Toggle button */
    '.theme-toggle-btn { background: none; border: none; color: var(--text-primary); font-size: 1.25rem; cursor: pointer; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s, transform 0.2s; margin-left: 12px; }\n' +
    '.theme-toggle-btn:hover { background-color: rgba(128,128,128,.15); transform: scale(1.05); }\n' +
    '@media (max-width:600px) { .theme-toggle-btn { margin-left:4px; font-size:1.15rem; padding:6px; } }\n';

  document.head.appendChild(darkThemeStyle);

  // 3. Theme Logic
  function getInitialTheme() {
    var storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) return storedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? DARK_THEME
      : LIGHT_THEME;
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    updateToggleButton(theme);
  }

  function updateToggleButton(theme) {
    var btn = document.getElementById("theme-toggle-btn");
    if (btn) {
      btn.innerHTML = theme === DARK_THEME ? "☀️" : "🌙";
      btn.setAttribute(
        "aria-label",
        theme === DARK_THEME ? "라이트 모드로 전환" : "다크 모드로 전환"
      );
    }
  }

  function injectToggleButton() {
    if (document.getElementById("theme-toggle-btn")) return;
    var headerInner = document.querySelector(".header-inner");
    if (!headerInner) return;

    var btn = document.createElement("button");
    btn.id = "theme-toggle-btn";
    btn.className = "theme-toggle-btn";
    btn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      setTheme(current === DARK_THEME ? LIGHT_THEME : DARK_THEME);
    });

    var headerNav = headerInner.querySelector(".header-nav");
    if (headerNav) {
      headerNav.appendChild(btn);
      headerNav.style.display = "flex";
      headerNav.style.alignItems = "center";
    } else {
      headerInner.appendChild(btn);
      headerInner.style.display = "flex";
      headerInner.style.alignItems = "center";
    }

    updateToggleButton(
      document.documentElement.getAttribute("data-theme") || LIGHT_THEME
    );
  }

  // 5. Initialize
  var initialTheme = getInitialTheme();
  document.documentElement.setAttribute("data-theme", initialTheme);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectToggleButton);
  } else {
    injectToggleButton();
  }
})();
