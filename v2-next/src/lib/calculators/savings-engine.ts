import { SAVINGS_CONSTANTS } from './constants';

export interface SavingsResult {
    type: 'deposit' | 'installment';
    principal: number;
    totalPrincipal: number;
    monthly?: number;
    grossInterest: number;
    taxAmount: number;
    netInterest: number;
    netMaturity: number;
    rate: number;
    period: number;
    interestType: 'simple' | 'compound';
    taxType: 'normal' | 'preferred' | 'exempt';
}

/**
 * 예금 (거치식) 계산기 엔진
 */
export function calculateDeposit(
    principal: number,
    rate: number,
    period: number,
    interestType: 'simple' | 'compound' = 'simple',
    taxType: 'normal' | 'preferred' | 'exempt' = 'normal'
): SavingsResult {
    if (principal <= 0 || rate <= 0 || period <= 0) throw new Error("입력값을 확인해주세요.");

    const annualRate = rate / 100;
    const monthlyRate = annualRate / 12;
    const years = period / 12;

    let maturity = 0;
    if (interestType === 'simple') {
        maturity = principal * (1 + annualRate * years);
    } else {
        // 월복리: 원금 * (1 + 월이율)^개월수
        maturity = principal * Math.pow(1 + monthlyRate, period);
    }

    const grossInterest = Math.floor(maturity - principal);
    const taxRate = SAVINGS_CONSTANTS.TAX_RATES[taxType] || 0.154;
    const taxAmount = Math.floor((grossInterest * taxRate) / 10) * 10;
    const netInterest = grossInterest - taxAmount;
    const netMaturity = principal + netInterest;

    return {
        type: 'deposit',
        principal,
        totalPrincipal: principal,
        grossInterest,
        taxAmount,
        netInterest,
        netMaturity,
        rate,
        period,
        interestType,
        taxType
    };
}

/**
 * 적금 (적립식) 계산기 엔진
 */
export function calculateInstallment(
    monthly: number,
    rate: number,
    period: number,
    interestType: 'simple' | 'compound' = 'simple',
    taxType: 'normal' | 'preferred' | 'exempt' = 'normal'
): SavingsResult {
    if (monthly <= 0 || rate <= 0 || period <= 0) throw new Error("입력값을 확인해주세요.");

    const monthlyRate = rate / 100 / 12;
    const totalPrincipal = monthly * period;
    let grossInterest = 0;

    if (interestType === 'simple') {
        // 단리 적금 이자: 월납입액 * 월이율 * 개월수(개월수+1)/2
        grossInterest = monthly * monthlyRate * period * (period + 1) / 2;
    } else {
        // 월복리 적금 이자: 각 회차별 복리 합산
        // Σ [월납입액 * (1+월이율)^회차] - 원금
        for (let i = 1; i <= period; i++) {
            grossInterest += monthly * Math.pow(1 + monthlyRate, period - i + 1) - monthly;
        }
    }

    grossInterest = Math.floor(grossInterest);
    const taxRate = SAVINGS_CONSTANTS.TAX_RATES[taxType] || 0.154;
    const taxAmount = Math.floor((grossInterest * taxRate) / 10) * 10;
    const netInterest = grossInterest - taxAmount;
    const netMaturity = totalPrincipal + netInterest;

    return {
        type: 'installment',
        principal: monthly,
        totalPrincipal,
        monthly,
        grossInterest,
        taxAmount,
        netInterest,
        netMaturity,
        rate,
        period,
        interestType,
        taxType
    };
}
