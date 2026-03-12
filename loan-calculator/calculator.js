/* =========================================
   금융계산기.kr - 대출 이자 계산기 Logic
   ========================================= */

'use strict';

// ===== 포매팅 유틸 =====
function formatKRW(num) { return Math.round(num).toLocaleString('ko-KR'); }
function parseAmount(str) { return parseFloat(String(str).replace(/,/g, '')) || 0; }

function getHumanReadable(num) {
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

// ===== 천단위 콤마 입력 =====
function setupCommaInput(inputId, hintId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('input', function () {
        const raw = this.value.replace(/[^0-9]/g, '');
        const num = parseInt(raw, 10);
        if (!isNaN(num) && num > 0) {
            this.value = num.toLocaleString('ko-KR');
            if (hintId) {
                const hint = document.getElementById(hintId);
                hint.textContent = getHumanReadable(num);
                hint.className = 'form-hint formatted';
            }
        } else {
            this.value = raw;
            if (hintId) {
                const hint = document.getElementById(hintId);
                hint.textContent = '';
                hint.className = 'form-hint';
            }
        }
    });
}

// 기간 힌트 (개월 → 년 변환)
function setupPeriodHint() {
    const input = document.getElementById('loan-period');
    const hint = document.getElementById('loan-period-hint');
    if (!input || !hint) return;
    input.addEventListener('input', function () {
        const m = parseInt(this.value, 10);
        if (m > 0) {
            const y = Math.floor(m / 12);
            const mo = m % 12;
            hint.textContent = y > 0 ? (mo > 0 ? `${y}년 ${mo}개월` : `${y}년`) : `${mo}개월`;
        } else {
            hint.textContent = '';
        }
    });
}

// ===== 차트 =====
const chartInstances = {};
function renderDonutChart(canvasId, legendId, principal, totalInterest) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (chartInstances[canvasId]) chartInstances[canvasId].destroy();

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['대출 원금', '총 이자'],
            datasets: [{
                data: [principal, totalInterest],
                backgroundColor: ['#1a56e8', '#e85d1a'],
                borderWidth: 0,
                hoverOffset: 8,
            }]
        },
        options: {
            cutout: '62%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ' ' + formatKRW(ctx.parsed) + '원'
                    }
                }
            },
            animation: { animateScale: true, duration: 600 }
        }
    });

    document.getElementById(legendId).innerHTML = [
        { label: '대출 원금', val: principal, color: '#1a56e8' },
        { label: '총 이자', val: totalInterest, color: '#e85d1a' },
    ].map(d =>
        `<div class="legend-item">
      <span class="legend-dot" style="background:${d.color}"></span>
      <div class="legend-info">
        <span class="legend-label">${d.label}</span>
        <span class="legend-val">${formatKRW(d.val)}원</span>
      </div>
    </div>`
    ).join('');
}

// ===== 전체/요약 스케줄 토글 =====
let showAll = false;
let lastScheduleData = [];
let lastGracePeriod = 0;

function toggleSchedule() {
    showAll = !showAll;
    document.getElementById('btn-show-all').textContent = showAll ? '요약 보기' : '전체 보기';
    renderScheduleTable(lastScheduleData, lastGracePeriod, showAll);
}

function renderScheduleTable(rows, gracePeriod, all) {
    const tbody = document.getElementById('schedule-body');
    const display = all ? rows : rows.slice(0, 12);

    let html = '';
    for (const r of display) {
        const isGrace = r.month <= gracePeriod;
        const rowClass = isGrace ? 'grace-row' : '';
        html += `<tr class="${rowClass}">
      <td>${r.month}</td>
      <td>${formatKRW(r.principal)}원</td>
      <td>${formatKRW(r.interest)}원</td>
      <td>${formatKRW(r.payment)}원</td>
      <td>${formatKRW(r.balance)}원</td>
    </tr>`;
    }

    // 합계 행
    const totP = rows.reduce((s, r) => s + r.principal, 0);
    const totI = rows.reduce((s, r) => s + r.interest, 0);
    const totPay = rows.reduce((s, r) => s + r.payment, 0);
    html += `<tr class="total-row">
    <td>합계</td>
    <td>${formatKRW(totP)}원</td>
    <td>${formatKRW(totI)}원</td>
    <td>${formatKRW(totPay)}원</td>
    <td>-</td>
  </tr>`;

    tbody.innerHTML = html;

    // 하단 힌트
    let tableHint = document.querySelector('.table-hint');
    if (!tableHint) {
        tableHint = document.createElement('div');
        tableHint.className = 'table-hint';
        document.querySelector('.table-wrap').appendChild(tableHint);
    }
    tableHint.textContent = !all && rows.length > 12
        ? `+ ${rows.length - 12}회차 더 있음. '전체 보기'를 클릭하세요.`
        : (rows.length > 12 ? `총 ${rows.length}회차 전체 표시 중` : '');
}

