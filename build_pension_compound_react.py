import os

os.makedirs('v2-next/src/hooks', exist_ok=True)
os.makedirs('v2-next/src/components/calculators', exist_ok=True)
os.makedirs('v2-next/src/app/pension-calculator', exist_ok=True)
os.makedirs('v2-next/src/app/compound-calculator', exist_ok=True)

# =========================================================================
# 1. PENSION CALCULATOR
# =========================================================================

hooks_pension = """
import { useState } from 'react';

export function usePensionCalculator() {
  const [nationalResult, setNationalResult] = useState<any>(null);
  const [retirementResult, setRetirementResult] = useState<any>(null);
  const [personalResult, setPersonalResult] = useState<any>(null);
  const [totalResult, setTotalResult] = useState<any>(null);

  const calcNational = (income: number, years: number, age: number) => {
    if (income <= 0) throw new Error("월 평균 소득을 입력해 주세요.");
    if (years < 10) throw new Error("국민연금은 최소 10년 이상 가입해야 수령 가능합니다.");
    
    const A = 3193511; // 2026 간이 기준
    const cappedIncome = Math.min(Math.max(income, 370000), 6170000);
    const B = cappedIncome;
    const base = 1.2 * (A + B) / 2 * (years / 40);
    
    let adj = 1;
    if (age < 63) adj = 1 - (63 - age) * 0.06;
    else if (age > 63) adj = 1 + (age - 63) * 0.072;
    
    const monthly = Math.round(base * adj);
    setNationalResult({ income: cappedIncome, years, age, monthly, total20y: monthly * 240, adjPercent: Math.round((adj - 1) * 100) });
  };

  const calcRetirement = (salary: number, years: number, pYears: number, rate: number) => {
    if (salary <= 0 || years <= 0) throw new Error("급여와 근속 기간을 입력해 주세요.");
    const totalRetirement = salary * years;
    const mr = rate / 100 / 12;
    const mn = pYears * 12;
    const monthlyPension = mr > 0 ? totalRetirement * mr / (1 - Math.pow(1 + mr, -mn)) : totalRetirement / mn;
    setRetirementResult({ salary, years, pYears, rate, totalRetirement, monthlyPension: Math.floor(monthlyPension) });
  };

  const calcPersonal = (monthly: number, accYears: number, rate: number, recYears: number) => {
    if (monthly <= 0) throw new Error("월 납입액을 입력해 주세요.");
    const mr = rate / 100 / 12;
    const mn = accYears * 12;
    const accumulated = mr > 0 ? monthly * (Math.pow(1 + mr, mn) - 1) / mr : monthly * mn;
    
    const rmr = rate / 100 / 12;
    const rmn = recYears * 12;
    const monthlyPension = rmr > 0 ? accumulated * rmr / (1 - Math.pow(1 + rmr, -rmn)) : accumulated / rmn;
    const totalInvested = monthly * 12 * accYears;
    
    setPersonalResult({ monthly, accYears, rate, recYears, totalInvested, accumulated: Math.floor(accumulated), monthlyPension: Math.floor(monthlyPension) });
  };

  const calcTotal = (national: number, retirement: number, personal: number, need: number) => {
    if (need <= 0) throw new Error("월 필요 생활비를 입력해 주세요.");
    const total = national + retirement + personal;
    const diff = total - need;
    const pct = need > 0 ? (total / need * 100).toFixed(1) : "0.0";
    setTotalResult({ national, retirement, personal, total, need, diff, pct });
  };

  return { nationalResult, retirementResult, personalResult, totalResult, calcNational, calcRetirement, calcPersonal, calcTotal };
}
"""

with open('v2-next/src/hooks/usePensionCalculator.ts', 'w', encoding='utf-8') as f:
    f.write(hooks_pension)

