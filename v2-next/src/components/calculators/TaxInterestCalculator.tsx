
"use client";
import { useState } from "react";
import { useTaxInterestCalculator } from "@/hooks/useTaxInterestCalculator";

export default function TaxInterestCalculator() {
  const { taxResult, calculate } = useTaxInterestCalculator();
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("3.5");
  const [months, setMonths] = useState("12");
  const [type, setType] = useState("simple");

  const formatKRW = (n: number) => Math.round(n).toLocaleString("ko-KR");
  const parseAmt = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
  const handleNum = (setter: any) => (e: any) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : "");
  };

  const onCalculate = () => {
    try { calculate(parseAmt(amount), parseFloat(rate), parseInt(months), type); } catch(e:any){alert(e.message);}
  };

  return (
    <div className="tab-panel active">
      <div className="calc-card">
        <h2 className="calc-card-title">예적금 이자 세금 계산기</h2>
        <div className="form-grid">
          <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">예치 원금</label><div className="input-wrap"><input type="text" className="form-input large-input" value={amount} onChange={handleNum(setAmount)} /><span className="input-unit">원</span></div></div>
          <div className="form-group"><label className="form-label">연 이자율</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={rate} onChange={e=>setRate(e.target.value)} /><span className="input-unit">%</span></div></div>
          <div className="form-group"><label className="form-label">예치 기간</label><div className="input-wrap"><input type="number" className="form-input" value={months} onChange={e=>setMonths(e.target.value)} /><span className="input-unit">개월</span></div></div>
          <div className="form-group" style={{gridColumn:'span 2', marginTop:'12px'}}><label className="form-label">계산 방식</label><div className="radio-group"><label className="radio-label"><input type="radio" checked={type==='simple'} onChange={()=>setType('simple')} /><span className="radio-custom"></span> 단리</label><label className="radio-label"><input type="radio" checked={type==='compound'} onChange={()=>setType('compound')} /><span className="radio-custom"></span> 복리</label></div></div>
        </div>
        <button className="calc-btn" onClick={onCalculate} style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'}}>⚡ 이자소득세 계산하기</button>
      </div>

      {taxResult && (
        <div className="result-card fade-in" style={{borderColor: '#10b981', marginTop:'20px'}}>
          <h3 className="result-title">💰 세금 유형별 비교 결과</h3>
          <div className="result-summary-box" style={{background:'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
            <div className="summary-label">세전 이자 ({taxResult.rate}% / {taxResult.months}개월 {taxResult.type==='compound'?'복리':'단리'})</div>
            <div className="summary-amount">{formatKRW(taxResult.grossInterest)}원</div>
          </div>
          
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginTop:'20px'}}>
            {taxResult.results.map((r:any) => (
              <div key={r.code} style={{padding:'15px', borderRadius:'12px', border:`2px solid ${r.code===taxResult.best.code?'#10b981':'var(--border)'}`, background:r.code===taxResult.best.code?'#10b98110':''}}>
                <div style={{fontWeight:700, color:r.code===taxResult.best.code?'#10b981':'var(--text-primary)'}}>{r.label} ({r.rate}%)</div>
                <div style={{fontSize:'1.2rem', fontWeight:800, margin:'10px 0'}}>{formatKRW(r.net)}원</div>
                <div style={{fontSize:'0.9rem', color:'var(--danger)'}}>세금: -{formatKRW(r.taxAmount)}원</div>
                <div style={{marginTop:'10px', fontSize:'0.85rem', color:r.code===taxResult.best.code?'#10b981':'var(--text-secondary)'}}>{r.code===taxResult.best.code?'✅ 가장 유리':`대비 -${formatKRW(taxResult.best.net - r.net)}원`}</div>
              </div>
            ))}
          </div>

          <table className="deduction-table" style={{marginTop:'30px'}}>
            <tbody>
              <tr><td>예치 원금</td><td style={{textAlign:'right'}}>{formatKRW(taxResult.principal)}원</td></tr>
              <tr><td>세전 이자</td><td style={{textAlign:'right', color:'#10b981'}}>+{formatKRW(taxResult.grossInterest)}원</td></tr>
              <tr><td>일반과세 이자소득세 (15.4%)</td><td style={{textAlign:'right', color:'var(--danger)'}}>-{formatKRW(taxResult.results[0].taxAmount)}원</td></tr>
              <tr style={{borderTop:'2px solid #10b981', background:'var(--surface-1)'}}><td style={{fontWeight:700}}>최종 세후 수령액 (일반)</td><td style={{textAlign:'right', fontWeight:700, color:'#10b981'}}>{formatKRW(taxResult.results[0].total)}원</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
