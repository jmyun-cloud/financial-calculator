import re
import math

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract style block
style_end = content.find('  </style>')
if style_end == -1:
    print('Could not find </style>')
    exit(1)

# Add new CSS
new_css = """
    /* ===== DASHBOARD STYLES ===== */
    .dashboard-container { max-width: 1200px; margin: 40px auto; padding: 0 24px; display: grid; gap: 30px; grid-template-columns: 1fr; }
    @media(min-width: 992px) { .dashboard-container { grid-template-columns: 3fr 1fr; } }
    .widget-panel { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 30px; }
    .widget-title { font-size: 1.25rem; font-weight: 800; color: white; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
    /* Market Indicators */
    .market-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; }
    .market-item { background: rgba(0,0,0,0.2); border-radius: 12px; padding: 16px; text-align: center; }
    .market-label { font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-bottom: 5px; }
    .market-value { font-size: 1.4rem; font-weight: 800; color: #a78bfa; }
    .market-change { font-size: 0.75rem; color: #10b981; margin-top: 5px; }
    .market-change.down { color: #ef4444; }
    /* Asset Promo */
    .asset-promo { background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(236,72,153,0.1) 100%); border: 1px dashed rgba(236,72,153,0.3); border-radius: 16px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; }
    .asset-promo:hover { background: linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(236,72,153,0.15) 100%); transform: translateY(-2px); }
    /* Magazine Cards */
    .mag-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
    .mag-card { background: rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden; text-decoration: none; display:block; transition: transform 0.2s; border: 1px solid rgba(255,255,255,0.05); }
    .mag-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.2); }
    .mag-img { height: 120px; background: #1e293b; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
    .mag-content { padding: 20px; }
    .mag-tag { font-size: 0.7rem; background: rgba(99,102,241,0.2); color: #a5b4fc; padding: 3px 8px; border-radius: 100px; display: inline-block; margin-bottom: 10px; }
    .mag-title { font-size: 1.05rem; font-weight: 700; color: white; margin-bottom: 8px; line-height: 1.4; }
    /* Horizontal Category */
    .toolbox-category { margin-bottom: 40px; }
    .toolbox-category:last-child { margin-bottom: 0; }
    .toolbox-category-title { font-size: 1.1rem; color: #94a3b8; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px; margin-bottom: 20px; }
    /* Search Bar */
    .header-search { display: flex; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; padding: 8px 16px; width: 260px; }
    .header-search input { background: transparent; border: none; color: white; font-size: 0.9rem; outline: none; width: 100%; margin-left: 8px; }
    .header-search input::placeholder { color: rgba(255,255,255,0.3); }
    @media(max-width: 600px) { .header-nav { display: none !important; } }
"""
content = content[:style_end] + new_css + content[style_end:]

# 2. Extract calculator cards blocks
cards = re.findall(r'<a href=".*?-calculator/index.html".*?</a\>', content, re.DOTALL)

def get_card(name):
    for c in cards:
        if name in c: return c
    return ''

