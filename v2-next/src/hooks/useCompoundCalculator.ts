
import { useState } from 'react';

export function useCompoundCalculator() {
  const [compoundResult, setCompoundResult] = useState<any>(null);

  const calculate = (initial: number, monthlyAdd: number, rate: number, years: number, freq: number, taxRate: number) => {
    if (initial <= 0 || rate <= 0 || years <= 0) throw new Error("입력값을 확인해주세요. (원금, 기간, 수익률 필수)");
    
    const r = rate / 100 / freq;
    const n = freq * years;
    
    // Principal Growth
    const principalGrowth = initial * Math.pow(1 + r, n);
    
    // Add Growth (simplified as monthly compound)
    let addGrowth = 0;
    if (monthlyAdd > 0) {
      const mr = rate / 100 / 12;
      const mn = 12 * years;
      addGrowth = mr > 0 ? monthlyAdd * (Math.pow(1 + mr, mn) - 1) / mr : monthlyAdd * mn;
    }
    
    const finalCompound = principalGrowth + addGrowth;
    const totalInvested = initial + monthlyAdd * 12 * years;
    const grossProfit = Math.floor(finalCompound - totalInvested);
    const taxAmount = Math.floor((grossProfit * (taxRate / 100)) / 10) * 10;
    const netProfit = grossProfit - taxAmount;
    
    // Simple Interest Comparison
    const finalSimple = totalInvested + initial * (rate / 100) * years + (monthlyAdd > 0 ? monthlyAdd * (rate / 100 / 12) * 12 * years * (12 * years + 1) / 2 : 0);
    
    // Generate Amortization schedule
    const schedule = [];
    for (let i = 1; i <= years; i++) {
        let pG = initial * Math.pow(1 + r, freq * i);
        let aG = 0;
        if (monthlyAdd > 0) {
            const mrr = rate / 100 / 12;
            const mnn = 12 * i;
            aG = mrr > 0 ? monthlyAdd * (Math.pow(1 + mrr, mnn) - 1) / mrr : monthlyAdd * mnn;
        }
        let yrInv = initial + monthlyAdd * 12 * i;
        let yrSimp = yrInv + initial * (rate / 100) * i + (monthlyAdd > 0 ? monthlyAdd * (rate / 100 / 12) * 12 * i * (12 * i + 1) / 2 : 0);
        schedule.push({ year: i, compound: pG + aG, simple: yrSimp, invested: yrInv });
    }

    setCompoundResult({
      initial, monthlyAdd, rate, years, freq, taxRate,
      totalInvested, finalCompound, grossProfit, taxAmount, netProfit, netFinal: totalInvested + netProfit,
      finalSimple, simpleProfit: finalSimple - totalInvested,
      doubling: (72 / rate).toFixed(1),
      schedule
    });
  };

  return { compoundResult, calculate };
}
