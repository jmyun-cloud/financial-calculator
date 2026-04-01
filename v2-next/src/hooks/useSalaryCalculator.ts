
import { useState } from 'react';

const INS_2026 = {
  pension_rate: 0.045,
  pension_cap: 6370000,
  pension_floor: 370000,
  health_rate: 0.03595,
  longterm_rate: 0.1314,
  employment_rate: 0.009,
};

const TAX_BRACKETS = [
  { limit: 14000000, rate: 0.06, deduction: 0 },
  { limit: 50000000, rate: 0.15, deduction: 1260000 },
  { limit: 88000000, rate: 0.24, deduction: 5760000 },
  { limit: 150000000, rate: 0.35, deduction: 15440000 },
  { limit: 300000000, rate: 0.38, deduction: 19940000 },
  { limit: 500000000, rate: 0.4, deduction: 25940000 },
  { limit: 1000000000, rate: 0.42, deduction: 35940000 },
  { limit: Infinity, rate: 0.45, deduction: 65940000 },
];

function calcEmploymentDeduction(annualGross: number) {
  if (annualGross <= 5000000) return annualGross * 0.7;
  if (annualGross <= 15000000) return 3500000 + (annualGross - 5000000) * 0.4;
  if (annualGross <= 45000000) return 7500000 + (annualGross - 15000000) * 0.15;
  if (annualGross <= 100000000) return 12000000 + (annualGross - 45000000) * 0.05;
  return 14750000 + (annualGross - 100000000) * 0.02; // 상한 2000만
}

function calcPersonalDeduction(dependants: number) {
  return dependants * 1500000;
}

function calcIncomeTax(taxableIncome: number) {
  if (taxableIncome <= 0) return 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) {
      return Math.max(0, taxableIncome * bracket.rate - bracket.deduction);
    }
  }
  return 0;
}

function calcTaxCredit(incomeTax: number) {
  if (incomeTax <= 1300000) return incomeTax * 0.55;
  return 715000 + (incomeTax - 1300000) * 0.3;
}

function calcChildCredit(children: number) {
  if (children <= 0) return 0;
  if (children === 1) return 250000;
  if (children === 2) return 550000;
  return 550000 + (children - 2) * 400000;
}

export function useSalaryCalculator() {
  const [result, setResult] = useState<any>(null);

  const calculateSalary = (annualRaw: number, dependants: number, children: number, nontaxMonthly: number) => {
    const monthlyGross = Math.round(annualRaw / 12);
    const monthlyTaxable = Math.max(0, monthlyGross - nontaxMonthly);
    const annualTaxable = monthlyTaxable * 12;

    const pensionBase = Math.min(Math.max(monthlyGross, INS_2026.pension_floor), INS_2026.pension_cap);
    const pension = Math.floor((pensionBase * INS_2026.pension_rate) / 10) * 10;
    const health = Math.floor((monthlyGross * INS_2026.health_rate) / 10) * 10;
    const longterm = Math.floor((health * INS_2026.longterm_rate) / 10) * 10;
    const employment = Math.floor((monthlyGross * INS_2026.employment_rate) / 10) * 10;
    
    const monthlyInsTotal = pension + health + longterm + employment;

    const employmentDeduction = Math.min(calcEmploymentDeduction(annualTaxable), 20000000);
    const workIncome = Math.max(0, annualTaxable - employmentDeduction);
    const totalDeduction = calcPersonalDeduction(dependants) + (pension * 12);
    const taxBase = Math.max(0, workIncome - totalDeduction);
    const grossTax = calcIncomeTax(taxBase);
    
    const incomeTax = Math.max(0, Math.round(grossTax - calcTaxCredit(grossTax) - calcChildCredit(children)));
    const localTax = Math.round(incomeTax * 0.1);

    const monthlyIncomeTax = Math.round(incomeTax / 12 / 10) * 10;
    const monthlyLocalTax = Math.round(localTax / 12 / 10) * 10;
    const monthlyTaxTotal = monthlyIncomeTax + monthlyLocalTax;

    const monthlyTotalDeduction = monthlyInsTotal + monthlyTaxTotal;
    const monthlyTakeHome = monthlyGross - monthlyTotalDeduction;
    const annualTakeHome = monthlyTakeHome * 12;

    setResult({
      annualRaw, monthlyGross, nontaxMonthly,
      ins: { pension, health, longterm, employment },
      monthlyInsTotal, monthlyIncomeTax, monthlyLocalTax,
      monthlyTaxTotal, monthlyTotalDeduction,
      monthlyTakeHome, annualTakeHome
    });
  };

  return { result, calculateSalary };
}