# 3. Build new body replacement
new_body_start = """<body>
  <!-- ===== HEADER ===== -->
  <header class="site-header">
    <div class="header-inner">
      <a href="index.html" class="logo">
        <span class="logo-icon">💰</span><span>금융계산기<span class="logo-accent">.kr</span></span>
      </a>
      <div class="header-search">
        <span>🔍</span>
        <input type="text" placeholder="예: 종부세, 복리, 청약..." />
      </div>
      <nav class="header-nav" style="display: flex; gap: 20px; margin-left: auto; align-items: center;">
        <a href="#toolbox" class="nav-link" style="font-size: 0.95rem; font-weight: 600; color: rgba(255,255,255,0.8);">계산기 도구</a>
        <a href="#magazine" class="nav-link" style="font-size: 0.95rem; font-weight: 600; color: rgba(255,255,255,0.8);">금융 매거진</a>
        <a href="#" class="nav-link" style="font-size: 0.95rem; font-weight: 700; background: rgba(99,102,241,0.15); color: #a5b4fc; padding: 6px 14px; border-radius: 100px; border: 1px solid rgba(99,102,241,0.3);">로그인 (준비중)</a>
      </nav>
    </div>
  </header>

  <div class="dashboard-container">
    <!-- LEFT COLUMN (Main Content) -->
    <div class="dashboard-main">
      <!-- Welcome & Assets -->
      <section class="widget-panel" style="margin-bottom: 30px;">
        <h2 class="widget-title">👋 환영합니다! 당신의 금융 현황</h2>
        <div class="asset-promo" onclick="alert('회원가입/로그인 및 자산 연동 기능은 현재 열심히 준비 중입니다! 🚀')">
          <div style="font-size: 2.5rem; margin-bottom: 15px;">🔒</div>
          <h3 style="color: white; font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">나의 자산 포트폴리오 (오픈 예정)</h3>
          <p style="color: rgba(255,255,255,0.6); font-size: 0.95rem;">
            회원가입 후 보유 자산 기능과 재무 목표(Goal Tracker)를 설정해보세요.<br/>사용자 맞춤형 대시보드 저장이 곧 추가됩니다!
          </p>
        </div>
      </section>

      <!-- Magazine -->
      <section class="widget-panel" id="magazine" style="margin-bottom: 30px;">
        <h2 class="widget-title">🗞️ 추천 금융 매거진 & 가이드</h2>
        <div class="mag-grid">
          <a href="guide/pension.html" class="mag-card">
            <div class="mag-img">👴</div>
            <div class="mag-content">
              <span class="mag-tag">노후 준비</span>
              <h3 class="mag-title">퇴직금 vs 퇴직연금 절세 비법</h3>
              <p style="font-size:0.8rem; color:rgba(255,255,255,0.4);">DB형과 DC형 중 나에게 맞는 선택은?</p>
            </div>
          </a>
          <a href="guide/compound.html" class="mag-card">
            <div class="mag-img">📈</div>
            <div class="mag-content">
              <span class="mag-tag">투자 마인드</span>
              <h3 class="mag-title">복리의 마법과 72의 법칙</h3>
              <p style="font-size:0.8rem; color:rgba(255,255,255,0.4);">워렌 버핏이 강조한 복리, 진짜일까?</p>
            </div>
          </a>
          <a href="guide/jeonse.html" class="mag-card">
            <div class="mag-img">🏗️</div>
            <div class="mag-content">
              <span class="mag-tag">부동산</span>
              <h3 class="mag-title">전월세 전환, 호구 당하지 않는 법</h3>
              <p style="font-size:0.8rem; color:rgba(255,255,255,0.4);">법정 전환율 6% 완벽 가이드</p>
            </div>
          </a>
        </div>
      </section>

      <!-- Toolbox -->
      <section class="widget-panel" id="toolbox">
        <h2 class="widget-title">🧰 금융 계산기 도구모음</h2>
        
        <div class="toolbox-category">
          <h3 class="toolbox-category-title">투자 및 저축</h3>
          <div class="calc-grid">
""" + get_card('savings-calculator') + "\n" + get_card('compound-calculator') + "\n" + get_card('tax-interest-calculator') + """
          </div>
        </div>

        <div class="toolbox-category">
          <h3 class="toolbox-category-title">대출 및 부동산</h3>
          <div class="calc-grid">
""" + get_card('loan-calculator') + "\n" + get_card('jeonse-calculator') + """
          </div>
        </div>

        <div class="toolbox-category">
          <h3 class="toolbox-category-title">생활 및 연봉/연금</h3>
          <div class="calc-grid">
""" + get_card('salary-calculator') + "\n" + get_card('severance-calculator') + "\n" + get_card('pension-calculator') + "\n" + get_card('inflation-calculator') + "\n" + get_card('exchange-calculator') + """
          </div>
        </div>
      </section>

    </div>

    <!-- RIGHT COLUMN (Sidebar) -->
    <aside class="dashboard-sidebar">
      <!-- Market Indicators -->
      <div class="widget-panel" style="margin-bottom: 30px;">
        <h2 class="widget-title" style="font-size: 1.05rem;">📊 오늘의 주요 지표</h2>
        <div class="market-grid" style="grid-template-columns: 1fr;">
          <div class="market-item">
            <div class="market-label">한국은행 기준금리</div>
            <div class="market-value">3.50%</div>
            <div class="market-change">동결 (최근 코멘트 기준)</div>
          </div>
          <div class="market-item">
            <div class="market-label">원/달러 환율</div>
            <div class="market-value">1,345.50</div>
            <div class="market-change down">▼ 2.50 (-0.18%)</div>
          </div>
          <div class="market-item">
            <div class="market-label">KOSPI 지수</div>
            <div class="market-value">2,750.20</div>
            <div class="market-change">▲ 15.30 (+0.5%)</div>
          </div>
        </div>
        <p style="font-size: 0.7rem; color: rgba(255,255,255,0.3); text-align: center; margin-top: 15px;">* API 연동을 통한 실시간 데이터 전환 예정</p>
      </div>

      <!-- Quick Links / Fast Action -->
      <div class="widget-panel" style="background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%); margin-bottom: 30px;">
        <h2 class="widget-title" style="font-size: 1.05rem;">🚀 빠른 실행</h2>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 12px; border-radius: 8px; text-align: left; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)';" onmouseout="this.style.background='rgba(255,255,255,0.05)';" onclick="window.location.href='savings-calculator/index.html'">+ 정기적금 이자 확인하기</button>
          <button style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 12px; border-radius: 8px; text-align: left; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)';" onmouseout="this.style.background='rgba(255,255,255,0.05)';" onclick="window.location.href='loan-calculator/index.html'">+ 주택담보대출 이자율 계산</button>
        </div>
      </div>

      <!-- Newsletter Promo -->
      <div class="widget-panel" style="background: rgba(99,102,241,0.05); border-color: rgba(99,102,241,0.2);">
        <h2 class="widget-title" style="font-size: 1.05rem; color: #a5b4fc;">💌 아침 경제 브리핑</h2>
        <p style="font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-bottom: 15px; line-height: 1.6;">
          어렵고 복잡한 금융 트렌드를 매일 아침 메일 1통으로 요약해 드립니다.
        </p>
        <div style="display: flex; gap: 8px;">
          <input type="email" placeholder="이메일 입력" style="flex:1; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px; color: white; font-size: 0.8rem; outline: none;"/>
          <button style="background: #818cf8; color: white; border: none; border-radius: 8px; padding: 0 15px; font-weight: bold; cursor: pointer;" onclick="alert('뉴스레터 구독 서비스 준비 중입니다.')">구독</button>
        </div>
      </div>
    </aside>
  </div>
"""

head_part = content[:content.find('<body>')]
footer_part = content[content.find('  <!-- ===== FOOTER ===== -->'):]

new_content = head_part + new_body_start + footer_part

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("index.html rewritten successfully!")
