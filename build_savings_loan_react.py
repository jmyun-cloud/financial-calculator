import os

os.makedirs('v2-next/src/hooks', exist_ok=True)
os.makedirs('v2-next/src/components/calculators', exist_ok=True)
os.makedirs('v2-next/src/app/savings-calculator', exist_ok=True)
os.makedirs('v2-next/src/app/loan-calculator', exist_ok=True)

# =========================================================================
# 1. SAVINGS CALCULATOR
# =========================================================================

hooks_savings = """
import { useState } from 'react';
import { calculateDeposit, calculateInstallment, SavingsResult } from '@/lib/calculators/savings-engine';

export function useSavingsCalculator() {
  const [depositResult, setDepositResult] = useState<SavingsResult | null>(null);
  const [installmentResult, setInstallmentResult] = useState<SavingsResult | null>(null);

  const onCalculateDeposit = (principal: number, rate: number, period: number, interestType: 'simple' | 'compound', taxType: 'normal' | 'preferred' | 'exempt') => {
    try {
      const res = calculateDeposit(principal, rate, period, interestType, taxType);
      setDepositResult(res);
    } catch (e: any) {
      throw e;
    }
  };

  const onCalculateInstallment = (monthly: number, rate: number, period: number, interestType: 'simple' | 'compound', taxType: 'normal' | 'preferred' | 'exempt') => {
    try {
      const res = calculateInstallment(monthly, rate, period, interestType, taxType);
      setInstallmentResult(res);
    } catch (e: any) {
      throw e;
    }
  };

  return { depositResult, installmentResult, calculateDeposit: onCalculateDeposit, calculateInstallment: onCalculateInstallment };
}
"""

with open('v2-next/src/hooks/useSavingsCalculator.ts', 'w', encoding='utf-8') as f:
    f.write(hooks_savings)

