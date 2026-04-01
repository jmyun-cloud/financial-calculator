
import { useState } from 'react';

export function useTaxInterestCalculator() {
  const [taxResult, setTaxResult] = useState<any>(null);

  const calculate = (principal: number, rate: number, months: number, type: string) => {
    if (principal <= 0 || rate <= 0 || months <= 0) throw new Error("원금, 연이율, 기간을 올바르게 입력해주세요.");
    
    let grossInterest = 0;
    if (type === 'simple') {
      grossInterest = Math.floor(principal * (rate / 100) * (months / 12));
    } else {
      const r = rate / 100 / 12;
      grossInterest = Math.floor(principal * (Math.pow(1 + r, months) - 1));
    }

    const taxes = [
      { label: '일반과세', rate: 15.4, code: 'normal' },
      { label: '세금우대', rate: 9.9, code: 'preferred' },
      { label: '비과세', rate: 0, code: 'exempt' },
    ];

    const results = taxes.map(t => {
      const taxAmount = Math.floor((grossInterest * (t.rate / 100)) / 10) * 10;
      const net = grossInterest - taxAmount;
      return { ...t, taxAmount, net, total: principal + net };
    });

    const best = results.reduce((a, b) => b.net > a.net ? b : a);

    setTaxResult({ principal, rate, months, type, grossInterest, results, best });
  };

  return { taxResult, calculate };
}
