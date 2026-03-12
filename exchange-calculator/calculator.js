"use strict";
const fmt = (n) => Math.round(n).toLocaleString("ko-KR");
const fmtF = (n) => n.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
const parse = (s) => parseFloat(String(s).replace(/,/g, "")) || 0;

const CURRENCIES = [
  { code: "USD", label: "미국 달러", symbol: "$", jpyBase: false },
  { code: "JPY", label: "일본 엔화 (100엔)", symbol: "¥", jpyBase: true },
  { code: "EUR", label: "유로", symbol: "€", jpyBase: false },
  { code: "CNY", label: "중국 위안화", symbol: "¥", jpyBase: false },
  { code: "GBP", label: "영국 파운드", symbol: "£", jpyBase: false },
  { code: "VND", label: "베트남 동 (1000동)", symbol: "₫", jpyBase: true },
];

function getRate(code) {
  return parseFloat(document.getElementById("rate-" + code).value) || 0;
}

// 1 unit of foreign currency → KRW
function toKRW(code) {
  const r = getRate(code);
  const c = CURRENCIES.find((c) => c.code === code);
  return c.jpyBase ? r / 100 : r; // JPY/VND: per 100 or 1000
}

async function fetchLiveRates() {
  const badge = document.getElementById("live-rate-badge");
  if (!badge) return;
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/KRW");
    if (!response.ok) throw new Error("API Error");
    const data = await response.json();

    const timestamp = data.time_last_update_unix * 1000;
    const date = new Date(timestamp);
    const formattedDate =
      date.toLocaleDateString("ko-KR") +
      " " +
      date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

    const rates = data.rates;
    const updateInput = (code, multiplier) => {
      const el = document.getElementById("rate-" + code);
      if (el && rates[code]) {
        const krwPerUnit = multiplier / rates[code];
        el.value = krwPerUnit.toFixed(2);
      }
    };

    updateInput("USD", 1);
    updateInput("JPY", 100);
    updateInput("EUR", 1);
    updateInput("CNY", 1);
    updateInput("GBP", 1);
    updateInput("VND", 1000);

    badge.className = "badge success";
    badge.textContent = `🟢 실시간 연동 완료 (${formattedDate} 기준)`;

    // Also trigger currency calculation if fields are filled (optional, doing it silently is fine)
  } catch (error) {
    console.error("Failed to fetch live rates:", error);
    badge.className = "badge error";
    badge.textContent = "🔴 실시간 연동 실패 (기본값 사용)";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetchLiveRates();
  const el = document.getElementById("ex-amount");
  if (el)
    el.addEventListener("input", function () {
      const raw = this.value.replace(/[^0-9]/g, "");
      const n = parseInt(raw, 10);
      this.value = !isNaN(n) && n > 0 ? n.toLocaleString("ko-KR") : raw;
      const h = document.getElementById("ex-amount-hint");
      if (h && !isNaN(n) && n > 0) {
        if (n >= 1e8) {
          const e = Math.floor(n / 1e8);
          h.textContent = `${e}억원`;
        } else if (n >= 1e4) h.textContent = `${Math.floor(n / 1e4)}만원`;
        else h.textContent = "";
      }
    });

  document.querySelectorAll('input[name="ex-dir"]').forEach((r) =>
    r.addEventListener("change", function () {
      const toKrw = this.value === "to-krw";
      document.getElementById("ex-amount-unit").textContent = toKrw
        ? "외화"
        : "원";
      document.getElementById("ex-currency-group").style.display = toKrw
        ? "flex"
        : "none";
      document.getElementById("ex-amount-hint").textContent = "";
      document.getElementById("ex-amount").value = "";
      document.getElementById("ex-amount").placeholder = toKrw
        ? "1,000"
        : "1,000,000";
    }),
  );
});

