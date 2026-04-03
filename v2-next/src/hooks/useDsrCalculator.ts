import { useState } from 'react';
import { calculateDSR, DsrResult } from '@/lib/calculators/real-estate-engine';

export function useDsrCalculator() {
  const [dsrResult, setDsrResult] = useState<DsrResult | null>(null);

  const calculate = (income: number, existingDebt: number, newRate: number, newTerm: number, dsrLimit: number) => {
    try {
      const res = calculateDSR(income, existingDebt, newRate, newTerm, dsrLimit);
      setDsrResult(res);
    } catch (e: any) {
      throw e;
    }
  };

  return { dsrResult, calculateDSR: calculate };
}
