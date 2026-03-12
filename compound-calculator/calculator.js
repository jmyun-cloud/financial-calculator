/* =========================================
   금융계산기.kr - 복리 수익률 계산기 Logic
   ========================================= */

'use strict';

// ===== 포매팅 =====
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

// ===== 콤마 입력 =====
function setupCommaInput(inputId, hintId, placeholder) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('input', function () {
        const raw = this.value.replace(/[^0-9]/g, '');
        const num = parseInt(raw, 10);
        if (!isNaN(num) && num > 0) {
            this.value = num.toLocaleString('ko-KR');
            if (hintId) {
                const hint = document.getElementById(hintId);
                if (hint) { hint.textContent = getHumanReadable(num); hint.className = 'form-hint formatted'; }
            }
        } else {
            this.value = raw;
            if (hintId) {
                const hint = document.getElementById(hintId);
                if (hint) { hint.textContent = placeholder || ''; hint.className = 'form-hint'; }
            }
        }
    });
}

// 기간 힌트
function setupPeriodHint() {
    const input = document.getElementById('invest-period');
    const hint = document.getElementById('invest-period-hint');
    if (!input || !hint) return;
    input.addEventListener('input', function () {
        const y = parseInt(this.value, 10);
        if (y > 0) hint.textContent = `만료 연도: ${new Date().getFullYear() + y}년`;
        else hint.textContent = '';
    });
}

// ===== 차트 인스턴스 =====
const chartInstances = {};

function destroyChart(id) {
    if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; }
}

// ===== 도넛 차트 =====
function renderDonutChart(principal, monthlyAdd, years, profit, tax) {
    destroyChart('chart-donut');
    const totalInvested = principal + monthlyAdd * 12 * years;
    const netProfit = Math.max(0, profit - tax);

    const ctx = document.getElementById('chart-donut').getContext('2d');
    chartInstances['chart-donut'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['투자 원금', '순 수익', '세금'],
            datasets: [{
                data: [totalInvested, netProfit, tax],
                backgroundColor: ['#1a56e8', '#059669', '#f59e0b'],
                borderWidth: 0,
                hoverOffset: 8,
            }]
        },
        options: {
            cutout: '62%',
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ' ' + formatKRW(c.parsed) + '원' } } },
            animation: { animateScale: true, duration: 600 }
        }
    });

    const legendData = [
        { label: '총 투자 원금', val: totalInvested, color: '#1a56e8' },
        { label: '순 수익', val: netProfit, color: '#059669' },
        { label: '세금', val: tax, color: '#f59e0b' },
    ];
    document.getElementById('legend-donut').innerHTML = legendData.map(d =>
        `<div class="legend-item">
      <span class="legend-dot" style="background:${d.color}"></span>
      <div class="legend-info">
        <span class="legend-label">${d.label}</span>
        <span class="legend-val">${formatKRW(d.val)}원</span>
      </div>
    </div>`
    ).join('');
}

