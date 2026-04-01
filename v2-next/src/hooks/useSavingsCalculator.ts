
import { useState } from 'react';

export function useSavingsCalculator() {
  const [depositResult, setDepositResult] = useState<any>(null);
  const [installmentResult, setInstallmentResult] = useState<any>(null);

  const getTaxRate = (taxType: string) => {
    if (taxType === 'preferred') return 0.099;
    if (taxType === 'exempt') return 0;
    return 0.154;
  };

  const calculateDeposit = (principal: number, rate: number, period: number, interestType: string, taxType: string) => {
    if (principal <= 0 || rate <= 0 || period <= 0) throw new Error("입력값을 확인해주세요.");
    const annualRate = rate / 100;
    const monthlyRate = annualRate / 12;
    const years = period / 12;

    let maturity = 0;
    if (interestType === 'simple') {
      maturity = principal * (1 + annualRate * years);
    } else {
      maturity = principal * Math.pow(1 + monthlyRate, period);
    }
    
    const grossInterest = Math.floor(maturity - principal);
    const taxAmount = Math.floor((grossInterest * getTaxRate(taxType)) / 10) * 10;
    const netInterest = grossInterest - taxAmount;
    const netMaturity = principal + netInterest;

    setDepositResult({ principal, grossInterest, taxAmount, netInterest, netMaturity, rate, period, interestType, taxType });
  };

  const calculateInstallment = (monthly: number, rate: number, period: number, interestType: string, taxType: string) => {
    if (monthly <= 0 || rate <= 0 || period <= 0) throw new Error("입력값을 확인해주세요.");
    const monthlyRate = rate / 100 / 12;
    const totalPrincipal = monthly * period;
    let grossInterest = 0;

    if (interestType === 'simple') {
      grossInterest = monthly * monthlyRate * period * (period + 1) / 2;
    } else {
      for (let i = 1; i <= period; i++) {
        grossInterest += monthly * Math.pow(1 + monthlyRate, period - i + 1) - monthly;
      }
    }

    grossInterest = Math.floor(grossInterest);
    const taxAmount = Math.floor((grossInterest * getTaxRate(taxType)) / 10) * 10;
    const netInterest = grossInterest - taxAmount;
    const netMaturity = totalPrincipal + netInterest;

    setInstallmentResult({ totalPrincipal, monthly, grossInterest, taxAmount, netInterest, netMaturity, rate, period, interestType, taxType });
  };

  return { depositResult, installmentResult, calculateDeposit, calculateInstallment };
}
