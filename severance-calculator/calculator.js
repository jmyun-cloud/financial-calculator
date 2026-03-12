/* =========================================
   금융계산기.kr - 퇴직금 계산기
   2026년 기준 퇴직소득세 계산
   ========================================= */

'use strict';

// ===== 탭 전환 =====
function switchTab(type) {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + type).classList.add('active');
  document.getElementById('tab-' + type).setAttribute('aria-selected', 'true');
  document.getElementById('panel-' + type).classList.add('active');
}

// ===== 숫자 유틸 =====
function fmtKRW(num) {
  return Math.round(num).toLocaleString('ko-KR');
}

function parseAmt(str) {
  return parseFloat(String(str).replace(/,/g, '')) || 0;
}

function getHuman(num) {
  const n = Math.round(num);
  if (n >= 1e8) {
    const eok = Math.floor(n / 1e8);
    const man = Math.round((n % 1e8) / 1e4);
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
  }
  if (n >= 1e4) {
    const man = Math.floor(n / 1e4);
    const rem = n % 1e4;
    return rem > 0 ? `${man}만 ${rem.toLocaleString()}원` : `${man}만원`;
  }
  return `${n.toLocaleString()}원`;
}

// ===== 천 단위 콤마 입력 =====
function setupCommaInput(id, hintId) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', function () {
    const raw = this.value.replace(/[^0-9]/g, '');
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num > 0) {
      this.value = num.toLocaleString('ko-KR');
      if (hintId) {
        const h = document.getElementById(hintId);
        if (h) { h.textContent = getHuman(num); h.className = 'form-hint formatted'; }
      }
    } else {
      this.value = raw;
      if (hintId) {
        const h = document.getElementById(hintId);
        if (h) { h.textContent = ''; h.className = 'form-hint'; }
      }
    }
  });
}

// ===== 차트 인스턴스 관리 =====
const chartInstances = {};

function renderDonutChart(canvasId, legendId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  if (chartInstances[canvasId]) chartInstances[canvasId].destroy();
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        data: data.map(d => d.value),
        backgroundColor: data.map(d => d.color),
        borderWidth: 0,
        hoverOffset: 8,
      }]
    },
    options: {
      cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => ' ' + fmtKRW(ctx.parsed) + '원' }
        }
      },
      animation: { animateScale: true, duration: 600 }
    }
  });
  const leg = document.getElementById(legendId);
  leg.innerHTML = data.map(d => `
    <div class="legend-item">
      <span class="legend-dot" style="background:${d.color}"></span>
      <div class="legend-info">
        <span class="legend-label">${d.label}</span>
        <span class="legend-val">${fmtKRW(d.value)}원</span>
      </div>
    </div>`).join('');
}

// ====================================================
// 퇴직소득세 계산 (2026년 기준)
// ====================================================

/**
 * 근속연수공제 (2026)
 * 5년 이하: 100만 × 연수
 * 6~10년: 500만 + 200만×(연수-5)
 * 11~20년: 1,500만 + 250만×(연수-10)
 * 20년 초과: 4,000만 + 300만×(연수-20)
 */
function calcTenureDeduction(yearsRaw) {
  const y = Math.floor(yearsRaw); // 1년 단위
  if (y <= 5) return y * 1_000_000;
  if (y <= 10) return 5_000_000 + (y - 5) * 2_000_000;
  if (y <= 20) return 15_000_000 + (y - 10) * 2_500_000;
  return 40_000_000 + (y - 20) * 3_000_000;
}

/**
 * 환산급여공제 (2026)
 * 800만원 이하: 100%
 * ~7,000만원: 800만 + 초과분 × 60%
 * ~1억: 4,520만 + 초과분 × 55%
 * ~3억: 6,170만 + 초과분 × 45%
 * 3억 초과: 15,170만 + 초과분 × 35%
 */
function calcConvertedDeduction(converted) {
  if (converted <= 8_000_000) return converted;
  if (converted <= 70_000_000) return 8_000_000 + (converted - 8_000_000) * 0.60;
  if (converted <= 100_000_000) return 45_200_000 + (converted - 70_000_000) * 0.55;
  if (converted <= 300_000_000) return 61_700_000 + (converted - 100_000_000) * 0.45;
  return 151_700_000 + (converted - 300_000_000) * 0.35;
}

/**
 * 종합소득세율 (과세표준)
 */