// ===== 라인 차트 (연도별 성장) =====
function renderLineChart(yearlyData) {
    destroyChart('chart-growth');
    const labels = yearlyData.map(d => `${d.year}년`);
    const compoundVals = yearlyData.map(d => Math.round(d.compound));
    const simpleVals = yearlyData.map(d => Math.round(d.simple));

    const ctx = document.getElementById('chart-growth').getContext('2d');
    chartInstances['chart-growth'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: '복리',
                    data: compoundVals,
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5,150,105,0.08)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointRadius: yearlyData.length <= 20 ? 4 : 2,
                    pointBackgroundColor: '#059669',
                },
                {
                    label: '단리',
                    data: simpleVals,
                    borderColor: '#94a3b8',
                    backgroundColor: 'rgba(148,163,184,0.05)',
                    borderWidth: 1.5,
                    fill: false,
                    tension: 0.4,
                    pointRadius: yearlyData.length <= 20 ? 3 : 1,
                    pointBackgroundColor: '#94a3b8',
                    borderDash: [5, 4],
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: { font: { family: 'Pretendard', size: 12 }, usePointStyle: true }
                },
                tooltip: {
                    callbacks: {
                        label: c => ` ${c.dataset.label}: ${formatKRW(c.parsed.y)}원`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: { font: { family: 'Pretendard', size: 11 }, maxTicksLimit: 10 }
                },
                y: {
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: {
                        font: { family: 'Pretendard', size: 11 },
                        callback: v => {
                            if (v >= 1e8) return (v / 1e8).toFixed(1) + '억';
                            if (v >= 1e4) return (v / 1e4).toFixed(0) + '만';
                            return v.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// ===== 복리 계산 핵심 로직 =====
function calcCompound(P, annualRate, years, monthlyAdd, freqPerYear) {
    const r = annualRate / 100 / freqPerYear;
    const n = freqPerYear * years;
    const monthlyFreq = 12; // 월 추가투자는 월 단위 계산

    // P의 복리
    let principalGrowth = P * Math.pow(1 + r, n);

    // 월 추가 투자 복리 (월복리로 계산 단순화)
    let addGrowth = 0;
    if (monthlyAdd > 0) {
        const mr = annualRate / 100 / 12;
        const mn = 12 * years;
        if (mr > 0) {
            addGrowth = monthlyAdd * (Math.pow(1 + mr, mn) - 1) / mr;
        } else {
            addGrowth = monthlyAdd * mn;
        }
    }

    return principalGrowth + addGrowth;
}

function calcSimple(P, annualRate, years, monthlyAdd) {
    const totalInvested = P + monthlyAdd * 12 * years;
    const principalInterest = P * (annualRate / 100) * years;
    // 적금식 단리: 월 납입금 * 연이율 * 평균 예치기간
    const addInterest = monthlyAdd > 0 ? monthlyAdd * (annualRate / 100 / 12) * (12 * years) * (12 * years + 1) / 2 : 0;
    return totalInvested + principalInterest + addInterest - monthlyAdd * 12 * years;
    // 단순화: simple = P*(1 + r*t)
}

// ===== 연도별 데이터 =====
function buildYearlyData(P, annualRate, years, monthlyAdd, freqPerYear) {
    return Array.from({ length: years }, (_, i) => {
        const y = i + 1;
        const compound = calcCompound(P, annualRate, y, monthlyAdd, freqPerYear);
        const totalInvested = P + monthlyAdd * 12 * y;
        const simple = totalInvested + P * (annualRate / 100) * y + (monthlyAdd > 0
            ? monthlyAdd * (annualRate / 100 / 12) * 12 * y * (12 * y + 1) / 2
            : 0);
        return { year: y, compound, simple, totalInvested };
    });
}

// ===== 메인 계산 =====
function calculateCompound() {
    const initial = parseAmount(document.getElementById('initial-amount').value);
    const rate = parseFloat(document.getElementById('annual-rate').value);
    const years = parseInt(document.getElementById('invest-period').value, 10);
    const monthlyAdd = parseAmount(document.getElementById('monthly-add').value) || 0;
    const freq = parseInt(document.querySelector('input[name="compound-freq"]:checked').value, 10);
    const taxRate = parseFloat(document.querySelector('input[name="tax-apply"]:checked').value) || 0;

    // 유효성
    if (!initial || initial <= 0) { document.getElementById('initial-amount').classList.add('error'); return alert('초기 투자 원금을 입력해 주세요.'); }
    if (!rate || rate <= 0 || rate > 100) { document.getElementById('annual-rate').classList.add('error'); return alert('연 수익률을 올바르게 입력해 주세요.'); }
    if (!years || years < 1 || years > 100) { document.getElementById('invest-period').classList.add('error'); return alert('투자 기간을 올바르게 입력해 주세요. (1~100년)'); }

    ['initial-amount', 'annual-rate', 'invest-period'].forEach(id => document.getElementById(id).classList.remove('error'));

    const totalInvested = initial + monthlyAdd * 12 * years;
    const finalCompound = calcCompound(initial, rate, years, monthlyAdd, freq);
    const grossProfit = finalCompound - totalInvested;
    const taxAmount = grossProfit * (taxRate / 100);
    const netFinal = finalCompound - taxAmount;
    const netProfit = netFinal - totalInvested;

    // 단리 비교
    const finalSimple = totalInvested + initial * (rate / 100) * years + (monthlyAdd > 0
        ? monthlyAdd * (rate / 100 / 12) * 12 * years * (12 * years + 1) / 2
        : 0);
    const simpleProfit = finalSimple - totalInvested;

    // 72의 법칙
    const doublingYears = (72 / rate).toFixed(1);

    displayResult({
        initial, monthlyAdd, rate, years, freq, taxRate,
        totalInvested, finalCompound, grossProfit, taxAmount, netFinal, netProfit,
        finalSimple, simpleProfit, doublingYears
    });

    // 연도별 표 & 차트
    const yearlyData = buildYearlyData(initial, rate, years, monthlyAdd, freq);
    renderLineChart(yearlyData);
    renderDonutChart(initial, monthlyAdd, years, grossProfit, taxAmount);
    renderGrowthTable(yearlyData, totalInvested, taxRate);
}

const freqLabel = { 1: '연복리', 4: '분기복리', 12: '월복리' };

function displayResult({ initial, monthlyAdd, rate, years, freq, taxRate,
    totalInvested, finalCompound, grossProfit, taxAmount, netFinal, netProfit,
    finalSimple, simpleProfit, doublingYears }) {

    const taxLabel = taxRate === 0 ? '세전' : `세금 ${taxRate}% 공제 후`;
    const freqStr = freqLabel[freq] || `${freq}회/년 복리`;

    // Summary
    document.getElementById('result-summary').innerHTML = `
    <div class="summary-label">${years}년 후 최종 자산 (${rate}% / ${freqStr} / ${taxLabel})</div>
    <div class="summary-amount">${formatKRW(netFinal)}원</div>
    <div class="summary-sub">${getHumanReadable(netFinal)} | 총 투자원금: ${formatKRW(totalInvested)}원</div>
  `;

    // Compare
    document.getElementById('compare-grid').innerHTML = `
    <div class="compare-item compound-type">
      <div class="compare-type">복리 (${freqStr})</div>
      <div class="compare-final">${formatKRW(finalCompound)}원</div>
      <div class="compare-profit">+${formatKRW(grossProfit)}원 수익</div>
    </div>
    <div class="compare-item">
      <div class="compare-type">단리</div>
      <div class="compare-final">${formatKRW(finalSimple)}원</div>
      <div class="compare-profit">+${formatKRW(simpleProfit)}원 수익</div>
      <div class="compare-diff">복리 대비 ${formatKRW(finalCompound - finalSimple)}원 적음</div>
    </div>
  `;

    // Grid
    const items = [
        { label: '초기 투자 원금', val: formatKRW(initial) + '원' },
        { label: '월 추가 투자금', val: monthlyAdd > 0 ? formatKRW(monthlyAdd) + '원/월' : '없음' },
        { label: '총 투자 원금', val: formatKRW(totalInvested) + '원' },
        { label: '세전 수익', val: '+' + formatKRW(grossProfit) + '원', cls: 'positive' },
        { label: '세금 공제액', val: taxAmount > 0 ? '-' + formatKRW(taxAmount) + '원' : '없음', cls: taxAmount > 0 ? 'negative' : '' },
        { label: '세후 순수익', val: '+' + formatKRW(netProfit) + '원', cls: 'accent' },
        { label: '수익률', val: ((grossProfit / totalInvested) * 100).toFixed(1) + '%', cls: 'positive' },
        { label: '세후 최종 자산', val: formatKRW(netFinal) + '원', cls: 'large' },
    ];

    document.getElementById('result-grid').innerHTML = items.map(d =>
        `<div class="result-item">
      <div class="result-item-label">${d.label}</div>
      <div class="result-item-value ${d.cls || ''}">${d.val}</div>
    </div>`
    ).join('');

    // 72의 법칙
    document.getElementById('rule72-box').innerHTML = `
    <div class="rule72-icon">🔢</div>
    <div class="rule72-text">
      <div class="rule72-title">72의 법칙 — 현재 수익률 기준</div>
      <div class="rule72-value">약 ${doublingYears}년마다 자산 2배!</div>
      <div class="rule72-desc">연 ${rate}%로 투자 시 72 ÷ ${rate} = ${doublingYears}년</div>
    </div>
  `;

    document.getElementById('result-compound').style.display = 'block';
  if (typeof addSaveImageButton === 'function') addSaveImageButton('result-compound');
    document.getElementById('growth-table-card').style.display = 'block';
    document.getElementById('result-compound').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderGrowthTable(yearlyData, totalInvested, taxRate) {
    const tbody = document.getElementById('growth-table-body');
    // 마일스톤: 원금 2배 되는 해
    const doubleMilestone = yearlyData.find(d => d.compound >= totalInvested * 2);

    tbody.innerHTML = yearlyData.map(d => {
        const profit = d.compound - d.totalInvested;
        const taxAmount = profit * (taxRate / 100);
        const netCompound = d.compound - taxAmount;
        const isMilestone = doubleMilestone && d.year === doubleMilestone.year;
        return `<tr class="${isMilestone ? 'milestone-row' : ''}">
      <td>${d.year}년${isMilestone ? ' 🎯' : ''}</td>
      <td>${formatKRW(d.totalInvested)}원</td>
      <td class="profit-cell">+${formatKRW(profit)}원</td>
      <td>${formatKRW(netCompound)}원</td>
      <td class="simple-cell">${formatKRW(d.simple)}원</td>
    </tr>`;
    }).join('');
}

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', function () {
    setupCommaInput('initial-amount', 'initial-amount-hint');
    setupCommaInput('monthly-add', 'monthly-add-hint', '없으면 0 또는 비워두세요');
    setupPeriodHint();

    document.querySelectorAll('#calculator input').forEach(el => {
        el.addEventListener('keydown', e => { if (e.key === 'Enter') calculateCompound(); });
    });
});
