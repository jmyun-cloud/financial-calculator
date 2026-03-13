/* =========================================
   금융계산기.kr - Calculator Logic
   예적금 만기 수령액 계산기
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

// ===== 숫자 포매팅 =====
function formatKRW(num) {
  return Math.round(num).toLocaleString('ko-KR');
}

function parseAmount(str) {
  return parseFloat(String(str).replace(/,/g, '')) || 0;
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

// ===== 이자소득세율 =====
function getTaxRate(taxType) {
  if (taxType === 'preferred') return 0.099;
  if (taxType === 'exempt') return 0;
  return 0.154; // 일반과세
}

// ===== 천 단위 콤마 입력 처리 =====
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

// ===== 차트 인스턴스 관리 =====
const chartInstances = {};

function renderDonutChart(canvasId, legendId, principal, interest, tax) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  const netInterest = Math.max(0, interest - tax);

  const data = {
    labels: ['원금', '세후이자', '이자소득세'],
    datasets: [{
      data: [principal, netInterest, tax],
      backgroundColor: ['#1a56e8', '#00c9a7', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 8,
    }]
  };

  chartInstances[canvasId] = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return ' ' + formatKRW(ctx.parsed) + '원';
            }
          }
        }
      },
      animation: { animateScale: true, duration: 600 }
    }
  });

  // 커스텀 범례
  const legend = document.getElementById(legendId);
  const colors = ['#1a56e8', '#00c9a7', '#ef4444'];
  const vals = [principal, netInterest, tax];
  const labels = ['원금', '세후 이자', '이자소득세'];
  legend.innerHTML = labels.map((label, i) =>
    `<div class="legend-item">
      <span class="legend-dot" style="background:${colors[i]}"></span>
      <div class="legend-info">
        <span class="legend-label">${label}</span>
        <span class="legend-val">${formatKRW(vals[i])}원</span>
      </div>
    </div>`
  ).join('');
}

// ===== 유효성 검사 =====
function validateInput(value, label) {
  if (!value || value <= 0) {
    return `${label}을(를) 올바르게 입력해 주세요.`;
  }
  return null;
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  if (input) {
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 2000);
  }
  alert(message);
}

// ===== 예금 계산 =====
function calculateDeposit(skipHistory = false) {
  const principalRaw = parseAmount(document.getElementById('d-principal').value);
  const rate = parseFloat(document.getElementById('d-rate').value);
  const period = parseInt(document.getElementById('d-period').value, 10);
  const interestType = document.querySelector('input[name="d-interest-type"]:checked').value;
  const taxType = document.querySelector('input[name="d-tax-type"]:checked').value;

  // 검사
  if (!principalRaw || principalRaw <= 0) return showError('d-principal', '예치 원금을 올바르게 입력해 주세요.');
  if (!rate || rate <= 0 || rate > 100) return showError('d-rate', '연이율을 올바르게 입력해 주세요. (0.01 ~ 100%)');
  if (!period || period <= 0 || period > 600) return showError('d-period', '예치 기간을 올바르게 입력해 주세요. (1 ~ 600개월)');

  const monthlyRate = rate / 100 / 12;
  const annualRate = rate / 100;
  const years = period / 12;

  let maturity = 0;
  if (interestType === 'simple') {
    maturity = principalRaw * (1 + annualRate * years);
  } else {
    // 월복리
    maturity = principalRaw * Math.pow(1 + monthlyRate, period);
  }

  const grossInterest = maturity - principalRaw;
  const taxRate = getTaxRate(taxType);
  const taxAmount = grossInterest * taxRate;
  const netInterest = grossInterest - taxAmount;
  const netMaturity = principalRaw + netInterest;

  displayDepositResult(principalRaw, grossInterest, taxAmount, netInterest, netMaturity, rate, period, interestType, taxType);

  // 이력 저장
  if (!skipHistory && window.HistoryManager) {
    HistoryManager.save('savings', {
      subType: 'deposit',
      inputs: { principal: principalRaw, rate, period, interestType, taxType },
      result: netMaturity,
      totalInterest: netInterest,
      interestLabel: document.querySelector(`input[name="d-interest-type"][value="${interestType}"]`).parentElement.textContent.trim(),
      taxLabel: document.querySelector(`input[name="d-tax-type"][value="${taxType}"]`).parentElement.textContent.trim()
    });
    renderHistory();
  }
}

function displayDepositResult(principal, grossInterest, taxAmount, netInterest, netMaturity, rate, period, interestType, taxType) {
  const summaryEl = document.getElementById('result-deposit-summary');
  const gridEl = document.getElementById('result-deposit-grid');

  const taxLabel = taxType === 'exempt' ? '비과세' : taxType === 'preferred' ? '세금우대(9.9%)' : '일반과세(15.4%)';
  const interestLabel = interestType === 'simple' ? '단리' : '월복리';

  summaryEl.innerHTML = `
    <div class="summary-label">만기 세후 수령액 (${period}개월 / ${rate}% / ${interestLabel} / ${taxLabel})</div>
    <div class="summary-amount">${formatKRW(netMaturity)}원</div>
    <div class="summary-sub">${getHumanReadable(netMaturity)}</div>
  `;

  gridEl.innerHTML = `
    <div class="result-item">
      <div class="result-item-label">예치 원금</div>
      <div class="result-item-value">${formatKRW(principal)}원</div>
    </div>
    <div class="result-item">
      <div class="result-item-label">세전 이자</div>
      <div class="result-item-value positive">+${formatKRW(grossInterest)}원</div>
    </div>
    <div class="result-item">
      <div class="result-item-label">이자소득세</div>
      <div class="result-item-value negative">−${formatKRW(taxAmount)}원</div>
    </div>
    <div class="result-item">
      <div class="result-item-label">세후 이자</div>
      <div class="result-item-value accent">+${formatKRW(netInterest)}원</div>
    </div>
    <div class="result-item" style="grid-column: span 2">
      <div class="result-item-label">세후 만기 수령액</div>
      <div class="result-item-value large">${formatKRW(netMaturity)}원</div>
    </div>
  `;

  const result = document.getElementById('result-deposit');
  result.style.display = 'block';
  if (typeof addSaveImageButton === 'function') addSaveImageButton('result-deposit');
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  renderDonutChart('chart-deposit', 'legend-deposit', principal, grossInterest, taxAmount);
}

// ===== 적금 계산 =====
function calculateInstallment(skipHistory = false) {
  const monthlyRaw = parseAmount(document.getElementById('i-monthly').value);
  const rate = parseFloat(document.getElementById('i-rate').value);
  const period = parseInt(document.getElementById('i-period').value, 10);
  const interestType = document.querySelector('input[name="i-interest-type"]:checked').value;
  const taxType = document.querySelector('input[name="i-tax-type"]:checked').value;

  // 검사
  if (!monthlyRaw || monthlyRaw <= 0) return showError('i-monthly', '월 납입액을 올바르게 입력해 주세요.');
  if (!rate || rate <= 0 || rate > 100) return showError('i-rate', '연이율을 올바르게 입력해 주세요. (0.01 ~ 100%)');
  if (!period || period <= 0 || period > 600) return showError('i-period', '납입 기간을 올바르게 입력해 주세요. (1 ~ 600개월)');

  const monthlyRate = rate / 100 / 12;
  const totalPrincipal = monthlyRaw * period;
  let grossInterest = 0;

  if (interestType === 'simple') {
    // 단리 적금: 월초 납입 기준 n*(n+1)/2 공식
    // 1회차가 (n)개월 이자, 마지막 회차가 1개월 이자
    grossInterest = monthlyRaw * (rate / 100 / 12) * period * (period + 1) / 2;
  } else {
    // 월복리 적금
    for (let i = 1; i <= period; i++) {
      const remainingMonths = period - i;
      const futureValue = monthlyRaw * Math.pow(1 + monthlyRate, remainingMonths);
      grossInterest += futureValue - monthlyRaw;
    }
  }

  const taxRate = getTaxRate(taxType);
  const taxAmount = grossInterest * taxRate;
  const netInterest = grossInterest - taxAmount;
  const netMaturity = totalPrincipal + netInterest;

  displayInstallmentResult(totalPrincipal, monthlyRaw, grossInterest, taxAmount, netInterest, netMaturity, rate, period, interestType, taxType);

  // 이력 저장
  if (!skipHistory && window.HistoryManager) {
    HistoryManager.save('savings', {
      subType: 'installment',
      inputs: { monthly: monthlyRaw, rate, period, interestType, taxType },
      result: netMaturity,
      totalInterest: netInterest,
      interestLabel: document.querySelector(`input[name="i-interest-type"][value="${interestType}"]`).parentElement.textContent.trim(),
      taxLabel: document.querySelector(`input[name="i-tax-type"][value="${taxType}"]`).parentElement.textContent.trim()
    });
    renderHistory();
  }
}

function displayInstallmentResult(totalPrincipal, monthly, grossInterest, taxAmount, netInterest, netMaturity, rate, period, interestType, taxType) {
  const summaryEl = document.getElementById('result-installment-summary');
  const gridEl = document.getElementById('result-installment-grid');

  const taxLabel = taxType === 'exempt' ? '비과세' : taxType === 'preferred' ? '세금우대(9.9%)' : '일반과세(15.4%)';
  const interestLabel = interestType === 'simple' ? '단리' : '월복리';

  summaryEl.innerHTML = `
    <div class="summary-label">만기 세후 수령액 (${period}개월 / ${rate}% / ${interestLabel} / ${taxLabel})</div>
    <div class="summary-amount">${formatKRW(netMaturity)}원</div>
    <div class="summary-sub">${getHumanReadable(netMaturity)}</div>
  `;

  gridEl.innerHTML = `
    <div class="result-item">
      <div class="result-item-label">월 납입액</div>
      <div class="result-item-value">${formatKRW(monthly)}원</div>
    </div>
    <div class="result-item">
      <div class="result-item-label">총 납입 원금</div>
      <div class="result-item-value">${formatKRW(totalPrincipal)}원</div>
    </div>
    <div class="result-item">
      <div class="result-item-label">세전 이자</div>
      <div class="result-item-value positive">+${formatKRW(grossInterest)}원</div>
    </div>
    <div class="result-item">
      <div class="result-item-label">이자소득세</div>
      <div class="result-item-value negative">−${formatKRW(taxAmount)}원</div>
    </div>
    <div class="result-item">
      <div class="result-item-label">세후 이자</div>
      <div class="result-item-value accent">+${formatKRW(netInterest)}원</div>
    </div>
    <div class="result-item">
      <div class="result-item-label">세후 만기 수령액</div>
      <div class="result-item-value large">${formatKRW(netMaturity)}원</div>
    </div>
  `;

  const result = document.getElementById('result-installment');
  result.style.display = 'block';
  if (typeof addSaveImageButton === 'function') addSaveImageButton('result-installment');
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  renderDonutChart('chart-installment', 'legend-installment', totalPrincipal, grossInterest, taxAmount);
}

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', function () {
  setupCommaInput('d-principal', 'd-principal-hint');
  setupCommaInput('i-monthly', 'i-monthly-hint');

  // Enter 키 계산
  document.getElementById('panel-deposit').querySelectorAll('input').forEach(el => {
    el.addEventListener('keydown', e => { if (e.key === 'Enter') calculateDeposit(); });
  });
  document.getElementById('panel-installment').querySelectorAll('input').forEach(el => {
    el.addEventListener('keydown', e => { if (e.key === 'Enter') calculateInstallment(); });
  });

  renderHistory();
});

// ===== 히스토리 기능 =====
function renderHistory() {
  if (!window.HistoryManager) return;
  const history = HistoryManager.get('savings');
  const container = document.getElementById('calc-history');
  const list = document.getElementById('history-list');

  if (!history || history.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  list.innerHTML = history.map(item => {
    const date = new Date(item.timestamp);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    const isDeposit = item.subType === 'deposit';
    const label = isDeposit ? '예금' : '적금';
    const icon = isDeposit ? '🏦' : '💰';

    // 원금 라벨링
    const principalValue = isDeposit ? item.inputs.principal : (item.inputs.monthly * item.inputs.period);
    const principalTitle = isDeposit ? '예치 원금' : '총 납입원금';
    const titleStr = `${principalTitle}: ${formatKRW(principalValue)}원`;

    return `
      <div class="history-item" onclick="loadHistoryItem(${item.timestamp})">
        <div class="history-main">
          <div class="history-icon">${icon}</div>
          <div class="history-content">
            <div class="history-title">${label} - ${titleStr}</div>
            <div class="history-tags">
              <span class="history-tag">${item.inputs.period}개월</span>
              <span class="history-tag">${item.inputs.rate}%</span>
              <span class="history-tag">${item.interestLabel}</span>
              <span class="history-tag">${item.taxLabel}</span>
            </div>
          </div>
        </div>
        <div class="history-right" onclick="event.stopPropagation()">
          <div class="history-result-box">
            <div class="history-result-row">
              <span class="history-result-label">만기 수령액</span>
              <span class="history-amount highlight">${formatKRW(item.result)}원</span>
            </div>
            <div class="history-result-row">
              <span class="history-result-label">총 이자(세후)</span>
              <span class="history-amount">${formatKRW(item.totalInterest)}원</span>
            </div>
            <div class="history-date">${dateStr}</div>
          </div>
          <button class="btn-delete-item" onclick="deleteHistoryItem(${item.timestamp})" title="삭제">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function deleteHistoryItem(timestamp) {
  if (confirm('이 기록을 삭제하시겠습니까?')) {
    HistoryManager.remove('savings', timestamp);
    renderHistory();
  }
}

function loadHistoryItem(timestamp) {
  const history = HistoryManager.get('savings');
  const item = history.find(h => h.timestamp === timestamp);
  if (!item) return;

  if (item.subType === 'deposit') {
    switchTab('deposit');
    document.getElementById('d-principal').value = item.inputs.principal.toLocaleString();
    document.getElementById('d-rate').value = item.inputs.rate;
    document.getElementById('d-period').value = item.inputs.period;
    document.querySelector(`input[name="d-interest-type"][value="${item.inputs.interestType}"]`).checked = true;
    document.querySelector(`input[name="d-tax-type"][value="${item.inputs.taxType}"]`).checked = true;

    // 힌트 갱신
    const hint = document.getElementById('d-principal-hint');
    if (hint) {
      hint.textContent = getHumanReadable(item.inputs.principal);
      hint.className = 'form-hint formatted';
    }

    calculateDeposit(true); // history 저장은 건너뜀
  } else {
    switchTab('installment');
    document.getElementById('i-monthly').value = item.inputs.monthly.toLocaleString();
    document.getElementById('i-rate').value = item.inputs.rate;
    document.getElementById('i-period').value = item.inputs.period;
    document.querySelector(`input[name="i-interest-type"][value="${item.inputs.interestType}"]`).checked = true;
    document.querySelector(`input[name="i-tax-type"][value="${item.inputs.taxType}"]`).checked = true;

    // 힌트 갱신
    const hint = document.getElementById('i-monthly-hint');
    if (hint) {
      hint.textContent = getHumanReadable(item.inputs.monthly);
      hint.className = 'form-hint formatted';
    }

    calculateInstallment(true);
  }

  // 결과 섹션으로 스크롤
  setTimeout(() => {
    const resultId = item.subType === 'deposit' ? 'result-deposit' : 'result-installment';
    const el = document.getElementById(resultId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

function clearHistory() {
  if (confirm('최근 계산 기록을 모두 삭제하시겠습니까?')) {
    HistoryManager.clear('savings');
    renderHistory();
  }
}
