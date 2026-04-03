import { useState } from 'react';
import { calculateLoan, LoanResult } from '@/lib/calculators/loan-engine';

export function useLoanCalculator() {
  const [loanResult, setLoanResult] = useState<LoanResult | null>(null);

  const calculate = (principal: number, rate: number, period: number, grace: number, type: 'equal-installment' | 'equal-principal' | 'bullet') => {
    try {
      const res = calculateLoan(principal, rate, period, grace, type);
      setLoanResult(res);
    } catch (e: any) {
      throw e;
    }
  };

  return { loanResult, calculate };
}
