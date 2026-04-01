
import { useState } from 'react';

export function useDsrCalculator() {
  const [dsrResult, setDsrResult] = useState<any>(null);

  const calculateMaxLoan = (monthlyPayment: number, annualRate: number, years: number) => {
    if (annualRate <= 0 || years <= 0 || monthlyPayment <= 0) return 0;
    const r = (annualRate / 100) / 12;
    const n = years * 12;
    return Math.floor(monthlyPayment * ((1 - Math.pow(1 + r, -n)) / r));
  };

  const calculateDSR = (income: number, existingDebt: number, newRate: number, newTerm: number, dsrLimit: number) => {
    if (income <= 0) throw new Error("연소득을 정확히 입력해주세요.");
    
    const currentDsrPct = (existingDebt / income) * 100;
    const maxYearlyAllowed = Math.floor(income * (dsrLimit / 100));
    let availableYearly = maxYearlyAllowed - existingDebt;
    
    let maxNewPrincipal = 0;
    if (availableYearly > 0 && newRate > 0 && newTerm > 0) {
      maxNewPrincipal = calculateMaxLoan(availableYearly / 12, newRate, newTerm);
    } else if (availableYearly < 0) {
      availableYearly = 0;
    }

    setDsrResult({
      income, existingDebt, newRate, newTerm, dsrLimit,
      currentDsrPct, maxYearlyAllowed, availableYearly, maxNewPrincipal
    });
  };

  return { dsrResult, calculateDSR };
}
