
import { useState } from 'react';

export function useLoanCalculator() {
  const [loanResult, setLoanResult] = useState<any>(null);

  const calculate = (principal: number, rate: number, period: number, grace: number, type: string) => {
    if (principal <= 0 || rate <= 0 || period <= 0) throw new Error("입력값을 확인해주세요.");
    if (grace >= period) throw new Error("거치기간은 대출기간보다 작아야합니다.");

    const monthlyRate = rate / 100 / 12;
    const schedule: any[] = [];
    
    // Grace period
    for (let i = 1; i <= grace; i++) {
      const interest = Math.floor(principal * monthlyRate);
      schedule.push({ month: i, principal: 0, interest, payment: interest, balance: principal });
    }

    const repayN = period - grace;
    let balance = principal;

    if (type === 'equal-installment') {
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
        schedule.push({ month: grace + i, principal: currPrincipal, interest, payment: currPrincipal + interest, balance: Math.max(0, balance) });
      }
    } else if (type === 'equal-principal') {
      const cpp = Math.floor(principal / repayN);
      for (let i = 1; i <= repayN; i++) {
        const isLast = i === repayN;
        const currPrincipal = isLast ? balance : cpp;
        const interest = Math.floor(balance * monthlyRate);
        balance -= currPrincipal;
        schedule.push({ month: grace + i, principal: currPrincipal, interest, payment: currPrincipal + interest, balance: Math.max(0, balance) });
      }
    } else {
      for (let i = 1; i <= repayN; i++) {
        const isLast = i === repayN;
        const interest = Math.floor(principal * monthlyRate);
        const currP = isLast ? principal : 0;
        schedule.push({ month: grace + i, principal: currP, interest, payment: currP + interest, balance: isLast ? 0 : principal });
      }
    }

    const totalPayment = schedule.reduce((sum, r) => sum + r.payment, 0);
    const totalInterest = totalPayment - principal;

    setLoanResult({
      principal, rate, period, grace, type,
      totalPayment, totalInterest, firstPayment: schedule[grace]?.payment || schedule[0].payment,
      schedule
    });
  };

  return { loanResult, calculate };
}
