
"use client";
import { useState } from "react";
import { useJeonseCalculator } from "@/hooks/useJeonseCalculator";

export default function JeonseCalculator() {
  const { tmResult, tdResult, adjResult, calcToMonthly, calcToDeposit, calcAdjust } = useJeonseCalculator();
  const [tab, setTab] = useState<'tm'|'td'|'adj'>('tm');

  const [tmJeonse, setTmJeonse] = useState("");
  const [tmDeposit, setTmDeposit] = useState("");
  const [tmRate, setTmRate] = useState("5.5");

  const [tdMonthly, setTdMonthly] = useState("");
  const [tdDeposit, setTdDeposit] = useState("");
  const [tdRate, setTdRate] = useState("5.5");

  const [adjCurMonthly, setAdjCurMonthly] = useState("");
  const [adjCurDeposit, setAdjCurDeposit] = useState("");
  const [adjNewDeposit, setAdjNewDeposit] = useState("");
  const [adjRate, setAdjRate] = useState("5.5");

  const formatKRW = (n: number) => Math.round(n).toLocaleString("ko-KR");
  const parseAmt = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
  const handleNum = (setter: any) => (e: any) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : "");
  };

  const onTm = () => { try { calcToMonthly(parseAmt(tmJeonse), parseAmt(tmDeposit), parseFloat(tmRate)||5.5); } catch(e:any) { alert(e.message); } };
  const onTd = () => { try { calcToDeposit(parseAmt(tdMonthly), parseAmt(tdDeposit), parseFloat(tdRate)||5.5); } catch(e:any) { alert(e.message); } };
  const onAdj = () => { try { calcAdjust(parseAmt(adjCurMonthly), parseAmt(adjCurDeposit), parseAmt(adjNewDeposit), parseFloat(adjRate)||5.5); } catch(e:any) { alert(e.message); } };

  const activeStyle = {background:'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow:'0 4px 12px rgba(5, 150, 105, 0.35)'};
  const themeColor = '#059669';

  return (
    <div className="tab-panel active">
      <div className="tab-switcher" role="tablist">
        <button className={`tab-btn ${tab==='tm'?'active':''}`} onClick={()=>setTab('tm')} style={tab==='tm'?activeStyle:{}}>📉 전세 → 월세</button>
        <button className={`tab-btn ${tab==='td'?'active':''}`} onClick={()=>setTab('td')} style={tab==='td'?activeStyle:{}}>📈 월세 → 전세</button>
        <button className={`tab-btn ${tab==='adj'?'active':''}`} onClick={()=>setTab('adj')} style={tab==='adj'?activeStyle:{}}>⚖️ 보증금 ↔ 월세 조정</button>
      </div>

      {tab === 'tm' && (
        <div className="calc-card">
          <h2 className="calc-card-title">전세보증금 일부 월세 전환</h2>
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">기존 전세 보증금</label><div className="input-wrap"><input type="text" className="form-input large-input" value={tmJeonse} onChange={handleNum(setTmJeonse)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">전환 후 남길 보증금</label><div className="input-wrap"><input type="text" className="form-input" value={tmDeposit} onChange={handleNum(setTmDeposit)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">전월세 전환율</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={tmRate} onChange={e=>setTmRate(e.target.value)} /><span className="input-unit">%</span></div></div>
          </div>
          <button className="calc-btn" onClick={onTm} style={{background:`linear-gradient(135deg, ${themeColor} 0%, #047857 100%)`, boxShadow:`0 4px 16px rgba(5,150,105,0.4)`}}>⚡ 예상 월세 계산하기</button>
          
          {tmResult && (
            <div className="result-card fade-in" style={{borderColor: themeColor, marginTop:'20px'}}>
              <h3 className="result-title">📉 전세 → 월세 전환 결과</h3>
              <div className="result-summary-box" style={{background:`linear-gradient(135deg, ${themeColor} 0%, #047857 100%)`}}>
                <div className="summary-label">월 납부 금액 (전환율 {tmResult.rate}%)</div>
                <div className="summary-amount">{formatKRW(tmResult.monthly)}원 / 월</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'20px'}}>
                <div className="result-item"><div className="result-item-label" style={{color:'var(--text-secondary)'}}>전환 대상 금액</div><div className="result-item-value">{formatKRW(tmResult.diff)}원</div></div>
                <div className="result-item"><div className="result-item-label" style={{color:'var(--text-secondary)'}}>적용 전환율</div><div className="result-item-value">{tmResult.rate}%</div></div>
                {tmResult.rate > tmResult.legalRate && (
                  <div className="result-item" style={{gridColumn:'span 2'}}><div className="result-item-label">법정 전환율({tmResult.legalRate}%) 기준 월세</div><div className="result-item-value" style={{color:'var(--danger)'}}>{formatKRW(tmResult.legalMonthly)}원/월</div></div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'td' && (
        <div className="calc-card">
          <h2 className="calc-card-title">월세를 전세로 환산</h2>
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">현재 납부하는 월세</label><div className="input-wrap"><input type="text" className="form-input large-input" value={tdMonthly} onChange={handleNum(setTdMonthly)} /><span className="input-unit">원/월</span></div></div>
            <div className="form-group"><label className="form-label">현재 보증금</label><div className="input-wrap"><input type="text" className="form-input" value={tdDeposit} onChange={handleNum(setTdDeposit)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">전월세 상한율(적용율)</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={tdRate} onChange={e=>setTdRate(e.target.value)} /><span className="input-unit">%</span></div></div>
          </div>
          <button className="calc-btn" onClick={onTd} style={{background:`linear-gradient(135deg, ${themeColor} 0%, #047857 100%)`, boxShadow:`0 4px 16px rgba(5,150,105,0.4)`}}>⚡ 전세 환산액 계산하기</button>
          
          {tdResult && (
            <div className="result-card fade-in" style={{borderColor: themeColor, marginTop:'20px'}}>
              <h3 className="result-title">📈 전세 환산 결과</h3>
              <div className="result-summary-box" style={{background:`linear-gradient(135deg, ${themeColor} 0%, #047857 100%)`}}>
                <div className="summary-label">전세 환산 금액</div>
                <div className="summary-amount">{formatKRW(tdResult.totalJeonse)}원</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'20px'}}>
                <div className="result-item"><div className="result-item-label" style={{color:'var(--text-secondary)'}}>현재 보증금</div><div className="result-item-value">{formatKRW(tdResult.deposit)}원</div></div>
                <div className="result-item"><div className="result-item-label" style={{color:'var(--text-secondary)'}}>월세 → 전세 환산액</div><div className="result-item-value" style={{color:themeColor}}>+{formatKRW(tdResult.addDeposit)}원</div></div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'adj' && (
        <div className="calc-card">
          <h2 className="calc-card-title">보증금 / 월세 상호 조정 계산</h2>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">현재 보증금</label><div className="input-wrap"><input type="text" className="form-input" value={adjCurDeposit} onChange={handleNum(setAdjCurDeposit)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">현재 월세</label><div className="input-wrap"><input type="text" className="form-input" value={adjCurMonthly} onChange={handleNum(setAdjCurMonthly)} /><span className="input-unit">원/월</span></div></div>
            <div className="form-group"><label className="form-label">변경 후 보증금</label><div className="input-wrap"><input type="text" className="form-input" value={adjNewDeposit} onChange={handleNum(setAdjNewDeposit)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">전환율</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={adjRate} onChange={e=>setAdjRate(e.target.value)} /><span className="input-unit">%</span></div></div>
          </div>
          <button className="calc-btn" onClick={onAdj} style={{background:`linear-gradient(135deg, ${themeColor} 0%, #047857 100%)`, boxShadow:`0 4px 16px rgba(5,150,105,0.4)`}}>⚡ 변경 후 세/월세 계산</button>
          
          {adjResult && (
             <div className="result-card fade-in" style={{borderColor: themeColor, marginTop:'20px'}}>
              <h3 className="result-title">⚖️ 조정 결과</h3>
              <div className="result-summary-box" style={{background:`linear-gradient(135deg, ${themeColor} 0%, #047857 100%)`}}>
                <div className="summary-label">변경 후 예정 월세</div>
                <div className="summary-amount">{formatKRW(adjResult.newMonthly)}원 / 월</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'20px'}}>
                <div className="result-item"><div className="result-item-label" style={{color:'var(--text-secondary)'}}>보증금 변동액</div><div className="result-item-value" style={{color:adjResult.depositDiff>0?'var(--primary)':'var(--danger)'}}>{adjResult.depositDiff>0?'+':''}{formatKRW(adjResult.depositDiff)}원</div></div>
                <div className="result-item"><div className="result-item-label" style={{color:'var(--text-secondary)'}}>예상 월세 변동액</div><div className="result-item-value" style={{color:adjResult.depositDiff>0?'var(--danger)':'var(--primary)'}}>{adjResult.depositDiff>0?'-':'+'}{formatKRW(Math.abs(adjResult.monthlyChange))}원</div></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
