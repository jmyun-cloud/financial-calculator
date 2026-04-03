import { SALARY_CONSTANTS } from './constants';

export interface SalaryResult {
    annualRaw: number;
    monthlyGross: number;
    nontaxMonthly: number;
    ins: {
        pension: number;
        health: number;
        longterm: number;
        employment: number;
    };
    monthlyInsTotal: number;
    monthlyIncomeTax: number;
    monthlyLocalTax: number;
    monthlyTaxTotal: number;
    monthlyTotalDeduction: number;
    monthlyTakeHome: number;
    annualTakeHome: number;
}

/**
 * 근로소득공제 계산 (2026년 기준)
 */
function calcEmploymentDeduction(annualGross: number): number {
    if (annualGross <= 5000000) return annualGross * 0.7;
    if (annualGross <= 15000000) return 3500000 + (annualGross - 5000000) * 0.4;
    if (annualGross <= 45000000) return 7500000 + (annualGross - 15000000) * 0.15;
    if (annualGross <= 100000000) return 12000000 + (annualGross - 45000000) * 0.05;
    return 14750000 + (annualGross - 100000000) * 0.02; // 상한 2000만 가능성 (참고용)
}

/**
 * 인적공제 계산
 */
function calcPersonalDeduction(dependants: number): number {
    return dependants * 1500000;
}

/**
 * 근로소득세 계산 (과세표준 기준)
 */
function calcIncomeTax(taxableIncome: number): number {
    if (taxableIncome <= 0) return 0;
    for (const bracket of SALARY_CONSTANTS.TAX_BRACKETS) {
        if (taxableIncome <= bracket.limit) {
            return Math.max(0, taxableIncome * bracket.rate - bracket.deduction);
        }
    }
    return 0;
}

/**
 * 근로소득 세액공제 계산
 */
function calcTaxCredit(incomeTax: number): number {
    if (incomeTax <= 1300000) return incomeTax * 0.55;
    return 715000 + (incomeTax - 1300000) * 0.3;
}

/**
 * 자녀 세액공제 계산 (8세~19세)
 */
function calcChildCredit(children: number): number {
    if (children <= 0) return 0;
    if (children === 1) return 250000;
    if (children === 2) return 550000;
    return 550000 + (children - 2) * 400000;
}

/**
 * 통합 연봉 실수령액 계산기 엔진
 */
export function calculateSalary(
    annualRaw: number,
    dependants: number = 1,
    children: number = 0,
    nontaxMonthly: number = 200000
): SalaryResult {
    const monthlyGross = Math.round(annualRaw / 12);
    const monthlyTaxable = Math.max(0, monthlyGross - nontaxMonthly);
    const annualTaxable = monthlyTaxable * 12;

    const INS = SALARY_CONSTANTS.INSURANCE_2026;

    // 1. 4대보험 계산
    const pensionBase = Math.min(Math.max(monthlyGross, INS.pension_floor), INS.pension_cap);
    const pension = Math.floor((pensionBase * INS.pension_rate) / 10) * 10;
    const health = Math.floor((monthlyGross * INS.health_rate) / 10) * 10;
    const longterm = Math.floor((health * INS.longterm_rate) / 10) * 10;
    const employment = Math.floor((monthlyGross * INS.employment_rate) / 10) * 10;

    const monthlyInsTotal = pension + health + longterm + employment;

    // 2. 세금 계산 (연간 환산 후 월간 배분)
    // 근로소득공제 (최대 2000만원)
    const employmentDeduction = Math.min(calcEmploymentDeduction(annualTaxable), 20000000);
    const workIncome = Math.max(0, annualTaxable - employmentDeduction);

    // 인적공제 + 연금보험료공제
    const totalDeduction = calcPersonalDeduction(dependants) + (pension * 12);
    const taxBase = Math.max(0, workIncome - totalDeduction);

    // 산출세액
    const grossTax = calcIncomeTax(taxBase);

    // 결정세액 (세액공제 적용)
    const annualIncomeTax = Math.max(0, Math.round(grossTax - calcTaxCredit(grossTax) - calcChildCredit(children)));
    const annualLocalTax = Math.round(annualIncomeTax * 0.1);

    // 월납부 세액 (10원 단위 절사)
    const monthlyIncomeTax = Math.round(annualIncomeTax / 12 / 10) * 10;
    const monthlyLocalTax = Math.round(annualLocalTax / 12 / 10) * 10;
    const monthlyTaxTotal = monthlyIncomeTax + monthlyLocalTax;

    // 3. 최종 결과 도출
    const monthlyTotalDeduction = monthlyInsTotal + monthlyTaxTotal;
    const monthlyTakeHome = monthlyGross - monthlyTotalDeduction;
    const annualTakeHome = monthlyTakeHome * 12;

    return {
        annualRaw,
        monthlyGross,
        nontaxMonthly,
        ins: { pension, health, longterm, employment },
        monthlyInsTotal,
        monthlyIncomeTax,
        monthlyLocalTax,
        monthlyTaxTotal,
        monthlyTotalDeduction,
        monthlyTakeHome,
        annualTakeHome
    };
}
