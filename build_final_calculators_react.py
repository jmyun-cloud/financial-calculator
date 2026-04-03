import os

os.makedirs('v2-next/src/hooks', exist_ok=True)
os.makedirs('v2-next/src/components/calculators', exist_ok=True)
os.makedirs('v2-next/src/app/tax-interest-calculator', exist_ok=True)
os.makedirs('v2-next/src/app/inflation-calculator', exist_ok=True)
os.makedirs('v2-next/src/app/exchange-calculator', exist_ok=True)

# =========================================================================
# 1. TAX / INTEREST CALCULATOR
# =========================================================================

hooks_tax = """
import { useState } from 'react';

export function useTaxInterestCalculator() {
  const [taxResult, setTaxResult] = useState<any>(null);

  const calculate = (principal: number, rate: number, months: number, type: string) => {
    if (principal <= 0 || rate <= 0 || months <= 0) throw new Error("원금, 연이율, 기간을 올바르게 입력해주세요.");
    
    let grossInterest = 0;
    if (type === 'simple') {
      grossInterest = Math.floor(principal * (rate / 100) * (months / 12));
    } else {
      const r = rate / 100 / 12;
      grossInterest = Math.floor(principal * (Math.pow(1 + r, months) - 1));
    }

    const taxes = [
      { label: '일반과세', rate: 15.4, code: 'normal' },
      { label: '세금우대', rate: 9.9, code: 'preferred' },
      { label: '비과세', rate: 0, code: 'exempt' },
    ];

    const results = taxes.map(t => {
      const taxAmount = Math.floor((grossInterest * (t.rate / 100)) / 10) * 10;
      const net = grossInterest - taxAmount;
      return { ...t, taxAmount, net, total: principal + net };
    });

    const best = results.reduce((a, b) => b.net > a.net ? b : a);

    setTaxResult({ principal, rate, months, type, grossInterest, results, best });
  };

  return { taxResult, calculate };
}
"""
with open('v2-next/src/hooks/useTaxInterestCalculator.ts', 'w', encoding='utf-8') as f: f.write(hooks_tax)

