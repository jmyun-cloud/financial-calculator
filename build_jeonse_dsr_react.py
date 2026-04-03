import os

os.makedirs('v2-next/src/hooks', exist_ok=True)
os.makedirs('v2-next/src/components/calculators', exist_ok=True)
os.makedirs('v2-next/src/app/jeonse-calculator', exist_ok=True)
os.makedirs('v2-next/src/app/dsr-calculator', exist_ok=True)

# =========================================================================
# 1. JEONSE CALCULATOR
# =========================================================================

hooks_jeonse = """
import { useState } from 'react';

export function useJeonseCalculator() {
  const [tmResult, setTmResult] = useState<any>(null);
  const [tdResult, setTdResult] = useState<any>(null);
  const [adjResult, setAdjResult] = useState<any>(null);

  const calcToMonthly = (jeonse: number, deposit: number, rate: number) => {
    if (jeonse <= 0) throw new Error("전세 보증금을 입력해 주세요.");
    if (deposit >= jeonse) throw new Error("전환 후 보증금은 전세 보증금보다 작아야 합니다.");
    
    const diff = jeonse - deposit;
    const monthly = Math.floor((diff * rate) / 100 / 12);
    const legalMonthly = Math.floor((diff * 5.5) / 100 / 12);
    setTmResult({ jeonse, deposit, diff, rate, monthly, legalRate: 5.5, legalMonthly });
  };

  const calcToDeposit = (monthly: number, deposit: number, rate: number) => {
    if (monthly <= 0) throw new Error("월세를 입력해 주세요.");
    const addDeposit = Math.floor(((monthly * 12) / rate) * 100);
    const totalJeonse = deposit + addDeposit;
    setTdResult({ monthly, deposit, rate, addDeposit, totalJeonse });
  };

  const calcAdjust = (curMonthly: number, curDeposit: number, newDeposit: number, rate: number) => {
    if (curMonthly < 0) throw new Error("현재 월세를 입력해 주세요.");
    if (newDeposit < 0) throw new Error("변경 후 보증금을 입력해 주세요.");
    
    const depositDiff = newDeposit - curDeposit;
    const monthlyChange = Math.floor((depositDiff * rate) / 100 / 12);
    const newMonthly = Math.max(0, curMonthly - monthlyChange);
    setAdjResult({ curMonthly, curDeposit, newDeposit, rate, depositDiff, monthlyChange, newMonthly });
  };

  return { tmResult, tdResult, adjResult, calcToMonthly, calcToDeposit, calcAdjust };
}
"""

with open('v2-next/src/hooks/useJeonseCalculator.ts', 'w', encoding='utf-8') as f:
    f.write(hooks_jeonse)


