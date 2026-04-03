import os

os.makedirs('v2-next/src/hooks', exist_ok=True)
os.makedirs('v2-next/src/components/calculators', exist_ok=True)
os.makedirs('v2-next/src/app/salary-calculator', exist_ok=True)

# 1. useSalaryCalculator.ts
hook_code = """
import { useState } from 'react';

const INS_2026 = {
  pension_rate: 0.045,
  pension_cap: 6370000,
  pension_floor: 370000,
  health_rate: 0.03595,
  longterm_rate: 0.1314,
  employment_rate: 0.009,
};

const TAX_BRACKETS = [
  { limit: 14000000, rate: 0.06, deduction: 0 },
  { limit: 50000000, rate: 0.15, deduction: 1260000 },
  { limit: 88000000, rate: 0.24, deduction: 5760000 },
  { limit: 150000000, rate: 0.35, deduction: 15440000 },
  { limit: 300000000, rate: 0.38, deduction: 19940000 },
  { limit: 500000000, rate: 0.4, deduction: 25940000 },
  { limit: 1000000000, rate: 0.42, deduction: 35940000 },
  { limit: Infinity, rate: 0.45, deduction: 65940000 },
];

function calcEmploymentDeduction(annualGross: number) {
  if (annualGross <= 5000000) return annualGross * 0.7;
  if (annualGross <= 15000000) return 3500000 + (annualGross - 5000000) * 0.4;
  if (annualGross <= 45000000) return 7500000 + (annualGross - 15000000) * 0.15;
  if (annualGross <= 100000000) return 12000000 + (annualGross - 45000000) * 0.05;
  return 14750000 + (annualGross - 100000000) * 0.02; // 상한 2000만
}

function calcPersonalDeduction(dependants: number) {
  return dependants * 1500000;
}

function calcIncomeTax(taxableIncome: number) {
  if (taxableIncome <= 0) return 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) {
      return Math.max(0, taxableIncome * bracket.rate - bracket.deduction);
    }
  }
  return 0;
}

function calcTaxCredit(incomeTax: number) {
  if (incomeTax <= 1300000) return incomeTax * 0.55;
  return 715000 + (incomeTax - 1300000) * 0.3;
}

function calcChildCredit(children: number) {
  if (children <= 0) return 0;
  if (children === 1) return 250000;
  if (children === 2) return 550000;
  return 550000 + (children - 2) * 400000;
}

export function useSalaryCalculator() {
  const [result, setResult] = useState<any>(null);

  const calculateSalary = (annualRaw: number, dependants: number, children: number, nontaxMonthly: number) => {
    const monthlyGross = Math.round(annualRaw / 12);
    const monthlyTaxable = Math.max(0, monthlyGross - nontaxMonthly);
    const annualTaxable = monthlyTaxable * 12;

    const pensionBase = Math.min(Math.max(monthlyGross, INS_2026.pension_floor), INS_2026.pension_cap);
    const pension = Math.floor((pensionBase * INS_2026.pension_rate) / 10) * 10;
    const health = Math.floor((monthlyGross * INS_2026.health_rate) / 10) * 10;
    const longterm = Math.floor((health * INS_2026.longterm_rate) / 10) * 10;
    const employment = Math.floor((monthlyGross * INS_2026.employment_rate) / 10) * 10;
    
    const monthlyInsTotal = pension + health + longterm + employment;

    const employmentDeduction = Math.min(calcEmploymentDeduction(annualTaxable), 20000000);
    const workIncome = Math.max(0, annualTaxable - employmentDeduction);
    const totalDeduction = calcPersonalDeduction(dependants) + (pension * 12);
    const taxBase = Math.max(0, workIncome - totalDeduction);
    const grossTax = calcIncomeTax(taxBase);
    
    const incomeTax = Math.max(0, Math.round(grossTax - calcTaxCredit(grossTax) - calcChildCredit(children)));
    const localTax = Math.round(incomeTax * 0.1);

    const monthlyIncomeTax = Math.round(incomeTax / 12 / 10) * 10;
    const monthlyLocalTax = Math.round(localTax / 12 / 10) * 10;
    const monthlyTaxTotal = monthlyIncomeTax + monthlyLocalTax;

    const monthlyTotalDeduction = monthlyInsTotal + monthlyTaxTotal;
    const monthlyTakeHome = monthlyGross - monthlyTotalDeduction;
    const annualTakeHome = monthlyTakeHome * 12;

    setResult({
      annualRaw, monthlyGross, nontaxMonthly,
      ins: { pension, health, longterm, employment },
      monthlyInsTotal, monthlyIncomeTax, monthlyLocalTax,
      monthlyTaxTotal, monthlyTotalDeduction,
      monthlyTakeHome, annualTakeHome
    });
  };

  return { result, calculateSalary };
}
"""

