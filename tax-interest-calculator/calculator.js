'use strict';
const fmt = n => Math.round(n).toLocaleString('ko-KR');
const parse = s => parseFloat(String(s).replace(/,/g, '')) || 0;
document.addEventListener('DOMContentLoaded', function () {
    const el = document.getElementById('ti-amount');
    if (el) el.addEventListener('input', function () {
        const raw = this.value.replace(/[^0-9]/g, ''); const n = parseInt(raw, 10);
        this.value = (!isNaN(n) && n > 0) ? n.toLocaleString('ko-KR') : raw;
        const h = document.getElementById('ti-amount-hint'); if (h) { if (n >= 1e8) { const e = Math.floor(n / 1e8); h.textContent = `${e}억원`; } else if (n >= 1e4) { h.textContent = `${Math.floor(n / 1e4)}만원`; } else h.textContent = ''; }
    });
});

function calcTaxInterest() {
    const P = parse(document.getElementById('ti-amount').value);
    const rate = parseFloat(document.getElementById('ti-rate').value) || 0;
    const months = parseInt(document.getElementById('ti-months').value) || 0;
    const type = document.querySelector('input[name="ti-type"]:checked').value;
    if (!P) return alert('원금을 입력해 주세요.');
    if (!rate || rate <= 0) return alert('연 이율을 입력해 주세요.');
    if (!months || months < 1) return alert('예치 기간을 입력해 주세요.');

    let grossInterest;
    if (type === 'simple') {
        grossInterest = P * rate / 100 * (months / 12);
    } else {
        const r = rate / 100 / 12;
        grossInterest = P * (Math.pow(1 + r, months) - 1);
    }

    const taxes = [
        { label: '일반과세', rate: 15.4, code: 'normal' },
        { label: '세금우대', rate: 9.9, code: 'preferred' },
        { label: '비과세', rate: 0, code: 'exempt' },
    ];

    const results = taxes.map(t => ({
        ...t, tax: grossInterest * t.rate / 100, net: grossInterest * (1 - t.rate / 100), total: P + grossInterest * (1 - t.rate / 100)
    }));
    const best = results.reduce((a, b) => b.net > a.net ? b : a);

    const compareHTML = results.map(r => `
    <div class="tax-compare-item${r.code === best.code ? ' best' : ''}">
      <div class="tc-label">${r.label} (${r.rate}%)</div>
      <div class="tc-net">${fmt(r.net)}원</div>
      <div class="tc-tax">세금: -${fmt(r.tax)}원</div>
      <div class="tc-badge">${r.code === best.code ? '✅ 가장 유리' : '대비 -' + fmt(best.net - r.net) + '원'}</div>
    </div>
  `).join('');

    const main = results[0];
    const el = document.getElementById('result-ti');
    document.getElementById('result-ti-content').innerHTML = `
    <div class="result-summary-box">
      <div class="summary-label">세전 이자 (${rate}% / ${months}개월 ${type === 'compound' ? '월복리' : '단리'})</div>
      <div class="summary-amount">${fmt(grossInterest)}원</div>
      <div class="summary-sub">원금: ${fmt(P)}원 | 세후 수령 합계: ${fmt(main.total)}원 (일반과세 기준)</div>
    </div>
    <h4 class="compare-title" style="margin-bottom:12px">💡 세금 유형별 비교</h4>
    <div class="tax-compare-grid">${compareHTML}</div>
    <div class="result-grid">
      <div class="result-item"><div class="result-item-label">원금</div><div class="result-item-value">${fmt(P)}원</div></div>
      <div class="result-item"><div class="result-item-label">세전 이자</div><div class="result-item-value accent">${fmt(grossInterest)}원</div></div>
      <div class="result-item"><div class="result-item-label">이자소득세 (15.4%)</div><div class="result-item-value negative">-${fmt(results[0].tax)}원</div></div>
      <div class="result-item"><div class="result-item-label">세후 이자 (일반)</div><div class="result-item-value">${fmt(results[0].net)}원</div></div>
      <div class="result-item"><div class="result-item-label">세금우대 절세액</div><div class="result-item-value positive">+${fmt(results[0].tax - results[1].tax)}원</div></div>
      <div class="result-item"><div class="result-item-label">비과세 시 절세액</div><div class="result-item-value positive large">+${fmt(results[0].tax)}원</div></div>
    </div>
  `;
    el.style.display = 'block'; el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
