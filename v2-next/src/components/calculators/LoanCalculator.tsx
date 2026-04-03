
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
    try {
      calculate(
        parseAmt(principalStr),
        parseFloat(rate),
        parseInt(period),
        parseInt(grace) || 0,
        type as 'equal-installment' | 'equal-principal' | 'bullet'
      );
    } catch (e: any) { alert(e.message); }
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
            labels: sched.map((r: any) => `${r.month}회차`),
            datasets: [
              { type: 'line', label: '잔여 원금', data: sched.map((r: any) => r.balance), borderColor: '#94a3b8', yAxisID: 'y1', order: 1 },
              { type: 'bar' as const, label: '이자', data: loanResult.schedule.map((r: any) => r.interest), backgroundColor: '#e85d1a', yAxisID: 'y', order: 2, stack: '1' },
              { type: 'bar' as const, label: '원금상환', data: loanResult.schedule.map((r: any) => r.principal), backgroundColor: '#1a56e8', yAxisID: 'y', order: 3, stack: '1' }
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
          <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">대출 원금</label><div className="input-wrap"><input type="text" className="form-input large-input" value={principalStr} onChange={handleNum(setPrincipalStr)} /><span className="input-unit">원</span></div></div>
          <div className="form-group"><label className="form-label">연 이자율</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={rate} onChange={e => setRate(e.target.value)} /><span className="input-unit">%</span></div></div>
          <div className="form-group"><label className="form-label">상환 기간</label><div className="input-wrap"><input type="number" className="form-input" value={period} onChange={e => setPeriod(e.target.value)} /><span className="input-unit">개월</span></div></div>
          <div className="form-group"><label className="form-label">거치 기간</label><div className="input-wrap"><input type="number" className="form-input" value={grace} onChange={e => setGrace(e.target.value)} /><span className="input-unit">개월</span></div></div>

          <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '12px' }}>
            <label className="form-label">상환 방식</label>
            <div className="radio-group">
              <label className="radio-label"><input type="radio" checked={type === 'equal-installment'} onChange={() => setType('equal-installment')} /><span className="radio-custom"></span> 원리금균등</label>
              <label className="radio-label"><input type="radio" checked={type === 'equal-principal'} onChange={() => setType('equal-principal')} /><span className="radio-custom"></span> 원금균등</label>
              <label className="radio-label"><input type="radio" checked={type === 'bullet'} onChange={() => setType('bullet')} /><span className="radio-custom"></span> 만기일시상환</label>
            </div>
          </div>
        </div>
        <button className="calc-btn" onClick={onCalculate} style={{ background: 'linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)', boxShadow: '0 4px 16px rgba(26, 86, 232, 0.4)' }}>⚡ 대출 계산하기</button>
      </div>

      {loanResult && (
        <div className="result-card fade-in" style={{ borderColor: '#1a56e8', marginTop: '20px' }}>
          <h3 className="result-title">💳 대출 계산 결과</h3>
          <div className="result-summary-box" style={{ background: 'linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)' }}>
            <div className="summary-label">첫 월 납입금</div>
            <div className="summary-amount">{formatKRW(loanResult.firstPayment)}원 / 월</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '10px' }}>총 상환액: {formatKRW(loanResult.totalPayment)}원 | 총 이자: {formatKRW(loanResult.totalInterest)}원</div>
          </div>

          <div className="chart-wrap" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}><div style={{ width: '240px', height: '240px' }}><canvas ref={chartRefD}></canvas></div></div>

          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '40px 0 20px' }}>상환 스케줄 차트</h4>
          <div style={{ height: '300px', width: '100%' }}><canvas ref={chartRefAmort}></canvas></div>

          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '40px 0 20px' }}>상환 스케줄 표</h4>
          <div style={{ overflowX: 'auto' }}>
            <table className="deduction-table">
              <thead><tr><th>회차</th><th>납입 원금</th><th>납입 이자</th><th>납입 총액</th><th>잔여 원금</th></tr></thead>
              <tbody>
                {(showAll ? loanResult.schedule : loanResult.schedule.slice(0, 12)).map((r: any) => (
                  <tr key={r.month} style={{ background: r.month <= loanResult.grace ? 'rgba(232,93,26,0.05)' : '' }}>
                    <td>{r.month}</td>
                    <td>{formatKRW(r.principal)}원</td>
                    <td style={{ color: '#e85d1a' }}>{formatKRW(r.interest)}원</td>
                    <td style={{ fontWeight: 700, color: '#1a56e8' }}>{formatKRW(r.payment)}원</td>
                    <td style={{ color: '#94a3b8' }}>{formatKRW(r.balance)}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loanResult.schedule.length > 12 && (
            <button onClick={() => setShowAll(!showAll)} style={{ width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)', marginTop: '10px' }}>
              {showAll ? '요약 보기' : `+ ${loanResult.schedule.length - 12}회차 더 보기`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
