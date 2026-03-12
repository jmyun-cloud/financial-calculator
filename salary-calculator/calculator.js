/* =========================================
   금융계산기.kr - 연봉 계산기
   2026년 기준 4대보험 + 소득세 계산
   ========================================= */

"use strict";

// ===== 탭 전환 =====
function switchTab(type) {
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-selected", "false");
  });
  document
    .querySelectorAll(".tab-panel")
    .forEach((p) => p.classList.remove("active"));

  document.getElementById("tab-" + type).classList.add("active");
  document.getElementById("tab-" + type).setAttribute("aria-selected", "true");
  document.getElementById("panel-" + type).classList.add("active");
}

// ===== 숫자 포매팅 =====
function formatKRW(num) {
  return Math.round(num).toLocaleString("ko-KR");
}

function parseAmount(str) {
  return parseFloat(String(str).replace(/,/g, "")) || 0;
}

function getHumanReadable(num) {
  const n = Math.round(num);
  if (n >= 1e8) {
    const eok = Math.floor(n / 1e8);
    const man = Math.round((n % 1e8) / 1e4);
    if (man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
    return `${eok}억원`;
  }
  if (n >= 1e4) {
    const man = Math.floor(n / 1e4);
    const rem = n % 1e4;
    if (rem > 0) return `${man}만 ${rem.toLocaleString()}원`;
    return `${man}만원`;
  }
  return `${n.toLocaleString()}원`;
}

// ===== 천 단위 콤마 입력 처리 =====
function setupCommaInput(inputId, hintId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener("input", function () {
    const raw = this.value.replace(/[^0-9]/g, "");
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num > 0) {
      this.value = num.toLocaleString("ko-KR");
      if (hintId) {
        const hint = document.getElementById(hintId);
        if (hint) {
          hint.textContent = getHumanReadable(num);
          hint.className = "form-hint formatted";
        }
      }
    } else {
      this.value = raw;
      if (hintId) {
        const hint = document.getElementById(hintId);
        if (hint) {
          hint.textContent = "";
          hint.className = "form-hint";
        }
      }
    }
  });
}

// ===== 차트 인스턴스 관리 =====
const chartInstances = {};

function renderDonutChart(canvasId, legendId, data) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  chartInstances[canvasId] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: data.map((d) => d.label),
      datasets: [
        {
          data: data.map((d) => d.value),
          backgroundColor: data.map((d) => d.color),
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      cutout: "62%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return " " + formatKRW(ctx.parsed) + "원";
            },
          },
        },
      },
      animation: { animateScale: true, duration: 600 },
    },
  });

  const legend = document.getElementById(legendId);
  legend.innerHTML = data
    .map(
      (d) =>
        `<div class="legend-item">
      <span class="legend-dot" style="background:${d.color}"></span>
      <div class="legend-info">
        <span class="legend-label">${d.label}</span>
        <span class="legend-val">${formatKRW(d.value)}원</span>
      </div>
    </div>`,
    )
    .join("");
}

// ===================================================
// 2026년 4대보험 계산
// ===================================================
const INS_2026 = {
  pension_rate: 0.045, // 국민연금 4.5%
  pension_cap: 6_370_000, // 상한 637만원
  pension_floor: 370_000, // 하한 37만원
  health_rate: 0.03545, // 건강보험 3.545%
  longterm_rate: 0.1295, // 장기요양 = 건강보험료 × 12.95%
  employment_rate: 0.009, // 고용보험 0.9%
};

function calcInsurance(monthlyGross) {
  // 국민연금
  const pensionBase = Math.min(
    Math.max(monthlyGross, INS_2026.pension_floor),
    INS_2026.pension_cap,
  );
  const pension = Math.floor((pensionBase * INS_2026.pension_rate) / 10) * 10; // 10원 단위 절사

  // 건강보험
  const health = Math.floor((monthlyGross * INS_2026.health_rate) / 10) * 10;

  // 장기요양
  const longterm = Math.floor((health * INS_2026.longterm_rate) / 10) * 10;

  // 고용보험
  const employment =
    Math.floor((monthlyGross * INS_2026.employment_rate) / 10) * 10;

  return { pension, health, longterm, employment };
}

