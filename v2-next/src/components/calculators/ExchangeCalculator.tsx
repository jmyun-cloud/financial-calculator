
"use client";
import { useState, useEffect } from "react";
import { useExchangeCalculator } from "@/hooks/useExchangeCalculator";

export default function ExchangeCalculator() {
  const { rates, lastUpdate, status, exResult, calculate, CURRENCIES } = useExchangeCalculator();
  const [amount, setAmount] = useState("");
  const [dir, setDir] = useState("from-krw");
  const [fee, setFee] = useState("1.75");
  const [target, setTarget] = useState("USD");
  const [customRates, setCustomRates] = useState<any>({});

  // Initialize custom rates from live rates when loaded
  useEffect(() => {
    if (status === 'success' && Object.keys(customRates).length === 0) {
      const initRates:any = {};
      Object.keys(rates).forEach(k => { initRates[k] = rates[k].toFixed(2); });
      setCustomRates(initRates);
    }
  }, [rates, status]);

  const formatKRW = (n: number) => Math.round(n).toLocaleString("ko-KR");
  const parseAmt = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
  const handleNum = (setter: any) => (e: any) => { const val = e.target.value.replace(/[^0-9]/g, ""); setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : ""); };

  const onCalculate = () => {
    const rateNumbers:any = {};
    Object.keys(customRates).forEach(k => { rateNumbers[k] = parseFloat(customRates[k])||rates[k]; });
    try { calculate(parseAmt(amount), parseFloat(fee)||0, dir, target, rateNumbers); } catch(e:any){alert(e.message);}
  };

  return (
    <div className="tab-panel active">
      <div className="calc-card">
        <h2 className="calc-card-title">실시간 환율 수수료 계산기</h2>
        
        {status === 'loading' && <div className="badge" style={{background:'#f1f5f9', color:'#475569'}}>⏳ 실시간 환율 불러오는 중...</div>}
        {status === 'success' && <div className="badge success">🟢 실시간 연동 완료 ({lastUpdate})</div>}
        {status === 'error' && <div className="badge error">🔴 연동 실패 (최근 기준환율 적용)</div>}

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', margin:'20px 0', padding:'15px', background:'var(--surface-1)', borderRadius:'12px'}}>
          {CURRENCIES.map(c => (
            <div key={c.code} style={{display:'flex', flexDirection:'column'}}>
               <label style={{fontSize:'0.75rem', fontWeight:600}}>{c.code} ({c.unit}{c.symbol})</label>
               <input type="number" step="0.01" style={{padding:'6px', border:'1px solid var(--border)', borderRadius:'6px'}} value={customRates[c.code]||''} onChange={e=>setCustomRates({...customRates, [c.code]: e.target.value})} />
            </div>
          ))}
        </div>

        <div className="form-grid">
          <div className="form-group" style={{gridColumn:'span 2'}}>
             <div className="radio-group" style={{marginBottom:'10px'}}>
               <label className="radio-label"><input type="radio" checked={dir==='from-krw'} onChange={()=>{setDir('from-krw'); setAmount('');}} /><span className="radio-custom"></span> 원화 → 외화 (살 때)</label>
               <label className="radio-label"><input type="radio" checked={dir==='to-krw'} onChange={()=>{setDir('to-krw'); setAmount('');}} /><span className="radio-custom"></span> 외화 → 원화 (팔 때)</label>
             </div>
             <div className="input-wrap">
               <input type="text" className="form-input large-input" value={amount} placeholder={dir==='from-krw'?'1,000,000':'1,000'} onChange={handleNum(setAmount)} />
               <span className="input-unit">{dir==='from-krw'?'원':'외화'}</span>
             </div>
          </div>
          
          {dir === 'to-krw' && (
            <div className="form-group">
               <label className="form-label">보유 외화 선택</label>
               <select className="form-input" value={target} onChange={e=>setTarget(e.target.value)}>
                 {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label} ({c.code})</option>)}
               </select>
            </div>
          )}

          <div className="form-group">
             <label className="form-label">은행 환전 수수료율</label>
             <div className="input-wrap"><input type="number" step="0.1" className="form-input" value={fee} onChange={e=>setFee(e.target.value)} /><span className="input-unit">%</span></div>
             <p style={{fontSize:'0.75rem', opacity:0.7, marginTop:'4px'}}>일반적인 은행 현찰 살때/팔때 스프레드</p>
          </div>
        </div>
        <button className="calc-btn" onClick={onCalculate} style={{background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', boxShadow: '0 4px 16px rgba(30, 64, 175, 0.4)'}}>⚡ 정확한 환전 금액 계산하기</button>
      </div>

      {exResult && exResult.dir === 'from-krw' && (
        <div className="result-card fade-in" style={{borderColor: '#1e40af', marginTop:'20px'}}>
          <h3 className="result-title">💱 다국어 동시 환전 정보</h3>
          <div className="result-summary-box" style={{background:'#1e40af'}}>
            <div className="summary-label">원화 {formatKRW(exResult.amount)}원의 세계 가치 (수수료 {exResult.fee}% 삭감분 적용)</div>
            <div className="summary-amount">아래 박스 확인</div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:'10px', marginTop:'20px'}}>
             {exResult.cards.map((c:any) => (
                <div key={c.code} style={{background:'var(--surface-1)', padding:'15px', borderRadius:'12px', textAlign:'center', border:'1px solid var(--border)'}}>
                   <div style={{fontWeight:800, color:'#1e40af'}}>{c.code} {c.label}</div>
                   <div style={{fontSize:'1.2rem', margin:'10px 0'}}>{c.symbol}{c.amt.toLocaleString(undefined, {maximumFractionDigits:2})}</div>
                   <div style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>수수료 우대시: <br/>{c.symbol}{c.noFeeAmt.toLocaleString(undefined, {maximumFractionDigits:2})}</div>
                </div>
             ))}
          </div>
        </div>
      )}

      {exResult && exResult.dir === 'to-krw' && (
        <div className="result-card fade-in" style={{borderColor: '#1e40af', marginTop:'20px'}}>
          <h3 className="result-title">💵 외화 환전 (국내 현금화)</h3>
          <div className="result-summary-box" style={{background:'#1e40af'}}>
            <div className="summary-label">{exResult.cur.symbol}{exResult.amount.toLocaleString(undefined, {maximumFractionDigits:2})} {exResult.cur.label} 매도 (팔 때)</div>
            <div className="summary-amount">{formatKRW(exResult.krwAmount)}원 환전 가능</div>
          </div>
          <table className="deduction-table" style={{marginTop:'30px'}}>
            <tbody>
              <tr><td>기준 원 환율</td><td style={{textAlign:'right'}}>{exResult.r.toFixed(2)}원 (기준 {exResult.cur.unit}{exResult.cur.code})</td></tr>
              <tr><td>수수료 없는 순수 원화</td><td style={{textAlign:'right'}}>{formatKRW(exResult.krwNoFee)}원</td></tr>
              <tr><td>은행/공항 손실 수수료</td><td style={{textAlign:'right', color:'var(--danger)'}}>-{formatKRW(exResult.krwNoFee - exResult.krwAmount)}원</td></tr>
              <tr style={{borderTop:'2px solid #1e40af'}}><td style={{fontWeight:700}}>실수령 원화 금액</td><td style={{textAlign:'right', fontWeight:700, color:'#1e40af'}}>{formatKRW(exResult.krwAmount)}원</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