const TAX_BRACKETS = [
  { limit: 14_000_000, rate: 0.06, deduct: 0 },
  { limit: 50_000_000, rate: 0.15, deduct: 1_260_000 },
  { limit: 88_000_000, rate: 0.24, deduct: 5_760_000 },
  { limit: 150_000_000, rate: 0.35, deduct: 15_440_000 },
  { limit: 300_000_000, rate: 0.38, deduct: 19_940_000 },
  { limit: 500_000_000, rate: 0.40, deduct: 25_940_000 },
  { limit: 1_000_000_000, rate: 0.42, deduct: 35_940_000 },
  { limit: Infinity, rate: 0.45, deduct: 65_940_000 },
];

function calcProgressiveTax(taxBase) {
  if (taxBase <= 0) return 0;
  for (const b of TAX_BRACKETS) {
    if (taxBase <= b.limit) return Math.max(0, taxBase * b.rate - b.deduct);
  }
  return 0;
}

/**
 * 퇴직소득세 계산 전체 절차
 * @param {number} severancePay - 퇴직금 총액
 * @param {number} tenureYearsFrac - 근속연수 (소수 포함, 예: 3.5년)
 * @returns {{ steps, incomeTax, localTax, totalTax }}
 */
function calcRetirementTax(severancePay, tenureYearsFrac) {
  const tenureYearsFloor = Math.floor(tenureYearsFrac); // 근속연수공제용 (1년 단위)
  const tenureForConvert = Math.max(1, tenureYearsFloor); // 나누기용

  // ① 근속연수공제
  const tenureDeduction = calcTenureDeduction(tenureYearsFloor);

  // ② 환산급여 = (퇴직금 - 근속연수공제) × 12 / 근속연수
  const afterTenure = Math.max(0, severancePay - tenureDeduction);
  const convertedWage = afterTenure * 12 / tenureForConvert;

  // ③ 환산급여공제
  const convertedDeduction = calcConvertedDeduction(convertedWage);

  // ④ 과세표준 = (환산급여 - 환산급여공제) × 근속연수 / 12
  const taxBase = Math.max(0, (convertedWage - convertedDeduction) * tenureForConvert / 12);

  // ⑤ 산출세액
  const grossTax = calcProgressiveTax(taxBase);

  // ⑥ 결정세액 (정수화)
  const incomeTax = Math.round(grossTax);
  const localTax = Math.round(incomeTax * 0.1);
  const totalTax = incomeTax + localTax;

  return {
    tenureDeduction,
    convertedWage,
    convertedDeduction,
    taxBase,
    incomeTax,
    localTax,
    totalTax,
    steps: { afterTenure, convertedWage, convertedDeduction, taxBase }
  };
}

// ====================================================
// 탭 1: 퇴직금 계산
// ====================================================
function calculateSeverance() {
  // 입사일 / 퇴직일
  const joinVal = document.getElementById('b-join').value;
  const retireVal = document.getElementById('b-retire').value;

  if (!joinVal || !retireVal) {
    alert('입사일과 퇴직일을 모두 입력해 주세요.');
    return;
  }

  const joinDate = new Date(joinVal);
  const retireDate = new Date(retireVal);
  const tenureDays = Math.floor((retireDate - joinDate) / (1000 * 60 * 60 * 24));

  if (tenureDays <= 0) {
    alert('퇴직일이 입사일보다 이후여야 합니다.');
    return;
  }

  if (tenureDays < 365) {
    // 1년 미만 경고 (법적 의무 없음이나 계산은 진행)
  }

  const tenureYears = tenureDays / 365;

  // 최근 3개월 임금
  const wage1 = parseAmt(document.getElementById('b-wage1').value);
  const wage2 = parseAmt(document.getElementById('b-wage2').value);
  const wage3 = parseAmt(document.getElementById('b-wage3').value);
  const bonusYearly = parseAmt(document.getElementById('b-bonus').value) || 0;

  if (!(wage1 + wage2 + wage3)) {
    alert('최근 3개월 임금을 입력해 주세요.');
    return;
  }

  // 3개월 달력 일수 (실제는 89~92일이지만 근사치로 91일 사용)
  const threeMonthDays = 91;

  // 상여금/12 × 3을 3개월 임금에 가산
  const bonusFor3M = (bonusYearly / 12) * 3;
  const totalWage3M = wage1 + wage2 + wage3 + bonusFor3M;

  // 1일 평균임금
  const dailyAvgWage = totalWage3M / threeMonthDays;

  // 퇴직금 = 1일 평균임금 × 30 × (근무일수 / 365)
  const severancePay = dailyAvgWage * 30 * (tenureDays / 365);

  // 퇴직소득세
  const taxResult = calcRetirementTax(severancePay, tenureYears);
  const netPay = severancePay - taxResult.totalTax;

  displaySeveranceResult({
    tenureDays, tenureYears,
    dailyAvgWage, totalWage3M, bonusFor3M,
    severancePay, netPay,
    taxResult,
    belowOneYear: tenureDays < 365
  });
}