with open('v2-next/src/hooks/useSalaryCalculator.ts', 'w', encoding='utf-8') as f:
    f.write(hook_code)

# 2. SalaryCalculator.tsx
ui_code = """
"use client";
import { useState, useRef, useEffect } from "react";
import { useSalaryCalculator } from "@/hooks/useSalaryCalculator";
import { Chart, ArcElement, Tooltip as ChartTooltip, DoughnutController } from 'chart.js';

Chart.register(ArcElement, ChartTooltip, DoughnutController);

export default function SalaryCalculator() {
  const { result, calculateSalary } = useSalaryCalculator();
  
  const [annual, setAnnual] = useState("");
  const [dependants, setDependants] = useState("1");
  const [children, setChildren] = useState("0");
  const [nontax, setNontax] = useState("200,000");
  
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const formatKRW = (num: number) => Math.round(num).toLocaleString("ko-KR");
  const parseAmount = (str: string) => parseFloat(str.replace(/,/g, "")) || 0;

  const handleCalculate = () => {
    const annualRaw = parseAmount(annual);
    if (annualRaw <= 0) return alert("연봉을 정확히 입력해주세요.");
    calculateSalary(annualRaw, parseInt(dependants)||1, parseInt(children)||0, parseAmount(nontax));
  };

  const handleNumberInput = (setter: any) => (e: any) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val) setter(parseInt(val, 10).toLocaleString("ko-KR"));
    else setter("");
  };

  useEffect(() => {
    if (result && chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();
      
      const ctx = chartRef.current.getContext("2d");
      if(ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["실수령액", "국민연금", "건강보험", "고용보험", "세금"],
            datasets: [{
              data: [
                result.monthlyTakeHome, result.ins.pension, 
                result.ins.health + result.ins.longterm,
                result.ins.employment, result.monthlyTaxTotal
              ],
              backgroundColor: ["#059669", "#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b"],
              borderWidth: 0, hoverOffset: 8
            }]
          },
          options: {
            cutout: "62%",
            plugins: { legend: { display: false } }
          }
        });
      }
    }
  }, [result]);

  return (
    <div className="calc-card">
      <h2 className="calc-card-title">
        연봉 실수령액 계산<span className="year-badge">2026 기준</span>
      </h2>
      <p className="calc-card-desc">세전 연봉을 입력하면 <strong>4대보험 + 소득세</strong>를 자동 공제하여 월 실수령액을 계산합니다.</p>
      
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">세전 연봉</label>
          <div className="input-wrap">
            <input type="text" className="form-input" placeholder="50,000,000" inputMode="numeric" value={annual} onChange={handleNumberInput(setAnnual)} />
            <span className="input-unit">원</span>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">비과세 수당</label>
          <div className="input-wrap">
            <input type="text" className="form-input" value={nontax} onChange={handleNumberInput(setNontax)} />
            <span className="input-unit">원/월</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">부양가족 수 (본인포함)</label>
          <div className="input-wrap">
            <input type="number" className="form-input" min="1" max="11" value={dependants} onChange={e=>setDependants(e.target.value)} />
            <span className="input-unit">명</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">8~19세 자녀 수</label>
          <div className="input-wrap">
            <input type="number" className="form-input" min="0" max="10" value={children} onChange={e=>setChildren(e.target.value)} />
            <span className="input-unit">명</span>
          </div>
        </div>
      </div>

      <button className="calc-btn" onClick={handleCalculate} style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 4px 16px rgba(5, 150, 105, 0.4)' }}>
        <span className="btn-icon">⚡</span> 실수령액 계산하기
      </button>

      {result && (
        <div className="result-card fade-in" style={{ marginTop: '30px', borderTop: '2px solid #059669', paddingTop: '20px' }}>
          <h3 className="result-title">💼 연봉 실수령액 결과</h3>
          <div className="result-summary-box" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>
            <div className="summary-label">월 실수령액</div>
            <div className="summary-amount">{formatKRW(result.monthlyTakeHome)}원</div>
          </div>
          
          <table className="deduction-table" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td>월 세전급여</td><td style={{textAlign:'right', fontWeight:'bold'}}>{formatKRW(result.monthlyGross)}원</td></tr>
              <tr><td>- 4대보험 소계</td><td style={{textAlign:'right', color:'#dc2626', fontWeight:'bold'}}>-{formatKRW(result.monthlyInsTotal)}원</td></tr>
              <tr><td>- 세금 소계 (소득세+지방세)</td><td style={{textAlign:'right', color:'#dc2626', fontWeight:'bold'}}>-{formatKRW(result.monthlyTaxTotal)}원</td></tr>
              <tr style={{background:'#ecfdf5'}}>
                <td style={{padding:'12px', fontWeight:'bold', color:'#047857'}}>🏦 총 월 실수령액</td>
                <td style={{textAlign:'right', padding:'12px', fontWeight:'bold', color:'#047857', fontSize:'1.1rem'}}>{formatKRW(result.monthlyTakeHome)}원</td>
              </tr>
            </tbody>
          </table>

          <div className="chart-wrap" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <div style={{ width: '240px', height: '240px' }}><canvas ref={chartRef}></canvas></div>
          </div>
        </div>
      )}
    </div>
  );
}
"""