ui_savings = """
"use client";
import { useState, useRef, useEffect } from "react";
import { useSavingsCalculator } from "@/hooks/useSavingsCalculator";
import { Chart, ArcElement, Tooltip as ChartTooltip, DoughnutController } from 'chart.js';

Chart.register(ArcElement, ChartTooltip, DoughnutController);

export default function SavingsCalculator() {
  const { depositResult, installmentResult, calculateDeposit, calculateInstallment } = useSavingsCalculator();
  const [tab, setTab] = useState<'deposit'|'installment'>('deposit');
  
  const [dPrincipal, setDPrincipal] = useState("");
  const [dRate, setDRate] = useState("3.5");
  const [dPeriod, setDPeriod] = useState("12");
  const [dInterest, setDInterest] = useState("simple");
  const [dTax, setDTax] = useState("normal");

  const [iMonthly, setIMonthly] = useState("");
  const [iRate, setIRate] = useState("4.5");
  const [iPeriod, setIPeriod] = useState("12");
  const [iInterest, setIInterest] = useState("simple");
  const [iTax, setITax] = useState("normal");

  const chartRefD = useRef<HTMLCanvasElement>(null);
  const chartRefI = useRef<HTMLCanvasElement>(null);
  const chartInstD = useRef<Chart | null>(null);
  const chartInstI = useRef<Chart | null>(null);

  const formatKRW = (n: number) => Math.round(n).toLocaleString("ko-KR");
  const parseAmt = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
  
  const handleNum = (setter: any) => (e: any) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : "");
  };

  const onDeposit = () => {
    try { calculateDeposit(parseAmt(dPrincipal), parseFloat(dRate), parseInt(dPeriod), dInterest as any, dTax as any); } catch(e:any) { alert(e.message); }
  };

  const onInstallment = () => {
    try { calculateInstallment(parseAmt(iMonthly), parseFloat(iRate), parseInt(iPeriod), iInterest as any, iTax as any); } catch(e:any) { alert(e.message); }
  };

  const renderChart = (ref: any, inst: any, p: number, inter: number, tax: number) => {
    if (ref.current) {
      if (inst.current) inst.current.destroy();
      inst.current = new Chart(ref.current.getContext("2d")!, {
        type: "doughnut",
        data: { labels: ['원금', '세후이자', '이자소득세'], datasets: [{ data: [p, Math.max(0, inter-tax), tax], backgroundColor: ['#1a56e8', '#00c9a7', '#ef4444'], borderWidth: 0, hoverOffset: 8 }] },
        options: { cutout: '62%', plugins: { legend: { display: false } } }
      });
    }
  };

  useEffect(() => {
    if (tab === 'deposit' && depositResult) renderChart(chartRefD, chartInstD, depositResult.principal, depositResult.grossInterest, depositResult.taxAmount);
    if (tab === 'installment' && installmentResult) renderChart(chartRefI, chartInstI, installmentResult.totalPrincipal, installmentResult.grossInterest, installmentResult.taxAmount);
  }, [depositResult, installmentResult, tab]);

  const activeStyle = {background:'linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)', boxShadow:'0 4px 12px rgba(26, 86, 232, 0.35)'};

  return (
    <>
      <div className="tab-switcher" role="tablist">
        <button className={`tab-btn ${tab==='deposit'?'active':''}`} onClick={()=>setTab('deposit')} style={tab==='deposit'?activeStyle:{}}>🏦 예금 (거치식)</button>
        <button className={`tab-btn ${tab==='installment'?'active':''}`} onClick={()=>setTab('installment')} style={tab==='installment'?activeStyle:{}}>💰 적금 (적립식)</button>
      </div>

      <div className="tab-panel active">
        {tab === 'deposit' ? (
          <div className="calc-card">
            <h2 className="calc-card-title">정기 예금 이자 계산기</h2>
            <div className="form-grid">
              <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">예치 원금</label><div className="input-wrap"><input type="text" className="form-input large-input" value={dPrincipal} onChange={handleNum(setDPrincipal)} /><span className="input-unit">원</span></div></div>
              <div className="form-group"><label className="form-label">연 이자율</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={dRate} onChange={e=>setDRate(e.target.value)} /><span className="input-unit">%</span></div></div>
              <div className="form-group"><label className="form-label">예치 기간</label><div className="input-wrap"><input type="number" className="form-input" value={dPeriod} onChange={e=>setDPeriod(e.target.value)} /><span className="input-unit">개월</span></div></div>
              <div className="form-group" style={{marginTop:'12px'}}><label className="form-label">이자 계산 방식</label><div className="radio-group"><label className="radio-label"><input type="radio" checked={dInterest==='simple'} onChange={()=>setDInterest('simple')} /><span className="radio-custom"></span> 단리</label><label className="radio-label"><input type="radio" checked={dInterest==='compound'} onChange={()=>setDInterest('compound')} /><span className="radio-custom"></span> 월복리</label></div></div>
              <div className="form-group" style={{marginTop:'12px'}}><label className="form-label">세금 우대</label><div className="radio-group"><label className="radio-label"><input type="radio" checked={dTax==='normal'} onChange={()=>setDTax('normal')} /><span className="radio-custom"></span> 일반 (15.4%)</label><label className="radio-label"><input type="radio" checked={dTax==='preferred'} onChange={()=>setDTax('preferred')} /><span className="radio-custom"></span> 우대 (9.9%)</label><label className="radio-label"><input type="radio" checked={dTax==='exempt'} onChange={()=>setDTax('exempt')} /><span className="radio-custom"></span> 비과세</label></div></div>
            </div>
            <button className="calc-btn" onClick={onDeposit} style={{background: 'linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)', boxShadow: '0 4px 16px rgba(26, 86, 232, 0.4)'}}>⚡ 예금 계산하기</button>
          </div>
        ) : (
          <div className="calc-card">
            <h2 className="calc-card-title">정기 적금 이자 계산기</h2>
            <div className="form-grid">
              <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">월 납입액</label><div className="input-wrap"><input type="text" className="form-input large-input" value={iMonthly} onChange={handleNum(setIMonthly)} /><span className="input-unit">원</span></div></div>
              <div className="form-group"><label className="form-label">연 이자율</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={iRate} onChange={e=>setIRate(e.target.value)} /><span className="input-unit">%</span></div></div>
              <div className="form-group"><label className="form-label">납입 기간</label><div className="input-wrap"><input type="number" className="form-input" value={iPeriod} onChange={e=>setIPeriod(e.target.value)} /><span className="input-unit">개월</span></div></div>
              <div className="form-group" style={{marginTop:'12px'}}><label className="form-label">이자 계산 방식</label><div className="radio-group"><label className="radio-label"><input type="radio" checked={iInterest==='simple'} onChange={()=>setIInterest('simple')} /><span className="radio-custom"></span> 단리</label><label className="radio-label"><input type="radio" checked={iInterest==='compound'} onChange={()=>setIInterest('compound')} /><span className="radio-custom"></span> 월복리</label></div></div>
              <div className="form-group" style={{marginTop:'12px'}}><label className="form-label">세금 우대</label><div className="radio-group"><label className="radio-label"><input type="radio" checked={iTax==='normal'} onChange={()=>setITax('normal')} /><span className="radio-custom"></span> 일반 (15.4%)</label><label className="radio-label"><input type="radio" checked={iTax==='preferred'} onChange={()=>setITax('preferred')} /><span className="radio-custom"></span> 우대 (9.9%)</label><label className="radio-label"><input type="radio" checked={iTax==='exempt'} onChange={()=>setITax('exempt')} /><span className="radio-custom"></span> 비과세</label></div></div>
            </div>
            <button className="calc-btn" onClick={onInstallment} style={{background: 'linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)', boxShadow: '0 4px 16px rgba(26, 86, 232, 0.4)'}}>⚡ 적금 계산하기</button>
          </div>
        )}

        {(tab === 'deposit' && depositResult) && (
          <div className="result-card fade-in" style={{borderColor: '#1a56e8', marginTop:'20px'}}>
            <h3 className="result-title">🏦 예금 계산 결과</h3>
            <div className="result-summary-box" style={{background:'linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)'}}>
              <div className="summary-label">만기 세후 수령액</div>
              <div className="summary-amount">{formatKRW(depositResult.netMaturity)}원</div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'20px'}}>
              <div className="result-item"><div className="result-item-label">예치 원금</div><div className="result-item-value">{formatKRW(depositResult.principal)}원</div></div>
              <div className="result-item"><div className="result-item-label">세전 이자</div><div className="result-item-value" style={{color:'#10b981'}}>+{formatKRW(depositResult.grossInterest)}원</div></div>
              <div className="result-item"><div className="result-item-label">이자소득세</div><div className="result-item-value" style={{color:'#ef4444'}}>-{formatKRW(depositResult.taxAmount)}원</div></div>
              <div className="result-item"><div className="result-item-label">세후 이자</div><div className="result-item-value" style={{color:'#1a56e8'}}>+{formatKRW(depositResult.netInterest)}원</div></div>
            </div>
            <div className="chart-wrap" style={{display:'flex', justifyContent:'center', marginTop:'30px'}}><div style={{width:'240px', height:'240px'}}><canvas ref={chartRefD}></canvas></div></div>
          </div>
        )}

        {(tab === 'installment' && installmentResult) && (
          <div className="result-card fade-in" style={{borderColor: '#1a56e8', marginTop:'20px'}}>
            <h3 className="result-title">💰 적금 계산 결과</h3>
            <div className="result-summary-box" style={{background:'linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)'}}>
              <div className="summary-label">만기 세후 수령액</div>
              <div className="summary-amount">{formatKRW(installmentResult.netMaturity)}원</div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'20px'}}>
              <div className="result-item"><div className="result-item-label">총 납입원금</div><div className="result-item-value">{formatKRW(installmentResult.totalPrincipal)}원</div></div>
              <div className="result-item"><div className="result-item-label">세전 이자</div><div className="result-item-value" style={{color:'#10b981'}}>+{formatKRW(installmentResult.grossInterest)}원</div></div>
              <div className="result-item"><div className="result-item-label">이자소득세</div><div className="result-item-value" style={{color:'#ef4444'}}>-{formatKRW(installmentResult.taxAmount)}원</div></div>
              <div className="result-item"><div className="result-item-label">세후 이자</div><div className="result-item-value" style={{color:'#1a56e8'}}>+{formatKRW(installmentResult.netInterest)}원</div></div>
            </div>
            <div className="chart-wrap" style={{display:'flex', justifyContent:'center', marginTop:'30px'}}><div style={{width:'240px', height:'240px'}}><canvas ref={chartRefI}></canvas></div></div>
          </div>
        )}
      </div>
    </>
  );
}
"""

