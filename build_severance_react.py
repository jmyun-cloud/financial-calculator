import os

os.makedirs('v2-next/src/hooks', exist_ok=True)
os.makedirs('v2-next/src/components/calculators', exist_ok=True)
os.makedirs('v2-next/src/app/severance-calculator', exist_ok=True)

# 1. useSeveranceCalculator.ts
hook_code = """
import { useState } from 'react';

const TAX_BRACKETS = [
  { limit: 14000000, rate: 0.06, deduct: 0 },
  { limit: 50000000, rate: 0.15, deduct: 1260000 },
  { limit: 88000000, rate: 0.24, deduct: 5760000 },
  { limit: 150000000, rate: 0.35, deduct: 15440000 },
  { limit: 300000000, rate: 0.38, deduct: 19940000 },
  { limit: 500000000, rate: 0.40, deduct: 25940000 },
  { limit: 1000000000, rate: 0.42, deduct: 35940000 },
  { limit: Infinity, rate: 0.45, deduct: 65940000 },
];

function calcTenureDeduction(yearsRaw: number) {
  const y = Math.floor(yearsRaw);
  if (y <= 5) return y * 1000000;
  if (y <= 10) return 5000000 + (y - 5) * 2000000;
  if (y <= 20) return 15000000 + (y - 10) * 2500000;
  return 40000000 + (y - 20) * 3000000;
}

function calcConvertedDeduction(converted: number) {
  if (converted <= 8000000) return converted;
  if (converted <= 70000000) return 8000000 + (converted - 8000000) * 0.60;
  if (converted <= 100000000) return 45200000 + (converted - 70000000) * 0.55;
  if (converted <= 300000000) return 61700000 + (converted - 100000000) * 0.45;
  return 151700000 + (converted - 300000000) * 0.35;
}

function calcProgressiveTax(taxBase: number) {
  if (taxBase <= 0) return 0;
  for (const b of TAX_BRACKETS) {
    if (taxBase <= b.limit) return Math.max(0, taxBase * b.rate - b.deduct);
  }
  return 0;
}

export function calcRetirementTax(severancePay: number, tenureYearsFrac: number) {
  const tenureYearsFloor = Math.floor(tenureYearsFrac);
  const tenureForConvert = Math.max(1, tenureYearsFloor);

  const tenureDeduction = calcTenureDeduction(tenureYearsFloor);
  const afterTenure = Math.max(0, severancePay - tenureDeduction);
  const convertedWage = afterTenure * 12 / tenureForConvert;
  
  const convertedDeduction = calcConvertedDeduction(convertedWage);
  const taxBase = Math.max(0, (convertedWage - convertedDeduction) * tenureForConvert / 12);
  const grossTax = calcProgressiveTax(taxBase);

  const incomeTax = Math.round(grossTax);
  const localTax = Math.round(incomeTax * 0.1);
  const totalTax = incomeTax + localTax;

  return { tenureDeduction, convertedWage, convertedDeduction, taxBase, incomeTax, localTax, totalTax };
}

export function useSeveranceCalculator() {
  const [basicResult, setBasicResult] = useState<any>(null);
  const [pensionResult, setPensionResult] = useState<any>(null);

  const calculateBasic = (joinVal: string, retireVal: string, wage1: number, wage2: number, wage3: number, bonus: number) => {
    const joinDate = new Date(joinVal);
    const retireDate = new Date(retireVal);
    const tenureDays = Math.floor((retireDate.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (tenureDays <= 0) throw new Error('퇴직일이 입사일보다 이후여야 합니다.');
    
    const tenureYears = tenureDays / 365;
    const bonusFor3M = (bonus / 12) * 3;
    const totalWage3M = wage1 + wage2 + wage3 + bonusFor3M;
    const dailyAvgWage = totalWage3M / 91; // 근사치 91일
    const severancePay = dailyAvgWage * 30 * (tenureDays / 365);
    
    const taxResult = calcRetirementTax(severancePay, tenureYears);
    const netPay = severancePay - taxResult.totalTax;

    setBasicResult({
      tenureDays, tenureYears, dailyAvgWage, totalWage3M, bonusFor3M,
      severancePay, netPay, taxResult, belowOneYear: tenureDays < 365
    });
  };

  const comparePension = (currentMonthly: number, retireMonthly: number, years: number, dcRatePerc: number) => {
    const dcRate = dcRatePerc / 100;
    const dbSeverance = retireMonthly * years;
    
    let dcAccum = 0;
    const annualWageGrowth = years > 1 ? (retireMonthly - currentMonthly) / (years - 1) : 0;
    for (let y = 1; y <= years; y++) {
      const monthlyWage = currentMonthly + annualWageGrowth * (y - 1);
      const annualContrib = monthlyWage; // * 12 / 12
      const remainingYears = years - y;
      dcAccum += annualContrib * Math.pow(1 + dcRate, remainingYears);
    }
    const dcSeverance = dcAccum;

    const dbTax = calcRetirementTax(dbSeverance, years);
    const dcTax = calcRetirementTax(dcSeverance, years);
    const dbNet = dbSeverance - dbTax.totalTax;
    const dcNet = dcSeverance - dcTax.totalTax;

    setPensionResult({ dbSeverance, dcSeverance, dbNet, dcNet, dbWins: dbNet >= dcNet });
  };

  return { basicResult, pensionResult, calculateBasic, comparePension };
}
"""

