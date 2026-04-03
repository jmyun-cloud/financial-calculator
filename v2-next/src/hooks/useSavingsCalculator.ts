import { useState } from 'react';
import { calculateDeposit, calculateInstallment, SavingsResult } from '@/lib/calculators/savings-engine';

export function useSavingsCalculator() {
  const [depositResult, setDepositResult] = useState<SavingsResult | null>(null);
  const [installmentResult, setInstallmentResult] = useState<SavingsResult | null>(null);

  const onCalculateDeposit = (principal: number, rate: number, period: number, interestType: 'simple' | 'compound', taxType: 'normal' | 'preferred' | 'exempt') => {
    try {
      const res = calculateDeposit(principal, rate, period, interestType, taxType);
      setDepositResult(res);
    } catch (e: any) {
      throw e;
    }
  };

  const onCalculateInstallment = (monthly: number, rate: number, period: number, interestType: 'simple' | 'compound', taxType: 'normal' | 'preferred' | 'exempt') => {
    try {
      const res = calculateInstallment(monthly, rate, period, interestType, taxType);
      setInstallmentResult(res);
    } catch (e: any) {
      throw e;
    }
  };

  return { depositResult, installmentResult, calculateDeposit: onCalculateDeposit, calculateInstallment: onCalculateInstallment };
}