ui_jeonse = """
"use client";
import { useState } from "react";
import { useJeonseCalculator } from "@/hooks/useJeonseCalculator";

export default function JeonseCalculator() {
  const { tmResult, tdResult, adjResult, calcToMonthly, calcToDeposit, calcAdjust } = useJeonseCalculator();
  const [tab, setTab] = useState<'tm'|'td'|'adj'>('tm');

  const [tmJeonse, setTmJeonse] = useState("");
  const [tmDeposit, setTmDeposit] = useState("");
  const [tmRate, setTmRate] = useState("5.5");

  const [tdMonthly, setTdMonthly] = useState("");
  const [tdDeposit, setTdDeposit] = useState("");
  const [tdRate, setTdRate] = useState("5.5");

  const [adjCurMonthly, setAdjCurMonthly] = useState("");
  const [adjCurDeposit, setAdjCurDeposit] = useState("");
  const [adjNewDeposit, setAdjNewDeposit] = useState("");
  const [adjRate, setAdjRate] = useState("5.5");

  const formatKRW = (n: number) => Math.round(n).toLocaleString("ko-KR");
  const parseAmt = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
  const handleNum = (setter: any) => (e: any) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : "");
  };

  const onTm = () => { try { calcToMonthly(parseAmt(tmJeonse), parseAmt(tmDeposit), parseFloat(tmRate)||5.5); } catch(e:any) { alert(e.message); } };
  const onTd = () => { try { calcToDeposit(parseAmt(tdMonthly), parseAmt(tdDeposit), parseFloat(tdRate)||5.5); } catch(e:any) { alert(e.message); } };
  const onAdj = () => { try { calcAdjust(parseAmt(adjCurMonthly), parseAmt(adjCurDeposit), parseAmt(adjNewDeposit), parseFloat(adjRate)||5.5); } catch(e:any) { alert(e.message); } };

  const activeStyle = {background:'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow:'0 4px 12px rgba(5, 150, 105, 0.35)'};
  const themeColor = '#059669';

  return (
    <div className="tab-panel active">
      <div className="tab-switcher" role="tablist">
        <button className={`tab-btn ${tab==='tm'?'active':''}`} onClick={()=>setTab('tm')} style={tab==='tm'?activeStyle:{}}>📉 전세 → 월세</button>
        <button className={`tab-btn ${tab==='td'?'active':''}`} onClick={()=>setTab('td')} style={tab==='td'?activeStyle:{}}>📈 월세 → 전세</button>
        <button className={`tab-btn ${tab==='adj'?'active':''}`} onClick={()=>setTab('adj')} style={tab==='adj'?activeStyle:{}}>⚖️ 보증금 ↔ 월세 조정</button>
      </div>

      {tab === 'tm' && (
        <div className="calc-card">
          <h2 className="calc-card-title">전세보증금 일부 월세 전환</h2>
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">기존 전세 보증금</label><div className="input-wrap"><input type="text" className="form-input large-input" value={tmJeonse} onChange={handleNum(setTmJeonse)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">전환 후 남길 보증금</label><div className="input-wrap"><input type="text" className="form-input" value={tmDeposit} onChange={handleNum(setTmDeposit)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">전월세 전환율</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={tmRate} onChange={e=>setTmRate(e.target.value)} /><span className="input-unit">%</span></div></div>
          </div>
          <button className="calc-btn" onClick={onTm} style={{background:`linear-gradient(135deg, ${themeColor} 0%, #047857 100%)`, boxShadow:`0 4px 16px rgba(5,150,105,0.4)`}}>⚡ 예상 월세 계산하기</button>
          
          {tmResult && (
            <div className="result-card fade-in" style={{borderColor: themeColor, marginTop:'20px'}}>
              <h3 className="result-title">📉 전세 → 월세 전환 결과</h3>
              <div className="result-summary-box" style={{background:`linear-gradient(135deg, ${themeColor} 0%, #047857 100%)`}}>
                <div className="summary-label">월 납부 금액 (전환율 {tmResult.rate}%)</div>
                <div className="summary-amount">{formatKRW(tmResult.monthly)}원 / 월</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'20px'}}>
                <div className="result-item"><div className="result-item-label" style={{color:'var(--text-secondary)'}}>전환 대상 금액</div><div className="result-item-value">{formatKRW(tmResult.diff)}원</div></div>
                <div className="result-item"><div className="result-item-label" style={{color:'var(--text-secondary)'}}>적용 전환율</div><div className="result-item-value">{tmResult.rate}%</div></div>
                {tmResult.rate > tmResult.legalRate && (
                  <div className="result-item" style={{gridColumn:'span 2'}}><div className="result-item-label">법정 전환율({tmResult.legalRate}%) 기준 월세</div><div className="result-item-value" style={{color:'var(--danger)'}}>{formatKRW(tmResult.legalMonthly)}원/월</div></div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'td' && (
        <div className="calc-card">
          <h2 className="calc-card-title">월세를 전세로 환산</h2>
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">현재 납부하는 월세</label><div className="input-wrap"><input type="text" className="form-input large-input" value={tdMonthly} onChange={handleNum(setTdMonthly)} /><span className="input-unit">원/월</span></div></div>
            <div className="form-group"><label className="form-label">현재 보증금</label><div className="input-wrap"><input type="text" className="form-input" value={tdDeposit} onChange={handleNum(setTdDeposit)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">전월세 상한율(적용율)</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={tdRate} onChange={e=>setTdRate(e.target.value)} /><span className="input-unit">%</span></div></div>
          </div>
          <button className="calc-btn" onClick={onTd} style={{background:`linear-gradient(135deg, ${themeColor} 0%, #047857 100%)`, boxShadow:`0 4px 16px rgba(5,150,105,0.4)`}}>⚡ 전세 환산액 계산하기</button>
          
          {tdResult && (
            <div className="result-card fade-in" style={{borderColor: themeColor, marginTop:'20px'}}>
              <h3 className="result-title">📈 전세 환산 결과</h3>
              <div className="result-summary-box" style={{background:`linear-gradient(135deg, ${themeColor} 0%, #047857 100%)`}}>
                <div className="summary-label">전세 환산 금액</div>
                <div className="summary-amount">{formatKRW(tdResult.totalJeonse)}원</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'20px'}}>
                <div className="result-item"><div className="result-item-label" style={{color:'var(--text-secondary)'}}>현재 보증금</div><div className="result-item-value">{formatKRW(tdResult.deposit)}원</div></div>
                <div className="result-item"><div className="result-item-label" style={{color:'var(--text-secondary)'}}>월세 → 전세 환산액</div><div className="result-item-value" style={{color:themeColor}}>+{formatKRW(tdResult.addDeposit)}원</div></div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'adj' && (
        <div className="calc-card">
          <h2 className="calc-card-title">보증금 / 월세 상호 조정 계산</h2>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">현재 보증금</label><div className="input-wrap"><input type="text" className="form-input" value={adjCurDeposit} onChange={handleNum(setAdjCurDeposit)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">현재 월세</label><div className="input-wrap"><input type="text" className="form-input" value={adjCurMonthly} onChange={handleNum(setAdjCurMonthly)} /><span className="input-unit">원/월</span></div></div>
            <div className="form-group"><label className="form-label">변경 후 보증금</label><div className="input-wrap"><input type="text" className="form-input" value={adjNewDeposit} onChange={handleNum(setAdjNewDeposit)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">전환율</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={adjRate} onChange={e=>setAdjRate(e.target.value)} /><span className="input-unit">%</span></div></div>
          </div>
          <button className="calc-btn" onClick={onAdj} style={{background:`linear-gradient(135deg, ${themeColor} 0%, #047857 100%)`, boxShadow:`0 4px 16px rgba(5,150,105,0.4)`}}>⚡ 변경 후 세/월세 계산</button>
          
          {adjResult && (
             <div className="result-card fade-in" style={{borderColor: themeColor, marginTop:'20px'}}>
              <h3 className="result-title">⚖️ 조정 결과</h3>
              <div className="result-summary-box" style={{background:`linear-gradient(135deg, ${themeColor} 0%, #047857 100%)`}}>
                <div className="summary-label">변경 후 예정 월세</div>
                <div className="summary-amount">{formatKRW(adjResult.newMonthly)}원 / 월</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'20px'}}>
                <div className="result-item"><div className="result-item-label" style={{color:'var(--text-secondary)'}}>보증금 변동액</div><div className="result-item-value" style={{color:adjResult.depositDiff>0?'var(--primary)':'var(--danger)'}}>{adjResult.depositDiff>0?'+':''}{formatKRW(adjResult.depositDiff)}원</div></div>
                <div className="result-item"><div className="result-item-label" style={{color:'var(--text-secondary)'}}>예상 월세 변동액</div><div className="result-item-value" style={{color:adjResult.depositDiff>0?'var(--danger)':'var(--primary)'}}>{adjResult.depositDiff>0?'-':'+'}{formatKRW(Math.abs(adjResult.monthlyChange))}원</div></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
"""