with open('v2-next/src/hooks/useSeveranceCalculator.ts', 'w', encoding='utf-8') as f:
    f.write(hook_code)

# 2. SeveranceCalculator.tsx
ui_code = """
"use client";
import { useState, useRef, useEffect } from "react";
import { useSeveranceCalculator } from "@/hooks/useSeveranceCalculator";
import { Chart, ArcElement, Tooltip as ChartTooltip, DoughnutController } from 'chart.js';

Chart.register(ArcElement, ChartTooltip, DoughnutController);

export default function SeveranceCalculator() {
  const { basicResult, pensionResult, calculateBasic, comparePension } = useSeveranceCalculator();
  const [tab, setTab] = useState<'basic'|'pension'>('basic');
  
  // Basic Form
  const [joinDate, setJoinDate] = useState("");
  const [retireDate, setRetireDate] = useState(new Date().toISOString().split('T')[0]);
  const [wage1, setWage1] = useState("");
  const [wage2, setWage2] = useState("");
  const [wage3, setWage3] = useState("");
  const [bonus, setBonus] = useState("");
  
  // Pension Form
  const [currentMonthly, setCurrentMonthly] = useState("");
  const [retireMonthly, setRetireMonthly] = useState("");
  const [years, setYears] = useState("");
  const [dcRate, setDcRate] = useState("3.0");

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const formatKRW = (num: number) => Math.round(num).toLocaleString("ko-KR");
  const parseAmount = (str: string) => parseFloat(str.replace(/,/g, "")) || 0;
  const handleNum = (setter: any) => (e: any) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : "");
  };

  const onBasic = () => {
    try {
      if(!joinDate || !retireDate) return alert("입사일과 퇴직일을 입력해주세요.");
      if(!wage1 && !wage2 && !wage3) return alert("최근 3개월 급여를 입력해주세요.");
      calculateBasic(joinDate, retireDate, parseAmount(wage1), parseAmount(wage2), parseAmount(wage3), parseAmount(bonus));
    } catch(err:any) { alert(err.message); }
  };

  const onPension = () => {
    if(!currentMonthly || !retireMonthly || !years) return alert("모든 항목을 입력해주세요.");
    comparePension(parseAmount(currentMonthly), parseAmount(retireMonthly), parseFloat(years), parseFloat(dcRate));
  };

  useEffect(() => {
    if (tab === 'basic' && basicResult && chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();
      const ctx = chartRef.current.getContext("2d");
      if(ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["세후 실수령액", "퇴직소득세", "지방소득세"],
            datasets: [{
              data: [Math.max(0, basicResult.netPay), basicResult.taxResult.incomeTax, basicResult.taxResult.localTax],
              backgroundColor: ["#d97706", "#ef4444", "#f97316"],
              borderWidth: 0, hoverOffset: 8
            }]
          },
          options: { cutout: "62%", plugins: { legend: { display: false } } }
        });
      }
    }
  }, [basicResult, tab]);

  return (
    <>
      <div className="tab-switcher" role="tablist">
        <button className={`tab-btn ${tab==='basic'?'active':''}`} onClick={()=>setTab('basic')} style={tab==='basic'?{background:'linear-gradient(135deg, #d97706 0%, #b45309 100%)', boxShadow:'0 4px 12px rgba(217, 119, 6, 0.35)'}:{}}>💼 퇴직금 계산</button>
        <button className={`tab-btn ${tab==='pension'?'active':''}`} onClick={()=>setTab('pension')} style={tab==='pension'?{background:'linear-gradient(135deg, #d97706 0%, #b45309 100%)', boxShadow:'0 4px 12px rgba(217, 119, 6, 0.35)'}:{}}>📊 DB형 vs DC형 비교</button>
      </div>

      {tab === 'basic' && (
        <div className="tab-panel active">
          <div className="calc-card">
            <h2 className="calc-card-title">퇴직금 계산 <span className="year-badge" style={{background:'rgba(217,119,6,0.15)', color:'#d97706', border:'1px solid rgba(217,119,6,0.3)'}}>2026 기준</span></h2>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">입사일</label><div className="input-wrap"><input type="date" className="form-input" value={joinDate} onChange={e=>setJoinDate(e.target.value)} /></div></div>
              <div className="form-group"><label className="form-label">퇴직일</label><div className="input-wrap"><input type="date" className="form-input" value={retireDate} onChange={e=>setRetireDate(e.target.value)} /></div></div>
              <div className="form-group"><label className="form-label">최근 1개월 임금</label><div className="input-wrap"><input type="text" className="form-input" value={wage1} onChange={handleNum(setWage1)} /><span className="input-unit">원</span></div></div>
              <div className="form-group"><label className="form-label">최근 2개월 임금</label><div className="input-wrap"><input type="text" className="form-input" value={wage2} onChange={handleNum(setWage2)} /><span className="input-unit">원</span></div></div>
              <div className="form-group"><label className="form-label">최근 3개월 임금</label><div className="input-wrap"><input type="text" className="form-input" value={wage3} onChange={handleNum(setWage3)} /><span className="input-unit">원</span></div></div>
              <div className="form-group"><label className="form-label">연간 상여금/연차수당</label><div className="input-wrap"><input type="text" className="form-input" value={bonus} onChange={handleNum(setBonus)} /><span className="input-unit">원/년</span></div></div>
            </div>
            <button className="calc-btn" onClick={onBasic} style={{background:'linear-gradient(135deg, #d97706 0%, #b45309 100%)', boxShadow:'0 4px 16px rgba(217, 119, 6, 0.4)'}}>⚡ 퇴직금 계산하기</button>
          </div>

          {basicResult && (
            <div className="result-card fade-in" style={{ borderColor: '#d97706', marginTop: '20px' }}>
              <h3 className="result-title">💼 퇴직금 계산 결과</h3>
              <div className="result-summary-box" style={{background:'linear-gradient(135deg, #d97706 0%, #b45309 100%)'}}>
                <div className="summary-label">퇴직금 총액</div>
                <div className="summary-amount">{formatKRW(basicResult.severancePay)}원</div>
                <div style={{fontSize:'0.8rem', opacity:0.9}}>세후 실수령액 ≈ {formatKRW(basicResult.netPay)}원</div>
              </div>
              <div className="chart-wrap" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <div style={{ width: '220px', height: '220px' }}><canvas ref={chartRef}></canvas></div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'pension' && (
        <div className="tab-panel active">
           <div className="calc-card">
            <h2 className="calc-card-title">DB형 vs DC형 퇴직연금 비교</h2>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">현재 월 기본급</label><div className="input-wrap"><input type="text" className="form-input" value={currentMonthly} onChange={handleNum(setCurrentMonthly)} /><span className="input-unit">원</span></div></div>
              <div className="form-group"><label className="form-label">퇴직 예상 월급</label><div className="input-wrap"><input type="text" className="form-input" value={retireMonthly} onChange={handleNum(setRetireMonthly)} /><span className="input-unit">원</span></div></div>
              <div className="form-group"><label className="form-label">예상 근속연수</label><div className="input-wrap"><input type="number" className="form-input" value={years} onChange={e=>setYears(e.target.value)} /><span className="input-unit">년</span></div></div>
              <div className="form-group"><label className="form-label">DC형 운용 수익률 (연)</label><div className="input-wrap"><input type="number" className="form-input" value={dcRate} onChange={e=>setDcRate(e.target.value)} step="0.1" /><span className="input-unit">%</span></div></div>
            </div>
            <button className="calc-btn" onClick={onPension} style={{background:'linear-gradient(135deg, #d97706 0%, #b45309 100%)', boxShadow:'0 4px 16px rgba(217, 119, 6, 0.4)'}}>⚡ 비교 계산하기</button>
          </div>
          
          {pensionResult && (
            <div className="result-card fade-in" style={{borderColor: '#d97706', marginTop: '20px'}}>
              <h3 className="result-title">📊 비교 결과</h3>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
                <div style={{padding:'20px', background:'var(--surface-2)', border: pensionResult.dbWins ? '2px solid #d97706' : '2px solid var(--border)', borderRadius:'12px', textAlign:'center'}}>
                  <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}>DB형 (확정급여형)</div>
                  <div style={{fontSize:'1.4rem', fontWeight:800, color: pensionResult.dbWins ? '#b45309' : 'var(--text-primary)'}}>{formatKRW(pensionResult.dbSeverance)}원</div>
                  <div style={{fontSize:'0.8rem', opacity:0.8}}>세후 {formatKRW(pensionResult.dbNet)}원</div>
                </div>
                <div style={{padding:'20px', background:'var(--surface-2)', border: !pensionResult.dbWins ? '2px solid #d97706' : '2px solid var(--border)', borderRadius:'12px', textAlign:'center'}}>
                  <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}>DC형 (확정기여형)</div>
                  <div style={{fontSize:'1.4rem', fontWeight:800, color: !pensionResult.dbWins ? '#b45309' : 'var(--text-primary)'}}>{formatKRW(pensionResult.dcSeverance)}원</div>
                  <div style={{fontSize:'0.8rem', opacity:0.8}}>세후 {formatKRW(pensionResult.dcNet)}원</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
"""

