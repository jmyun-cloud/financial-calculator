
import { useState } from 'react';

const TAX_BRACKETS = [
  { limit: 14000000, rate: 0.06, deduct: 0 },
  { limit: 50000000, rate: 0.15, deduct: 1260000 },
  { limit: 88000000, rate: 0.24, deduct: 5760000 },
  { limit: 150000000, rate: 0.35, deduct: 15440000 },
  { limit: 300000000, rate: 0.38, deduct: 19940000 },
  { limit: 500000000, rate: 0.40, deduct: 25940000 },
  { limit: 1000000000, rate: 0.42, deduct: 35940000 },
  { limit: Infinity, rate: 0.45, deduct: 65940000 },
];

function calcTenureDeduction(yearsRaw: number) {
  const y = Math.floor(yearsRaw);
  if (y <= 5) return y * 1000000;
  if (y <= 10) return 5000000 + (y - 5) * 2000000;
  if (y <= 20) return 15000000 + (y - 10) * 2500000;
  return 40000000 + (y - 20) * 3000000;
}

function calcConvertedDeduction(converted: number) {
  if (converted <= 8000000) return converted;
  if (converted <= 70000000) return 8000000 + (converted - 8000000) * 0.60;
  if (converted <= 100000000) return 45200000 + (converted - 70000000) * 0.55;
  if (converted <= 300000000) return 61700000 + (converted - 100000000) * 0.45;
  return 151700000 + (converted - 300000000) * 0.35;
}

function calcProgressiveTax(taxBase: number) {
  if (taxBase <= 0) return 0;
  for (const b of TAX_BRACKETS) {
    if (taxBase <= b.limit) return Math.max(0, taxBase * b.rate - b.deduct);
  }
  return 0;
}

export function calcRetirementTax(severancePay: number, tenureYearsFrac: number) {
  const tenureYearsFloor = Math.floor(tenureYearsFrac);
  const tenureForConvert = Math.max(1, tenureYearsFloor);

  const tenureDeduction = calcTenureDeduction(tenureYearsFloor);
  const afterTenure = Math.max(0, severancePay - tenureDeduction);
  const convertedWage = afterTenure * 12 / tenureForConvert;
  
  const convertedDeduction = calcConvertedDeduction(convertedWage);
  const taxBase = Math.max(0, (convertedWage - convertedDeduction) * tenureForConvert / 12);
  const grossTax = calcProgressiveTax(taxBase);

  const incomeTax = Math.round(grossTax);
  const localTax = Math.round(incomeTax * 0.1);
  const totalTax = incomeTax + localTax;

  return { tenureDeduction, convertedWage, convertedDeduction, taxBase, incomeTax, localTax, totalTax };
}

export function useSeveranceCalculator() {
  const [basicResult, setBasicResult] = useState<any>(null);
  const [pensionResult, setPensionResult] = useState<any>(null);

  const calculateBasic = (joinVal: string, retireVal: string, wage1: number, wage2: number, wage3: number, bonus: number) => {
    const joinDate = new Date(joinVal);
    const retireDate = new Date(retireVal);
    const tenureDays = Math.floor((retireDate.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (tenureDays <= 0) throw new Error('퇴직일이 입사일보다 이후여야 합니다.');
    
    const tenureYears = tenureDays / 365;
    const bonusFor3M = (bonus / 12) * 3;
    const totalWage3M = wage1 + wage2 + wage3 + bonusFor3M;
    const dailyAvgWage = totalWage3M / 91; // 근사치 91일
    const severancePay = dailyAvgWage * 30 * (tenureDays / 365);
    
    const taxResult = calcRetirementTax(severancePay, tenureYears);
    const netPay = severancePay - taxResult.totalTax;

    setBasicResult({
      tenureDays, tenureYears, dailyAvgWage, totalWage3M, bonusFor3M,
      severancePay, netPay, taxResult, belowOneYear: tenureDays < 365
    });
  };

  const comparePension = (currentMonthly: number, retireMonthly: number, years: number, dcRatePerc: number) => {
    const dcRate = dcRatePerc / 100;
    const dbSeverance = retireMonthly * years;
    
    let dcAccum = 0;
    const annualWageGrowth = years > 1 ? (retireMonthly - currentMonthly) / (years - 1) : 0;
    for (let y = 1; y <= years; y++) {
      const monthlyWage = currentMonthly + annualWageGrowth * (y - 1);
      const annualContrib = monthlyWage; // * 12 / 12
      const remainingYears = years - y;
      dcAccum += annualContrib * Math.pow(1 + dcRate, remainingYears);
    }
    const dcSeverance = dcAccum;

    const dbTax = calcRetirementTax(dbSeverance, years);
    const dcTax = calcRetirementTax(dcSeverance, years);
    const dbNet = dbSeverance - dbTax.totalTax;
    const dcNet = dcSeverance - dcTax.totalTax;

    setPensionResult({ dbSeverance, dcSeverance, dbNet, dcNet, dbWins: dbNet >= dcNet });
  };

  return { basicResult, pensionResult, calculateBasic, comparePension };
}