ui_tax = """
"use client";
import { useState } from "react";
import { useTaxInterestCalculator } from "@/hooks/useTaxInterestCalculator";

export default function TaxInterestCalculator() {
  const { taxResult, calculate } = useTaxInterestCalculator();
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("3.5");
  const [months, setMonths] = useState("12");
  const [type, setType] = useState("simple");

  const formatKRW = (n: number) => Math.round(n).toLocaleString("ko-KR");
  const parseAmt = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
  const handleNum = (setter: any) => (e: any) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : "");
  };

  const onCalculate = () => {
    try { calculate(parseAmt(amount), parseFloat(rate), parseInt(months), type); } catch(e:any){alert(e.message);}
  };

  return (
    <div className="tab-panel active">
      <div className="calc-card">
        <h2 className="calc-card-title">예적금 이자 세금 계산기</h2>
        <div className="form-grid">
          <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">예치 원금</label><div className="input-wrap"><input type="text" className="form-input large-input" value={amount} onChange={handleNum(setAmount)} /><span className="input-unit">원</span></div></div>
          <div className="form-group"><label className="form-label">연 이자율</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={rate} onChange={e=>setRate(e.target.value)} /><span className="input-unit">%</span></div></div>
          <div className="form-group"><label className="form-label">예치 기간</label><div className="input-wrap"><input type="number" className="form-input" value={months} onChange={e=>setMonths(e.target.value)} /><span className="input-unit">개월</span></div></div>
          <div className="form-group" style={{gridColumn:'span 2', marginTop:'12px'}}><label className="form-label">계산 방식</label><div className="radio-group"><label className="radio-label"><input type="radio" checked={type==='simple'} onChange={()=>setType('simple')} /><span className="radio-custom"></span> 단리</label><label className="radio-label"><input type="radio" checked={type==='compound'} onChange={()=>setType('compound')} /><span className="radio-custom"></span> 복리</label></div></div>
        </div>
        <button className="calc-btn" onClick={onCalculate} style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'}}>⚡ 이자소득세 계산하기</button>
      </div>

      {taxResult && (
        <div className="result-card fade-in" style={{borderColor: '#10b981', marginTop:'20px'}}>
          <h3 className="result-title">💰 세금 유형별 비교 결과</h3>
          <div className="result-summary-box" style={{background:'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
            <div className="summary-label">세전 이자 ({taxResult.rate}% / {taxResult.months}개월 {taxResult.type==='compound'?'복리':'단리'})</div>
            <div className="summary-amount">{formatKRW(taxResult.grossInterest)}원</div>
          </div>
          
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginTop:'20px'}}>
            {taxResult.results.map((r:any) => (
              <div key={r.code} style={{padding:'15px', borderRadius:'12px', border:`2px solid ${r.code===taxResult.best.code?'#10b981':'var(--border)'}`, background:r.code===taxResult.best.code?'#10b98110':''}}>
                <div style={{fontWeight:700, color:r.code===taxResult.best.code?'#10b981':'var(--text-primary)'}}>{r.label} ({r.rate}%)</div>
                <div style={{fontSize:'1.2rem', fontWeight:800, margin:'10px 0'}}>{formatKRW(r.net)}원</div>
                <div style={{fontSize:'0.9rem', color:'var(--danger)'}}>세금: -{formatKRW(r.taxAmount)}원</div>
                <div style={{marginTop:'10px', fontSize:'0.85rem', color:r.code===taxResult.best.code?'#10b981':'var(--text-secondary)'}}>{r.code===taxResult.best.code?'✅ 가장 유리':`대비 -${formatKRW(taxResult.best.net - r.net)}원`}</div>
              </div>
            ))}
          </div>

          <table className="deduction-table" style={{marginTop:'30px'}}>
            <tbody>
              <tr><td>예치 원금</td><td style={{textAlign:'right'}}>{formatKRW(taxResult.principal)}원</td></tr>
              <tr><td>세전 이자</td><td style={{textAlign:'right', color:'#10b981'}}>+{formatKRW(taxResult.grossInterest)}원</td></tr>
              <tr><td>일반과세 이자소득세 (15.4%)</td><td style={{textAlign:'right', color:'var(--danger)'}}>-{formatKRW(taxResult.results[0].taxAmount)}원</td></tr>
              <tr style={{borderTop:'2px solid #10b981', background:'var(--surface-1)'}}><td style={{fontWeight:700}}>최종 세후 수령액 (일반)</td><td style={{textAlign:'right', fontWeight:700, color:'#10b981'}}>{formatKRW(taxResult.results[0].total)}원</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
"""
with open('v2-next/src/components/calculators/TaxInterestCalculator.tsx', 'w', encoding='utf-8') as f: f.write(ui_tax)

page_tax = """
import { Metadata } from "next";
import TaxInterestCalculator from "@/components/calculators/TaxInterestCalculator";

export const metadata: Metadata = {
  title: "세금우대 이자소득세 계산기 | 일반, 세금우대, 비과세 비교",
  description: "예적금 만기 시 부과되는 이자소득세를 15.4% 일반과세, 9.9% 세금우대, 비과세 조건으로 한눈에 비교 계산해 드립니다."
};

export default function TaxInterestPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)' }}>
        <div className="container"><div className="top-desc-inner"><h1 className="main-title">세금우대 이자 계산기</h1><p className="main-subtitle">내 예적금, 비과세나 세금우대를 받으면 <strong>진짜 내 손에 쥐어지는 돈(세후 수령액)</strong>이 어떻게 달라질까요?</p></div></div>
      </section>
      <main className="main-content"><div className="container content-grid"><section className="calculator-section"><TaxInterestCalculator /></section></div></main>
    </>
  );
}
"""
with open('v2-next/src/app/tax-interest-calculator/page.tsx', 'w', encoding='utf-8') as f: f.write(page_tax)



# =========================================================================
# 2. INFLATION CALCULATOR
# =========================================================================

