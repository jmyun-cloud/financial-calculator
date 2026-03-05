'use strict';
const fmt = n => Math.round(n).toLocaleString('ko-KR');
const parse = s => parseFloat(String(s).replace(/,/g, '')) || 0;
function hr(n) { const v = Math.round(n); if (v >= 1e8) { const e = Math.floor(v / 1e8), m = Math.round((v % 1e8) / 1e4); return m ? `${e}억 ${m}만원` : `${e}억원`; } if (v >= 1e4) { const m = Math.floor(v / 1e4); return `${m}만원`; } return `${v.toLocaleString()}원`; }
function setupComma(id) { const el = document.getElementById(id); if (!el) return; el.addEventListener('input', function () { const raw = this.value.replace(/[^0-9]/g, ''); const n = parseInt(raw, 10); this.value = (!isNaN(n) && n > 0) ? n.toLocaleString('ko-KR') : raw; }); }
function switchTab(t) { const map = { national: 0, retirement: 1, personal: 2, total: 3 }; document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === map[t])); document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active')); document.getElementById('panel-' + t).classList.add('active'); }
function gridHTML(items) { return `<div class="result-grid">${items.map(i => `<div class="result-item"><div class="result-item-label">${i.l}</div><div class="result-item-value ${i.c || ''}">${i.v}</div></div>`).join('')}</div>`; }

