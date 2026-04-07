
"use client";
import { useState, useRef, useEffect } from "react";
import { useSavingsCalculator } from "@/hooks/useSavingsCalculator";
import { Chart, ArcElement, Tooltip as ChartTooltip, DoughnutController } from 'chart.js';

Chart.register(ArcElement, ChartTooltip, DoughnutController);

export default function SavingsCalculator() {
  const { depositResult, installmentResult, calculateDeposit, calculateInstallment } = useSavingsCalculator();
  const [tab, setTab] = useState<'deposit' | 'installment'>('deposit');

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
    try {
      calculateDeposit(
        parseAmt(dPrincipal),
        parseFloat(dRate),
        parseInt(dPeriod),
        dInterest as 'simple' | 'compound',
        dTax as 'normal' | 'preferred' | 'exempt'
      );
    } catch (e: any) { alert(e.message); }
  };

  const onInstallment = () => {
    try {
      calculateInstallment(
        parseAmt(iMonthly),
        parseFloat(iRate),
        parseInt(iPeriod),
        iInterest as 'simple' | 'compound',
        iTax as 'normal' | 'preferred' | 'exempt'
      );
    } catch (e: any) { alert(e.message); }
  };

  const renderChart = (ref: any, inst: any, p: number, inter: number, tax: number) => {
    if (ref.current) {
      if (inst.current) inst.current.destroy();
      inst.current = new Chart(ref.current.getContext("2d"), {
        type: "doughnut",
        data: { labels: ['원금', '세후이자', '이자소득세'], datasets: [{ data: [p, Math.max(0, inter - tax), tax], backgroundColor: ['#1a56e8', '#00c9a7', '#ef4444'], borderWidth: 0, hoverOffset: 8 }] },
        options: { cutout: '62%', plugins: { legend: { display: false } } }
      });
    }
  };

  const saveGoal = (type: string, title: string, current: number, target: number) => {
    const goals = JSON.parse(localStorage.getItem('fc_goals') || '[]');
    const newGoal = {
      id: Date.now().toString(),
      calcType: type,
      title: title,
      targetAmt: target,
      currentAmt: current,
      dateStr: new Date().toLocaleDateString('ko-KR'),
      isCompleted: false,
      link: '/savings-calculator'
    };
    localStorage.setItem('fc_goals', JSON.stringify([newGoal, ...goals].slice(0, 5))); // Keep max 5
    window.dispatchEvent(new Event('fc_goal_updated'));
    alert('내 재무 목표에 저장되었습니다! 홈 화면에서 확인해보세요.');
  };

  useEffect(() => {
    if (tab === 'deposit' && depositResult) renderChart(chartRefD, chartInstD, depositResult.principal, depositResult.grossInterest, depositResult.taxAmount);
    if (tab === 'installment' && installmentResult) renderChart(chartRefI, chartInstI, installmentResult.totalPrincipal, installmentResult.grossInterest, installmentResult.taxAmount);
  }, [depositResult, installmentResult, tab]);

  const activeStyle = { background: 'linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)', boxShadow: '0 4px 12px rgba(26, 86, 232, 0.35)' };

  return (
    <>
      <div className="tab-switcher" role="tablist">
        <button className={`tab-btn ${tab === 'deposit' ? 'active' : ''}`} onClick={() => setTab('deposit')} style={tab === 'deposit' ? activeStyle : {}}>🏦 예금 (거치식)</button>
        <button className={`tab-btn ${tab === 'installment' ? 'active' : ''}`} onClick={() => setTab('installment')} style={tab === 'installment' ? activeStyle : {}}>💰 적금 (적립식)</button>
      </div>

      <div className="tab-panel active">
        {tab === 'deposit' ? (
          <div className="calc-card">
            <h2 className="calc-card-title">정기 예금 이자 계산기</h2>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">예치 원금</label><div className="input-wrap"><input type="text" className="form-input large-input" value={dPrincipal} onChange={handleNum(setDPrincipal)} /><span className="input-unit">원</span></div></div>
              <div className="form-group"><label className="form-label">연 이자율</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={dRate} onChange={e => setDRate(e.target.value)} /><span className="input-unit">%</span></div></div>
              <div className="form-group"><label className="form-label">예치 기간</label><div className="input-wrap"><input type="number" className="form-input" value={dPeriod} onChange={e => setDPeriod(e.target.value)} /><span className="input-unit">개월</span></div></div>
              <div className="form-group" style={{ marginTop: '12px' }}><label className="form-label">이자 계산 방식</label><div className="radio-group"><label className="radio-label"><input type="radio" checked={dInterest === 'simple'} onChange={() => setDInterest('simple')} /><span className="radio-custom"></span> 단리</label><label className="radio-label"><input type="radio" checked={dInterest === 'compound'} onChange={() => setDInterest('compound')} /><span className="radio-custom"></span> 월복리</label></div></div>
              <div className="form-group" style={{ marginTop: '12px' }}><label className="form-label">세금 우대</label><div className="radio-group"><label className="radio-label"><input type="radio" checked={dTax === 'normal'} onChange={() => setDTax('normal')} /><span className="radio-custom"></span> 일반 (15.4%)</label><label className="radio-label"><input type="radio" checked={dTax === 'preferred'} onChange={() => setDTax('preferred')} /><span className="radio-custom"></span> 우대 (9.9%)</label><label className="radio-label"><input type="radio" checked={dTax === 'exempt'} onChange={() => setDTax('exempt')} /><span className="radio-custom"></span> 비과세</label></div></div>
            </div>
            <button className="calc-btn" onClick={onDeposit} style={{ background: 'linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)', boxShadow: '0 4px 16px rgba(26, 86, 232, 0.4)' }}>⚡ 예금 계산하기</button>
          </div>
        ) : (
          <div className="calc-card">
            <h2 className="calc-card-title">정기 적금 이자 계산기</h2>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">월 납입액</label><div className="input-wrap"><input type="text" className="form-input large-input" value={iMonthly} onChange={handleNum(setIMonthly)} /><span className="input-unit">원</span></div></div>
              <div className="form-group"><label className="form-label">연 이자율</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={iRate} onChange={e => setIRate(e.target.value)} /><span className="input-unit">%</span></div></div>
              <div className="form-group"><label className="form-label">납입 기간</label><div className="input-wrap"><input type="number" className="form-input" value={iPeriod} onChange={e => setIPeriod(e.target.value)} /><span className="input-unit">개월</span></div></div>
              <div className="form-group" style={{ marginTop: '12px' }}><label className="form-label">이자 계산 방식</label><div className="radio-group"><label className="radio-label"><input type="radio" checked={iInterest === 'simple'} onChange={() => setIInterest('simple')} /><span className="radio-custom"></span> 단리</label><label className="radio-label"><input type="radio" checked={iInterest === 'compound'} onChange={() => setIInterest('compound')} /><span className="radio-custom"></span> 월복리</label></div></div>
              <div className="form-group" style={{ marginTop: '12px' }}><label className="form-label">세금 우대</label><div className="radio-group"><label className="radio-label"><input type="radio" checked={iTax === 'normal'} onChange={() => setITax('normal')} /><span className="radio-custom"></span> 일반 (15.4%)</label><label className="radio-label"><input type="radio" checked={iTax === 'preferred'} onChange={() => setITax('preferred')} /><span className="radio-custom"></span> 우대 (9.9%)</label><label className="radio-label"><input type="radio" checked={iTax === 'exempt'} onChange={() => setITax('exempt')} /><span className="radio-custom"></span> 비과세</label></div></div>
            </div>
            <button className="calc-btn" onClick={onInstallment} style={{ background: 'linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)', boxShadow: '0 4px 16px rgba(26, 86, 232, 0.4)' }}>⚡ 적금 계산하기</button>
          </div>
        )}

        {(tab === 'deposit' && depositResult) && (
          <div className="result-card fade-in" style={{ borderColor: '#1a56e8', marginTop: '20px' }}>
            <h3 className="result-title">🏦 예금 계산 결과</h3>
            <div className="result-summary-box" style={{ background: 'linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)' }}>
              <div className="summary-label">만기 세후 수령액</div>
              <div className="summary-amount">{formatKRW(depositResult.netMaturity)}원</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
              <div className="result-item"><div className="result-item-label">예치 원금</div><div className="result-item-value">{formatKRW(depositResult.principal)}원</div></div>
              <div className="result-item"><div className="result-item-label">세전 이자</div><div className="result-item-value" style={{ color: '#10b981' }}>+{formatKRW(depositResult.grossInterest)}원</div></div>
              <div className="result-item"><div className="result-item-label">이자소득세</div><div className="result-item-value" style={{ color: '#ef4444' }}>-{formatKRW(depositResult.taxAmount)}원</div></div>
              <div className="result-item"><div className="result-item-label">세후 이자</div><div className="result-item-value" style={{ color: '#1a56e8' }}>+{formatKRW(depositResult.netInterest)}원</div></div>
            </div>
            <div className="chart-wrap" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}><div style={{ width: '240px', height: '240px' }}><canvas ref={chartRefD}></canvas></div></div>
            <button onClick={() => saveGoal('예금', `목돈 ${formatKRW(depositResult.principal)}원 불리기`, depositResult.principal, depositResult.netMaturity)} style={{ marginTop: '20px', width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-primary)' }}>⭐ 내 재무 목표로 저장하기</button>
          </div>
        )}

        {(tab === 'installment' && installmentResult) && (
          <div className="result-card fade-in" style={{ borderColor: '#1a56e8', marginTop: '20px' }}>
            <h3 className="result-title">💰 적금 계산 결과</h3>
            <div className="result-summary-box" style={{ background: 'linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)' }}>
              <div className="summary-label">만기 세후 수령액</div>
              <div className="summary-amount">{formatKRW(installmentResult.netMaturity)}원</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
              <div className="result-item"><div className="result-item-label">총 납입원금</div><div className="result-item-value">{formatKRW(installmentResult.totalPrincipal)}원</div></div>
              <div className="result-item"><div className="result-item-label">세전 이자</div><div className="result-item-value" style={{ color: '#10b981' }}>+{formatKRW(installmentResult.grossInterest)}원</div></div>
              <div className="result-item"><div className="result-item-label">이자소득세</div><div className="result-item-value" style={{ color: '#ef4444' }}>-{formatKRW(installmentResult.taxAmount)}원</div></div>
              <div className="result-item"><div className="result-item-label">세후 이자</div><div className="result-item-value" style={{ color: '#1a56e8' }}>+{formatKRW(installmentResult.netInterest)}원</div></div>
            </div>
            <div className="chart-wrap" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}><div style={{ width: '240px', height: '240px' }}><canvas ref={chartRefI}></canvas></div></div>
            <button onClick={() => saveGoal('적금', `월 ${formatKRW(installmentResult.monthly || 0)}원 모으기`, installmentResult.totalPrincipal, installmentResult.netMaturity)} style={{ marginTop: '20px', width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-primary)' }}>⭐ 내 재무 목표로 저장하기</button>
          </div>
        )}
      </div>
    </>
  );
}
