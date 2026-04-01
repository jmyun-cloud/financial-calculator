
import { useState } from 'react';

export function useFreelancerCalculator() {
  const [basicResult, setBasicResult] = useState<any>(null);
  const [reverseResult, setReverseResult] = useState<any>(null);

  const calculateBasic = (gross: number) => {
    if (gross <= 0) throw new Error("세전 총 수입을 입력해주세요.");
    const incomeTax = Math.floor((gross * 0.03) / 10) * 10;
    const localTax = Math.floor((incomeTax * 0.1) / 10) * 10;
    const totalTax = incomeTax + localTax;
    const net = gross - totalTax;

    setBasicResult({ gross, incomeTax, localTax, totalTax, net });
  };

  const calculateReverse = (net: number) => {
    if (net <= 0) throw new Error("입금된 실수령액을 입력해주세요.");
    
    let gross = Math.round((net / 0.967) / 10) * 10;
    let incomeTax = Math.floor((gross * 0.03) / 10) * 10;
    let localTax = Math.floor((incomeTax * 0.1) / 10) * 10;
    let totalTax = incomeTax + localTax;

    let diff = net - (gross - totalTax);
    if (diff !== 0) {
      gross += diff;
      incomeTax = Math.floor((gross * 0.03) / 10) * 10;
      localTax = Math.floor((incomeTax * 0.1) / 10) * 10;
      totalTax = incomeTax + localTax;
    }

    setReverseResult({ gross, incomeTax, localTax, totalTax, net });
  };

  return { basicResult, reverseResult, calculateBasic, calculateReverse };
}
