import { useState } from 'react';
import {
  calculateJeonseToMonthly,
  calculateMonthlyToJeonse,
  calculateDepositMonthlyAdjust,
  JeonseToMonthlyResult,
  MonthlyToJeonseResult,
  DepositMonthlyAdjustResult
} from '@/lib/calculators/real-estate-engine';

export function useJeonseCalculator() {
  const [tmResult, setTmResult] = useState<JeonseToMonthlyResult | null>(null);
  const [tdResult, setTdResult] = useState<MonthlyToJeonseResult | null>(null);
  const [adjResult, setAdjResult] = useState<DepositMonthlyAdjustResult | null>(null);

  const calcToMonthly = (jeonse: number, deposit: number, rate: number) => {
    try {
      const res = calculateJeonseToMonthly(jeonse, deposit, rate);
      setTmResult(res);
    } catch (e: any) {
      throw e;
    }
  };

  const calcToDeposit = (monthly: number, deposit: number, rate: number) => {
    try {
      const res = calculateMonthlyToJeonse(monthly, deposit, rate);
      setTdResult(res);
    } catch (e: any) {
      throw e;
    }
  };

  const calcAdjust = (curMonthly: number, curDeposit: number, newDeposit: number, rate: number) => {
    try {
      const res = calculateDepositMonthlyAdjust(curMonthly, curDeposit, newDeposit, rate);
      setAdjResult(res);
    } catch (e: any) {
      throw e;
    }
  };

  return { tmResult, tdResult, adjResult, calcToMonthly, calcToDeposit, calcAdjust };
}
