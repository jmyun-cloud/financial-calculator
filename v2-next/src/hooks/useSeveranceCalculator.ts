import { useState } from 'react';
import {
  calculateBasicSeverance,
  comparePensionTypes,
  BasicSeveranceResult,
  PensionComparisonResult
} from '@/lib/calculators/severance-engine';

export function useSeveranceCalculator() {
  const [basicResult, setBasicResult] = useState<BasicSeveranceResult | null>(null);
  const [pensionResult, setPensionResult] = useState<PensionComparisonResult | null>(null);

  const calculateBasic = (joinVal: string, retireVal: string, wage1: number, wage2: number, wage3: number, bonus: number) => {
    try {
      const res = calculateBasicSeverance(joinVal, retireVal, wage1, wage2, wage3, bonus);
      setBasicResult(res);
    } catch (err: any) {
      throw err;
    }
  };

  const comparePension = (currentMonthly: number, retireMonthly: number, years: number, dcRatePerc: number) => {
    try {
      const res = comparePensionTypes(currentMonthly, retireMonthly, years, dcRatePerc);
      setPensionResult(res);
    } catch (err: any) {
      throw err;
    }
  };

  return { basicResult, pensionResult, calculateBasic, comparePension };
}
