
import { useState } from 'react';

export function useJeonseCalculator() {
  const [tmResult, setTmResult] = useState<any>(null);
  const [tdResult, setTdResult] = useState<any>(null);
  const [adjResult, setAdjResult] = useState<any>(null);

  const calcToMonthly = (jeonse: number, deposit: number, rate: number) => {
    if (jeonse <= 0) throw new Error("전세 보증금을 입력해 주세요.");
    if (deposit >= jeonse) throw new Error("전환 후 보증금은 전세 보증금보다 작아야 합니다.");
    
    const diff = jeonse - deposit;
    const monthly = Math.floor((diff * rate) / 100 / 12);
    const legalMonthly = Math.floor((diff * 5.5) / 100 / 12);
    setTmResult({ jeonse, deposit, diff, rate, monthly, legalRate: 5.5, legalMonthly });
  };

  const calcToDeposit = (monthly: number, deposit: number, rate: number) => {
    if (monthly <= 0) throw new Error("월세를 입력해 주세요.");
    const addDeposit = Math.floor(((monthly * 12) / rate) * 100);
    const totalJeonse = deposit + addDeposit;
    setTdResult({ monthly, deposit, rate, addDeposit, totalJeonse });
  };

  const calcAdjust = (curMonthly: number, curDeposit: number, newDeposit: number, rate: number) => {
    if (curMonthly < 0) throw new Error("현재 월세를 입력해 주세요.");
    if (newDeposit < 0) throw new Error("변경 후 보증금을 입력해 주세요.");
    
    const depositDiff = newDeposit - curDeposit;
    const monthlyChange = Math.floor((depositDiff * rate) / 100 / 12);
    const newMonthly = Math.max(0, curMonthly - monthlyChange);
    setAdjResult({ curMonthly, curDeposit, newDeposit, rate, depositDiff, monthlyChange, newMonthly });
  };

  return { tmResult, tdResult, adjResult, calcToMonthly, calcToDeposit, calcAdjust };
}