// ===================================================
// 2026년 근로소득세 계산 (간이세액표 근사 계산)
// ===================================================

// 소득세 세율 구간 (누진공제 방식)
const TAX_BRACKETS = [
  { limit: 14_000_000, rate: 0.06, deduction: 0 },
  { limit: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { limit: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { limit: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { limit: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { limit: 500_000_000, rate: 0.4, deduction: 25_940_000 },
  { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { limit: Infinity, rate: 0.45, deduction: 65_940_000 },
];

// 근로소득공제
function calcEmploymentDeduction(annualGross) {
  if (annualGross <= 5_000_000) return annualGross * 0.7;
  if (annualGross <= 15_000_000)
    return 3_500_000 + (annualGross - 5_000_000) * 0.4;
  if (annualGross <= 45_000_000)
    return 7_500_000 + (annualGross - 15_000_000) * 0.15;
  if (annualGross <= 100_000_000)
    return 12_000_000 + (annualGross - 45_000_000) * 0.05;
  return 14_750_000 + (annualGross - 100_000_000) * 0.02; // 상한 2,000만원
}

// 인적공제 (1인당 150만원)
function calcPersonalDeduction(dependants) {
  return dependants * 1_500_000;
}

// 소득세 계산 (종합소득세율 적용)
function calcIncomeTax(taxableIncome) {
  if (taxableIncome <= 0) return 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) {
      return Math.max(0, taxableIncome * bracket.rate - bracket.deduction);
    }
  }
  return 0;
}

// 근로소득세액공제 (산출세액 기준)
function calcTaxCredit(incomeTax) {
  if (incomeTax <= 1_300_000) return incomeTax * 0.55;
  return 715_000 + (incomeTax - 1_300_000) * 0.3;
}

// 자녀세액공제
function calcChildCredit(children) {
  if (children <= 0) return 0;
  if (children === 1) return 250_000;
  if (children === 2) return 550_000;
  return 550_000 + (children - 2) * 400_000;
}

/**
 * 연간 근로소득세 + 지방소득세 계산
 * @param {number} annualTaxable - 과세대상 연봉 (비과세 제외)
 * @param {number} dependants - 부양가족 수(본인 포함)
 * @param {number} children - 자녀 수 (8~19세)
 * @param {number} annualInsurance - 연간 4대보험료 합계
 * @returns {{ incomeTax: number, localTax: number, totalTax: number }}
 */
function calcAnnualTax(annualTaxable, dependants, children, annualInsurance) {
  // 1. 근로소득공제
  const employmentDeduction = Math.min(
    calcEmploymentDeduction(annualTaxable),
    20_000_000,
  );

  // 2. 근로소득금액 = 총급여 - 근로소득공제
  const workIncome = Math.max(0, annualTaxable - employmentDeduction);

  // 3. 종합소득공제: 인적공제 + 국민연금
  const personalDeduction = calcPersonalDeduction(dependants);
  const pensionDeduction = annualInsurance; // 국민연금만 공제 (간소화)
  const totalDeduction = personalDeduction + pensionDeduction;

  // 4. 과세표준
  const taxBase = Math.max(0, workIncome - totalDeduction);

  // 5. 산출세액
  const grossTax = calcIncomeTax(taxBase);

  // 6. 세액공제
  const creditWork = calcTaxCredit(grossTax); // 근로세액공제
  const creditChild = calcChildCredit(children); // 자녀세액공제

  // 7. 결정세액
  const incomeTax = Math.max(
    0,
    Math.round(grossTax - creditWork - creditChild),
  );

  // 8. 지방소득세 = 소득세 × 10%
  const localTax = Math.round(incomeTax * 0.1);

  return { incomeTax, localTax, totalTax: incomeTax + localTax };
}

// ===================================================
// 연봉 계산 메인
// ===================================================
function calculateSalary() {
  const annualRaw = parseAmount(document.getElementById("s-annual").value);
  const dependants =
    parseInt(document.getElementById("s-dependants").value, 10) || 1;
  const children =
    parseInt(document.getElementById("s-children").value, 10) || 0;
  const nontaxMonthly =
    parseAmount(document.getElementById("s-nontax").value) || 200_000;

  if (!annualRaw || annualRaw <= 0) {
    alert("세전 연봉을 올바르게 입력해 주세요.");
    document.getElementById("s-annual").classList.add("error");
    setTimeout(
      () => document.getElementById("s-annual").classList.remove("error"),
      2000,
    );
    return;
  }

  const monthlyGross = Math.round(annualRaw / 12); // 월 세전급여
  const monthlyTaxable = Math.max(0, monthlyGross - nontaxMonthly); // 과세 월급여
  const annualTaxable = monthlyTaxable * 12; // 과세 연봉

  // 4대보험 (과세+비과세 합산 기준)
  const ins = calcInsurance(monthlyGross);
  const monthlyInsTotal =
    ins.pension + ins.health + ins.longterm + ins.employment;
  const annualInsTotal = monthlyInsTotal * 12;

  // 소득세 (연간 계산 후 월 분할)
  const annualPensionDeduction = ins.pension * 12; // 국민연금만 소득공제
  const { incomeTax: annualIncomeTax, localTax: annualLocalTax } =
    calcAnnualTax(annualTaxable, dependants, children, annualPensionDeduction);
  const monthlyIncomeTax = Math.round(annualIncomeTax / 12 / 10) * 10;
  const monthlyLocalTax = Math.round(annualLocalTax / 12 / 10) * 10;
  const monthlyTaxTotal = monthlyIncomeTax + monthlyLocalTax;

  // 총 공제
  const monthlyTotalDeduction = monthlyInsTotal + monthlyTaxTotal;
  const monthlyTakeHome = monthlyGross - monthlyTotalDeduction;
  const annualTakeHome = monthlyTakeHome * 12;

  displaySalaryResult({
    annualRaw,
    monthlyGross,
    nontaxMonthly,
    ins,
    monthlyInsTotal,
    monthlyIncomeTax,
    monthlyLocalTax,
    monthlyTaxTotal,
    monthlyTotalDeduction,
    monthlyTakeHome,
    annualTakeHome,
  });
}

function displaySalaryResult(r) {
  const resultEl = document.getElementById("result-salary");
  const summaryEl = document.getElementById("result-salary-summary");

  summaryEl.innerHTML = `
    <div class="summary-label">월 실수령액 (세전 연봉 ${formatKRW(r.annualRaw)}원 기준)</div>
    <div class="summary-amount">${formatKRW(r.monthlyTakeHome)}원</div>
    <div class="summary-sub">연간 실수령액 ≈ ${getHumanReadable(r.annualTakeHome)}</div>
  `;

  // 공제 내역 테이블
  const table = document.getElementById("deduction-table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>항목</th>
        <th style="text-align:right">요율</th>
        <th style="text-align:right">월 공제액</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>월 세전급여</td>
        <td class="deduction-rate">-</td>
        <td class="deduction-amount" style="color:var(--text-primary)">${formatKRW(r.monthlyGross)}원</td>
      </tr>
      <tr>
        <td style="padding-left:20px;color:var(--text-muted);font-size:.82rem">ㄴ 비과세 수당</td>
        <td class="deduction-rate">-</td>
        <td class="deduction-amount" style="color:var(--success);font-size:.85rem">- ${formatKRW(r.nontaxMonthly)}원</td>
      </tr>
      <tr><td colspan="3" style="padding:4px 12px;background:#f8faff;font-size:.78rem;color:var(--text-muted)">▼ 4대보험</td></tr>
      <tr>
        <td style="padding-left:16px">국민연금</td>
        <td class="deduction-rate">4.5%</td>
        <td class="deduction-amount">- ${formatKRW(r.ins.pension)}원</td>
      </tr>
      <tr>
        <td style="padding-left:16px">건강보험</td>
        <td class="deduction-rate">3.545%</td>
        <td class="deduction-amount">- ${formatKRW(r.ins.health)}원</td>
      </tr>
      <tr>
        <td style="padding-left:16px">장기요양보험</td>
        <td class="deduction-rate">건강보험료 × 12.95%</td>
        <td class="deduction-amount">- ${formatKRW(r.ins.longterm)}원</td>
      </tr>
      <tr>
        <td style="padding-left:16px">고용보험</td>
        <td class="deduction-rate">0.9%</td>
        <td class="deduction-amount">- ${formatKRW(r.ins.employment)}원</td>
      </tr>
      <tr><td colspan="3" style="padding:4px 12px;background:#f8faff;font-size:.78rem;color:var(--text-muted)">▼ 세금</td></tr>
      <tr>
        <td style="padding-left:16px">근로소득세</td>
        <td class="deduction-rate">간이세액표</td>
        <td class="deduction-amount">- ${formatKRW(r.monthlyIncomeTax)}원</td>
      </tr>
      <tr>
        <td style="padding-left:16px">지방소득세</td>
        <td class="deduction-rate">소득세 × 10%</td>
        <td class="deduction-amount">- ${formatKRW(r.monthlyLocalTax)}원</td>
      </tr>
      <tr class="deduction-total">
        <td><strong>총 공제액</strong></td>
        <td class="deduction-rate"></td>
        <td class="deduction-amount">- ${formatKRW(r.monthlyTotalDeduction)}원</td>
      </tr>
      <tr class="take-home-row">
        <td><strong>🏦 월 실수령액</strong></td>
        <td class="deduction-rate"></td>
        <td class="deduction-amount">${formatKRW(r.monthlyTakeHome)}원</td>
      </tr>
    </tbody>
  `;

  // 도넛 차트
  renderDonutChart("chart-salary", "legend-salary", [
    { label: "실수령액", value: r.monthlyTakeHome, color: "#059669" },
    { label: "국민연금", value: r.ins.pension, color: "#3b82f6" },
    {
      label: "건강보험",
      value: r.ins.health + r.ins.longterm,
      color: "#06b6d4",
    },
    { label: "고용보험", value: r.ins.employment, color: "#8b5cf6" },
    { label: "소득세+지방세", value: r.monthlyTaxTotal, color: "#f59e0b" },
  ]);

  resultEl.style.display = "block";
  resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ===================================================
// 시급 계산
// ===================================================
function calculateHourly() {
  const wageRaw = parseAmount(document.getElementById("h-wage").value);
  const weeklyHours =
    parseFloat(document.getElementById("h-hours").value) || 40;
  const includeHoliday =
    document.querySelector('input[name="h-weekly-holiday"]:checked').value ===
    "yes";

  if (!wageRaw || wageRaw <= 0) {
    alert("시급을 올바르게 입력해 주세요.");
    return;
  }
  if (weeklyHours <= 0 || weeklyHours > 52) {
    alert("주 근로시간을 1~52시간으로 입력해 주세요.");
    return;
  }

  // 최저시급 체크
  const MIN_WAGE_2026 = 10030;
  const belowMin = wageRaw < MIN_WAGE_2026;

  // 주 근로시간 → 월 환산 (4.345주/월)
  const weeksPerMonth = 365 / 7 / 12; // ≈ 4.345
  const monthlyWorkHours = weeklyHours * weeksPerMonth;

  // 주휴 시간 (주 15시간 이상 근무 시만 지급)
  let weeklyHolidayHours = 0;
  if (includeHoliday && weeklyHours >= 15) {
    // 주휴수당 = 1일 통상임금 = (주 소정근로시간/5) × 시급
    weeklyHolidayHours = Math.min(weeklyHours, 40) / 5; // 최대 8시간/주
  }
  const monthlyHolidayHours = weeklyHolidayHours * weeksPerMonth;

  const monthlyPay = Math.round(
    wageRaw * (monthlyWorkHours + monthlyHolidayHours),
  );
  const annualPay = monthlyPay * 12;

  // 4대보험 간이 계산 (소득세는 최소 수준)
  const ins = calcInsurance(monthlyPay);
  const monthlyInsTotal =
    ins.pension + ins.health + ins.longterm + ins.employment;
  const { incomeTax, localTax } = calcAnnualTax(
    Math.max(0, monthlyPay - 200_000) * 12,
    1,
    0,
    ins.pension * 12,
  );
  const monthlyTax = Math.round((incomeTax + localTax) / 12 / 10) * 10;
  const monthlyTakeHome = monthlyPay - monthlyInsTotal - monthlyTax;

  displayHourlyResult({
    wageRaw,
    weeklyHours,
    includeHoliday,
    belowMin,
    monthlyWorkHours,
    monthlyHolidayHours,
    monthlyPay,
    annualPay,
    ins,
    monthlyInsTotal,
    monthlyTax,
    monthlyTakeHome,
  });
}

function displayHourlyResult(r) {
  const resultEl = document.getElementById("result-hourly");
  const summaryEl = document.getElementById("result-hourly-summary");

  summaryEl.innerHTML = `
    <div class="summary-label">월 급여 (${formatKRW(r.wageRaw)}원 × 주 ${r.weeklyHours}시간${r.includeHoliday ? " + 주휴수당" : ""})</div>
    <div class="summary-amount">${formatKRW(r.monthlyPay)}원</div>
    <div class="summary-sub">월 실수령액 ≈ ${formatKRW(r.monthlyTakeHome)}원 | 연봉 ≈ ${getHumanReadable(r.annualPay)}</div>
    ${r.belowMin ? '<div style="margin-top:10px;background:rgba(239,68,68,.15);padding:6px 14px;border-radius:6px;font-size:.82rem">⚠️ 2026년 최저시급(10,030원) 미만입니다.</div>' : ""}
  `;

  const gridEl = document.getElementById("result-hourly-grid");
  gridEl.innerHTML = `
    <div class="result-item">
      <div class="result-item-label">시급</div>
      <div class="result-item-value">${formatKRW(r.wageRaw)}원</div>
    </div>
    <div class="result-item">
      <div class="result-item-label">월 근로시간</div>
      <div class="result-item-value">${r.monthlyWorkHours.toFixed(1)}시간</div>
    </div>
    <div class="result-item">
      <div class="result-item-label">월 기본급</div>
      <div class="result-item-value">${formatKRW(Math.round(r.wageRaw * r.monthlyWorkHours))}원</div>
    </div>
    <div class="result-item">
      <div class="result-item-label">월 주휴수당</div>
      <div class="result-item-value positive">${r.monthlyHolidayHours > 0 ? "+" + formatKRW(Math.round(r.wageRaw * r.monthlyHolidayHours)) : "0"}원</div>
    </div>
    <div class="result-item">
      <div class="result-item-label">4대보험 공제</div>
      <div class="result-item-value negative">- ${formatKRW(r.monthlyInsTotal)}원</div>
    </div>
    <div class="result-item">
      <div class="result-item-label">소득세+지방세</div>
      <div class="result-item-value negative">- ${formatKRW(r.monthlyTax)}원</div>
    </div>
    <div class="result-item" style="grid-column: span 2">
      <div class="result-item-label">월 실수령액 (추정)</div>
      <div class="result-item-value large">${formatKRW(r.monthlyTakeHome)}원</div>
    </div>
    <div class="result-item" style="grid-column: span 2">
      <div class="result-item-label">연 환산 (세전)</div>
      <div class="result-item-value accent">${formatKRW(r.annualPay)}원 (${getHumanReadable(r.annualPay)})</div>
    </div>
  `;

  resultEl.style.display = "block";
  resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ===== 초기화 =====
document.addEventListener("DOMContentLoaded", function () {
  setupCommaInput("s-annual", "s-annual-hint");
  setupCommaInput("s-nontax", null);
  setupCommaInput("h-wage", "h-wage-hint");

  // 비과세 기본값 200,000 표시
  const nontaxInput = document.getElementById("s-nontax");
  if (nontaxInput && !nontaxInput.value) {
    nontaxInput.value = "200,000";
  }
});
