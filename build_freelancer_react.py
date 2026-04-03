import os

os.makedirs('v2-next/src/hooks', exist_ok=True)
os.makedirs('v2-next/src/components/calculators', exist_ok=True)
os.makedirs('v2-next/src/app/freelancer-calculator', exist_ok=True)

# 1. useFreelancerCalculator.ts
hook_code = """
import { useState } from 'react';

export function useFreelancerCalculator() {
  const [basicResult, setBasicResult] = useState<any>(null);
  const [reverseResult, setReverseResult] = useState<any>(null);

  const calculateBasic = (gross: number) => {
    if (gross <= 0) throw new Error("세전 총 수입을 입력해주세요.");
    const incomeTax = Math.floor((gross * 0.03) / 10) * 10;
    const localTax = Math.floor((incomeTax * 0.1) / 10) * 10;
    const totalTax = incomeTax + localTax;
    const net = gross - totalTax;

    setBasicResult({ gross, incomeTax, localTax, totalTax, net });
  };

  const calculateReverse = (net: number) => {
    if (net <= 0) throw new Error("입금된 실수령액을 입력해주세요.");
    
    let gross = Math.round((net / 0.967) / 10) * 10;
    let incomeTax = Math.floor((gross * 0.03) / 10) * 10;
    let localTax = Math.floor((incomeTax * 0.1) / 10) * 10;
    let totalTax = incomeTax + localTax;

    let diff = net - (gross - totalTax);
    if (diff !== 0) {
      gross += diff;
      incomeTax = Math.floor((gross * 0.03) / 10) * 10;
      localTax = Math.floor((incomeTax * 0.1) / 10) * 10;
      totalTax = incomeTax + localTax;
    }

    setReverseResult({ gross, incomeTax, localTax, totalTax, net });
  };

  return { basicResult, reverseResult, calculateBasic, calculateReverse };
}
"""

with open('v2-next/src/hooks/useFreelancerCalculator.ts', 'w', encoding='utf-8') as f:
    f.write(hook_code)