hooks_inf = """
import { useState } from 'react';

export function useInflationCalculator() {
  const [fvResult, setFvResult] = useState<any>(null);
  const [pvResult, setPvResult] = useState<any>(null);
  const [rrResult, setRrResult] = useState<any>(null);

  const calcFuture = (amount: number, rate: number, years: number) => {
    if (amount <= 0) throw new Error("금액을 입력해주세요.");
    const future = amount * Math.pow(1 + rate / 100, years);
    setFvResult({ amount, rate, years, future, increase: future - amount });
  };

  const calcPresent = (amount: number, rate: number, years: number) => {
    if (amount <= 0) throw new Error("금액을 입력해주세요.");
    const realValue = amount / Math.pow(1 + rate / 100, years);
    setPvResult({ amount, rate, years, realValue, lost: amount - realValue, pct: (realValue / amount * 100).toFixed(1) });
  };

  const calcRealReturn = (amount: number, nominal: number, inflation: number, years: number) => {
    const real = ((1 + nominal / 100) / (1 + inflation / 100) - 1) * 100;
    const nominalFinal = amount ? amount * Math.pow(1 + nominal / 100, years) : 0;
    const realFinal = amount ? amount * Math.pow(1 + real / 100, years) : 0;
    setRrResult({ amount, nominal, inflation, years, real, nominalFinal, realFinal });
  };

  return { fvResult, pvResult, rrResult, calcFuture, calcPresent, calcRealReturn };
}
"""
with open('v2-next/src/hooks/useInflationCalculator.ts', 'w', encoding='utf-8') as f: f.write(hooks_inf)