// ===== 원리금균등상환 계산 =====
function calcEqualInstallment(P, r, n) {
    // r: 월이율, n: 납입 개월
    if (r === 0) {
        const payment = P / n;
        return Array.from({ length: n }, (_, i) => {
            const balance = P - payment * (i + 1);
            return { month: i + 1, principal: payment, interest: 0, payment, balance: Math.max(0, balance) };
        });
    }
    const m = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    let balance = P;
    return Array.from({ length: n }, (_, i) => {
        const interest = balance * r;
        const principal = m - interest;
        balance -= principal;
        return { month: i + 1, principal: Math.round(principal), interest: Math.round(interest), payment: Math.round(m), balance: Math.max(0, Math.round(balance)) };
    });
}

// ===== 원금균등상환 계산 =====
function calcEqualPrincipal(P, r, n) {
    const principalPerMonth = P / n;
    let balance = P;
    return Array.from({ length: n }, (_, i) => {
        const interest = balance * r;
        const payment = principalPerMonth + interest;
        balance -= principalPerMonth;
        return { month: i + 1, principal: Math.round(principalPerMonth), interest: Math.round(interest), payment: Math.round(payment), balance: Math.max(0, Math.round(balance)) };
    });
}

// ===== 만기일시상환 계산 =====
function calcBullet(P, r, n) {
    const interest = P * r;
    const rows = Array.from({ length: n }, (_, i) => ({
        month: i + 1,
        principal: i === n - 1 ? Math.round(P) : 0,
        interest: Math.round(interest),
        payment: i === n - 1 ? Math.round(P + interest) : Math.round(interest),
        balance: i === n - 1 ? 0 : Math.round(P),
    }));
    return rows;
}

// ===== 거치 기간 포함 스케줄 생성 =====
function buildScheduleWithGrace(P, r, n, grace, type) {
    const rows = [];

    // 거치 기간: 이자만 납부
    for (let i = 1; i <= grace; i++) {
        const interest = P * r;
        rows.push({ month: i, principal: 0, interest: Math.round(interest), payment: Math.round(interest), balance: Math.round(P) });
    }

    // 상환 기간
    const repayN = n - grace;
    let repayRows;
    if (type === 'equal-installment') repayRows = calcEqualInstallment(P, r, repayN);
    else if (type === 'equal-principal') repayRows = calcEqualPrincipal(P, r, repayN);
    else repayRows = calcBullet(P, r, repayN);

    repayRows.forEach((row, idx) => {
        rows.push({ ...row, month: grace + idx + 1 });
    });

    return rows;
}

// ===== 메인 계산 함수 =====
function calculateLoan() {
    const principal = parseAmount(document.getElementById('loan-amount').value);
    const rate = parseFloat(document.getElementById('loan-rate').value);
    const period = parseInt(document.getElementById('loan-period').value, 10);
    const grace = parseInt(document.getElementById('loan-grace').value, 10) || 0;
    const type = document.querySelector('input[name="repayment-type"]:checked').value;

    // 유효성 검사
    if (!principal || principal <= 0) { document.getElementById('loan-amount').classList.add('error'); return alert('대출 원금을 올바르게 입력해 주세요.'); }
    if (!rate || rate <= 0 || rate > 50) { document.getElementById('loan-rate').classList.add('error'); return alert('연이율을 올바르게 입력해 주세요. (0.01 ~ 50%)'); }
    if (!period || period < 1 || period > 600) { document.getElementById('loan-period').classList.add('error'); return alert('대출 기간을 올바르게 입력해 주세요. (1 ~ 600개월)'); }
    if (grace >= period) return alert('거치 기간은 대출 기간보다 작아야 합니다.');

    document.getElementById('loan-amount').classList.remove('error');
    document.getElementById('loan-rate').classList.remove('error');
    document.getElementById('loan-period').classList.remove('error');

    const monthlyRate = rate / 100 / 12;

    // 현재 선택 방식 계산
    const schedule = buildScheduleWithGrace(principal, monthlyRate, period, grace, type);
    const totalPayment = schedule.reduce((s, r) => s + r.payment, 0);
    const totalInterest = totalPayment - principal;
    const firstPayment = schedule[grace] ? schedule[grace].payment : schedule[0].payment;  // 첫 상환 회차 납입금
    const lastPayment = schedule[schedule.length - 1].payment;

    // 3가지 방식 비교 계산 (거치 제외 순수 비교)
    const repayN = period - grace;
    const ei = calcEqualInstallment(principal, monthlyRate, repayN);
    const ep = calcEqualPrincipal(principal, monthlyRate, repayN);
    const bu = calcBullet(principal, monthlyRate, repayN);

    const compareData = [
        { label: '원리금균등', key: 'equal-installment', monthly: ei[0]?.payment || 0, totalInt: ei.reduce((s, r) => s + r.interest, 0) },
        { label: '원금균등', key: 'equal-principal', monthly: ep[0]?.payment || 0, totalInt: ep.reduce((s, r) => s + r.interest, 0) },
        { label: '만기일시', key: 'bullet', monthly: bu[0]?.payment || 0, totalInt: bu.reduce((s, r) => s + r.interest, 0) },
    ];

    displayResult(principal, totalInterest, totalPayment, firstPayment, lastPayment, rate, period, grace, type, compareData, schedule);
    lastScheduleData = schedule;
    lastGracePeriod = grace;
    showAll = false;
    renderScheduleTable(schedule, grace, false);
    document.getElementById('btn-show-all').textContent = '전체 보기';
}

