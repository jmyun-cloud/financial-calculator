
"use client";
import { useState } from "react";
import { usePensionCalculator } from "@/hooks/usePensionCalculator";

export default function PensionCalculator() {
  const { nationalResult, retirementResult, personalResult, totalResult, calcNational, calcRetirement, calcPersonal, calcTotal } = usePensionCalculator();
  const [tab, setTab] = useState<'national' | 'retirement' | 'personal' | 'total'>('national');

  // National
  const [npIncome, setNpIncome] = useState("");
  const [npYears, setNpYears] = useState("20");
  const [npAge, setNpAge] = useState("65");
  // Retirement
  const [rpSalary, setRpSalary] = useState("");
  const [rpYears, setRpYears] = useState("10");
  const [rpPyears, setRpPyears] = useState("20");
  const [rpRate, setRpRate] = useState("3");
  // Personal
  const [ppMonthly, setPpMonthly] = useState("");
  const [ppAccYears, setPpAccYears] = useState("25");
  const [ppRate, setPpRate] = useState("5");
  const [ppRecYears, setPpRecYears] = useState("20");
  // Total
  const [totNational, setTotNational] = useState("");
  const [totRetirement, setTotRetirement] = useState("");
  const [totPersonal, setTotPersonal] = useState("");
  const [totNeed, setTotNeed] = useState("3000000");

  const formatKRW = (n: number) => Math.round(n).toLocaleString("ko-KR");
  const parseAmt = (s: string) => parseFloat(String(s).replace(/,/g, "")) || 0;
  const handleNum = (setter: any) => (e: any) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setter(val ? parseInt(val, 10).toLocaleString("ko-KR") : "");
  };

  const onNat = () => { try { calcNational(parseAmt(npIncome), parseInt(npYears) || 0, parseInt(npAge) || 0); } catch (e: any) { alert(e.message); } };
  const onRet = () => { try { calcRetirement(parseAmt(rpSalary), parseInt(rpYears) || 0, parseInt(rpPyears) || 0, parseFloat(rpRate) || 0); } catch (e: any) { alert(e.message); } };
  const onPer = () => { try { calcPersonal(parseAmt(ppMonthly), parseInt(ppAccYears) || 0, parseFloat(ppRate) || 0, parseInt(ppRecYears) || 0); } catch (e: any) { alert(e.message); } };
  const onTot = () => { try { calcTotal(parseAmt(totNational), parseAmt(totRetirement), parseAmt(totPersonal), parseAmt(totNeed)); } catch (e: any) { alert(e.message); } };

  const themeColors: any = { national: '#0284c7', retirement: '#059669', personal: '#7c3aed', total: '#334155' };
  const bgColors: any = { national: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', retirement: 'linear-gradient(135deg, #059669 0%, #047857 100%)', personal: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', total: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)' };

  return (
    <div className="tab-panel active">
      <div className="tab-switcher" role="tablist">
        {['national', 'retirement', 'personal', 'total'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t as any)} style={tab === t ? { background: bgColors[t], boxShadow: `0 4px 12px ${themeColors[t]}50` } : {}}>
            {t === 'national' ? '🏢 국민연금' : t === 'retirement' ? '💼 퇴직연금' : t === 'personal' ? '💰 개인연금' : '📊 통합 분석'}
          </button>
        ))}
      </div>

      {tab === 'national' && (
        <div className="calc-card">
          <h2 className="calc-card-title">국민연금 (노령연금) 예상 수령액 <span className="year-badge" style={{ background: '#0284c720', color: '#0284c7', border: '1px solid #0284c740' }}>간이계산</span></h2>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">월 평균 소득월액</label><div className="input-wrap"><input type="text" className="form-input large-input" value={npIncome} onChange={handleNum(setNpIncome)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">총 가입 기간</label><div className="input-wrap"><input type="number" className="form-input" value={npYears} onChange={e => setNpYears(e.target.value)} /><span className="input-unit">년</span></div></div>
            <div className="form-group"><label className="form-label">수령 시작 나이</label><div className="input-wrap"><input type="number" className="form-input" value={npAge} onChange={e => setNpAge(e.target.value)} /><span className="input-unit">세</span></div></div>
          </div>
          <button className="calc-btn" onClick={onNat} style={{ background: bgColors.national }}>⚡ 연금 계산하기</button>

          {nationalResult && (
            <div className="result-card fade-in" style={{ borderColor: themeColors.national, marginTop: '20px' }}>
              <h3 className="result-title">🏢 국민연금 예상 결과</h3>
              <div className="result-summary-box" style={{ background: bgColors.national }}>
                <div className="summary-label">예상 국민연금 월 수령액 ({nationalResult.years}년 가입 / {nationalResult.age}세)</div>
                <div className="summary-amount">{formatKRW(nationalResult.monthly)}원 / 월</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                <div className="result-item"><div className="result-item-label">반영 소득월액 (상/하한 적용)</div><div className="result-item-value">{formatKRW(nationalResult.income)}원</div></div>
                <div className="result-item"><div className="result-item-label">조기/연기 조정율</div><div className="result-item-value">{nationalResult.adjPercent > 0 ? '+' : ''}{nationalResult.adjPercent}%</div></div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'retirement' && (
        <div className="calc-card">
          <h2 className="calc-card-title">퇴직연금 수령액 (IRP)</h2>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">목표/현재 월 급여</label><div className="input-wrap"><input type="text" className="form-input large-input" value={rpSalary} onChange={handleNum(setRpSalary)} /><span className="input-unit">원</span></div></div>
            <div className="form-group"><label className="form-label">근속 기간</label><div className="input-wrap"><input type="number" className="form-input" value={rpYears} onChange={e => setRpYears(e.target.value)} /><span className="input-unit">년</span></div></div>
            <div className="form-group"><label className="form-label">운용 수익률 (IRP 등)</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={rpRate} onChange={e => setRpRate(e.target.value)} /><span className="input-unit">%</span></div></div>
            <div className="form-group"><label className="form-label">연금 수령 기간</label><div className="input-wrap"><input type="number" className="form-input" value={rpPyears} onChange={e => setRpPyears(e.target.value)} /><span className="input-unit">년</span></div></div>
          </div>
          <button className="calc-btn" onClick={onRet} style={{ background: bgColors.retirement }}>⚡ 연금 계산하기</button>

          {retirementResult && (
            <div className="result-card fade-in" style={{ borderColor: themeColors.retirement, marginTop: '20px' }}>
              <h3 className="result-title">💼 퇴직연금 예상 결과</h3>
              <div className="result-summary-box" style={{ background: bgColors.retirement }}>
                <div className="summary-label">예상 퇴직연금 월 수령액 ({retirementResult.pYears}년 분할)</div>
                <div className="summary-amount">{formatKRW(retirementResult.monthlyPension)}원 / 월</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                <div className="result-item"><div className="result-item-label">예상 총 퇴직금 원금</div><div className="result-item-value">{formatKRW(retirementResult.totalRetirement)}원</div></div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'personal' && (
        <div className="calc-card">
          <h2 className="calc-card-title">개인연금저축 목표 수령액</h2>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">월 납입 목표액</label><div className="input-wrap"><input type="text" className="form-input large-input" value={ppMonthly} onChange={handleNum(setPpMonthly)} /><span className="input-unit">원/월</span></div></div>
            <div className="form-group"><label className="form-label">납입 기간</label><div className="input-wrap"><input type="number" className="form-input" value={ppAccYears} onChange={e => setPpAccYears(e.target.value)} /><span className="input-unit">년</span></div></div>
            <div className="form-group"><label className="form-label">운용 수익률</label><div className="input-wrap"><input type="number" step="0.1" className="form-input" value={ppRate} onChange={e => setPpRate(e.target.value)} /><span className="input-unit">%</span></div></div>
            <div className="form-group"><label className="form-label">연금 수령 기간</label><div className="input-wrap"><input type="number" className="form-input" value={ppRecYears} onChange={e => setPpRecYears(e.target.value)} /><span className="input-unit">년</span></div></div>
          </div>
          <button className="calc-btn" onClick={onPer} style={{ background: bgColors.personal }}>⚡ 연금 계산하기</button>

          {personalResult && (
            <div className="result-card fade-in" style={{ borderColor: themeColors.personal, marginTop: '20px' }}>
              <h3 className="result-title">💰 개인연금 예상 결과</h3>
              <div className="result-summary-box" style={{ background: bgColors.personal }}>
                <div className="summary-label">개인연금 월 예상액 ({personalResult.recYears}년 수령)</div>
                <div className="summary-amount">{formatKRW(personalResult.monthlyPension)}원 / 월</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                <div className="result-item"><div className="result-item-label">총 납입 원금</div><div className="result-item-value">{formatKRW(personalResult.totalInvested)}원</div></div>
                <div className="result-item"><div className="result-item-label">예상 최종 적립액</div><div className="result-item-value">{formatKRW(personalResult.accumulated)}원</div></div>
              </div>
              <button
                onClick={() => {
                  const goals = JSON.parse(localStorage.getItem('fc_goals') || '[]');
                  const newGoal = {
                    id: Date.now().toString(),
                    calcType: '개인연금',
                    title: `노후 대비 ${formatKRW(personalResult.accumulated)}원 모으기`,
                    targetAmt: personalResult.accumulated,
                    currentAmt: personalResult.totalInvested,
                    dateStr: new Date().toLocaleDateString('ko-KR'),
                    isCompleted: false,
                    link: '/pension-calculator'
                  };
                  localStorage.setItem('fc_goals', JSON.stringify([newGoal, ...goals].slice(0, 5)));
                  window.dispatchEvent(new Event('fc_goal_updated'));
                  alert('내 재무 목표에 저장되었습니다! 홈 화면에서 확인해보세요.');
                }}
                style={{ marginTop: '20px', width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                ⭐ 내 재무 목표로 저장하기
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'total' && (
        <div className="calc-card">
          <h2 className="calc-card-title">내 연금 3층탑 통합 분석</h2>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">노후 필요 생활비</label><div className="input-wrap"><input type="text" className="form-input large-input" value={totNeed} onChange={handleNum(setTotNeed)} /><span className="input-unit">원/월</span></div></div>
            <div className="form-group"><label className="form-label">국민연금 예상액</label><div className="input-wrap"><input type="text" className="form-input" value={totNational} onChange={handleNum(setTotNational)} /><span className="input-unit">원/월</span></div></div>
            <div className="form-group"><label className="form-label">퇴직연금 예상액</label><div className="input-wrap"><input type="text" className="form-input" value={totRetirement} onChange={handleNum(setTotRetirement)} /><span className="input-unit">원/월</span></div></div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">개인연금 예상액</label><div className="input-wrap"><input type="text" className="form-input" value={totPersonal} onChange={handleNum(setTotPersonal)} /><span className="input-unit">원/월</span></div></div>
          </div>
          <button className="calc-btn" onClick={onTot} style={{ background: bgColors.total }}>📊 종합 분석하기</button>

          {totalResult && (
            <div className="result-card fade-in" style={{ borderColor: themeColors.total, marginTop: '20px' }}>
              <h3 className="result-title">📊 종합 노후 진단</h3>
              <div className="result-summary-box" style={{ background: bgColors.total }}>
                <div className="summary-label">총 월 연금 수령액 (필요경비 대비 {totalResult.pct}% 충족)</div>
                <div className="summary-amount">{formatKRW(totalResult.total)}원 / 월</div>
              </div>

              <div style={{ marginTop: '30px' }}>
                {[
                  { l: '국민연금', v: totalResult.national, c: '#0284c7' },
                  { l: '퇴직연금', v: totalResult.retirement, c: '#059669' },
                  { l: '개인연금', v: totalResult.personal, c: '#7c3aed' }
                ].map((b, i) => (
                  <div key={i} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 600 }}><span style={{ color: b.c }}>{b.l}</span><span>{formatKRW(b.v)}원</span></div>
                    <div style={{ width: '100%', height: '12px', background: 'var(--surface-2)', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${totalResult.need ? Math.min(100, b.v / totalResult.need * 100) : 0}%`, height: '100%', background: b.c }}></div></div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '25px', padding: '20px', borderRadius: '12px', background: totalResult.diff >= 0 ? '#bbf7d020' : '#fecdd320', borderLeft: `4px solid ${totalResult.diff >= 0 ? '#22c55e' : '#f43f5e'}` }}>
                <strong style={{ fontSize: '1.1rem', color: totalResult.diff >= 0 ? '#166534' : '#9f1239' }}>
                  {totalResult.diff >= 0 ? `✅ 월 ${formatKRW(totalResult.diff)}원 여유` : `⚠️ 월 ${formatKRW(Math.abs(totalResult.diff))}원 부족`}
                </strong>
                <p style={{ fontSize: '0.9rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
                  {totalResult.diff >= 0 ? '예상 연금이 필요 생활비를 충분히 충당합니다.' : '부족분 충당을 위해 지금부터 추가 저축 및 연금 증액이 필요합니다.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