function calcExchange() {
  const amountRaw = parse(document.getElementById("ex-amount").value);
  const dir = document.querySelector('input[name="ex-dir"]:checked').value;
  const fee = parseFloat(document.getElementById("ex-fee").value) || 0;
  if (!amountRaw) return alert("금액을 입력해 주세요.");

  const el = document.getElementById("result-ex");

  if (dir === "from-krw") {
    // 원화 → 각국 통화 동시계산
    const krw = amountRaw;
    const cardsHTML = CURRENCIES.map((c) => {
      const ratePerUnit = toKRW(c.code);
      if (!ratePerUnit) return "";
      const rateWithFee = rateWithFeeCalc(ratePerUnit, fee, "buy");
      const foreign = krw / rateWithFee;
      const noFeeAmt = krw / ratePerUnit;
      return `<div class="currency-card">
        <div class="cc-name">${c.code} ${c.label}</div>
        <div class="cc-rate">${c.symbol}${fmtF(foreign)}</div>
        <div class="cc-amount">수수료 없을 시: ${c.symbol}${fmtF(noFeeAmt)}</div>
      </div>`;
    }).join("");

    document.getElementById("result-ex-content").innerHTML = `
      <div class="result-summary-box"><div class="summary-label">원화 ${fmt(krw)}원 → 각 통화 (수수료 ${fee}% 포함)</div><div class="summary-amount">아래 환산표 확인</div></div>
      <div class="currency-grid">${cardsHTML}</div>
      <div class="result-grid">
        <div class="result-item"><div class="result-item-label">환전 금액</div><div class="result-item-value">${fmt(krw)}원</div></div>
        <div class="result-item"><div class="result-item-label">수수료율</div><div class="result-item-value">${fee}%</div></div>
        <div class="result-item"><div class="result-item-label">수수료 금액</div><div class="result-item-value negative">-${fmt((krw * fee) / 100)}원</div></div>
        <div class="result-item"><div class="result-item-label">실제 환전 금액</div><div class="result-item-value accent">${fmt(krw * (1 - fee / 100))}원 상당</div></div>
      </div>
      <div class="result-notice">※ 실제 환율은 금융기관마다 다르며 변동됩니다. 계산 전 최신 환율을 위에서 직접 수정하세요.</div>
    `;
  } else {
    // 외화 → 원화
    const code = document.getElementById("ex-currency").value;
    const cur = CURRENCIES.find((c) => c.code === code);
    const ratePerUnit = toKRW(code);
    const rateWithFee = rateWithFeeCalc(ratePerUnit, fee, "sell");
    const krwAmount = amountRaw * rateWithFee;
    const noFeeKrw = amountRaw * ratePerUnit;

    document.getElementById("result-ex-content").innerHTML = `
      <div class="exchange-display">
        <div class="ex-from"><div class="ex-amount">${cur.symbol}${fmtF(amountRaw)}</div><div class="ex-currency">${code} ${cur.label}</div></div>
        <div class="ex-arrow">→</div>
        <div class="ex-to"><div class="ex-amount">${fmt(krwAmount)}원</div><div class="ex-currency">KRW (수수료 ${fee}% 포함)</div></div>
      </div>
      <div class="result-grid">
        <div class="result-item"><div class="result-item-label">외화 금액</div><div class="result-item-value">${cur.symbol}${fmtF(amountRaw)}</div></div>
        <div class="result-item"><div class="result-item-label">적용 환율 (1${code})</div><div class="result-item-value">${fmt(ratePerUnit)}원</div></div>
        <div class="result-item"><div class="result-item-label">수수료 ${fee}%</div><div class="result-item-value negative">-${fmt(noFeeKrw - krwAmount)}원</div></div>
        <div class="result-item"><div class="result-item-label">실수령 원화</div><div class="result-item-value large">${fmt(krwAmount)}원</div></div>
        <div class="result-item"><div class="result-item-label">수수료 없을 시</div><div class="result-item-value">${fmt(noFeeKrw)}원</div></div>
        <div class="result-item"><div class="result-item-label">수수료 절약 (온라인)</div><div class="result-item-value positive">+${fmt(noFeeKrw - amountRaw * rateWithFeeCalc(ratePerUnit, 0.5, "sell"))}원</div></div>
      </div>
      <div class="result-notice">※ 온라인 환전(수수료 0.5% 기준) 시 약 ${fmt(noFeeKrw - amountRaw * rateWithFeeCalc(ratePerUnit, 0.5, "sell"))}원 절약 가능합니다.</div>
    `;
  }

  el.style.display = "block";
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function rateWithFeeCalc(baseRate, feePct, dir) {
  // buy: 원화→외화, 비싸게 사야 함 → 환율 높게 적용 (= 외화 적게 받음)
  // sell: 외화→원화, 원화 적게 받음
  return dir === "buy"
    ? baseRate * (1 + feePct / 100)
    : baseRate * (1 - feePct / 100);
}
