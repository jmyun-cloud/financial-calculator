import { useState } from 'react';
import { calculateSalary, SalaryResult } from '@/lib/calculators/salary-engine';

export function useSalaryCalculator() {
  const [result, setResult] = useState<SalaryResult | null>(null);

  const calculate = (annualRaw: number, dependants: number, children: number, nontaxMonthly: number) => {
    try {
      const res = calculateSalary(annualRaw, dependants, children, nontaxMonthly);
      setResult(res);
    } catch (error) {
      console.error("Salary calculation error:", error);
    }
  };

  return { result, calculateSalary: calculate };
}
