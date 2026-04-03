import { REAL_ESTATE_CONSTANTS } from './constants';

export interface JeonseToMonthlyResult {
    jeonse: number;
    deposit: number;
    diff: number;
    rate: number;
    monthly: number;
    legalRate: number;
    legalMonthly: number;
}

export interface MonthlyToJeonseResult {
    monthly: number;
    deposit: number;
    rate: number;
    addDeposit: number;
    totalJeonse: number;
}

export interface DepositMonthlyAdjustResult {
    curMonthly: number;
    curDeposit: number;
    newDeposit: number;
    rate: number;
    depositDiff: number;
    monthlyChange: number;
    newMonthly: number;
}

export interface DsrResult {
    income: number;
    existingDebt: number;
    newRate: number;
    newTerm: number;
    dsrLimit: number;
    currentDsrPct: number;
    maxYearlyAllowed: number;
    availableYearly: number;
    maxNewPrincipal: number;
}

/**
 * 전세 -> 월세 전환 계산기 엔진
 */
export function calculateJeonseToMonthly(
    jeonse: number,
    deposit: number,
    rate: number
): JeonseToMonthlyResult {
    if (jeonse <= 0) throw new Error("전세 보증금을 입력해 주세요.");
    if (deposit >= jeonse) throw new Error("전환 후 보증금은 전세 보증금보다 작아야 합니다.");

    const diff = jeonse - deposit;
    const monthly = Math.floor((diff * rate) / 100 / 12);
    const legalRate = REAL_ESTATE_CONSTANTS.LEGAL_JEONSE_RATE;
    const legalMonthly = Math.floor((diff * legalRate) / 100 / 12);

    return { jeonse, deposit, diff, rate, monthly, legalRate, legalMonthly };
}

/**
 * 월세 -> 전세 환산 계산기 엔진
 */
export function calculateMonthlyToJeonse(
    monthly: number,
    deposit: number,
    rate: number
): MonthlyToJeonseResult {
    if (monthly <= 0) throw new Error("월세를 입력해 주세요.");
    const addDeposit = Math.floor(((monthly * 12) / rate) * 100);
    const totalJeonse = deposit + addDeposit;

    return { monthly, deposit, rate, addDeposit, totalJeonse };
}

/**
 * 보증금/월세 상호 조정 계산기 엔진
 */
export function calculateDepositMonthlyAdjust(
    curMonthly: number,
    curDeposit: number,
    newDeposit: number,
    rate: number
): DepositMonthlyAdjustResult {
    if (curMonthly < 0) throw new Error("현재 월세를 입력해 주세요.");
    if (newDeposit < 0) throw new Error("변경 후 보증금을 입력해 주세요.");

    const depositDiff = newDeposit - curDeposit;
    const monthlyChange = Math.floor((depositDiff * rate) / 100 / 12);
    const newMonthly = Math.max(0, curMonthly - monthlyChange);

    return { curMonthly, curDeposit, newDeposit, rate, depositDiff, monthlyChange, newMonthly };
}

/**
 * DSR 한도 대출금 역산 보조 함수
 */
function calculateMaxLoanFromDsr(monthlyPayment: number, annualRate: number, years: number): number {
    if (annualRate <= 0 || years <= 0 || monthlyPayment <= 0) return 0;
    const r = (annualRate / 100) / 12;
    const n = years * 12;
    return Math.floor(monthlyPayment * ((1 - Math.pow(1 + r, -n)) / r));
}

/**
 * DSR 대출 한도 계산기 엔진
 */
export function calculateDSR(
    income: number,
    existingDebt: number,
    newRate: number,
    newTerm: number,
    dsrLimit: number = 40
): DsrResult {
    if (income <= 0) throw new Error("연소득을 정확히 입력해주세요.");

    const currentDsrPct = (existingDebt / income) * 100;
    const maxYearlyAllowed = Math.floor(income * (dsrLimit / 100));
    let availableYearly = maxYearlyAllowed - existingDebt;

    let maxNewPrincipal = 0;
    if (availableYearly > 0 && newRate > 0 && newTerm > 0) {
        maxNewPrincipal = calculateMaxLoanFromDsr(availableYearly / 12, newRate, newTerm);
    } else if (availableYearly < 0) {
        availableYearly = 0;
    }

    return {
        income,
        existingDebt,
        newRate,
        newTerm,
        dsrLimit,
        currentDsrPct,
        maxYearlyAllowed,
        availableYearly,
        maxNewPrincipal
    };
}