with open('v2-next/src/components/calculators/SavingsCalculator.tsx', 'w', encoding='utf-8') as f:
    f.write(ui_savings)

page_savings = """
import { Metadata } from "next";
import SavingsCalculator from "@/components/calculators/SavingsCalculator";

export const metadata: Metadata = {
  title: "예적금 만기 수령액 계산기 | 예금/적금 이자 및 세금 계산 자동 산출",
  description: "목돈 만들기 필수! 예금과 적금 만기 시 수령하는 이자와 세금을 계산하여 실 수령액을 정확히 알려드립니다."
};

export default function SavingsPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #1a56e8 0%, #1738c8 50%, #1e2898 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">예적금 이자 계산기</h1>
            <p className="main-subtitle">예금/적금 목표 달성 시 이자소득세가 공제된 실제 만기 수령액을 계산해드립니다.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section">
            <SavingsCalculator />
          </section>
        </div>
      </main>
    </>
  );
}
"""

with open('v2-next/src/app/savings-calculator/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_savings)



# =========================================================================
# 2. LOAN CALCULATOR
# =========================================================================

hooks_loan = """
import { useState } from 'react';
import { calculateLoan, LoanResult } from '@/lib/calculators/loan-engine';

export function useLoanCalculator() {
  const [loanResult, setLoanResult] = useState<LoanResult | null>(null);

  const calculate = (principal: number, rate: number, period: number, grace: number, type: 'equal-installment' | 'equal-principal' | 'bullet') => {
    try {
        const res = calculateLoan(principal, rate, period, grace, type);
        setLoanResult(res);
    } catch (e: any) {
        throw e;
    }
  };

  return { loanResult, calculate };
}
"""

with open('v2-next/src/hooks/useLoanCalculator.ts', 'w', encoding='utf-8') as f:
    f.write(hooks_loan)

ui_loan = """
"use client";
import { useState, useRef, useEffect } from "react";
import { useLoanCalculator } from "@/hooks/useLoanCalculator";
import { Chart, ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip as ChartTooltip, Legend } from 'chart.js';

Chart.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, ChartTooltip, Legend);

export default function LoanCalculator() {
  const { loanResult, calculate } = useLoanCalculator();
  const [principalStr, setPrincipalStr] = useState("");
  const [rate, setRate] = useState("4.5");
  const [period, setPeriod] = useState("120");
  const [grace, setGrace] = useState("0");
  const [type, setType] = useState("equal-installment");

  const [showAll, setShowAll] = useState(false);

  const chartRefD = useRef<HTMLCanvasElement>(null);
  const chartRefAmort = useRef<HTMLCanvasElement>(null);
  const instD = useRef<Chart | null>(null);
  const instAmort = useRef<Chart | null>(null);

  const formatKRW = (n: number) => Math.round(n).toLocaleString("ko-KR");
  const parseAmt = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
  
  const handleNum = (setter: any) => (e: any) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : "");
  };

  const onCalculate = () => {
    try { calculate(parseAmt(principalStr), parseFloat(rate), parseInt(period), parseInt(grace)||0, type); } catch(e:any) { alert(e.message); }
  };

  useEffect(() => {
    if (loanResult) {
      if (instD.current) instD.current.destroy();
      if (instAmort.current) instAmort.current.destroy();

      if (chartRefD.current) {
        instD.current = new Chart(chartRefD.current.getContext('2d')!, {
          type: 'doughnut',
          data: { labels: ['대출 원금', '총 이자'], datasets: [{ data: [loanResult.principal, loanResult.totalInterest], backgroundColor: ['#1a56e8', '#e85d1a'], borderWidth: 0 }] },
          options: { cutout: '62%', plugins: { legend: { display: false } } }
        });
      }

      if (chartRefAmort.current) {
        const sched = loanResult.schedule;
        instAmort.current = new Chart(chartRefAmort.current.getContext('2d')!, {
          type: 'bar',
          data: {
            labels: sched.map((r:any) => `${r.month}회차`),
            datasets: [
              { type: 'line', label: '잔여 원금', data: sched.map((r:any)=>r.balance), borderColor: '#94a3b8', yAxisID: 'y1', order: 1 },
              { type: 'bar', label: '납입 이자', data: sched.map((r:any)=>r.interest), backgroundColor: '#e85d1a', yAxisID: 'y', order: 2, stacked: true },
              { type: 'bar', label: '납입 원금', data: sched.map((r:any)=>r.principal), backgroundColor: '#1a56e8', yAxisID: 'y', order: 3, stacked: true }
            ]
          },
          options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true, position: 'left' }, y1: { position: 'right', grid: { drawOnChartArea: false } } } }
        });
      }
    }
  }, [loanResult]);

  return (
    <div className="tab-panel active">
      <div className="calc-card">
        <h2 className="calc-card-title">대출 이자 계산기</h2>
        <div className="form-grid">
          <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">대출 원금</label><div className="input-wrap"><input type="text" className="form-input large-input" value={principalStr} onChange={handleNum(setPrincipalStr)} /><span className="input-unit">원</span></div></div>
          <div className="form-group"><label className="form-label">연 이자율</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={rate} onChange={e=>setRate(e.target.value)} /><span className="input-unit">%</span></div></div>
          <div className="form-group"><label className="form-label">상환 기간</label><div className="input-wrap"><input type="number" className="form-input" value={period} onChange={e=>setPeriod(e.target.value)} /><span className="input-unit">개월</span></div></div>
          <div className="form-group"><label className="form-label">거치 기간</label><div className="input-wrap"><input type="number" className="form-input" value={grace} onChange={e=>setGrace(e.target.value)} /><span className="input-unit">개월</span></div></div>
          
          <div className="form-group" style={{gridColumn:'span 2', marginTop:'12px'}}>
            <label className="form-label">상환 방식</label>
            <div className="radio-group">
              <label className="radio-label"><input type="radio" checked={type==='equal-installment'} onChange={()=>setType('equal-installment')} /><span className="radio-custom"></span> 원리금균등</label>
              <label className="radio-label"><input type="radio" checked={type==='equal-principal'} onChange={()=>setType('equal-principal')} /><span className="radio-custom"></span> 원금균등</label>
              <label className="radio-label"><input type="radio" checked={type==='bullet'} onChange={()=>setType('bullet')} /><span className="radio-custom"></span> 만기일시상환</label>
            </div>
          </div>
        </div>
        <button className="calc-btn" onClick={onCalculate} style={{background: 'linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)', boxShadow: '0 4px 16px rgba(26, 86, 232, 0.4)'}}>⚡ 대출 계산하기</button>
      </div>

      {loanResult && (
        <div className="result-card fade-in" style={{borderColor: '#1a56e8', marginTop:'20px'}}>
          <h3 className="result-title">💳 대출 계산 결과</h3>
          <div className="result-summary-box" style={{background:'linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)'}}>
            <div className="summary-label">첫 월 납입금</div>
            <div className="summary-amount">{formatKRW(loanResult.firstPayment)}원 / 월</div>
            <div style={{fontSize:'0.9rem', opacity:0.8, marginTop:'10px'}}>총 상환액: {formatKRW(loanResult.totalPayment)}원 | 총 이자: {formatKRW(loanResult.totalInterest)}원</div>
          </div>
          
          <div className="chart-wrap" style={{display:'flex', justifyContent:'center', marginTop:'30px'}}><div style={{width:'240px', height:'240px'}}><canvas ref={chartRefD}></canvas></div></div>
          
          <h4 style={{fontSize:'1.1rem', fontWeight:700, margin:'40px 0 20px'}}>상환 스케줄 차트</h4>
          <div style={{height:'300px', width:'100%'}}><canvas ref={chartRefAmort}></canvas></div>

          <h4 style={{fontSize:'1.1rem', fontWeight:700, margin:'40px 0 20px'}}>상환 스케줄 표</h4>
          <div style={{overflowX:'auto'}}>
            <table className="deduction-table">
              <thead><tr><th>회차</th><th>납입 원금</th><th>납입 이자</th><th>납입 총액</th><th>잔여 원금</th></tr></thead>
              <tbody>
                {(showAll ? loanResult.schedule : loanResult.schedule.slice(0, 12)).map((r:any) => (
                  <tr key={r.month} style={{background: r.month <= loanResult.grace ? 'rgba(232,93,26,0.05)' : ''}}>
                    <td>{r.month}</td>
                    <td>{formatKRW(r.principal)}원</td>
                    <td style={{color:'#e85d1a'}}>{formatKRW(r.interest)}원</td>
                    <td style={{fontWeight:700, color:'#1a56e8'}}>{formatKRW(r.payment)}원</td>
                    <td style={{color:'#94a3b8'}}>{formatKRW(r.balance)}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loanResult.schedule.length > 12 && (
            <button onClick={()=>setShowAll(!showAll)} style={{width:'100%', padding:'12px', background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'8px', cursor:'pointer', fontWeight:600, color:'var(--text-primary)', marginTop:'10px'}}>
              {showAll ? '요약 보기' : `+ ${loanResult.schedule.length - 12}회차 더 보기`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
"""

with open('v2-next/src/components/calculators/LoanCalculator.tsx', 'w', encoding='utf-8') as f:
    f.write(ui_loan)

page_loan = """
import { Metadata } from "next";
import LoanCalculator from "@/components/calculators/LoanCalculator";

export const metadata: Metadata = {
  title: "대출 이자 계산기 | 원리금균등, 원금균등, 만기일시상환 자동 계산",
  description: "다양한 대출 상환 방식에 따른 월 납입금, 총 이자, 잔여 원금을 차트와 함께 시뮬레이션 해보세요."
};

export default function LoanPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #1a56e8 0%, #1738c8 50%, #1e2898 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">대출 이자 상환 계산기</h1>
            <p className="main-subtitle">대출 원금과 금리를 입력하면 <strong>상환 방식별 월 납입 스케줄과 총 이자</strong>를 그래프로 한눈에 비교해드립니다.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section">
            <LoanCalculator />
          </section>
        </div>
      </main>
    </>
  );
}
"""

with open('v2-next/src/app/loan-calculator/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_loan)

print("Savings & Loan Calculators scaffolded successfully.")
