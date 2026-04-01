
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