with open('v2-next/src/components/calculators/JeonseCalculator.tsx', 'w', encoding='utf-8') as f:
    f.write(ui_jeonse)

page_jeonse = """
import { Metadata } from "next";
import JeonseCalculator from "@/components/calculators/JeonseCalculator";

export const metadata: Metadata = {
  title: "전월세 전환 계산기 | 전세보증금을 월세로 계산",
  description: "전월세 전환율(5.5% 상한)을 바탕으로 전세금을 월세로 바꾸거나, 월세를 전세 보증금으로 정확하게 변환해 드립니다."
};

export default function JeonsePage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">전월세 전환 계산기</h1>
            <p className="main-subtitle">계약갱신 및 새로운 임대차 계약 시 <strong>보증금 ↔ 월세 전환금액</strong>을 법정 상한율을 고려해 계산해보세요.</p>
          </div>
        </div>
      </section>
      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section"><JeonseCalculator /></section>
        </div>
      </main>
    </>
  );
}
"""

with open('v2-next/src/app/jeonse-calculator/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_jeonse)




# =========================================================================
# 2. DSR CALCULATOR
# =========================================================================

hooks_dsr = """
import { useState } from 'react';

export function useDsrCalculator() {
  const [dsrResult, setDsrResult] = useState<any>(null);

  const calculateMaxLoan = (monthlyPayment: number, annualRate: number, years: number) => {
    if (annualRate <= 0 || years <= 0 || monthlyPayment <= 0) return 0;
    const r = (annualRate / 100) / 12;
    const n = years * 12;
    return Math.floor(monthlyPayment * ((1 - Math.pow(1 + r, -n)) / r));
  };

  const calculateDSR = (income: number, existingDebt: number, newRate: number, newTerm: number, dsrLimit: number) => {
    if (income <= 0) throw new Error("연소득을 정확히 입력해주세요.");
    
    const currentDsrPct = (existingDebt / income) * 100;
    const maxYearlyAllowed = Math.floor(income * (dsrLimit / 100));
    let availableYearly = maxYearlyAllowed - existingDebt;
    
    let maxNewPrincipal = 0;
    if (availableYearly > 0 && newRate > 0 && newTerm > 0) {
      maxNewPrincipal = calculateMaxLoan(availableYearly / 12, newRate, newTerm);
    } else if (availableYearly < 0) {
      availableYearly = 0;
    }

    setDsrResult({
      income, existingDebt, newRate, newTerm, dsrLimit,
      currentDsrPct, maxYearlyAllowed, availableYearly, maxNewPrincipal
    });
  };

  return { dsrResult, calculateDSR };
}
"""

with open('v2-next/src/hooks/useDsrCalculator.ts', 'w', encoding='utf-8') as f:
    f.write(hooks_dsr)

ui_dsr = """
"use client";
import { useState, useRef, useEffect } from "react";
import { useDsrCalculator } from "@/hooks/useDsrCalculator";
import { Chart, ArcElement, Tooltip as ChartTooltip, DoughnutController } from 'chart.js';

Chart.register(ArcElement, ChartTooltip, DoughnutController);

export default function DsrCalculator() {
  const { dsrResult, calculateDSR } = useDsrCalculator();
  const [income, setIncome] = useState("");
  const [existingDebt, setExistingDebt] = useState("");
  const [newRate, setNewRate] = useState("4.5");
  const [newTerm, setNewTerm] = useState("30");
  const [dsrLimit, setDsrLimit] = useState("40");

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInst = useRef<Chart | null>(null);

  const formatKRW = (n: number) => Math.round(n).toLocaleString("ko-KR");
  const parseAmt = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
  const handleNum = (setter: any) => (e: any) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : "");
  };

  const onCalculate = () => {
    try { calculateDSR(parseAmt(income), parseAmt(existingDebt), parseFloat(newRate)||0, parseInt(newTerm)||0, parseInt(dsrLimit)||40); } catch(e:any) { alert(e.message); }
  };

  useEffect(() => {
    if (dsrResult && chartRef.current) {
      if (chartInst.current) chartInst.current.destroy();
      
      const maxRepay = dsrResult.income * (dsrResult.dsrLimit / 100);
      const safeZone = Math.max(0, dsrResult.income - Math.max(dsrResult.existingDebt + dsrResult.availableYearly, maxRepay));

      chartInst.current = new Chart(chartRef.current.getContext('2d')!, {
        type: 'doughnut',
        data: {
          labels: ['기존 대출 원리금', '추가 가능 한도', '생활비 (DSR 제외분)'],
          datasets: [{
            data: [dsrResult.existingDebt, dsrResult.availableYearly, safeZone],
            backgroundColor: ['#f43f5e', '#2563eb', '#e2e8f0'],
            borderWidth: 0, hoverOffset: 4
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }
      });
    }
  }, [dsrResult]);

  return (
    <div className="tab-panel active">
      <div className="calc-card">
        <h2 className="calc-card-title">DSR 한도 계산기 <span className="year-badge" style={{background:'rgba(37, 99, 235, 0.1)', color:'#2563eb', border:'1px solid rgba(37, 99, 235, 0.2)'}}>스트레스 DSR 미반영</span></h2>
        <div className="form-grid">
          <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">연소득 (세전)</label><div className="input-wrap"><input type="text" className="form-input large-input" value={income} onChange={handleNum(setIncome)} /><span className="input-unit">원</span></div></div>
          <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">기존 대출 연간 원리금상환액</label><div className="input-wrap"><input type="text" className="form-input" placeholder="(선택) 연간 총 갚는 금액" value={existingDebt} onChange={handleNum(setExistingDebt)} /><span className="input-unit">원/년</span></div></div>
          <div className="form-group"><label className="form-label">추가 대출 예상 금리</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={newRate} onChange={e=>setNewRate(e.target.value)} /><span className="input-unit">%</span></div></div>
          <div className="form-group"><label className="form-label">추가 대출 상환 기간</label><div className="input-wrap"><input type="number" className="form-input" value={newTerm} onChange={e=>setNewTerm(e.target.value)} /><span className="input-unit">년</span></div></div>
          <div className="form-group" style={{gridColumn:'span 2', marginTop:'12px'}}><label className="form-label">적용 DSR 한도</label><div className="radio-group"><label className="radio-label"><input type="radio" checked={dsrLimit==='40'} onChange={()=>setDsrLimit('40')} /><span className="radio-custom"></span> 은행권 (40%)</label><label className="radio-label"><input type="radio" checked={dsrLimit==='50'} onChange={()=>setDsrLimit('50')} /><span className="radio-custom"></span> 제2금융권 (50%)</label></div></div>
        </div>
        <button className="calc-btn" onClick={onCalculate} style={{background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)'}}>⚡ 대출 한도 계산하기</button>
      </div>

      {dsrResult && (
        <div className="result-card fade-in" style={{borderColor: '#2563eb', marginTop:'20px'}}>
          <h3 className="result-title">🏦 대출 예상 결과</h3>
          <div className="result-summary-box" style={{background:'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'}}>
            <div className="summary-label">추가 가능 대출 한도 (원리금균등 기준)</div>
            <div className="summary-amount" style={{fontSize: dsrResult.maxNewPrincipal > 0 ? '2.8rem' : '2.2rem', color: dsrResult.availableYearly <= 0 ? '#fca5a5' : '#ffffff'}}>
              {dsrResult.availableYearly <= 0 ? '대출 불가' : (dsrResult.newRate <= 0 || dsrResult.newTerm <= 0 ? '금리/기간 입력필요' : `${formatKRW(dsrResult.maxNewPrincipal)}원`)}
            </div>
            <div style={{fontSize:'1rem', opacity:0.9, marginTop:'10px'}}>현재 DSR: {dsrResult.currentDsrPct.toFixed(1)}% {(dsrResult.currentDsrPct >= dsrResult.dsrLimit) && <span style={{color:'#fca5a5'}}>- 한도 초과 ⚠️</span>}</div>
          </div>
          <table className="deduction-table" style={{marginTop:'30px'}}>
            <tbody>
              <tr><td>최대 연간 원리금 상환 한도</td><td style={{textAlign:'right', fontWeight:700}}>{formatKRW(dsrResult.maxYearlyAllowed)}원</td></tr>
              <tr><td>기존 대출 상환액 차감</td><td style={{textAlign:'right', fontWeight:700, color:'var(--danger)'}}>- {formatKRW(dsrResult.existingDebt)}원</td></tr>
              <tr style={{borderTop:'2px solid #2563eb', background:'var(--primary-light)'}}><td style={{padding:'10px 12px', fontWeight:700}}>추가 대출 여유 원리금</td><td style={{textAlign:'right', fontWeight:800, color:'#2563eb', padding:'10px 12px'}}>{formatKRW(dsrResult.availableYearly)}원/년</td></tr>
            </tbody>
          </table>
          <div className="chart-wrap" style={{display:'flex', justifyContent:'center', marginTop:'30px'}}><div style={{width:'240px', height:'240px'}}><canvas ref={chartRef}></canvas></div></div>
        </div>
      )}
    </div>
  );
}
"""

with open('v2-next/src/components/calculators/DsrCalculator.tsx', 'w', encoding='utf-8') as f:
    f.write(ui_dsr)

page_dsr = """
import { Metadata } from "next";
import DsrCalculator from "@/components/calculators/DsrCalculator";

export const metadata: Metadata = {
  title: "DSR 대출한도 계산기 | 총부채원리금상환비율",
  description: "연봉과 기존 대출을 바탕으로 나의 DSR(총부채원리금상환비율) 한도를 확인하고 추가로 받을 수 있는 최대 대출 금액을 역산해보세요."
};

export default function DsrPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e3a8a 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">DSR 대출한도 계산기</h1>
            <p className="main-subtitle">총부채원리금상환비율! 나의 <strong>기준 연소득과 기존 대출</strong>을 평가하여 은행에서 추가로 얼마까지 빌려줄 수 있는지 알려드립니다.</p>
          </div>
        </div>
      </section>
      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section"><DsrCalculator /></section>
        </div>
      </main>
    </>
  );
}
"""

with open('v2-next/src/app/dsr-calculator/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_dsr)

print("Jeonse & DSR Calculators scaffolded successfully.")
