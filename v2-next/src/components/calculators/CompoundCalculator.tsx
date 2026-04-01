
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