ui_inf = """
"use client";
import { useState } from "react";
import { useInflationCalculator } from "@/hooks/useInflationCalculator";

export default function InflationCalculator() {
  const { fvResult, pvResult, rrResult, calcFuture, calcPresent, calcRealReturn } = useInflationCalculator();
  const [tab, setTab] = useState<'fv'|'pv'|'rr'>('fv');

  const [fvAmt, setFvAmt] = useState(""); const [fvRate, setFvRate] = useState("3.0"); const [fvYears, setFvYears] = useState("20");
  const [pvAmt, setPvAmt] = useState(""); const [pvRate, setPvRate] = useState("3.0"); const [pvYears, setPvYears] = useState("20");
  const [rrAmt, setRrAmt] = useState(""); const [rrNom, setRrNom] = useState("5.0"); const [rrInf, setRrInf] = useState("3.0"); const [rrYears, setRrYears] = useState("10");

  const formatKRW = (n: number) => Math.round(n).toLocaleString("ko-KR");
  const parseAmt = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
  const handleNum = (setter: any) => (e: any) => { const val = e.target.value.replace(/[^0-9]/g, ""); setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : ""); };

  const onFv = () => { try { calcFuture(parseAmt(fvAmt), parseFloat(fvRate)||0, parseInt(fvYears)||0); } catch(e:any){alert(e.message);} };
  const onPv = () => { try { calcPresent(parseAmt(pvAmt), parseFloat(pvRate)||0, parseInt(pvYears)||0); } catch(e:any){alert(e.message);} };
  const onRr = () => { try { calcRealReturn(parseAmt(rrAmt), parseFloat(rrNom)||0, parseFloat(rrInf)||0, parseInt(rrYears)||0); } catch(e:any){alert(e.message);} };

  const colors:any = { fv:'#f59e0b', pv:'#ef4444', rr:'#8b5cf6' };

  return (
    <div className="tab-panel active">
      <div className="tab-switcher" role="tablist">
        <button className={`tab-btn ${tab==='fv'?'active':''}`} onClick={()=>setTab('fv')} style={tab==='fv'?{background:'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow:'0 4px 12px #f59e0b50'}:{}}>미래 화폐가치</button>
        <button className={`tab-btn ${tab==='pv'?'active':''}`} onClick={()=>setTab('pv')} style={tab==='pv'?{background:'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow:'0 4px 12px #ef444450'}:{}}>현재 화폐가치</button>
        <button className={`tab-btn ${tab==='rr'?'active':''}`} onClick={()=>setTab('rr')} style={tab==='rr'?{background:'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', boxShadow:'0 4px 12px #8b5cf650'}:{}}>실질 수익률</button>
      </div>

      {tab === 'fv' && (
        <div className="calc-card">
          <h2 className="calc-card-title">미래 필요 금액 (인플레이션 반영)</h2>
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">현재 목표 금액</label><div className="input-wrap"><input type="text" className="form-input large-input" value={fvAmt} onChange={handleNum(setFvAmt)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">예상 물가상승률</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={fvRate} onChange={e=>setFvRate(e.target.value)} /><span className="input-unit">%</span></div></div>
            <div className="form-group"><label className="form-label">달성 소요 기간</label><div className="input-wrap"><input type="number" className="form-input" value={fvYears} onChange={e=>setFvYears(e.target.value)} /><span className="input-unit">년</span></div></div>
          </div>
          <button className="calc-btn" onClick={onFv} style={{background:'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>⚡ 금액 환산하기</button>
          {fvResult && (
            <div className="result-card fade-in" style={{borderColor: colors.fv, marginTop:'20px'}}>
              <h3 className="result-title">📈 미래 화폐가치 환산 결과</h3>
              <div className="result-summary-box" style={{background:`linear-gradient(135deg, ${colors.fv} 0%, #d97706 100%)`}}>
                <div className="summary-label">{fvResult.years}년 후 동일한 구매력을 유지하기 위한 금액</div>
                <div className="summary-amount">{formatKRW(fvResult.future)}원</div>
              </div>
              <div className="result-notice">물가상승 지출 방어를 위해 <strong>{formatKRW(fvResult.increase)}원</strong>이 미래에 더 필요합니다.</div>
            </div>
          )}
        </div>
      )}

      {tab === 'pv' && (
        <div className="calc-card">
          <h2 className="calc-card-title">목돈의 실질 구매력 하락 알리미</h2>
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">현재 보유 현금</label><div className="input-wrap"><input type="text" className="form-input large-input" value={pvAmt} onChange={handleNum(setPvAmt)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">예상 물가상승률</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={pvRate} onChange={e=>setPvRate(e.target.value)} /><span className="input-unit">%</span></div></div>
            <div className="form-group"><label className="form-label">기회비용 상실 기간</label><div className="input-wrap"><input type="number" className="form-input" value={pvYears} onChange={e=>setPvYears(e.target.value)} /><span className="input-unit">년</span></div></div>
          </div>
          <button className="calc-btn" onClick={onPv} style={{background:'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}}>⚡ 현재가치 환산하기</button>
          {pvResult && (
            <div className="result-card fade-in" style={{borderColor: colors.pv, marginTop:'20px'}}>
              <h3 className="result-title">🔻 자산 가치 하락 결과</h3>
              <div className="result-summary-box" style={{background:`linear-gradient(135deg, ${colors.pv} 0%, #dc2626 100%)`}}>
                <div className="summary-label">{pvResult.years}년 후 이 돈의 실질 가치</div>
                <div className="summary-amount">{formatKRW(pvResult.realValue)}원 상당</div>
              </div>
              <div className="result-notice">현재 상태로 현금을 쥐고 있으면 <strong>{formatKRW(pvResult.lost)}원</strong>어치의 구매력이 말소됩니다.</div>
            </div>
          )}
        </div>
      )}

      {tab === 'rr' && (
        <div className="calc-card">
          <h2 className="calc-card-title">인플레이션 반영 실질 수익률</h2>
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">투자기관 명시 내 수익률 (명목수익률)</label><div className="input-wrap"><input type="number" step="0.1" className="form-input large-input" value={rrNom} onChange={e=>setRrNom(e.target.value)} /><span className="input-unit">%</span></div></div>
            <div className="form-group"><label className="form-label">예상 물가상승률</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={rrInf} onChange={e=>setRrInf(e.target.value)} /><span className="input-unit">%</span></div></div>
            <div className="form-group"><label className="form-label">투자 기간</label><div className="input-wrap"><input type="number" className="form-input" value={rrYears} onChange={e=>setRrYears(e.target.value)} /><span className="input-unit">년</span></div></div>
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">투자 원금 (선택)</label><div className="input-wrap"><input type="text" className="form-input" value={rrAmt} onChange={handleNum(setRrAmt)} /><span className="input-unit">원</span></div></div>
          </div>
          <button className="calc-btn" onClick={onRr} style={{background:'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}}>⚡ 실질 수익률 확인하기</button>
          {rrResult && (
             <div className="result-card fade-in" style={{borderColor: colors.rr, marginTop:'20px'}}>
              <h3 className="result-title">🔮 실질 투자 결과</h3>
              <div className="result-summary-box" style={{background:`linear-gradient(135deg, ${colors.rr} 0%, #7c3aed 100%)`}}>
                <div className="summary-label">물가상승률을 체감한 진짜 수익률</div>
                <div className="summary-amount">{rrResult.real >= 0 ? '+' : ''}{rrResult.real.toFixed(2)}%</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'20px'}}>
                <div className="result-item"><div className="result-item-label">명목상 자산</div><div className="result-item-value">{formatKRW(rrResult.nominalFinal)}원</div></div>
                <div className="result-item"><div className="result-item-label">실질적 부의 증식 기준자산</div><div className="result-item-value" style={{color:colors.rr}}>{formatKRW(rrResult.realFinal)}원</div></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
"""
with open('v2-next/src/components/calculators/InflationCalculator.tsx', 'w', encoding='utf-8') as f: f.write(ui_inf)

