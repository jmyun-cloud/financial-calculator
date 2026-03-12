'use strict';
const fmt = n => Math.round(n).toLocaleString('ko-KR');
const parse = s => parseFloat(String(s).replace(/,/g, '')) || 0;
function hr(n) { const v = Math.round(n); if (v >= 1e8) { const e = Math.floor(v / 1e8), m = Math.round((v % 1e8) / 1e4); return m ? `${e}억 ${m}만원` : `${e}억원`; } if (v >= 1e4) return `${Math.floor(v / 1e4)}만원`; return `${v.toLocaleString()}원`; }
function setupComma(id, hintId) { const el = document.getElementById(id); if (!el) return; el.addEventListener('input', function () { const raw = this.value.replace(/[^0-9]/g, ''); const n = parseInt(raw, 10); this.value = (!isNaN(n) && n > 0) ? n.toLocaleString('ko-KR') : raw; if (hintId) { const h = document.getElementById(hintId); if (h) h.textContent = (!isNaN(n) && n > 0) ? hr(n) : ''; } }); }
function switchTab(t) { const map = { future: 0, present: 1, 'real-return': 2 }; document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === map[t])); document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active')); document.getElementById('panel-' + t).classList.add('active'); }
function grid(items) { return `<div class="result-grid">${items.map(i => `<div class="result-item"><div class="result-item-label">${i.l}</div><div class="result-item-value ${i.c || ''}">${i.v}</div></div>`).join('')}</div>`; }

function calcFuture() {
    const amount = parse(document.getElementById('fv-amount').value);
    const rate = parseFloat(document.getElementById('fv-rate').value) || 3;
    const years = parseInt(document.getElementById('fv-years').value) || 20;
    if (!amount) return alert('현재 금액을 입력해 주세요.');
    const future = amount * Math.pow(1 + rate / 100, years);
    const increase = future - amount;
    const el = document.getElementById('result-fv');
    document.getElementById('result-fv-content').innerHTML = `
    <div class="result-summary-box"><div class="summary-label">${years}년 후 필요 금액 (물가상승률 ${rate}%)</div><div class="summary-amount">${fmt(future)}원</div><div class="summary-sub">현재 ${fmt(amount)}원 → ${years}년 후 ${hr(future)} 필요</div></div>
    ${grid([
        { l: '현재 금액', v: fmt(amount) + '원' }, { l: '물가상승률', v: rate + '%/년' },
        { l: '기간', v: years + '년' }, { l: '물가 상승분', v: '+' + fmt(increase) + '원', c: 'negative' },
        { l: '미래 필요금액', v: fmt(future) + '원', c: 'large' }, { l: '구매력 유지 비율', v: '100%' },
    ])}
    <div class="result-notice">매년 지출이 물가 상승률만큼 늘어난다는 가정 하에 미래에 동일한 생활 수준을 유지하기 위해 필요한 금액입니다.</div>
  `;
    el.style.display = 'block'; el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (typeof addSaveImageButton === 'function') addSaveImageButton('result-fv');
}

function calcPresent() {
    const amount = parse(document.getElementById('pv-amount').value);
    const rate = parseFloat(document.getElementById('pv-rate').value) || 3;
    const years = parseInt(document.getElementById('pv-years').value) || 20;
    if (!amount) return alert('현재 금액을 입력해 주세요.');
    const realValue = amount / Math.pow(1 + rate / 100, years);
    const lost = amount - realValue;
    const pct = (realValue / amount * 100).toFixed(1);
    const el = document.getElementById('result-pv');
    document.getElementById('result-pv-content').innerHTML = `
    <div class="result-summary-box"><div class="summary-label">${years}년 후 실질 구매력 (물가 ${rate}%/년)</div><div class="summary-amount">${fmt(realValue)}원 상당</div><div class="summary-sub">현재 구매력의 ${pct}%만 남음 | ${hr(lost)} 가치 하락</div></div>
    ${grid([
        { l: '현재 보유 금액', v: fmt(amount) + '원' }, { l: '물가상승률', v: rate + '%/년' },
        { l: '기간', v: years + '년' }, { l: '가치 하락분', v: '-' + fmt(lost) + '원', c: 'negative' },
        { l: '실질 구매력', v: fmt(realValue) + '원 상당', c: 'accent' }, { l: '구매력 유지율', v: pct + '%', c: 'large' },
    ])}
    <div class="result-notice">지금 ${fmt(amount)}원을 현금으로 보유만 하면 ${years}년 후에는 ${hr(realValue)} 가치밖에 없습니다. 물가상승률 이상의 수익이 필요합니다.</div>
  `;
    el.style.display = 'block'; el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calcRealReturn() {
    const nominal = parseFloat(document.getElementById('rr-nominal').value) || 0;
    const inflation = parseFloat(document.getElementById('rr-inflation').value) || 3;
    const amount = parse(document.getElementById('rr-amount').value);
    const years = parseInt(document.getElementById('rr-years').value) || 10;
    if (!nominal) return alert('명목 수익률을 입력해 주세요.');
    const real = ((1 + nominal / 100) / (1 + inflation / 100) - 1) * 100;
    const nominalFinal = amount ? amount * Math.pow(1 + nominal / 100, years) : 0;
    const realFinal = amount ? amount * Math.pow(1 + real / 100, years) : 0;
    const el = document.getElementById('result-rr');
    document.getElementById('result-rr-content').innerHTML = `
    <div class="result-summary-box"><div class="summary-label">실질 수익률 (명목 ${nominal}% - 물가 ${inflation}%)</div><div class="summary-amount">${real >= 0 ? '+' : ''}${real.toFixed(2)}%</div><div class="summary-sub">${real >= 0 ? '물가를 이기는 실질 수익' : '⚠️ 구매력 감소 중 — 물가를 이기지 못하는 투자'}</div></div>
    ${grid([
        { l: '명목 수익률', v: nominal + '%' }, { l: '물가상승률', v: inflation + '%' },
        { l: '실질 수익률', v: (real >= 0 ? '+' : '') + real.toFixed(2) + '%', c: real >= 0 ? 'positive' : 'negative' },
        ...(amount ? [{ l: '투자 원금', v: fmt(amount) + '원' }, { l: years + '년 후 명목 자산', v: fmt(nominalFinal) + '원', c: 'accent' }, { l: years + '년 후 실질 가치', v: fmt(realFinal) + '원', c: 'large' }] : []),
    ])}
    <div class="result-notice">실질수익률 = (1+명목수익률) ÷ (1+물가상승률) - 1. 인플레이션 차감 후 실제 구매력 증가분입니다.</div>
  `;
    el.style.display = 'block'; el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.addEventListener('DOMContentLoaded', function () {
    setupComma('fv-amount', 'fv-amount-hint');
    setupComma('pv-amount', 'pv-amount-hint');
    setupComma('rr-amount');
});
