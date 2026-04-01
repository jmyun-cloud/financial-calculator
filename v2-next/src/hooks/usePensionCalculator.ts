
import { useState } from 'react';

export function usePensionCalculator() {
  const [nationalResult, setNationalResult] = useState<any>(null);
  const [retirementResult, setRetirementResult] = useState<any>(null);
  const [personalResult, setPersonalResult] = useState<any>(null);
  const [totalResult, setTotalResult] = useState<any>(null);

  const calcNational = (income: number, years: number, age: number) => {
    if (income <= 0) throw new Error("월 평균 소득을 입력해 주세요.");
    if (years < 10) throw new Error("국민연금은 최소 10년 이상 가입해야 수령 가능합니다.");
    
    const A = 3193511; // 2026 간이 기준
    const cappedIncome = Math.min(Math.max(income, 370000), 6170000);
    const B = cappedIncome;
    const base = 1.2 * (A + B) / 2 * (years / 40);
    
    let adj = 1;
    if (age < 63) adj = 1 - (63 - age) * 0.06;
    else if (age > 63) adj = 1 + (age - 63) * 0.072;
    
    const monthly = Math.round(base * adj);
    setNationalResult({ income: cappedIncome, years, age, monthly, total20y: monthly * 240, adjPercent: Math.round((adj - 1) * 100) });
  };

  const calcRetirement = (salary: number, years: number, pYears: number, rate: number) => {
    if (salary <= 0 || years <= 0) throw new Error("급여와 근속 기간을 입력해 주세요.");
    const totalRetirement = salary * years;
    const mr = rate / 100 / 12;
    const mn = pYears * 12;
    const monthlyPension = mr > 0 ? totalRetirement * mr / (1 - Math.pow(1 + mr, -mn)) : totalRetirement / mn;
    setRetirementResult({ salary, years, pYears, rate, totalRetirement, monthlyPension: Math.floor(monthlyPension) });
  };

  const calcPersonal = (monthly: number, accYears: number, rate: number, recYears: number) => {
    if (monthly <= 0) throw new Error("월 납입액을 입력해 주세요.");
    const mr = rate / 100 / 12;
    const mn = accYears * 12;
    const accumulated = mr > 0 ? monthly * (Math.pow(1 + mr, mn) - 1) / mr : monthly * mn;
    
    const rmr = rate / 100 / 12;
    const rmn = recYears * 12;
    const monthlyPension = rmr > 0 ? accumulated * rmr / (1 - Math.pow(1 + rmr, -rmn)) : accumulated / rmn;
    const totalInvested = monthly * 12 * accYears;
    
    setPersonalResult({ monthly, accYears, rate, recYears, totalInvested, accumulated: Math.floor(accumulated), monthlyPension: Math.floor(monthlyPension) });
  };

  const calcTotal = (national: number, retirement: number, personal: number, need: number) => {
    if (need <= 0) throw new Error("월 필요 생활비를 입력해 주세요.");
    const total = national + retirement + personal;
    const diff = total - need;
    const pct = need > 0 ? (total / need * 100).toFixed(1) : "0.0";
    setTotalResult({ national, retirement, personal, total, need, diff, pct });
  };

  return { nationalResult, retirementResult, personalResult, totalResult, calcNational, calcRetirement, calcPersonal, calcTotal };
}
