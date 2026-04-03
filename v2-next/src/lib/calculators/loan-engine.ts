export interface LoanScheduleItem {
    month: number;
    principal: number;
    interest: number;
    payment: number;
    balance: number;
}

export interface LoanResult {
    principal: number;
    rate: number;
    period: number;
    grace: number;
    type: 'equal-installment' | 'equal-principal' | 'bullet';
    totalPayment: number;
    totalInterest: number;
    firstPayment: number;
    schedule: LoanScheduleItem[];
}

/**
 * 대출 상환 계산기 엔진
 */
export function calculateLoan(
    principal: number,
    rate: number,
    period: number,
    grace: number = 0,
    type: 'equal-installment' | 'equal-principal' | 'bullet' = 'equal-installment'
): LoanResult {
    if (principal <= 0 || rate <= 0 || period <= 0) throw new Error("입력값을 확인해주세요.");
    if (grace >= period) throw new Error("거치기간은 대출기간보다 작아야합니다.");

    const monthlyRate = rate / 100 / 12;
    const schedule: LoanScheduleItem[] = [];

    // 1. 거치 기간 (Grace period - 이자만 납부)
    for (let i = 1; i <= grace; i++) {
        const interest = Math.floor(principal * monthlyRate);
        schedule.push({
            month: i,
            principal: 0,
            interest,
            payment: interest,
            balance: principal
        });
    }

    const repayN = period - grace; // 실제 원금 상환 개월수
    let balance = principal;

    // 2. 상환 기간 계산
    if (type === 'equal-installment') {
        // 원리금균등: PMT = P * r * (1+r)^n / ((1+r)^n - 1)
        const payment = Math.floor(principal * monthlyRate * Math.pow(1 + monthlyRate, repayN) / (Math.pow(1 + monthlyRate, repayN) - 1));

        for (let i = 1; i <= repayN; i++) {
            const isLast = i === repayN;
            const interest = Math.floor(balance * monthlyRate);
            let currPrincipal = payment - interest;

            if (isLast) {
                currPrincipal = balance;
                balance = 0;
            } else {
                balance -= currPrincipal;
            }

            schedule.push({
                month: grace + i,
                principal: currPrincipal,
                interest,
                payment: currPrincipal + interest,
                balance: Math.max(0, balance)
            });
        }
    } else if (type === 'equal-principal') {
        // 원금균등: 매달 동일 원금 + 잔액 이자
        const cpp = Math.floor(principal / repayN);

        for (let i = 1; i <= repayN; i++) {
            const isLast = i === repayN;
            const currPrincipal = isLast ? balance : cpp;
            const interest = Math.floor(balance * monthlyRate);
            balance -= currPrincipal;

            schedule.push({
                month: grace + i,
                principal: currPrincipal,
                interest,
                payment: currPrincipal + interest,
                balance: Math.max(0, balance)
            });
        }
    } else {
        // 만기일시 (Bullet): 매달 이자만, 마지막에 전액 상환
        for (let i = 1; i <= repayN; i++) {
            const isLast = i === repayN;
            const interest = Math.floor(principal * monthlyRate);
            const currP = isLast ? principal : 0;

            schedule.push({
                month: grace + i,
                principal: currP,
                interest,
                payment: currP + interest,
                balance: isLast ? 0 : principal
            });
        }
    }

    const totalPayment = schedule.reduce((sum, r) => sum + r.payment, 0);
    const totalInterest = totalPayment - principal;
    const firstPayment = schedule[grace]?.payment || schedule[0].payment;

    return {
        principal,
        rate,
        period,
        grace,
        type,
        totalPayment,
        totalInterest,
        firstPayment,
        schedule
    };
}