ui_pension = """
"use client";
import { useState } from "react";
import { usePensionCalculator } from "@/hooks/usePensionCalculator";

export default function PensionCalculator() {
  const { nationalResult, retirementResult, personalResult, totalResult, calcNational, calcRetirement, calcPersonal, calcTotal } = usePensionCalculator();
  const [tab, setTab] = useState<'national'|'retirement'|'personal'|'total'>('national');

  // National
  const [npIncome, setNpIncome] = useState("");
  const [npYears, setNpYears] = useState("20");
  const [npAge, setNpAge] = useState("65");
  // Retirement
  const [rpSalary, setRpSalary] = useState("");
  const [rpYears, setRpYears] = useState("10");
  const [rpPyears, setRpPyears] = useState("20");
  const [rpRate, setRpRate] = useState("3");
  // Personal
  const [ppMonthly, setPpMonthly] = useState("");
  const [ppAccYears, setPpAccYears] = useState("25");
  const [ppRate, setPpRate] = useState("5");
  const [ppRecYears, setPpRecYears] = useState("20");
  // Total
  const [totNational, setTotNational] = useState("");
  const [totRetirement, setTotRetirement] = useState("");
  const [totPersonal, setTotPersonal] = useState("");
  const [totNeed, setTotNeed] = useState("3000000");

  const formatKRW = (n: number) => Math.round(n).toLocaleString("ko-KR");
  const parseAmt = (s: string) => parseFloat(String(s).replace(/,/g, "")) || 0;
  const handleNum = (setter: any) => (e: any) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : "");
  };

  const onNat = () => { try { calcNational(parseAmt(npIncome), parseInt(npYears)||0, parseInt(npAge)||0); } catch(e:any){alert(e.message);} };
  const onRet = () => { try { calcRetirement(parseAmt(rpSalary), parseInt(rpYears)||0, parseInt(rpPyears)||0, parseFloat(rpRate)||0); } catch(e:any){alert(e.message);} };
  const onPer = () => { try { calcPersonal(parseAmt(ppMonthly), parseInt(ppAccYears)||0, parseFloat(ppRate)||0, parseInt(ppRecYears)||0); } catch(e:any){alert(e.message);} };
  const onTot = () => { try { calcTotal(parseAmt(totNational), parseAmt(totRetirement), parseAmt(totPersonal), parseAmt(totNeed)); } catch(e:any){alert(e.message);} };

  const themeColors:any = { national:'#0284c7', retirement:'#059669', personal:'#7c3aed', total:'#334155' };
  const bgColors:any = { national:'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', retirement:'linear-gradient(135deg, #059669 0%, #047857 100%)', personal:'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', total:'linear-gradient(135deg, #334155 0%, #1e293b 100%)' };

  return (
    <div className="tab-panel active">
      <div className="tab-switcher" role="tablist">
        {['national', 'retirement', 'personal', 'total'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t as any)} style={tab === t ? { background: bgColors[t], boxShadow: `0 4px 12px ${themeColors[t]}50` } : {}}>
            {t === 'national' ? '🏢 국민연금' : t === 'retirement' ? '💼 퇴직연금' : t === 'personal' ? '💰 개인연금' : '📊 통합 분석'}
          </button>
        ))}
      </div>

      {tab === 'national' && (
        <div className="calc-card">
          <h2 className="calc-card-title">국민연금 (노령연금) 예상 수령액 <span className="year-badge" style={{background:'#0284c720', color:'#0284c7', border:'1px solid #0284c740'}}>간이계산</span></h2>
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">월 평균 소득월액</label><div className="input-wrap"><input type="text" className="form-input large-input" value={npIncome} onChange={handleNum(setNpIncome)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">총 가입 기간</label><div className="input-wrap"><input type="number" className="form-input" value={npYears} onChange={e=>setNpYears(e.target.value)} /><span className="input-unit">년</span></div></div>
            <div className="form-group"><label className="form-label">수령 시작 나이</label><div className="input-wrap"><input type="number" className="form-input" value={npAge} onChange={e=>setNpAge(e.target.value)} /><span className="input-unit">세</span></div></div>
          </div>
          <button className="calc-btn" onClick={onNat} style={{background:bgColors.national}}>⚡ 연금 계산하기</button>
          
          {nationalResult && (
            <div className="result-card fade-in" style={{borderColor: themeColors.national, marginTop:'20px'}}>
              <h3 className="result-title">🏢 국민연금 예상 결과</h3>
              <div className="result-summary-box" style={{background:bgColors.national}}>
                <div className="summary-label">예상 국민연금 월 수령액 ({nationalResult.years}년 가입 / {nationalResult.age}세)</div>
                <div className="summary-amount">{formatKRW(nationalResult.monthly)}원 / 월</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'20px'}}>
                <div className="result-item"><div className="result-item-label">반영 소득월액 (상/하한 적용)</div><div className="result-item-value">{formatKRW(nationalResult.income)}원</div></div>
                <div className="result-item"><div className="result-item-label">조기/연기 조정율</div><div className="result-item-value">{nationalResult.adjPercent > 0 ? '+' : ''}{nationalResult.adjPercent}%</div></div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'retirement' && (
        <div className="calc-card">
          <h2 className="calc-card-title">퇴직연금 수령액 (IRP)</h2>
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">목표/현재 월 급여</label><div className="input-wrap"><input type="text" className="form-input large-input" value={rpSalary} onChange={handleNum(setRpSalary)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">근속 기간</label><div className="input-wrap"><input type="number" className="form-input" value={rpYears} onChange={e=>setRpYears(e.target.value)} /><span className="input-unit">년</span></div></div>
            <div className="form-group"><label className="form-label">운용 수익률 (IRP 등)</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={rpRate} onChange={e=>setRpRate(e.target.value)} /><span className="input-unit">%</span></div></div>
            <div className="form-group"><label className="form-label">연금 수령 기간</label><div className="input-wrap"><input type="number" className="form-input" value={rpPyears} onChange={e=>setRpPyears(e.target.value)} /><span className="input-unit">년</span></div></div>
          </div>
          <button className="calc-btn" onClick={onRet} style={{background:bgColors.retirement}}>⚡ 연금 계산하기</button>
          
          {retirementResult && (
            <div className="result-card fade-in" style={{borderColor: themeColors.retirement, marginTop:'20px'}}>
              <h3 className="result-title">💼 퇴직연금 예상 결과</h3>
              <div className="result-summary-box" style={{background:bgColors.retirement}}>
                <div className="summary-label">예상 퇴직연금 월 수령액 ({retirementResult.pYears}년 분할)</div>
                <div className="summary-amount">{formatKRW(retirementResult.monthlyPension)}원 / 월</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'20px'}}>
                <div className="result-item"><div className="result-item-label">예상 총 퇴직금 원금</div><div className="result-item-value">{formatKRW(retirementResult.totalRetirement)}원</div></div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'personal' && (
        <div className="calc-card">
          <h2 className="calc-card-title">개인연금저축 목표 수령액</h2>
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">월 납입 목표액</label><div className="input-wrap"><input type="text" className="form-input large-input" value={ppMonthly} onChange={handleNum(setPpMonthly)} /><span className="input-unit">원/월</span></div></div>
            <div className="form-group"><label className="form-label">납입 기간</label><div className="input-wrap"><input type="number" className="form-input" value={ppAccYears} onChange={e=>setPpAccYears(e.target.value)} /><span className="input-unit">년</span></div></div>
            <div className="form-group"><label className="form-label">운용 수익률</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={ppRate} onChange={e=>setPpRate(e.target.value)} /><span className="input-unit">%</span></div></div>
            <div className="form-group"><label className="form-label">연금 수령 기간</label><div className="input-wrap"><input type="number" className="form-input" value={ppRecYears} onChange={e=>setPpRecYears(e.target.value)} /><span className="input-unit">년</span></div></div>
          </div>
          <button className="calc-btn" onClick={onPer} style={{background:bgColors.personal}}>⚡ 연금 계산하기</button>
          
          {personalResult && (
            <div className="result-card fade-in" style={{borderColor: themeColors.personal, marginTop:'20px'}}>
              <h3 className="result-title">💰 개인연금 예상 결과</h3>
              <div className="result-summary-box" style={{background:bgColors.personal}}>
                <div className="summary-label">개인연금 월 예상액 ({personalResult.recYears}년 수령)</div>
                <div className="summary-amount">{formatKRW(personalResult.monthlyPension)}원 / 월</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'20px'}}>
                <div className="result-item"><div className="result-item-label">총 납입 원금</div><div className="result-item-value">{formatKRW(personalResult.totalInvested)}원</div></div>
                <div className="result-item"><div className="result-item-label">예상 최종 적립액</div><div className="result-item-value">{formatKRW(personalResult.accumulated)}원</div></div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'total' && (
        <div className="calc-card">
          <h2 className="calc-card-title">내 연금 3층탑 통합 분석</h2>
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">노후 필요 생활비</label><div className="input-wrap"><input type="text" className="form-input large-input" value={totNeed} onChange={handleNum(setTotNeed)} /><span className="input-unit">원/월</span></div></div>
            <div className="form-group"><label className="form-label">국민연금 예상액</label><div className="input-wrap"><input type="text" className="form-input" value={totNational} onChange={handleNum(setTotNational)} /><span className="input-unit">원/월</span></div></div>
            <div className="form-group"><label className="form-label">퇴직연금 예상액</label><div className="input-wrap"><input type="text" className="form-input" value={totRetirement} onChange={handleNum(setTotRetirement)} /><span className="input-unit">원/월</span></div></div>
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">개인연금 예상액</label><div className="input-wrap"><input type="text" className="form-input" value={totPersonal} onChange={handleNum(setTotPersonal)} /><span className="input-unit">원/월</span></div></div>
          </div>
          <button className="calc-btn" onClick={onTot} style={{background:bgColors.total}}>📊 종합 분석하기</button>
          
          {totalResult && (
            <div className="result-card fade-in" style={{borderColor: themeColors.total, marginTop:'20px'}}>
              <h3 className="result-title">📊 종합 노후 진단</h3>
              <div className="result-summary-box" style={{background:bgColors.total}}>
                <div className="summary-label">총 월 연금 수령액 (필요경비 대비 {totalResult.pct}% 충족)</div>
                <div className="summary-amount">{formatKRW(totalResult.total)}원 / 월</div>
              </div>
              
              <div style={{marginTop:'30px'}}>
                {[
                  {l:'국민연금', v:totalResult.national, c:'#0284c7'},
                  {l:'퇴직연금', v:totalResult.retirement, c:'#059669'},
                  {l:'개인연금', v:totalResult.personal, c:'#7c3aed'}
                ].map((b,i) => (
                  <div key={i} style={{marginBottom:'12px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:'4px', fontWeight:600}}><span style={{color:b.c}}>{b.l}</span><span>{formatKRW(b.v)}원</span></div>
                    <div style={{width:'100%', height:'12px', background:'var(--surface-2)', borderRadius:'6px', overflow:'hidden'}}><div style={{width:`${totalResult.need?Math.min(100, b.v/totalResult.need*100):0}%`, height:'100%', background:b.c}}></div></div>
                  </div>
                ))}
              </div>

              <div style={{marginTop:'25px', padding:'20px', borderRadius:'12px', background: totalResult.diff >= 0 ? '#bbf7d020' : '#fecdd320', borderLeft: `4px solid ${totalResult.diff >= 0 ? '#22c55e' : '#f43f5e'}`}}>
                <strong style={{fontSize:'1.1rem', color: totalResult.diff >= 0 ? '#166534' : '#9f1239'}}>
                  {totalResult.diff >= 0 ? `✅ 월 ${formatKRW(totalResult.diff)}원 여유` : `⚠️ 월 ${formatKRW(Math.abs(totalResult.diff))}원 부족`}
                </strong>
                <p style={{fontSize:'0.9rem', marginTop:'6px', color:'var(--text-secondary)'}}>
                  {totalResult.diff >= 0 ? '예상 연금이 필요 생활비를 충분히 충당합니다.' : '부족분 충당을 위해 지금부터 추가 저축 및 연금 증액이 필요합니다.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
"""