page_inf = """
import { Metadata } from "next";
import InflationCalculator from "@/components/calculators/InflationCalculator";

export const metadata: Metadata = {
  title: "인플레이션 화폐가치 계산기 | 물가상승 실질수익률 미래가치",
  description: "현금 1억원의 10년 뒤 찐가치는? 물가상승률을 반영하여 내 자산의 미래 가치와 실질 수익률을 정확히 계산해 드립니다."
};

export default function InflationPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #c2410c 100%)' }}>
        <div className="container"><div className="top-desc-inner"><h1 className="main-title">인플레이션 파워 분석기</h1><p className="main-subtitle">내 예금은 <strong>물가를 이기고 있을까요?</strong> 아니면 조용히 녹아내리고 있을까요?</p></div></div>
      </section>
      <main className="main-content"><div className="container content-grid"><section className="calculator-section"><InflationCalculator /></section></div></main>
    </>
  );
}
"""
with open('v2-next/src/app/inflation-calculator/page.tsx', 'w', encoding='utf-8') as f: f.write(page_inf)


# =========================================================================
# 3. EXCHANGE CALCULATOR
# =========================================================================

hooks_ex = """
import { useState, useEffect } from 'react';

const CURRENCIES = [
  { code: "USD", label: "미국 달러", symbol: "$", unit: 1 },
  { code: "JPY", label: "일본 엔화", symbol: "¥", unit: 100 },
  { code: "EUR", label: "유로", symbol: "€", unit: 1 },
  { code: "CNY", label: "중국 위안화", symbol: "¥", unit: 1 },
  { code: "GBP", label: "영국 파운드", symbol: "£", unit: 1 },
  { code: "VND", label: "베트남 동", symbol: "₫", unit: 1000 },
];

export function useExchangeCalculator() {
  const [rates, setRates] = useState<any>({});
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [status, setStatus] = useState<string>("loading");
  const [exResult, setExResult] = useState<any>(null);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/KRW")
      .then(res => res.json())
      .then(data => {
        const d = new Date(data.time_last_update_unix * 1000);
        setLastUpdate(d.toLocaleDateString() + " " + d.toLocaleTimeString());
        
        const newRates:any = {};
        CURRENCIES.forEach(c => {
           if(data.rates[c.code]) {
               newRates[c.code] = c.unit / data.rates[c.code];
           }
        });
        setRates(newRates);
        setStatus("success");
      })
      .catch((e) => {
        console.error(e);
        setStatus("error");
        setRates({ USD: 1350, JPY: 900, EUR: 1450, CNY: 190, GBP: 1700, VND: 5.5 });
      });
  }, []);

  const calculate = (amount: number, fee: number, dir: string, targetCode: string, userRates: any) => {
    if (amount <= 0) throw new Error("금액을 정확히 입력해주세요.");
    
    if (dir === 'from-krw') {
      const cards = CURRENCIES.map(c => {
        const r = userRates[c.code] || rates[c.code];
        const rFee = r * (1 + fee / 100);
        return { ...c, amt: amount / rFee, noFeeAmt: amount / r };
      });
      setExResult({ dir, amount, fee, cards });
    } else {
      const cur = CURRENCIES.find((c) => c.code === targetCode)!;
      const r = userRates[targetCode] || rates[targetCode];
      const rFee = r * (1 - fee / 100);
      const krwAmount = amount * rFee;
      const krwNoFee = amount * r;
      setExResult({ dir, amount, fee, cur, r, krwAmount, krwNoFee });
    }
  };

  return { rates, lastUpdate, status, exResult, calculate, CURRENCIES };
}
"""
with open('v2-next/src/hooks/useExchangeCalculator.ts', 'w', encoding='utf-8') as f: f.write(hooks_ex)