# 2. FreelancerCalculator.tsx
ui_code = """
"use client";
import { useState, useRef, useEffect } from "react";
import { useFreelancerCalculator } from "@/hooks/useFreelancerCalculator";
import { Chart, ArcElement, Tooltip as ChartTooltip, DoughnutController } from 'chart.js';

Chart.register(ArcElement, ChartTooltip, DoughnutController);

export default function FreelancerCalculator() {
  const { basicResult, reverseResult, calculateBasic, calculateReverse } = useFreelancerCalculator();
  const [tab, setTab] = useState<'basic'|'reverse'>('basic');
  const [grossStr, setGrossStr] = useState("");
  const [netStr, setNetStr] = useState("");

  const chartRefBasic = useRef<HTMLCanvasElement>(null);
  const chartInstBasic = useRef<Chart | null>(null);

  const formatKRW = (num: number) => Math.round(num).toLocaleString("ko-KR");
  const parseAmount = (str: string) => parseFloat(str.replace(/,/g, "")) || 0;
  
  const handleNum = (setter: any) => (e: any) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : "");
  };

  const onBasic = () => {
    try { calculateBasic(parseAmount(grossStr)); } catch(e:any) { alert(e.message); }
  };

  const onReverse = () => {
    try { calculateReverse(parseAmount(netStr)); } catch(e:any) { alert(e.message); }
  };

  const renderChart = (ref: any, inst: any, label1: string, val1: number, label2: string, val2: number) => {
    if (ref.current) {
      if (inst.current) inst.current.destroy();
      const ctx = ref.current.getContext("2d");
      inst.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: [label1, label2],
          datasets: [{ data: [val1, val2], backgroundColor: ["#8b5cf6", "#ec4899"], borderWidth: 0, hoverOffset: 4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }
      });
    }
  };

  useEffect(() => {
    if (tab === 'basic' && basicResult) {
      renderChart(chartRefBasic, chartInstBasic, '실수령액', basicResult.net, '총 공제 세액', basicResult.totalTax);
    }
  }, [basicResult, tab]);

  const activeTabStyle = {background:'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', boxShadow:'0 4px 12px rgba(139, 92, 246, 0.35)'};

  return (
    <>
      <div className="tab-switcher" role="tablist">
        <button className={`tab-btn ${tab==='basic'?'active':''}`} onClick={()=>setTab('basic')} style={tab==='basic'?activeTabStyle:{}}>💸 실수령액 구하기</button>
        <button className={`tab-btn ${tab==='reverse'?'active':''}`} onClick={()=>setTab('reverse')} style={tab==='reverse'?activeTabStyle:{}}>🔄 계약금액 역산</button>
      </div>

      {tab === 'basic' && (
        <div className="tab-panel active">
          <div className="calc-card">
            <h2 className="calc-card-title">프리랜서 실수령액 계산기<span className="year-badge" style={{background:'rgba(139, 92, 246, 0.15)', border:'1px solid rgba(139, 92, 246, 0.3)', color:'#8b5cf6'}}>3.3% 공제</span></h2>
            <p className="calc-card-desc" style={{marginBottom:'24px'}}>세전 수입(계약금액)을 입력하시면 3.3%의 원천징수 세액을 제외한 실제 수령액을 보여줍니다.</p>
            <div className="form-grid">
              <div className="form-group" style={{gridColumn:'span 2'}}>
                <label className="form-label">세전 총 수입 (계약 금액)</label>
                <div className="input-wrap">
                  <input type="text" className="form-input large-input" placeholder="10,000,000" inputMode="numeric" value={grossStr} onChange={handleNum(setGrossStr)} />
                  <span className="input-unit">원</span>
                </div>
              </div>
            </div>
            <button className="calc-btn" onClick={onBasic} style={{background:'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', boxShadow:'0 4px 16px rgba(139, 92, 246, 0.4)'}}>⚡ 3.3% 계산하기</button>
          </div>

          {basicResult && (
            <div className="result-card fade-in" style={{ borderColor: '#8b5cf6', marginTop: '20px' }}>
              <h3 className="result-title">💸 프리랜서 계산 결과</h3>
              <div className="result-summary-box" style={{background:'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}}>
                <div className="summary-label">예상 실수령액</div>
                <div className="summary-amount">{formatKRW(basicResult.net)}원</div>
                <div style={{fontSize:'0.9rem', opacity:0.8, marginTop:'10px'}}>세전 금액: {formatKRW(basicResult.gross)}원</div>
              </div>
              
              <h4 style={{fontSize:'0.95rem', fontWeight:700, margin:'24px 0 12px', color:'var(--text-primary)'}}>📋 상세 공제 내역 (3.3%)</h4>
              <table className="deduction-table">
                <tbody>
                  <tr><td>사업소득세 (국세 3%)</td><td style={{textAlign:'right', fontWeight:700, color:'var(--danger)'}}>{formatKRW(basicResult.incomeTax)}원</td></tr>
                  <tr><td>지방소득세 (지방세 0.3%)</td><td style={{textAlign:'right', fontWeight:700, color:'var(--danger)'}}>{formatKRW(basicResult.localTax)}원</td></tr>
                  <tr style={{background:'#fff3f0', borderTop:'2px solid #fca5a5'}}><td style={{padding:'10px 12px', fontWeight:700}}>총 공제 세액 (3.3%)</td><td style={{textAlign:'right', fontWeight:700, color:'#dc2626', padding:'10px 12px'}}>{formatKRW(basicResult.totalTax)}원</td></tr>
                </tbody>
              </table>
              <div className="chart-wrap" style={{ display:'flex', justifyContent:'center', marginTop:'30px' }}><div style={{width:'240px', height:'240px'}}><canvas ref={chartRefBasic}></canvas></div></div>
            </div>
          )}
        </div>
      )}

      {tab === 'reverse' && (
        <div className="tab-panel active">
           <div className="calc-card">
            <h2 className="calc-card-title">원래 계약금액(세전) 역산 계산기<span className="year-badge" style={{background:'rgba(139, 92, 246, 0.15)', border:'1px solid rgba(139, 92, 246, 0.3)', color:'#8b5cf6'}}>공급가액 도출</span></h2>
            <p className="calc-card-desc" style={{marginBottom:'24px'}}>통장에 입금된 <strong>실수령액</strong>을 바탕으로 원래 3.3% 공제 전 계약 금액을 거꾸로 계산합니다.</p>
            <div className="form-grid">
              <div className="form-group" style={{gridColumn:'span 2'}}>
                <label className="form-label">입금된 실수령액</label>
                <div className="input-wrap">
                  <input type="text" className="form-input large-input" placeholder="9,670,000" inputMode="numeric" value={netStr} onChange={handleNum(setNetStr)} />
                  <span className="input-unit">원</span>
                </div>
              </div>
            </div>
            <button className="calc-btn" onClick={onReverse} style={{background:'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', boxShadow:'0 4px 16px rgba(139, 92, 246, 0.4)'}}>⚡ 세전 금액 역산하기</button>
          </div>
          
          {reverseResult && (
            <div className="result-card fade-in" style={{borderColor: '#8b5cf6', marginTop: '20px'}}>
              <h3 className="result-title">🔄 세전 계약금액 역산 결과</h3>
              <div className="result-summary-box" style={{background:'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}}>
                <div className="summary-label">원래 세전 계약금액</div>
                <div className="summary-amount">{formatKRW(reverseResult.gross)}원</div>
                <div style={{fontSize:'0.9rem', opacity:0.8, marginTop:'10px'}}>실수령액: {formatKRW(reverseResult.net)}원</div>
              </div>
              <h4 style={{fontSize:'0.95rem', fontWeight:700, margin:'24px 0 12px', color:'var(--text-primary)'}}>📋 세금 도출 내역 (3.3%)</h4>
              <table className="deduction-table">
                <tbody>
                  <tr style={{background:'var(--primary-light)', borderTop:'2px solid #8b5cf6'}}><td style={{padding:'10px 12px', fontWeight:700, color:'#7c3aed'}}>세전 계약금액 (100%)</td><td style={{textAlign:'right', padding:'10px 12px', fontWeight:700, color:'#7c3aed'}}>{formatKRW(reverseResult.gross)}원</td></tr>
                  <tr><td>사업소득세 (국세 3%)</td><td style={{textAlign:'right', fontWeight:700, color:'var(--danger)'}}>-{formatKRW(reverseResult.incomeTax)}원</td></tr>
                  <tr><td>지방소득세 (지방세 0.3%)</td><td style={{textAlign:'right', fontWeight:700, color:'var(--danger)'}}>-{formatKRW(reverseResult.localTax)}원</td></tr>
                  <tr style={{background:'#fff3f0', borderTop:'2px solid #fca5a5'}}><td style={{padding:'10px 12px', fontWeight:700}}>실수령액 (96.7%)</td><td style={{textAlign:'right', fontWeight:700, color:'var(--text-primary)', padding:'10px 12px'}}>{formatKRW(reverseResult.gross - reverseResult.totalTax)}원</td></tr>
                </tbody>
              </table>
              <div className="result-notice" style={{marginTop:'20px'}}>※ 통장에 찍힌 실수령액을 0.967로 나누어(÷) 세전 금액을 도출합니다. 원 단위 절사 방식에 따라 1~10원의 미세한 단수 차이가 발생할 수 있습니다.</div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
"""