with open('v2-next/src/components/calculators/PensionCalculator.tsx', 'w', encoding='utf-8') as f:
    f.write(ui_pension)

page_pension = """
import { Metadata } from "next";
import PensionCalculator from "@/components/calculators/PensionCalculator";

export const metadata: Metadata = {
  title: "연금 3층탑 계산기 | 국민, 퇴직, 개인연금 통합 진단",
  description: "국민연금 조기수령 계산부터 퇴직연금, IRP, 개인연금저축까지 노후에 받을 연금 총액을 계산하고 생활비 달성률을 진단해줍니다."
};

export default function PensionPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">연금 3층탑 분석기</h1>
            <p className="main-subtitle">국민연금, 퇴직연금, 개인연금을 한곳에 모아 <strong>내 노후 준비 상태를 한눈에 통과</strong>해보세요.</p>
          </div>
        </div>
      </section>
      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section"><PensionCalculator /></section>
        </div>
      </main>
    </>
  );
}
"""

with open('v2-next/src/app/pension-calculator/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_pension)


# =========================================================================
# 2. COMPOUND CALCULATOR
# =========================================================================

hooks_compound = """
import { useState } from 'react';

export function useCompoundCalculator() {
  const [compoundResult, setCompoundResult] = useState<any>(null);

  const calculate = (initial: number, monthlyAdd: number, rate: number, years: number, freq: number, taxRate: number) => {
    if (initial <= 0 || rate <= 0 || years <= 0) throw new Error("입력값을 확인해주세요. (원금, 기간, 수익률 필수)");
    
    const r = rate / 100 / freq;
    const n = freq * years;
    
    // Principal Growth
    const principalGrowth = initial * Math.pow(1 + r, n);
    
    // Add Growth (simplified as monthly compound)
    let addGrowth = 0;
    if (monthlyAdd > 0) {
      const mr = rate / 100 / 12;
      const mn = 12 * years;
      addGrowth = mr > 0 ? monthlyAdd * (Math.pow(1 + mr, mn) - 1) / mr : monthlyAdd * mn;
    }
    
    const finalCompound = principalGrowth + addGrowth;
    const totalInvested = initial + monthlyAdd * 12 * years;
    const grossProfit = Math.floor(finalCompound - totalInvested);
    const taxAmount = Math.floor((grossProfit * (taxRate / 100)) / 10) * 10;
    const netProfit = grossProfit - taxAmount;
    
    // Simple Interest Comparison
    const finalSimple = totalInvested + initial * (rate / 100) * years + (monthlyAdd > 0 ? monthlyAdd * (rate / 100 / 12) * 12 * years * (12 * years + 1) / 2 : 0);
    
    // Generate Amortization schedule
    const schedule = [];
    for (let i = 1; i <= years; i++) {
        let pG = initial * Math.pow(1 + r, freq * i);
        let aG = 0;
        if (monthlyAdd > 0) {
            const mrr = rate / 100 / 12;
            const mnn = 12 * i;
            aG = mrr > 0 ? monthlyAdd * (Math.pow(1 + mrr, mnn) - 1) / mrr : monthlyAdd * mnn;
        }
        let yrInv = initial + monthlyAdd * 12 * i;
        let yrSimp = yrInv + initial * (rate / 100) * i + (monthlyAdd > 0 ? monthlyAdd * (rate / 100 / 12) * 12 * i * (12 * i + 1) / 2 : 0);
        schedule.push({ year: i, compound: pG + aG, simple: yrSimp, invested: yrInv });
    }

    setCompoundResult({
      initial, monthlyAdd, rate, years, freq, taxRate,
      totalInvested, finalCompound, grossProfit, taxAmount, netProfit, netFinal: totalInvested + netProfit,
      finalSimple, simpleProfit: finalSimple - totalInvested,
      doubling: (72 / rate).toFixed(1),
      schedule
    });
  };

  return { compoundResult, calculate };
}
"""

with open('v2-next/src/hooks/useCompoundCalculator.ts', 'w', encoding='utf-8') as f:
    f.write(hooks_compound)

ui_compound = """
"use client";
import { useState, useRef, useEffect } from "react";
import { useCompoundCalculator } from "@/hooks/useCompoundCalculator";
import { Chart, ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip as ChartTooltip, Legend } from 'chart.js';

Chart.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, ChartTooltip, Legend);

export default function CompoundCalculator() {
  const { compoundResult, calculate } = useCompoundCalculator();
  const [initial, setInitial] = useState("");
  const [monthlyAdd, setMonthlyAdd] = useState("");
  const [rate, setRate] = useState("10.0");
  const [years, setYears] = useState("10");
  const [freq, setFreq] = useState("12");
  const [tax, setTax] = useState("15.4");

  const [showAmort, setShowAmort] = useState(false);

  const chartDonutRef = useRef<HTMLCanvasElement>(null);
  const chartLineRef = useRef<HTMLCanvasElement>(null);
  const instDonut = useRef<Chart | null>(null);
  const instLine = useRef<Chart | null>(null);

  const formatKRW = (n: number) => Math.round(n).toLocaleString("ko-KR");
  const parseAmt = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
  const handleNum = (setter: any) => (e: any) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : "");
  };

  const onCalculate = () => {
    try { calculate(parseAmt(initial), parseAmt(monthlyAdd), parseFloat(rate), parseInt(years), parseInt(freq), parseFloat(tax)); } catch(e:any){alert(e.message);}
  };

  useEffect(() => {
    if (compoundResult) {
      if (instDonut.current) instDonut.current.destroy();
      if (instLine.current) instLine.current.destroy();

      if (chartDonutRef.current) {
        instDonut.current = new Chart(chartDonutRef.current.getContext('2d')!, {
          type: 'doughnut',
          data: { labels: ['투자원금', '순수익', '세금'], datasets: [{ data: [compoundResult.totalInvested, compoundResult.netProfit, compoundResult.taxAmount], backgroundColor: ['#1a56e8', '#059669', '#f59e0b'], borderWidth: 0 }] },
          options: { cutout: '65%', plugins: { legend: { display: false } } }
        });
      }

      if (chartLineRef.current) {
        instLine.current = new Chart(chartLineRef.current.getContext('2d')!, {
          type: 'line',
          data: {
            labels: compoundResult.schedule.map((r:any) => `${r.year}년`),
            datasets: [
              { label: '복리', data: compoundResult.schedule.map((r:any)=>r.compound), borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.08)', borderWidth: 2, fill: true, tension: 0.4 },
              { label: '단리', data: compoundResult.schedule.map((r:any)=>r.simple), borderColor: '#94a3b8', borderDash: [5,4], borderWidth: 1.5, fill: false, tension: 0.4 }
            ]
          },
          options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false } }
        });
      }
    }
  }, [compoundResult]);

  return (
    <div className="tab-panel active">
      <div className="calc-card">
        <h2 className="calc-card-title">목돈 불리기 (복리 수익률)</h2>
        <div className="form-grid">
          <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">초기 투자 원금</label><div className="input-wrap"><input type="text" className="form-input large-input" value={initial} onChange={handleNum(setInitial)} /><span className="input-unit">원</span></div></div>
          <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">매월 추가 투자액</label><div className="input-wrap"><input type="text" className="form-input" value={monthlyAdd} placeholder="(선택) 추가 납입액" onChange={handleNum(setMonthlyAdd)} /><span className="input-unit">원/월</span></div></div>
          <div className="form-group"><label className="form-label">목표 연 수익률</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={rate} onChange={e=>setRate(e.target.value)} /><span className="input-unit">%</span></div></div>
          <div className="form-group"><label className="form-label">투자 유지 기간</label><div className="input-wrap"><input type="number" className="form-input" value={years} onChange={e=>setYears(e.target.value)} /><span className="input-unit">년</span></div></div>
          <div className="form-group" style={{marginTop:'12px'}}><label className="form-label">복리 적용 빈도</label><div className="radio-group"><label className="radio-label"><input type="radio" checked={freq==='1'} onChange={()=>setFreq('1')} /><span className="radio-custom"></span> 연복리</label><label className="radio-label"><input type="radio" checked={freq==='12'} onChange={()=>setFreq('12')} /><span className="radio-custom"></span> 월복리</label></div></div>
          <div className="form-group" style={{marginTop:'12px'}}><label className="form-label">금융소득 세금</label><div className="radio-group"><label className="radio-label"><input type="radio" checked={tax==='15.4'} onChange={()=>setTax('15.4')} /><span className="radio-custom"></span> 일반 (15.4%)</label><label className="radio-label"><input type="radio" checked={tax==='0'} onChange={()=>setTax('0')} /><span className="radio-custom"></span> 비과세</label></div></div>
        </div>
        <button className="calc-btn" onClick={onCalculate} style={{background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 4px 16px rgba(5, 150, 105, 0.4)'}}>⚡ 복리 마법 계산하기</button>
      </div>

      {compoundResult && (
        <div className="result-card fade-in" style={{borderColor: '#059669', marginTop:'20px'}}>
          <h3 className="result-title">🚀 복리 투자 결과</h3>
          <div className="result-summary-box" style={{background:'linear-gradient(135deg, #059669 0%, #047857 100%)'}}>
            <div className="summary-label">{compoundResult.years}년 후 최종 자산 (세후)</div>
            <div className="summary-amount">{formatKRW(compoundResult.netFinal)}원</div>
          </div>
          
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'20px'}}>
             <div className="result-item"><div className="result-item-label">총 투자 원금</div><div className="result-item-value">{formatKRW(compoundResult.totalInvested)}원</div></div>
             <div className="result-item"><div className="result-item-label">순수익 (세후)</div><div className="result-item-value" style={{color:'#059669'}}>+{formatKRW(compoundResult.netProfit)}원 ({((compoundResult.netProfit / compoundResult.totalInvested)*100).toFixed(1)}%)</div></div>
          </div>

          <div style={{margin:'20px 0', padding:'15px', background:'#f8fafc', borderRadius:'8px', display:'flex', alignItems:'center', gap:'10px'}}>
            <div style={{fontSize:'30px'}}>⏳</div><div><div style={{fontWeight:700}}>72의 법칙: 매 {compoundResult.doubling}년 마다 원금 2배</div><div style={{fontSize:'0.85rem', color: '#64748b'}}>현재 연 {compoundResult.rate}% 수익률이 꾸준히 이어진다면 예상되는 결과입니다.</div></div>
          </div>

          <div className="chart-wrap" style={{display:'flex', justifyContent:'center', marginTop:'30px', gap:'20px', flexWrap:'wrap'}}>
            <div style={{width:'220px', height:'220px'}}><canvas ref={chartDonutRef}></canvas></div>
            <div style={{width:'100%', maxWidth:'400px', height:'250px'}}><canvas ref={chartLineRef}></canvas></div>
          </div>

          <button onClick={()=>setShowAmort(!showAmort)} style={{width:'100%', padding:'12px', background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'8px', cursor:'pointer', fontWeight:600, color:'var(--text-primary)', marginTop:'20px'}}>
            {showAmort ? '연도별 명세표 닫기' : '연도별 수익률 스케줄 보기'}
          </button>

          {showAmort && (
            <div style={{overflowX:'auto', marginTop:'15px'}}>
              <table className="deduction-table">
                <thead><tr><th>연도</th><th>총 원금</th><th>누적 복리자산</th><th>(단리 비교)</th></tr></thead>
                <tbody>
                  {compoundResult.schedule.map((r:any) => (
                    <tr key={r.year}><td>{r.year}년</td><td>{formatKRW(r.invested)}</td><td style={{fontWeight:'bold', color:'#059669'}}>{formatKRW(r.compound)}</td><td style={{color:'#94a3b8'}}>{formatKRW(r.simple)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
"""

with open('v2-next/src/components/calculators/CompoundCalculator.tsx', 'w', encoding='utf-8') as f:
    f.write(ui_compound)

page_compound = """
import { Metadata } from "next";
import CompoundCalculator from "@/components/calculators/CompoundCalculator";

export const metadata: Metadata = {
  title: "눈덩이 복리 계산기 | 매월 투자액 단리 복리 비교 수익률 계산",
  description: "아인슈타인이 극찬한 복리의 마법! 매월 일정한 금액을 꾸준히 투자했을 때 몇 년 뒤 얼마가 되는지 단리와 비교해 차트로 보여드립니다."
};

export default function CompoundPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">눈덩이 복리 계산기</h1>
            <p className="main-subtitle">내 퇴직금, 여윳돈을 꾸준히 굴리면 어떻게 될까요? <strong>시간이 돈을 버는 복리의 마법</strong>을 차트로 경험해 보세요.</p>
          </div>
        </div>
      </section>
      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section"><CompoundCalculator /></section>
        </div>
      </main>
    </>
  );
}
"""

with open('v2-next/src/app/compound-calculator/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_compound)

print("Pension & Compound Calculators scaffolded successfully.")