ui_ex = """
"use client";
import { useState, useEffect } from "react";
import { useExchangeCalculator } from "@/hooks/useExchangeCalculator";

export default function ExchangeCalculator() {
  const { rates, lastUpdate, status, exResult, calculate, CURRENCIES } = useExchangeCalculator();
  const [amount, setAmount] = useState("");
  const [dir, setDir] = useState("from-krw");
  const [fee, setFee] = useState("1.75");
  const [target, setTarget] = useState("USD");
  const [customRates, setCustomRates] = useState<any>({});

  // Initialize custom rates from live rates when loaded
  useEffect(() => {
    if (status === 'success' && Object.keys(customRates).length === 0) {
      const initRates:any = {};
      Object.keys(rates).forEach(k => { initRates[k] = rates[k].toFixed(2); });
      setCustomRates(initRates);
    }
  }, [rates, status]);

  const formatKRW = (n: number) => Math.round(n).toLocaleString("ko-KR");
  const parseAmt = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
  const handleNum = (setter: any) => (e: any) => { const val = e.target.value.replace(/[^0-9]/g, ""); setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : ""); };

  const onCalculate = () => {
    const rateNumbers:any = {};
    Object.keys(customRates).forEach(k => { rateNumbers[k] = parseFloat(customRates[k])||rates[k]; });
    try { calculate(parseAmt(amount), parseFloat(fee)||0, dir, target, rateNumbers); } catch(e:any){alert(e.message);}
  };

  return (
    <div className="tab-panel active">
      <div className="calc-card">
        <h2 className="calc-card-title">실시간 환율 수수료 계산기</h2>
        
        {status === 'loading' && <div className="badge" style={{background:'#f1f5f9', color:'#475569'}}>⏳ 실시간 환율 불러오는 중...</div>}
        {status === 'success' && <div className="badge success">🟢 실시간 연동 완료 ({lastUpdate})</div>}
        {status === 'error' && <div className="badge error">🔴 연동 실패 (최근 기준환율 적용)</div>}

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', margin:'20px 0', padding:'15px', background:'var(--surface-1)', borderRadius:'12px'}}>
          {CURRENCIES.map(c => (
            <div key={c.code} style={{display:'flex', flexDirection:'column'}}>
               <label style={{fontSize:'0.75rem', fontWeight:600}}>{c.code} ({c.unit}{c.symbol})</label>
               <input type="number" step="0.01" style={{padding:'6px', border:'1px solid var(--border)', borderRadius:'6px'}} value={customRates[c.code]||''} onChange={e=>setCustomRates({...customRates, [c.code]: e.target.value})} />
            </div>
          ))}
        </div>

        <div className="form-grid">
          <div className="form-group" style={{gridColumn:'span 2'}}>
             <div className="radio-group" style={{marginBottom:'10px'}}>
               <label className="radio-label"><input type="radio" checked={dir==='from-krw'} onChange={()=>{setDir('from-krw'); setAmount('');}} /><span className="radio-custom"></span> 원화 → 외화 (살 때)</label>
               <label className="radio-label"><input type="radio" checked={dir==='to-krw'} onChange={()=>{setDir('to-krw'); setAmount('');}} /><span className="radio-custom"></span> 외화 → 원화 (팔 때)</label>
             </div>
             <div className="input-wrap">
               <input type="text" className="form-input large-input" value={amount} placeholder={dir==='from-krw'?'1,000,000':'1,000'} onChange={handleNum(setAmount)} />
               <span className="input-unit">{dir==='from-krw'?'원':'외화'}</span>
             </div>
          </div>
          
          {dir === 'to-krw' && (
            <div className="form-group">
               <label className="form-label">보유 외화 선택</label>
               <select className="form-input" value={target} onChange={e=>setTarget(e.target.value)}>
                 {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label} ({c.code})</option>)}
               </select>
            </div>
          )}

          <div className="form-group">
             <label className="form-label">은행 환전 수수료율</label>
             <div className="input-wrap"><input type="number" step="0.1" className="form-input" value={fee} onChange={e=>setFee(e.target.value)} /><span className="input-unit">%</span></div>
             <p style={{fontSize:'0.75rem', opacity:0.7, marginTop:'4px'}}>일반적인 은행 현찰 살때/팔때 스프레드</p>
          </div>
        </div>
        <button className="calc-btn" onClick={onCalculate} style={{background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', boxShadow: '0 4px 16px rgba(30, 64, 175, 0.4)'}}>⚡ 정확한 환전 금액 계산하기</button>
      </div>

      {exResult && exResult.dir === 'from-krw' && (
        <div className="result-card fade-in" style={{borderColor: '#1e40af', marginTop:'20px'}}>
          <h3 className="result-title">💱 다국어 동시 환전 정보</h3>
          <div className="result-summary-box" style={{background:'#1e40af'}}>
            <div className="summary-label">원화 {formatKRW(exResult.amount)}원의 세계 가치 (수수료 {exResult.fee}% 삭감분 적용)</div>
            <div className="summary-amount">아래 박스 확인</div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:'10px', marginTop:'20px'}}>
             {exResult.cards.map((c:any) => (
                <div key={c.code} style={{background:'var(--surface-1)', padding:'15px', borderRadius:'12px', textAlign:'center', border:'1px solid var(--border)'}}>
                   <div style={{fontWeight:800, color:'#1e40af'}}>{c.code} {c.label}</div>
                   <div style={{fontSize:'1.2rem', margin:'10px 0'}}>{c.symbol}{c.amt.toLocaleString(undefined, {maximumFractionDigits:2})}</div>
                   <div style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>수수료 우대시: <br/>{c.symbol}{c.noFeeAmt.toLocaleString(undefined, {maximumFractionDigits:2})}</div>
                </div>
             ))}
          </div>
        </div>
      )}

      {exResult && exResult.dir === 'to-krw' && (
        <div className="result-card fade-in" style={{borderColor: '#1e40af', marginTop:'20px'}}>
          <h3 className="result-title">💵 외화 환전 (국내 현금화)</h3>
          <div className="result-summary-box" style={{background:'#1e40af'}}>
            <div className="summary-label">{exResult.cur.symbol}{exResult.amount.toLocaleString(undefined, {maximumFractionDigits:2})} {exResult.cur.label} 매도 (팔 때)</div>
            <div className="summary-amount">{formatKRW(exResult.krwAmount)}원 환전 가능</div>
          </div>
          <table className="deduction-table" style={{marginTop:'30px'}}>
            <tbody>
              <tr><td>기준 원 환율</td><td style={{textAlign:'right'}}>{exResult.r.toFixed(2)}원 (기준 {exResult.cur.unit}{exResult.cur.code})</td></tr>
              <tr><td>수수료 없는 순수 원화</td><td style={{textAlign:'right'}}>{formatKRW(exResult.krwNoFee)}원</td></tr>
              <tr><td>은행/공항 손실 수수료</td><td style={{textAlign:'right', color:'var(--danger)'}}>-{formatKRW(exResult.krwNoFee - exResult.krwAmount)}원</td></tr>
              <tr style={{borderTop:'2px solid #1e40af'}}><td style={{fontWeight:700}}>실수령 원화 금액</td><td style={{textAlign:'right', fontWeight:700, color:'#1e40af'}}>{formatKRW(exResult.krwAmount)}원</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
"""
with open('v2-next/src/components/calculators/ExchangeCalculator.tsx', 'w', encoding='utf-8') as f: f.write(ui_ex)

page_ex = """
import { Metadata } from "next";
import ExchangeCalculator from "@/components/calculators/ExchangeCalculator";

export const metadata: Metadata = {
  title: "실시간 환전 수수료 계산기 | 달러 엔화 유로 살때 팔때 환율",
  description: "실시간 오픈 API 환율을 연동! 여행 갈 때 살 돈, 다녀와서 남은 돈 팔 때 적용되는 무서운 환전 수수료까지 계산해 드립니다."
};

export default function ExchangePage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #172554 100%)' }}>
        <div className="container"><div className="top-desc-inner"><h1 className="main-title">글로벌 환율 마스터</h1><p className="main-subtitle">공항에서 눈뜨고 코 베이지 마세요. <strong>살 때, 팔 때 달라지는 환율과 은행 수수료</strong>를 실시간으로 비교 계산합니다.</p></div></div>
      </section>
      <main className="main-content"><div className="container content-grid"><section className="calculator-section"><ExchangeCalculator /></section></div></main>
    </>
  );
}
"""
with open('v2-next/src/app/exchange-calculator/page.tsx', 'w', encoding='utf-8') as f: f.write(page_ex)

print("Tax/Interest, Inflation, Exchange Calculators scaffolded successfully.")
