
"use client";
import { useState } from "react";
import { useInflationCalculator } from "@/hooks/useInflationCalculator";

export default function InflationCalculator() {
  const { fvResult, pvResult, rrResult, calcFuture, calcPresent, calcRealReturn } = useInflationCalculator();
  const [tab, setTab] = useState<'fv'|'pv'|'rr'>('fv');

  const [fvAmt, setFvAmt] = useState(""); const [fvRate, setFvRate] = useState("3.0"); const [fvYears, setFvYears] = useState("20");
  const [pvAmt, setPvAmt] = useState(""); const [pvRate, setPvRate] = useState("3.0"); const [pvYears, setPvYears] = useState("20");
  const [rrAmt, setRrAmt] = useState(""); const [rrNom, setRrNom] = useState("5.0"); const [rrInf, setRrInf] = useState("3.0"); const [rrYears, setRrYears] = useState("10");

  const formatKRW = (n: number) => Math.round(n).toLocaleString("ko-KR");
  const parseAmt = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
  const handleNum = (setter: any) => (e: any) => { const val = e.target.value.replace(/[^0-9]/g, ""); setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : ""); };

  const onFv = () => { try { calcFuture(parseAmt(fvAmt), parseFloat(fvRate)||0, parseInt(fvYears)||0); } catch(e:any){alert(e.message);} };
  const onPv = () => { try { calcPresent(parseAmt(pvAmt), parseFloat(pvRate)||0, parseInt(pvYears)||0); } catch(e:any){alert(e.message);} };
  const onRr = () => { try { calcRealReturn(parseAmt(rrAmt), parseFloat(rrNom)||0, parseFloat(rrInf)||0, parseInt(rrYears)||0); } catch(e:any){alert(e.message);} };

  const colors:any = { fv:'#f59e0b', pv:'#ef4444', rr:'#8b5cf6' };

  return (
    <div className="tab-panel active">
      <div className="tab-switcher" role="tablist">
        <button className={`tab-btn ${tab==='fv'?'active':''}`} onClick={()=>setTab('fv')} style={tab==='fv'?{background:'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow:'0 4px 12px #f59e0b50'}:{}}>미래 화폐가치</button>
        <button className={`tab-btn ${tab==='pv'?'active':''}`} onClick={()=>setTab('pv')} style={tab==='pv'?{background:'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow:'0 4px 12px #ef444450'}:{}}>현재 화폐가치</button>
        <button className={`tab-btn ${tab==='rr'?'active':''}`} onClick={()=>setTab('rr')} style={tab==='rr'?{background:'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', boxShadow:'0 4px 12px #8b5cf650'}:{}}>실질 수익률</button>
      </div>

      {tab === 'fv' && (
        <div className="calc-card">
          <h2 className="calc-card-title">미래 필요 금액 (인플레이션 반영)</h2>
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">현재 목표 금액</label><div className="input-wrap"><input type="text" className="form-input large-input" value={fvAmt} onChange={handleNum(setFvAmt)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">예상 물가상승률</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={fvRate} onChange={e=>setFvRate(e.target.value)} /><span className="input-unit">%</span></div></div>
            <div className="form-group"><label className="form-label">달성 소요 기간</label><div className="input-wrap"><input type="number" className="form-input" value={fvYears} onChange={e=>setFvYears(e.target.value)} /><span className="input-unit">년</span></div></div>
          </div>
          <button className="calc-btn" onClick={onFv} style={{background:'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>⚡ 금액 환산하기</button>
          {fvResult && (
            <div className="result-card fade-in" style={{borderColor: colors.fv, marginTop:'20px'}}>
              <h3 className="result-title">📈 미래 화폐가치 환산 결과</h3>
              <div className="result-summary-box" style={{background:`linear-gradient(135deg, ${colors.fv} 0%, #d97706 100%)`}}>
                <div className="summary-label">{fvResult.years}년 후 동일한 구매력을 유지하기 위한 금액</div>
                <div className="summary-amount">{formatKRW(fvResult.future)}원</div>
              </div>
              <div className="result-notice">물가상승 지출 방어를 위해 <strong>{formatKRW(fvResult.increase)}원</strong>이 미래에 더 필요합니다.</div>
            </div>
          )}
        </div>
      )}

      {tab === 'pv' && (
        <div className="calc-card">
          <h2 className="calc-card-title">목돈의 실질 구매력 하락 알리미</h2>
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">현재 보유 현금</label><div className="input-wrap"><input type="text" className="form-input large-input" value={pvAmt} onChange={handleNum(setPvAmt)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">예상 물가상승률</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={pvRate} onChange={e=>setPvRate(e.target.value)} /><span className="input-unit">%</span></div></div>
            <div className="form-group"><label className="form-label">기회비용 상실 기간</label><div className="input-wrap"><input type="number" className="form-input" value={pvYears} onChange={e=>setPvYears(e.target.value)} /><span className="input-unit">년</span></div></div>
          </div>
          <button className="calc-btn" onClick={onPv} style={{background:'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}}>⚡ 현재가치 환산하기</button>
          {pvResult && (
            <div className="result-card fade-in" style={{borderColor: colors.pv, marginTop:'20px'}}>
              <h3 className="result-title">🔻 자산 가치 하락 결과</h3>
              <div className="result-summary-box" style={{background:`linear-gradient(135deg, ${colors.pv} 0%, #dc2626 100%)`}}>
                <div className="summary-label">{pvResult.years}년 후 이 돈의 실질 가치</div>
                <div className="summary-amount">{formatKRW(pvResult.realValue)}원 상당</div>
              </div>
              <div className="result-notice">현재 상태로 현금을 쥐고 있으면 <strong>{formatKRW(pvResult.lost)}원</strong>어치의 구매력이 말소됩니다.</div>
            </div>
          )}
        </div>
      )}

      {tab === 'rr' && (
        <div className="calc-card">
          <h2 className="calc-card-title">인플레이션 반영 실질 수익률</h2>
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">투자기관 명시 내 수익률 (명목수익률)</label><div className="input-wrap"><input type="number" step="0.1" className="form-input large-input" value={rrNom} onChange={e=>setRrNom(e.target.value)} /><span className="input-unit">%</span></div></div>
            <div className="form-group"><label className="form-label">예상 물가상승률</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={rrInf} onChange={e=>setRrInf(e.target.value)} /><span className="input-unit">%</span></div></div>
            <div className="form-group"><label className="form-label">투자 기간</label><div className="input-wrap"><input type="number" className="form-input" value={rrYears} onChange={e=>setRrYears(e.target.value)} /><span className="input-unit">년</span></div></div>
            <div className="form-group" style={{gridColumn:'span 2'}}><label className="form-label">투자 원금 (선택)</label><div className="input-wrap"><input type="text" className="form-input" value={rrAmt} onChange={handleNum(setRrAmt)} /><span className="input-unit">원</span></div></div>
          </div>
          <button className="calc-btn" onClick={onRr} style={{background:'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}}>⚡ 실질 수익률 확인하기</button>
          {rrResult && (
             <div className="result-card fade-in" style={{borderColor: colors.rr, marginTop:'20px'}}>
              <h3 className="result-title">🔮 실질 투자 결과</h3>
              <div className="result-summary-box" style={{background:`linear-gradient(135deg, ${colors.rr} 0%, #7c3aed 100%)`}}>
                <div className="summary-label">물가상승률을 체감한 진짜 수익률</div>
                <div className="summary-amount">{rrResult.real >= 0 ? '+' : ''}{rrResult.real.toFixed(2)}%</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'20px'}}>
                <div className="result-item"><div className="result-item-label">명목상 자산</div><div className="result-item-value">{formatKRW(rrResult.nominalFinal)}원</div></div>
                <div className="result-item"><div className="result-item-label">실질적 부의 증식 기준자산</div><div className="result-item-value" style={{color:colors.rr}}>{formatKRW(rrResult.realFinal)}원</div></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