function displaySeveranceResult(r) {
  const resultEl = document.getElementById('result-basic');
  const summaryEl = document.getElementById('result-basic-summary');

  const tenureY = Math.floor(r.tenureYears);
  const tenureM = Math.round((r.tenureYears - tenureY) * 12);

  summaryEl.innerHTML = `
    <div class="summary-label">퇴직금 총액 (근속 ${tenureY}년 ${tenureM}개월 기준)</div>
    <div class="summary-amount">${fmtKRW(r.severancePay)}원</div>
    <div class="summary-sub">세후 실수령액 ≈ ${fmtKRW(r.netPay)}원 (${getHuman(r.netPay)})</div>
    ${r.belowOneYear ? '<div style="margin-top:10px;background:rgba(239,68,68,.15);padding:6px 14px;border-radius:6px;font-size:.82rem">⚠️ 근속기간 1년 미만 — 법적 퇴직금 지급 의무 없음</div>' : ''}
  `;

  // 상세 테이블
  const t = document.getElementById('sev-detail-table');
  const cvWage = r.taxResult.convertedWage;
  const cvDeduct = r.taxResult.convertedDeduction;
  const taxBase = r.taxResult.taxBase;
  t.innerHTML = `
    <thead><tr><th>항목</th><th style="text-align:right">금액</th></tr></thead>
    <tbody>
      <tr><td>퇴직금 총액</td><td class="sev-amount plus">${fmtKRW(r.severancePay)}원</td></tr>
      <tr><td style="padding-left:16px;font-size:.82rem;color:var(--text-muted)">ㄴ 1일 평균임금</td><td class="sev-amount" style="font-size:.82rem;color:var(--text-muted)">${fmtKRW(r.dailyAvgWage)}원</td></tr>
      <tr><td colspan="2" style="padding:4px 12px;font-size:.76rem;color:var(--text-muted);background:var(--surface-2)">▼ 퇴직소득세 계산 과정</td></tr>
      <tr><td style="padding-left:12px">① 근속연수공제 (${Math.floor(r.tenureYears)}년)</td><td class="sev-amount minus">- ${fmtKRW(r.taxResult.tenureDeduction)}원</td></tr>
      <tr><td style="padding-left:12px">② 환산급여 (×12/근속연수)</td><td class="sev-amount">${fmtKRW(cvWage)}원</td></tr>
      <tr><td style="padding-left:12px">③ 환산급여공제</td><td class="sev-amount minus">- ${fmtKRW(cvDeduct)}원</td></tr>
      <tr><td style="padding-left:12px">④ 과세표준</td><td class="sev-amount">${fmtKRW(taxBase)}원</td></tr>
      <tr class="sev-total-row"><td>퇴직소득세 (산출)</td><td class="sev-amount minus">- ${fmtKRW(r.taxResult.incomeTax)}원</td></tr>
      <tr><td style="padding-left:16px;font-size:.82rem">ㄴ 지방소득세 (×10%)</td><td class="sev-amount minus" style="font-size:.82rem">- ${fmtKRW(r.taxResult.localTax)}원</td></tr>
      <tr class="sev-final-row"><td>💰 세후 실수령액</td><td class="sev-amount main">${fmtKRW(r.netPay)}원</td></tr>
    </tbody>
  `;

  // 도넛 차트
  renderDonutChart('chart-sev', 'legend-sev', [
    { label: '세후 실수령액', value: Math.max(0, r.netPay), color: '#d97706' },
    { label: '퇴직소득세', value: r.taxResult.incomeTax, color: '#ef4444' },
    { label: '지방소득세', value: r.taxResult.localTax, color: '#f97316' },
  ]);

  resultEl.style.display = 'block';
  if (typeof addSaveImageButton === 'function') addSaveImageButton('result-basic');
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ====================================================
// 탭 2: DB형 vs DC형 비교
// ====================================================
function comparePension() {
  const currentMonthly = parseAmt(document.getElementById('p-current-monthly').value);
  const retireMonthly = parseAmt(document.getElementById('p-retire-monthly').value);
  const years = parseFloat(document.getElementById('p-years').value) || 0;
  const dcRate = (parseFloat(document.getElementById('p-dc-rate').value) || 3) / 100;

  if (!currentMonthly || !retireMonthly || years <= 0) {
    alert('모든 항목을 올바르게 입력해 주세요.');
    return;
  }

  // DB형: 퇴직 직전 3개월 평균 기본급 × 근속연수
  const dbSeverance = retireMonthly * years;

  // DC형: 매년 연간 급여(=월급×12)의 1/12를 적립 = 월급을 단순 적립
  // 임금이 선형 상승한다고 가정
  // 1년차: currentMonthly×12/12 = currentMonthly
  // N년차: currentMonthly + (retireMonthly - currentMonthly) × (n-1)/(years-1)
  // 복리 누적
  let dcAccum = 0;
  const annualWageGrowth = years > 1 ? (retireMonthly - currentMonthly) / (years - 1) : 0;
  for (let y = 1; y <= years; y++) {
    const monthlyWage = currentMonthly + annualWageGrowth * (y - 1);
    const annualContrib = monthlyWage * 12 / 12; // 연간 임금의 1/12 × 12개월 = 연간 임금
    // 실제: 매월 연간임금의 1/12 기여. 단순화로 연말 일시 기여 가정.
    const remainingYears = years - y;
    dcAccum += annualContrib * Math.pow(1 + dcRate, remainingYears);
  }
  const dcSeverance = dcAccum;

  const dbTax = calcRetirementTax(dbSeverance, years);
  const dcTax = calcRetirementTax(dcSeverance, years);
  const dbNet = dbSeverance - dbTax.totalTax;
  const dcNet = dcSeverance - dcTax.totalTax;

  const dbWins = dbNet >= dcNet;

  const resultEl = document.getElementById('result-pension');
  const compareGrid = document.getElementById('compare-grid');
  const gridEl = document.getElementById('result-pension-grid');

  compareGrid.innerHTML = `
    <div class="compare-card ${dbWins ? 'winner' : ''}">
      <div class="compare-card-label">DB형 (확정급여형)</div>
      <div class="compare-card-amount">${fmtKRW(dbSeverance)}원</div>
      <div class="compare-card-sub">세후 ${fmtKRW(dbNet)}원</div>
      ${dbWins ? '<div class="winner-badge">✓ 유리</div>' : ''}
    </div>
    <div class="compare-card ${!dbWins ? 'winner' : ''}">
      <div class="compare-card-label">DC형 (확정기여형, 연 ${(dcRate * 100).toFixed(1)}%)</div>
      <div class="compare-card-amount">${fmtKRW(dcSeverance)}원</div>
      <div class="compare-card-sub">세후 ${fmtKRW(dcNet)}원</div>
      ${!dbWins ? '<div class="winner-badge">✓ 유리</div>' : ''}
    </div>
  `;

  const diff = Math.abs(dbNet - dcNet);
  gridEl.innerHTML = `
    <div class="result-item"><div class="result-item-label">DB형 퇴직금</div><div class="result-item-value">${fmtKRW(dbSeverance)}원</div></div>
    <div class="result-item"><div class="result-item-label">DB형 세후 실수령</div><div class="result-item-value accent">${fmtKRW(dbNet)}원</div></div>
    <div class="result-item"><div class="result-item-label">DC형 적립 총액</div><div class="result-item-value">${fmtKRW(dcSeverance)}원</div></div>
    <div class="result-item"><div class="result-item-label">DC형 세후 실수령</div><div class="result-item-value accent">${fmtKRW(dcNet)}원</div></div>
    <div class="result-item" style="grid-column:span 2">
      <div class="result-item-label">차이 (세후 기준)</div>
      <div class="result-item-value large">${dbWins ? 'DB형이' : 'DC형이'} ${fmtKRW(diff)}원 더 유리</div>
    </div>
  `;

  resultEl.style.display = 'block';
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ====================================================
// 초기화
// ====================================================
document.addEventListener('DOMContentLoaded', function () {
  setupCommaInput('b-wage1', 'b-wage1-hint');
  setupCommaInput('b-wage2', 'b-wage2-hint');
  setupCommaInput('b-wage3', 'b-wage3-hint');
  setupCommaInput('b-bonus', null);
  setupCommaInput('p-current-monthly', 'p-current-hint');
  setupCommaInput('p-retire-monthly', 'p-retire-hint');

  // 입사일/퇴직일 변경 시 근속기간 힌트 표시
  function updateTenureHint() {
    const join = document.getElementById('b-join').value;
    const retire = document.getElementById('b-retire').value;
    if (!join || !retire) return;
    const days = Math.floor((new Date(retire) - new Date(join)) / (1000 * 60 * 60 * 24));
    if (days <= 0) return;
    const y = Math.floor(days / 365);
    const m = Math.round((days % 365) / 30);
    const hint = document.getElementById('b-tenure-hint');
    hint.textContent = `근속기간: ${y}년 ${m}개월 (${days.toLocaleString()}일)`;
    hint.className = 'form-hint formatted';
  }

  document.getElementById('b-join').addEventListener('change', updateTenureHint);
  document.getElementById('b-retire').addEventListener('change', updateTenureHint);

  // 기본 퇴직일: 오늘
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('b-retire').value = today;
});
