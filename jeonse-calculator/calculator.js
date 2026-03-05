'use strict';
function fmt(n) { return Math.round(n).toLocaleString('ko-KR'); }
function parse(s) { return parseFloat(String(s).replace(/,/g, '')) || 0; }
function hr(n) { const v = Math.round(n); if (v >= 1e8) { const e = Math.floor(v / 1e8), m = Math.round((v % 1e8) / 1e4); return m ? `${e}억 ${m}만원` : `${e}억원`; } if (v >= 1e4) { const m = Math.floor(v / 1e4), r = v % 1e4; return r ? `${m}만 ${r.toLocaleString()}원` : `${m}만원`; } return `${v.toLocaleString()}원`; }
function setupComma(id, hintId) {
    const el = document.getElementById(id); if (!el) return;
    el.addEventListener('input', function () {
        const raw = this.value.replace(/[^0-9]/g, ''); const n = parseInt(raw, 10);
        if (!isNaN(n) && n > 0) { this.value = n.toLocaleString('ko-KR'); if (hintId) { const h = document.getElementById(hintId); if (h) { h.textContent = hr(n); h.className = 'form-hint formatted'; } } }
        else { this.value = raw; if (hintId) { const h = document.getElementById(hintId); if (h) { h.textContent = ''; h.className = 'form-hint'; } } }
    });
}
function switchTab(t) {
    document.querySelectorAll('.tab-btn').forEach((b, i) => { b.classList.remove('active'); });
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const map = { 'to-monthly': 0, 'to-deposit': 1, 'adjust': 2 };
    document.querySelectorAll('.tab-btn')[map[t]].classList.add('active');
    document.getElementById('panel-' + t).classList.add('active');
}
function resultHTML(items, notice = '') {
    return items.map(i => `<div class="result-item"><div class="result-item-label">${i.label}</div><div class="result-item-value ${i.cls || ''}">${i.val}</div></div>`).join('') + (notice ? `<div class="result-notice">${notice}</div>` : '');
}

function calcToMonthly() {
    const jeonse = parse(document.getElementById('tm-jeonse').value);
    const deposit = parse(document.getElementById('tm-deposit').value);
    const rate = parseFloat(document.getElementById('tm-rate').value) || 6;
    if (!jeonse) return alert('전세 보증금을 입력해 주세요.');
    if (deposit >= jeonse) return alert('전환 후 보증금은 전세 보증금보다 작아야 합니다.');
    const diff = jeonse - deposit;
    const monthly = diff * rate / 100 / 12;
    const legalMonthly = diff * 6 / 100 / 12;
    const el = document.getElementById('result-tm');
    document.getElementById('result-tm-content').innerHTML = `
    <div class="result-highlight"><div class="label">월 납부 금액 (전환율 ${rate}%)</div><div class="amount">${fmt(monthly)}원 / 월</div></div>
    <div class="result-grid">
      ${resultHTML([
        { label: '전세 보증금', val: fmt(jeonse) + '원' },
        { label: '전환 후 보증금', val: fmt(deposit) + '원' },
        { label: '전환 대상금액', val: fmt(diff) + '원' },
        { label: '적용 전환율', val: rate + '%' },
        { label: '월세 (전환)', val: fmt(monthly) + '원/월', cls: 'accent' },
        { label: '법정 전환율 기준 월세', val: fmt(legalMonthly) + '원/월', cls: rate > 6 ? 'negative' : '' },
    ])}
    </div>
    ${rate > 6 ? `<div class="result-notice">⚠️ 입력한 전환율(${rate}%)이 법정 상한(6%)을 초과합니다. 법정 기준 월세는 ${fmt(legalMonthly)}원입니다.</div>` : ''}
  `;
    el.style.display = 'block'; el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calcToDeposit() {
    const monthly = parse(document.getElementById('td-monthly').value);
    const deposit = parse(document.getElementById('td-deposit').value);
    const rate = parseFloat(document.getElementById('td-rate').value) || 6;
    if (!monthly) return alert('월세를 입력해 주세요.');
    const addDeposit = monthly * 12 / rate * 100;
    const totalJeonse = deposit + addDeposit;
    const el = document.getElementById('result-td');
    document.getElementById('result-td-content').innerHTML = `
    <div class="result-highlight"><div class="label">전세 환산 금액</div><div class="amount">${fmt(totalJeonse)}원</div></div>
    <div class="result-grid">
      ${resultHTML([
        { label: '현재 월세', val: fmt(monthly) + '원/월' },
        { label: '현재 보증금', val: fmt(deposit) + '원' },
        { label: '월세 전환 금액', val: fmt(addDeposit) + '원' },
        { label: '전세 환산 총액', val: fmt(totalJeonse) + '원', cls: 'large' },
        { label: '연간 월세 총액', val: fmt(monthly * 12) + '원' },
    ])}
    </div>
    <div class="result-notice">전세 환산 금액 = 보증금 + (월세 × 12 ÷ 전환율 × 100)</div>
  `;
    el.style.display = 'block'; el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calcAdjust() {
    const curMonthly = parse(document.getElementById('adj-current-monthly').value);
    const curDeposit = parse(document.getElementById('adj-current-deposit').value);
    const newDeposit = parse(document.getElementById('adj-new-deposit').value);
    const rate = parseFloat(document.getElementById('adj-rate').value) || 6;
    if (!curMonthly) return alert('현재 월세를 입력해 주세요.');
    if (!newDeposit) return alert('변경 후 보증금을 입력해 주세요.');
    const depositDiff = newDeposit - curDeposit;
    const monthlyChange = depositDiff * rate / 100 / 12;
    const newMonthly = curMonthly - monthlyChange;
    const el = document.getElementById('result-adj');
    const isUp = depositDiff > 0;
    document.getElementById('result-adj-content').innerHTML = `
    <div class="result-highlight"><div class="label">변경 후 월세</div><div class="amount">${fmt(Math.max(0, newMonthly))}원 / 월</div></div>
    <div class="result-grid">
      ${resultHTML([
        { label: '현재 월세', val: fmt(curMonthly) + '원/월' },
        { label: '현재 보증금', val: fmt(curDeposit) + '원' },
        { label: '변경 후 보증금', val: fmt(newDeposit) + '원' },
        { label: '보증금 변동', val: (isUp ? '+' : '') + fmt(depositDiff) + '원', cls: isUp ? 'positive' : 'negative' },
        { label: '월세 변동', val: (isUp ? '-' : '+') + fmt(Math.abs(monthlyChange)) + '원', cls: isUp ? 'accent' : 'negative' },
        { label: '변경 후 월세', val: fmt(Math.max(0, newMonthly)) + '원/월', cls: 'large' },
    ])}
    </div>
  `;
    el.style.display = 'block'; el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.addEventListener('DOMContentLoaded', function () {
    setupComma('tm-jeonse', 'tm-jeonse-hint'); setupComma('tm-deposit', 'tm-deposit-hint');
    setupComma('td-monthly', 'td-monthly-hint'); setupComma('td-deposit', 'td-deposit-hint');
    setupComma('adj-current-monthly'); setupComma('adj-current-deposit'); setupComma('adj-new-deposit');
});