const typeLabels = { 'equal-installment': '원리금균등', 'equal-principal': '원금균등', 'bullet': '만기일시' };

function displayResult(principal, totalInterest, totalPayment, firstPayment, lastPayment, rate, period, grace, type, compareData, schedule) {
    const label = typeLabels[type];
    const isEqualInstallment = type === 'equal-installment';

    // Summary
    document.getElementById('result-loan-summary').innerHTML = `
    <div class="summary-label">월 납입금 (${rate}% / ${period}개월 / ${label}상환${grace > 0 ? ` / 거치 ${grace}개월` : ''})</div>
    <div class="summary-amount">${formatKRW(firstPayment)}원 / 월</div>
    <div class="summary-sub">총 상환액: ${formatKRW(totalPayment)}원 | 총 이자: ${formatKRW(totalInterest)}원</div>
  `;

    // Compare
    const compareSection = document.getElementById('compare-section');
    compareSection.style.display = 'block';
    document.getElementById('compare-grid').innerHTML = compareData.map(d => `
    <div class="compare-item ${d.key === type ? 'active-type' : ''}">
      <div class="compare-type">${d.label}</div>
      <div class="compare-monthly">${formatKRW(d.monthly)}원/월</div>
      <div class="compare-total">총이자 ${formatKRW(d.totalInt)}원</div>
    </div>
  `).join('');

    // Grid
    const gridItems = [
        { label: '대출 원금', val: formatKRW(principal) + '원', cls: '' },
        { label: '연 이율', val: rate + '%', cls: '' },
        { label: '대출 기간', val: `${period}개월 (${period >= 12 ? Math.floor(period / 12) + '년 ' : ''}${period % 12 > 0 ? period % 12 + '개월' : ''})`, cls: '' },
        { label: '거치 기간', val: grace > 0 ? `${grace}개월` : '없음', cls: '' },
        { label: '총 상환액', val: formatKRW(totalPayment) + '원', cls: 'accent' },
        { label: '총 이자', val: formatKRW(totalInterest) + '원', cls: 'negative' },
    ];
    if (!isEqualInstallment) {
        gridItems.push({ label: '첫 달 납입금', val: formatKRW(firstPayment) + '원', cls: '' });
        gridItems.push({ label: '마지막 납입금', val: formatKRW(lastPayment) + '원', cls: '' });
    }
    gridItems.push({ label: '원금 대비 이자율', val: ((totalInterest / principal) * 100).toFixed(1) + '%', cls: 'large' });

    document.getElementById('result-loan-grid').innerHTML = gridItems.map(d => `
    <div class="result-item">
      <div class="result-item-label">${d.label}</div>
      <div class="result-item-value ${d.cls}">${d.val}</div>
    </div>
  `).join('');

    document.getElementById('result-loan').style.display = 'block';
  if (typeof addSaveImageButton === 'function') addSaveImageButton('result-loan');
    document.getElementById('schedule-card').style.display = 'block';
    document.getElementById('result-loan').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    renderDonutChart('chart-loan', 'legend-loan', principal, totalInterest);
}

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', function () {
    setupCommaInput('loan-amount', 'loan-amount-hint');
    setupPeriodHint();

    document.querySelectorAll('#calculator input').forEach(el => {
        el.addEventListener('keydown', e => { if (e.key === 'Enter') calculateLoan(); });
    });
});
