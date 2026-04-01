
"use client";
import { useState, useRef, useEffect } from "react";
import { useSeveranceCalculator } from "@/hooks/useSeveranceCalculator";
import { Chart, ArcElement, Tooltip as ChartTooltip, DoughnutController } from 'chart.js';

Chart.register(ArcElement, ChartTooltip, DoughnutController);

export default function SeveranceCalculator() {
  const { basicResult, pensionResult, calculateBasic, comparePension } = useSeveranceCalculator();
  const [tab, setTab] = useState<'basic' | 'pension'>('basic');

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
      if (!joinDate || !retireDate) return alert("입사일과 퇴직일을 입력해주세요.");
      if (!wage1 && !wage2 && !wage3) return alert("최근 3개월 급여를 입력해주세요.");
      calculateBasic(joinDate, retireDate, parseAmount(wage1), parseAmount(wage2), parseAmount(wage3), parseAmount(bonus));
    } catch (err: any) { alert(err.message); }
  };

  const onPension = () => {
    if (!currentMonthly || !retireMonthly || !years) return alert("모든 항목을 입력해주세요.");
    comparePension(parseAmount(currentMonthly), parseAmount(retireMonthly), parseFloat(years), parseFloat(dcRate));
  };

  useEffect(() => {
    if (tab === 'basic' && basicResult && chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
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
        <button className={`tab-btn ${tab === 'basic' ? 'active' : ''}`} onClick={() => setTab('basic')} style={tab === 'basic' ? { background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)' } : {}}>💼 퇴직금 계산</button>
        <button className={`tab-btn ${tab === 'pension' ? 'active' : ''}`} onClick={() => setTab('pension')} style={tab === 'pension' ? { background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)' } : {}}>📊 DB형 vs DC형 비교</button>
      </div>

      {tab === 'basic' && (
        <div className="tab-panel active">
          <div className="calc-card">
            <h2 className="calc-card-title">퇴직금 계산 <span className="year-badge" style={{ background: 'rgba(217,119,6,0.15)', color: '#d97706', border: '1px solid rgba(217,119,6,0.3)' }}>2026 기준</span></h2>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">입사일</label><div className="input-wrap"><input type="date" className="form-input" value={joinDate} onChange={e => setJoinDate(e.target.value)} /></div></div>
              <div className="form-group"><label className="form-label">퇴직일</label><div className="input-wrap"><input type="date" className="form-input" value={retireDate} onChange={e => setRetireDate(e.target.value)} /></div></div>
              <div className="form-group"><label className="form-label">최근 1개월 임금</label><div className="input-wrap"><input type="text" className="form-input" value={wage1} onChange={handleNum(setWage1)} /><span className="input-unit">원</span></div></div>
              <div className="form-group"><label className="form-label">최근 2개월 임금</label><div className="input-wrap"><input type="text" className="form-input" value={wage2} onChange={handleNum(setWage2)} /><span className="input-unit">원</span></div></div>
              <div className="form-group"><label className="form-label">최근 3개월 임금</label><div className="input-wrap"><input type="text" className="form-input" value={wage3} onChange={handleNum(setWage3)} /><span className="input-unit">원</span></div></div>
              <div className="form-group"><label className="form-label">연간 상여금/연차수당</label><div className="input-wrap"><input type="text" className="form-input" value={bonus} onChange={handleNum(setBonus)} /><span className="input-unit">원/년</span></div></div>
            </div>
            <button className="calc-btn" onClick={onBasic} style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', boxShadow: '0 4px 16px rgba(217, 119, 6, 0.4)' }}>⚡ 퇴직금 계산하기</button>
          </div>

          {basicResult && (
            <div className="result-card fade-in" style={{ borderColor: '#d97706', marginTop: '20px' }}>
              <h3 className="result-title">💼 퇴직금 계산 결과</h3>
              <div className="result-summary-box" style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }}>
                <div className="summary-label">퇴직금 총액</div>
                <div className="summary-amount">{formatKRW(basicResult.severancePay)}원</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>세후 실수령액 ≈ {formatKRW(basicResult.netPay)}원</div>
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
              <div className="form-group"><label className="form-label">예상 근속연수</label><div className="input-wrap"><input type="number" className="form-input" value={years} onChange={e => setYears(e.target.value)} /><span className="input-unit">년</span></div></div>
              <div className="form-group"><label className="form-label">DC형 운용 수익률 (연)</label><div className="input-wrap"><input type="number" className="form-input" value={dcRate} onChange={e => setDcRate(e.target.value)} step="0.1" /><span className="input-unit">%</span></div></div>
            </div>
            <button className="calc-btn" onClick={onPension} style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', boxShadow: '0 4px 16px rgba(217, 119, 6, 0.4)' }}>⚡ 비교 계산하기</button>
          </div>

          {pensionResult && (() => {
            const getBorder = (isWinner: boolean) => isWinner ? '2px solid #d97706' : '2px solid var(--border)';
            const getColor = (isWinner: boolean) => isWinner ? '#b45309' : 'var(--text-primary)';

            return (
              <div className="result-card fade-in" style={{ borderColor: '#d97706', marginTop: '20px' }}>
                <h3 className="result-title">📊 비교 결과</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '20px', background: 'var(--surface-2)', border: getBorder(pensionResult.dbWins), borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DB형 (확정급여형)</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: getColor(pensionResult.dbWins) }}>{formatKRW(pensionResult.dbSeverance)}원</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>세후 {formatKRW(pensionResult.dbNet)}원</div>
                  </div>
                  <div style={{ padding: '20px', background: 'var(--surface-2)', border: getBorder(!pensionResult.dbWins), borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DC형 (확정기여형)</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: getColor(!pensionResult.dbWins) }}>{formatKRW(pensionResult.dcSeverance)}원</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>세후 {formatKRW(pensionResult.dcNet)}원</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
}
