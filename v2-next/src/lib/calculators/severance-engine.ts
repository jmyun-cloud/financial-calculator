import { SALARY_CONSTANTS } from './constants';

export interface SeveranceTaxResult {
    tenureDeduction: number;
    convertedWage: number;
    convertedDeduction: number;
    taxBase: number;
    incomeTax: number;
    localTax: number;
    totalTax: number;
}

export interface BasicSeveranceResult {
    tenureDays: number;
    tenureYears: number;
    dailyAvgWage: number;
    totalWage3M: number;
    bonusFor3M: number;
    severancePay: number;
    netPay: number;
    taxResult: SeveranceTaxResult;
    belowOneYear: boolean;
}

export interface PensionComparisonResult {
    dbSeverance: number;
    dcSeverance: number;
    dbNet: number;
    dcNet: number;
    dbWins: boolean;
}

/**
 * 근속연수공제 계산 (2026 기준)
 */
function calcTenureDeduction(yearsRaw: number): number {
    const y = Math.floor(yearsRaw);
    if (y <= 5) return y * 1000000;
    if (y <= 10) return 5000000 + (y - 5) * 2000000;
    if (y <= 20) return 15000000 + (y - 10) * 2500000;
    return 40000000 + (y - 20) * 3000000;
}

/**
 * 환산급여공제 계산
 */
function calcConvertedDeduction(converted: number): number {
    if (converted <= 8000000) return converted;
    if (converted <= 70000000) return 8000000 + (converted - 8000000) * 0.60;
    if (converted <= 100000000) return 45200000 + (converted - 70000000) * 0.55;
    if (converted <= 300000000) return 61700000 + (converted - 100000000) * 0.45;
    return 151700000 + (converted - 300000000) * 0.35;
}

/**
 * 퇴직소득세 누진세율 계산
 */
function calcProgressiveTax(taxBase: number): number {
    if (taxBase <= 0) return 0;
    for (const b of SALARY_CONSTANTS.TAX_BRACKETS) {
        if (taxBase <= b.limit) return Math.max(0, taxBase * b.rate - b.deduction);
    }
    return 0;
}

/**
 * 퇴직소득세 최종 계산
 */
export function calculateRetirementTax(severancePay: number, tenureYearsFrac: number): SeveranceTaxResult {
    const tenureYearsFloor = Math.floor(tenureYearsFrac);
    const tenureForConvert = Math.max(1, tenureYearsFloor);

    const tenureDeduction = calcTenureDeduction(tenureYearsFloor);
    const afterTenure = Math.max(0, severancePay - tenureDeduction);

    // 환산급여 = (퇴직소득 - 근속연수공제) * 12 / 근속연수
    const convertedWage = afterTenure * 12 / tenureForConvert;

    const convertedDeduction = calcConvertedDeduction(convertedWage);
    const taxBase = Math.max(0, (convertedWage - convertedDeduction) * tenureForConvert / 12);
    const grossTax = calcProgressiveTax(taxBase);

    const incomeTax = Math.round(grossTax);
    const localTax = Math.round(incomeTax * 0.1);
    const totalTax = incomeTax + localTax;

    return { tenureDeduction, convertedWage, convertedDeduction, taxBase, incomeTax, localTax, totalTax };
}

/**
 * 기본 퇴직금 계산기 엔진
 */
export function calculateBasicSeverance(
    joinVal: string,
    retireVal: string,
    wage1: number,
    wage2: number,
    wage3: number,
    bonus: number
): BasicSeveranceResult {
    const joinDate = new Date(joinVal);
    const retireDate = new Date(retireVal);
    const tenureDays = Math.floor((retireDate.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

    if (tenureDays <= 0) throw new Error('퇴직일이 입사일보다 이후여야 합니다.');

    const tenureYears = tenureDays / 365;
    const bonusFor3M = (bonus / 12) * 3;
    const totalWage3M = wage1 + wage2 + wage3 + bonusFor3M;
    const dailyAvgWage = totalWage3M / 91; // 근사치 91일
    const severancePay = dailyAvgWage * 30 * (tenureDays / 365);

    const taxResult = calculateRetirementTax(severancePay, tenureYears);
    const netPay = severancePay - taxResult.totalTax;

    return {
        tenureDays,
        tenureYears,
        dailyAvgWage,
        totalWage3M,
        bonusFor3M,
        severancePay,
        netPay,
        taxResult,
        belowOneYear: tenureDays < 365
    };
}

/**
 * DB형 vs DC형 퇴직연금 비교 엔진
 */
export function comparePensionTypes(
    currentMonthly: number,
    retireMonthly: number,
    years: number,
    dcRatePerc: number
): PensionComparisonResult {
    const dcRate = dcRatePerc / 100;
    const dbSeverance = retireMonthly * years;

    let dcAccum = 0;
    const annualWageGrowth = years > 1 ? (retireMonthly - currentMonthly) / (years - 1) : 0;
    for (let y = 1; y <= years; y++) {
        const monthlyWage = currentMonthly + annualWageGrowth * (y - 1);
        const annualContrib = monthlyWage; // 매년 1개월분 납입 가정
        const remainingYears = years - y;
        dcAccum += annualContrib * Math.pow(1 + dcRate, remainingYears);
    }
    const dcSeverance = dcAccum;

    const dbTax = calculateRetirementTax(dbSeverance, years);
    const dcTax = calculateRetirementTax(dcSeverance, years);
    const dbNet = dbSeverance - dbTax.totalTax;
    const dcNet = dcSeverance - dcTax.totalTax;

    return {
        dbSeverance,
        dcSeverance,
        dbNet,
        dcNet,
        dbWins: dbNet >= dcNet
    };
}
