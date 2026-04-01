
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
