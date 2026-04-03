/**
 * 금융 계산기 공통 상수 (2026년 기준)
 */

export const SALARY_CONSTANTS = {
    // 4대보험 요율
    INSURANCE_2026: {
        pension_rate: 0.045,
        pension_cap: 6370000,
        pension_floor: 370000,
        health_rate: 0.03595,
        longterm_rate: 0.1314, // 건강보험료의 13.14%
        employment_rate: 0.009,
    },

    // 소득세 과세표준 구간
    TAX_BRACKETS: [
        { limit: 14000000, rate: 0.06, deduction: 0 },
        { limit: 50000000, rate: 0.15, deduction: 1260000 },
        { limit: 88000000, rate: 0.24, deduction: 5760000 },
        { limit: 150000000, rate: 0.35, deduction: 15440000 },
        { limit: 300000000, rate: 0.38, deduction: 19940000 },
        { limit: 500000000, rate: 0.4, deduction: 25940000 },
        { limit: 1000000000, rate: 0.42, deduction: 35940000 },
        { limit: Infinity, rate: 0.45, deduction: 65940000 },
    ]
};

export const SAVINGS_CONSTANTS = {
    TAX_RATES: {
        normal: 0.154,    // 일반 과세 (14% + 지방세 1.4%)
        preferred: 0.099, // 세금 우대 (9% + 지방세 0.9%)
        exempt: 0         // 비과세
    }
};

export const REAL_ESTATE_CONSTANTS = {
    LEGAL_JEONSE_RATE: 5.5, // 전월세 전환율 법정 상한 (기준금리 + 2.0%)
    DSR_LIMITS: {
        BANK: 40,
        NON_BANK: 50
    }
};