with open('v2-next/src/components/calculators/SeveranceCalculator.tsx', 'w', encoding='utf-8') as f:
    f.write(ui_code)

# 3. page.tsx
page_code = """
import { Metadata } from "next";
import SeveranceCalculator from "@/components/calculators/SeveranceCalculator";

export const metadata: Metadata = {
  title: "퇴직금 계산기 2026 - 퇴직소득세·DB/DC형 비교 자동 계산 | 금융계산기.kr",
  description: "2026년 기준 퇴직금 계산기. 근속기간과 평균임금 입력으로 퇴직금·퇴직소득세·실수령액을 자동 계산합니다.",
  openGraph: {
    title: "2026 퇴직금 계산기 - 퇴직소득세·실수령액 자동 계산",
    description: "근속기간·평균임금 입력으로 퇴직금과 퇴직소득세를 자동 계산합니다."
  }
};

export default function SeverancePage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">퇴직금 계산기 <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>2026</span></h1>
            <p className="main-subtitle">근속기간과 평균임금 입력으로 <strong>퇴직금·퇴직소득세·실수령액</strong>을 자동 계산합니다.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section">
            <SeveranceCalculator />
          </section>

          <aside className="sidebar">
            <div className="sidebar-widget info-widget">
              <h2 className="widget-title">📋 2026 근속연수공제</h2>
              <table className="tax-table">
                <tbody>
                  <tr><td>5년 이하</td><td className="tax-rate">100만원 × 연수</td></tr>
                  <tr><td>6~10년</td><td className="tax-rate">500만 + 200만×(연수-5)</td></tr>
                  <tr><td>11~20년</td><td className="tax-rate">1,500만 + 250만×(연수-10)</td></tr>
                  <tr><td>20년 초과</td><td className="tax-rate">4,000만 + 300만×(연수-20)</td></tr>
                </tbody>
              </table>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
"""

with open('v2-next/src/app/severance-calculator/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_code)

print("Severance Calculator React Architecture scaffolded successfully.")