with open('v2-next/src/components/calculators/SalaryCalculator.tsx', 'w', encoding='utf-8') as f:
    f.write(ui_code)

# 3. page.tsx
page_code = """
import { Metadata } from "next";
import SalaryCalculator from "@/components/calculators/SalaryCalculator";

export const metadata: Metadata = {
  title: "연봉 계산기 2026 - 월 실수령액·4대보험·소득세 자동 계산 | 금융계산기.kr",
  description: "2026년 기준 연봉 실수령액 계산기. 연봉 입력 시 국민연금·건강보험·고용보험·소득세를 자동 계산하여 월 실수령액을 즉시 확인하세요.",
  openGraph: {
    title: "2026 연봉 계산기 - 월 실수령액·4대보험 자동 계산",
    description: "연봉 입력만으로 4대보험·소득세 공제 후 월 실수령액을 즉시 계산합니다. 2026년 최신 요율 적용.",
  }
};

export default function SalaryPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">연봉 계산기 <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>2026</span></h1>
            <p className="main-subtitle">연봉을 입력하면 <strong>국민연금·건강보험·고용보험·소득세</strong>를 자동 계산하여 <strong>월 실수령액</strong>을 즉시 확인할 수 있습니다.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section">
            <SalaryCalculator />
          </section>
          
          <aside className="sidebar">
            <div className="sidebar-widget info-widget">
              <h2 className="widget-title">📋 2026년 4대보험 요율</h2>
              <table className="tax-table">
                <tbody>
                  <tr><td>국민연금</td><td className="tax-rate">4.50%</td></tr>
                  <tr><td>건강보험</td><td className="tax-rate">3.595%</td></tr>
                  <tr><td>고용보험</td><td className="tax-rate">0.90%</td></tr>
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

with open('v2-next/src/app/salary-calculator/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_code)

print("Salary Calculator React Architecture scaffolded successfully.")
