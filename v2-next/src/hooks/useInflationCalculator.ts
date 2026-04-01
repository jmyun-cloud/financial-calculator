
import { useState } from 'react';

export function useInflationCalculator() {
  const [fvResult, setFvResult] = useState<any>(null);
  const [pvResult, setPvResult] = useState<any>(null);
  const [rrResult, setRrResult] = useState<any>(null);

  const calcFuture = (amount: number, rate: number, years: number) => {
    if (amount <= 0) throw new Error("금액을 입력해주세요.");
    const future = amount * Math.pow(1 + rate / 100, years);
    setFvResult({ amount, rate, years, future, increase: future - amount });
  };

  const calcPresent = (amount: number, rate: number, years: number) => {
    if (amount <= 0) throw new Error("금액을 입력해주세요.");
    const realValue = amount / Math.pow(1 + rate / 100, years);
    setPvResult({ amount, rate, years, realValue, lost: amount - realValue, pct: (realValue / amount * 100).toFixed(1) });
  };

  const calcRealReturn = (amount: number, nominal: number, inflation: number, years: number) => {
    const real = ((1 + nominal / 100) / (1 + inflation / 100) - 1) * 100;
    const nominalFinal = amount ? amount * Math.pow(1 + nominal / 100, years) : 0;
    const realFinal = amount ? amount * Math.pow(1 + real / 100, years) : 0;
    setRrResult({ amount, nominal, inflation, years, real, nominalFinal, realFinal });
  };

  return { fvResult, pvResult, rrResult, calcFuture, calcPresent, calcRealReturn };
}