// 국민연금 간이 계산
// 기준: 수령액 ≈ 평균소득 × 가입기간 × 0.01 (단순화된 공식)
// 실제: A+B*P/n 공식이나 더 복잡. 여기서는 국민연금공단 공개 간이식 사용
function calcNational() {
    const income = parse(document.getElementById('np-income').value);
    const years = parseInt(document.getElementById('np-years').value) || 0;
    const age = parseInt(document.getElementById('np-age').value) || 63;
    if (!income) return alert('월 평균 소득을 입력해 주세요.');
    if (years < 10) return alert('국민연금은 최소 10년 이상 가입해야 수령 가능합니다.');

    const A = 2856590; // 2024년 국민연금 전체 가입자 평균 소득월액(A값) 근사치
    const cappedIncome = Math.min(Math.max(income, 370000), 6170000);
    // 노령연금 기본 공식: (A+B)*P/40*0.5 유사 간이식
    // 실제는 (P>=20): 기본연금액 = 1.2*(A+B)/2*P/40
    const B = cappedIncome;
    const base = 1.2 * (A + B) / 2 * years / 40;
    // 조기/연기 조정
    let adj = 1;
    if (age < 63) adj = 1 - (63 - age) * 0.06;
    else if (age > 63) adj = 1 + (age - 63) * 0.072;
    const monthly = Math.round(base * adj);

    const el = document.getElementById('result-national');
    document.getElementById('result-national-content').innerHTML = `
    <div class="result-summary-box"><div class="summary-label">예상 국민연금 월 수령액 (${years}년 가입 / ${age}세 수령)</div><div class="summary-amount">${fmt(monthly)}원 / 월</div><div class="summary-sub">연: ${fmt(monthly * 12)}원 | ${hr(monthly * 12)}</div></div>
    ${gridHTML([
        { l: '평균 소득월액', v: fmt(cappedIncome) + '원' }, { l: '가입 기간', v: years + '년' },
        { l: '수령 시작 나이', v: age + '세' }, { l: '조기/연기 조정', v: age < 63 ? `-${(63 - age) * 6}%` : age > 63 ? `+${Math.round((age - 63) * 7.2)}%` : '기본(100%)' },
        { l: '연간 수령액', v: fmt(monthly * 12) + '원', c: 'accent' }, { l: '20년 총 수령액', v: fmt(monthly * 240) + '원', c: 'large' },
    ])}
    <div class="result-notice">국민연금 A값(전체 가입자 평균소득) 기준 간이 계산. 실제 수령액과 차이가 있을 수 있습니다.</div>
  `;
    el.style.display = 'block'; el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 퇴직연금
function calcRetirement() {
    const salary = parse(document.getElementById('rp-salary').value);
    const years = parseInt(document.getElementById('rp-years').value) || 0;
    const pYears = parseInt(document.getElementById('rp-pension-years').value) || 20;
    const rate = parseFloat(document.getElementById('rp-rate').value) || 3;
    if (!salary) return alert('월 급여를 입력해 주세요.');
    if (!years) return alert('근속 기간을 입력해 주세요.');

    const totalRetirement = salary * years; // 퇴직금 = 평균임금 × 30일 × 근속연수 = 월급 × 근속연수 (단순화)
    // 연금으로 수령 시 복리로 운용
    const mr = rate / 100 / 12;
    const mn = pYears * 12;
    const monthlyPension = mr > 0 ? totalRetirement * mr / (1 - Math.pow(1 + mr, -mn)) : totalRetirement / mn;

    const el = document.getElementById('result-retirement');
    document.getElementById('result-retirement-content').innerHTML = `
    <div class="result-summary-box"><div class="summary-label">예상 퇴직연금 월 수령액 (${pYears}년 분할)</div><div class="summary-amount">${fmt(monthlyPension)}원 / 월</div><div class="summary-sub">총 퇴직금: ${fmt(totalRetirement)}원 | ${hr(totalRetirement)}</div></div>
    ${gridHTML([
        { l: '퇴직 전 월 급여', v: fmt(salary) + '원' }, { l: '근속 기간', v: years + '년' },
        { l: '예상 총 퇴직금', v: fmt(totalRetirement) + '원', c: 'accent' }, { l: '연금 수령 기간', v: pYears + '년' },
        { l: '운용 수익률', v: rate + '%' }, { l: '월 수령액', v: fmt(monthlyPension) + '원', c: 'large' },
    ])}
  `;
    el.style.display = 'block'; el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 개인연금
function calcPersonal() {
    const monthly = parse(document.getElementById('pp-monthly').value);
    const accYears = parseInt(document.getElementById('pp-accumulate').value) || 25;
    const rate = parseFloat(document.getElementById('pp-rate').value) || 5;
    const recYears = parseInt(document.getElementById('pp-receive-years').value) || 20;
    if (!monthly) return alert('월 납입액을 입력해 주세요.');

    const mr = rate / 100 / 12;
    const mn = accYears * 12;
    const accumulated = mr > 0 ? monthly * (Math.pow(1 + mr, mn) - 1) / mr : monthly * mn;
    const rmr = rate / 100 / 12;
    const rmn = recYears * 12;
    const monthlyPension = rmr > 0 ? accumulated * rmr / (1 - Math.pow(1 + rmr, -rmn)) : accumulated / rmn;
    const totalInvested = monthly * 12 * accYears;

    const el = document.getElementById('result-personal');
    document.getElementById('result-personal-content').innerHTML = `
    <div class="result-summary-box"><div class="summary-label">개인연금 예상 월 수령액 (${recYears}년 수령)</div><div class="summary-amount">${fmt(monthlyPension)}원 / 월</div><div class="summary-sub">납입 원금: ${fmt(totalInvested)}원 → 적립: ${fmt(accumulated)}원</div></div>
    ${gridHTML([
        { l: '월 납입액', v: fmt(monthly) + '원' }, { l: '납입 기간', v: accYears + '년' },
        { l: '총 납입 원금', v: fmt(totalInvested) + '원' }, { l: '예상 적립액', v: fmt(accumulated) + '원', c: 'accent' },
        { l: '수령 기간', v: recYears + '년' }, { l: '월 수령액', v: fmt(monthlyPension) + '원', c: 'large' },
    ])}
    <div class="result-notice">연간 세액공제 한도: 연금저축 600만원 + IRP 300만원 = 합산 900만원. 총급여 5,500만원 이하 16.5% 공제.</div>
  `;
    el.style.display = 'block'; el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 통합 분석
function calcTotal() {
    const national = parse(document.getElementById('tot-national').value);
    const retirement = parse(document.getElementById('tot-retirement').value);
    const personal = parse(document.getElementById('tot-personal').value);
    const need = parse(document.getElementById('tot-need').value);
    if (!need) return alert('월 필요 생활비를 입력해 주세요.');

    const total = national + retirement + personal;
    const diff = total - need;
    const pct = need > 0 ? (total / need * 100).toFixed(1) : 0;
    const colors = ['#0284c7', '#059669', '#7c3aed'];
    const bars = [{ l: '국민연금', v: national }, { l: '퇴직연금', v: retirement }, { l: '개인연금', v: personal }]
        .map((b, i) => `<div class="pension-bar-item"><div class="pension-bar-label">${b.l}</div><div class="pension-bar-track"><div class="pension-bar-fill" style="width:${need ? Math.min(100, b.v / need * 100) : 0}%;background:${colors[i]}"></div></div><div class="pension-bar-val">${fmt(b.v)}원</div></div>`).join('');

    const el = document.getElementById('result-total');
    document.getElementById('result-total-content').innerHTML = `
    <div class="pension-total-box"><div class="ptb-label">총 월 연금 수령액</div><div class="ptb-value">${fmt(total)}원 / 월</div><div class="ptb-sub">필요 생활비 대비 ${pct}% 충족</div></div>
    <div class="pension-bars">${bars}</div>
    <div class="${diff >= 0 ? 'shortfall-box surplus' : 'shortfall-box'}">
      ${diff >= 0
            ? `<strong>✅ 월 ${fmt(diff)}원 여유</strong><p style="font-size:.88rem;margin-top:6px;">예상 연금이 필요 생활비를 충분히 충당합니다.</p>`
            : `<strong>⚠️ 월 ${fmt(Math.abs(diff))}원 부족</strong><p style="font-size:.88rem;margin-top:6px;">부족분 충당을 위해 추가 저축 또는 개인연금 증액이 필요합니다. 지금부터 월 ${fmt(Math.abs(diff))}원 이상 추가 준비를 권장합니다.</p>`}
    </div>
    ${gridHTML([{ l: '국민연금', v: fmt(national) + '원' }, { l: '퇴직연금', v: fmt(retirement) + '원' }, { l: '개인연금', v: fmt(personal) + '원' }, { l: '총 수령액', v: fmt(total) + '원', c: 'accent' }, { l: '필요 생활비', v: fmt(need) + '원' }, { l: '월 여유/부족', v: (diff >= 0 ? '+' : '') + fmt(diff) + '원', c: diff >= 0 ? 'positive' : 'negative' },])}
  `;
    el.style.display = 'block'; el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.addEventListener('DOMContentLoaded', function () {
    ['np-income', 'rp-salary', 'pp-monthly', 'tot-national', 'tot-retirement', 'tot-personal', 'tot-need'].forEach(setupComma);
});
