
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
