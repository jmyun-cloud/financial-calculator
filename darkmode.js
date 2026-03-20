(function () {
  var LIGHT_THEME = "light";
  var DARK_THEME = "dark";
  var THEME_STORAGE_KEY = "richcalc_theme";

  var darkThemeStyle = document.createElement("style");

  // We build the CSS as a string to avoid template literal issues
  var css = [
    /* ======== VARIABLES ======== */
    'html[data-theme="dark"] {',
    "  --bg: #090e17;",
    "  --surface: #111827;",
    "  --surface-2: #1e293b;",
    "  --border: #334155;",
    "  --text-primary: #f8fafc;",
    "  --text-secondary: #cbd5e1;",
    "  --text-muted: #94a3b8;",
    "  --shadow-sm: 0 1px 3px rgba(0,0,0,.6);",
    "  --shadow-md: 0 8px 24px rgba(0,0,0,.7);",
    "  --shadow-lg: 0 10px 40px rgba(0,0,0,.8);",
    "}",

    /* ======== BASE ======== */
    'html[data-theme="dark"] body { background-color: var(--bg); color: var(--text-primary); }',

    /* ======== CARDS ======== */
    'html[data-theme="dark"] .calc-card,',
    'html[data-theme="dark"] .result-card,',
    'html[data-theme="dark"] .schedule-card,',
    'html[data-theme="dark"] .sidebar-widget,',
    'html[data-theme="dark"] .terms-section,',
    'html[data-theme="dark"] .toc-box,',
    'html[data-theme="dark"] .feature-item,',
    'html[data-theme="dark"] .popular-item,',
    'html[data-theme="dark"] .calculator-card {',
    "  background-color: var(--surface) !important;",
    "  border-color: var(--border) !important;",
    "  color: var(--text-primary) !important;",
    "}",

    /* info-card: covers ALL inline style variants */
    'html[data-theme="dark"] .info-card {',
    "  background-color: var(--surface-2) !important;",
    "  border-color: var(--border) !important;",
    "  color: var(--text-primary) !important;",
    "}",
    'html[data-theme="dark"] .info-card h3,',
    'html[data-theme="dark"] .info-card h4 {',
    "  color: var(--text-primary) !important;",
    "}",
    'html[data-theme="dark"] .info-card p,',
    'html[data-theme="dark"] .info-card li,',
    'html[data-theme="dark"] .info-card small {',
    "  color: var(--text-secondary) !important;",
    "}",
    'html[data-theme="dark"] .info-card strong { color: var(--text-primary) !important; }',

    /* highlight / colored info-cards */
    'html[data-theme="dark"] .info-card.highlight-card { background-color: #182a18 !important; border-color: #2a4a2a !important; }',

    /* ======== BOTTOM DESCRIPTION SECTION ======== */
    'html[data-theme="dark"] .bottom-description { background-color: var(--bg) !important; color: var(--text-primary) !important; }',
    'html[data-theme="dark"] .bottom-description h2,',
    'html[data-theme="dark"] .bottom-description h3,',
    'html[data-theme="dark"] .info-section h2,',
    'html[data-theme="dark"] .info-section p,',
    'html[data-theme="dark"] .info-section li,',
    'html[data-theme="dark"] .info-section strong { color: var(--text-primary) !important; }',

    /* ======== FORMULA BOX ======== */
    'html[data-theme="dark"] .formula-box {',
    "  background-color: #0f1e10 !important;",
    "  border-color: #1c3520 !important;",
    "}",
    'html[data-theme="dark"] .formula-box code,',
    'html[data-theme="dark"] .formula-box p { color: #80cfa0 !important; }',

    /* ======== EXAMPLE / HELPER BOXES ======== */
    'html[data-theme="dark"] .tax-example-box,',
    'html[data-theme="dark"] .example-box,',
    'html[data-theme="dark"] .note-box,',
    'html[data-theme="dark"] .info-box {',
    "  background-color: var(--surface-2) !important;",
    "  border-color: var(--border) !important;",
    "}",
    'html[data-theme="dark"] .tax-example-box h4,',
    'html[data-theme="dark"] .tax-example-box p,',
    'html[data-theme="dark"] .tax-example-box li,',
    'html[data-theme="dark"] .tax-example-box .note {',
    "  color: var(--text-secondary) !important;",
    "}",
    'html[data-theme="dark"] .tax-example-box li strong { color: var(--text-primary) !important; }',

    /* ======== COMPARISON NOTE ======== */
    'html[data-theme="dark"] .comparison-note { background-color: var(--surface-2) !important; border-color: var(--border) !important; }',
    'html[data-theme="dark"] .comparison-note p, html[data-theme="dark"] .comparison-note li { color: var(--text-secondary) !important; }',

    /* ======== RESULT ITEMS ======== */
    'html[data-theme="dark"] .result-notice { background-color: var(--surface-2) !important; border-color: var(--border) !important; color: var(--text-muted) !important; }',
    'html[data-theme="dark"] .result-item, html[data-theme="dark"] .compare-item { background-color: var(--surface-2) !important; border-color: var(--border) !important; }',

    /* ======== INPUTS ======== */
    'html[data-theme="dark"] .form-input, html[data-theme="dark"] .currency-helper { background-color: var(--surface-2) !important; border-color: var(--border) !important; color: var(--text-primary) !important; }',
    'html[data-theme="dark"] .input-unit { color: var(--text-muted) !important; }',

    /* ======== HEADER ======== */
    'html[data-theme="dark"] .site-header { background-color: var(--surface) !important; border-bottom: 1px solid var(--border) !important; }',
    'html[data-theme="dark"] .logo-text, html[data-theme="dark"] .nav-link, html[data-theme="dark"] .header-desc { color: var(--text-primary) !important; }',
    'html[data-theme="dark"] .nav-link:hover, html[data-theme="dark"] .nav-link.active { background-color: var(--surface-2) !important; color: var(--text-primary) !important; }',

    /* ======== ADS ======== */
    'html[data-theme="dark"] .ad-banner-top, html[data-theme="dark"] .ad-banner-middle, html[data-theme="dark"] .ad-banner-bottom { background-color: var(--surface) !important; border-color: var(--border) !important; }',
    'html[data-theme="dark"] .ad-slot { background-color: var(--surface) !important; border: 2px dashed var(--border) !important; }',

    /* ======== TYPOGRAPHY ======== */
    'html[data-theme="dark"] .calc-card-desc, html[data-theme="dark"] .form-hint, html[data-theme="dark"] .result-item-label, html[data-theme="dark"] .faq-item p, html[data-theme="dark"] .widget-note, html[data-theme="dark"] .footer-disclaimer, html[data-theme="dark"] .footer-copy { color: var(--text-secondary) !important; }',
    'html[data-theme="dark"] .faq-item summary, html[data-theme="dark"] .faq-item { border-color: var(--border) !important; color: var(--text-primary) !important; }',

    /* ======== BUTTONS / INTERACTIVE ======== */
    'html[data-theme="dark"] .radio-label, html[data-theme="dark"] .tab-btn, html[data-theme="dark"] .sidebar-link { background-color: var(--surface) !important; border-color: var(--border) !important; color: var(--text-secondary) !important; }',
    'html[data-theme="dark"] .tab-btn:not(.active):hover, html[data-theme="dark"] .radio-label:hover, html[data-theme="dark"] .sidebar-link:hover { background-color: var(--surface-2) !important; color: var(--text-primary) !important; border-color: #4a6380 !important; }',
    'html[data-theme="dark"] .sidebar-link.active-link { background-color: rgba(255,255,255,.04) !important; }',

    /* Save button */
    'html[data-theme="dark"] .save-image-btn { background: rgba(26,36,53,.9) !important; border-color: var(--border) !important; color: var(--text-muted) !important; }',
    'html[data-theme="dark"] .save-image-btn:hover { background: var(--surface-2) !important; color: var(--text-primary) !important; border-color: #4a6380 !important; }',

    /* ======== RESULT VALUES ======== */
    'html[data-theme="dark"] .cr-value, html[data-theme="dark"] .amount, html[data-theme="dark"] .result-item-value { color: var(--text-primary) !important; }',
    'html[data-theme="dark"] .result-highlight { background-color: rgba(255,255,255,.04) !important; border-color: var(--border) !important; }',
    'html[data-theme="dark"] .result-highlight .amount { color: var(--text-primary) !important; }',
    'html[data-theme="dark"] .result-highlight .label { color: var(--text-secondary) !important; }',

    /* ======== TABLES ======== */
    'html[data-theme="dark"] .tax-table th { background-color: var(--surface-2) !important; color: var(--text-secondary) !important; border-color: var(--border) !important; }',
    'html[data-theme="dark"] .tax-table td { border-color: var(--border) !important; color: var(--text-primary) !important; }',
    'html[data-theme="dark"] .tax-table tr:nth-child(even) { background-color: rgba(255,255,255,.02) !important; }',
    'html[data-theme="dark"] .schedule-table th { background-color: var(--surface-2) !important; color: var(--text-secondary) !important; }',
    'html[data-theme="dark"] .schedule-table td { border-color: var(--border) !important; color: var(--text-primary) !important; }',
    'html[data-theme="dark"] .schedule-table tr:nth-child(even) td { background-color: rgba(255,255,255,.02) !important; }',
    'html[data-theme="dark"] .schedule-table tr:hover td { background-color: rgba(255,255,255,.05) !important; }',

    /* ======== FOOTER ======== */
    'html[data-theme="dark"] .site-footer { background-color: #0a1220 !important; border-top: 1px solid var(--border) !important; }',
    'html[data-theme="dark"] .footer-logo .logo-text { color: var(--text-primary) !important; }',
    'html[data-theme="dark"] .footer-links a { color: rgba(255,255,255,.5) !important; }',
    'html[data-theme="dark"] .footer-links a:hover { color: var(--text-primary) !important; }',

    /* ======== EXCHANGE CALC SPECIFIC ======== */
    'html[data-theme="dark"] .rate-box, html[data-theme="dark"] .rate-card, html[data-theme="dark"] .currency-card { background-color: var(--surface-2) !important; border-color: var(--border) !important; color: var(--text-primary) !important; }',
    'html[data-theme="dark"] .today-rate-box, html[data-theme="dark"] .rate-info-box { background-color: var(--surface-2) !important; border-color: var(--border) !important; }',

    /* ======== TOGGLE BUTTON ======== */
    ".theme-toggle-btn { background: none; border: none; color: var(--text-primary); font-size: 1.25rem; cursor: pointer; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s, transform 0.2s; margin-left: 12px; }",
    ".theme-toggle-btn:hover { background-color: rgba(128,128,128,.15); transform: scale(1.05); }",
    "@media (max-width:600px) { .theme-toggle-btn { margin-left:4px; font-size:1.15rem; padding:6px; } }",
  ].join("\n");

  darkThemeStyle.textContent = css;
  document.head.appendChild(darkThemeStyle);

  function getInitialTheme() {
    var stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) return stored;
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
      var cur = document.documentElement.getAttribute("data-theme");
      setTheme(cur === DARK_THEME ? LIGHT_THEME : DARK_THEME);
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

  var initialTheme = getInitialTheme();
  document.documentElement.setAttribute("data-theme", initialTheme);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectToggleButton);
  } else {
    injectToggleButton();
  }
})();