with open('v2-next/src/components/calculators/FreelancerCalculator.tsx', 'w', encoding='utf-8') as f:
    f.write(ui_code)

# 3. page.tsx
page_code = """
import { Metadata } from "next";
import FreelancerCalculator from "@/components/calculators/FreelancerCalculator";

export const metadata: Metadata = {
  title: "프리랜서 3.3% 계산기 - 알바·N잡러 실수령액 및 세금 자동 계산 | 금융계산기.kr",
  description: "프리랜서, 아르바이트, N잡러를 위한 3.3% 세금 계산기. 총 수입을 입력하면 3.3% 원천징수 세액을 자동 공제하여 실수령액을 즉시 확인하세요.",
  openGraph: {
    title: "프리랜서 3.3% 계산기 - 원천징수 세급 및 실수령액 자동 산출",
    description: "프리랜서 수입 입력 시 3.3% 원천징수 세액 공제 후 정확한 실수령액을 즉시 계산합니다."
  }
};

export default function FreelancerPage() {
  return (
    <>
      <section className="top-description" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)' }}>
        <div className="container">
          <div className="top-desc-inner">
            <h1 className="main-title">프리랜서 3.3% 세금 계산기</h1>
            <p className="main-subtitle">아르바이트나 프리랜서 등 3.3% 원천징수 근로자의 수입을 입력하면, <strong>사업소득세(3%) 및 지방소득세(0.3%)</strong>를 자동 계산하여 실수령액을 보여줍니다.</p>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container content-grid">
          <section className="calculator-section">
            <FreelancerCalculator />
          </section>

          <aside className="sidebar">
            <div className="sidebar-widget info-widget">
              <h2 className="widget-title">📋 3.3% 원천징수란?</h2>
              <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '15px'}}>
                고용 관계 없이 독립된 자격으로 용역을 제공하고 대가를 받는 경우, 지급하는 자가 금액의 3.3%를 미리 떼어 국가에 납부하는 제도입니다.
              </p>
              <table className="tax-table">
                <tbody>
                  <tr><td>사업 소득세</td><td className="tax-rate preferred">수입금액의 3%</td></tr>
                  <tr><td>지방 소득세</td><td className="tax-rate exempt">사업소득세의 10% (0.3%)</td></tr>
                  <tr style={{borderTop: '2px solid var(--border)'}}><td><strong>총 공제율</strong></td><td className="tax-rate" style={{color: 'var(--danger)'}}><strong>3.3%</strong></td></tr>
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

with open('v2-next/src/app/freelancer-calculator/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_code)

print("Freelancer Calculator React Architecture scaffolded successfully.")
