
import { useState, useEffect } from 'react';

const CURRENCIES = [
  { code: "USD", label: "미국 달러", symbol: "$", unit: 1 },
  { code: "JPY", label: "일본 엔화", symbol: "¥", unit: 100 },
  { code: "EUR", label: "유로", symbol: "€", unit: 1 },
  { code: "CNY", label: "중국 위안화", symbol: "¥", unit: 1 },
  { code: "GBP", label: "영국 파운드", symbol: "£", unit: 1 },
  { code: "VND", label: "베트남 동", symbol: "₫", unit: 1000 },
];

export function useExchangeCalculator() {
  const [rates, setRates] = useState<any>({});
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [status, setStatus] = useState<string>("loading");
  const [exResult, setExResult] = useState<any>(null);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/KRW")
      .then(res => res.json())
      .then(data => {
        const d = new Date(data.time_last_update_unix * 1000);
        setLastUpdate(d.toLocaleDateString() + " " + d.toLocaleTimeString());
        
        const newRates:any = {};
        CURRENCIES.forEach(c => {
           if(data.rates[c.code]) {
               newRates[c.code] = c.unit / data.rates[c.code];
           }
        });
        setRates(newRates);
        setStatus("success");
      })
      .catch((e) => {
        console.error(e);
        setStatus("error");
        setRates({ USD: 1350, JPY: 900, EUR: 1450, CNY: 190, GBP: 1700, VND: 5.5 });
      });
  }, []);

  const calculate = (amount: number, fee: number, dir: string, targetCode: string, userRates: any) => {
    if (amount <= 0) throw new Error("금액을 정확히 입력해주세요.");
    
    if (dir === 'from-krw') {
      const cards = CURRENCIES.map(c => {
        const r = userRates[c.code] || rates[c.code];
        const rFee = r * (1 + fee / 100);
        return { ...c, amt: amount / rFee, noFeeAmt: amount / r };
      });
      setExResult({ dir, amount, fee, cards });
    } else {
      const cur = CURRENCIES.find((c) => c.code === targetCode)!;
      const r = userRates[targetCode] || rates[targetCode];
      const rFee = r * (1 - fee / 100);
      const krwAmount = amount * rFee;
      const krwNoFee = amount * r;
      setExResult({ dir, amount, fee, cur, r, krwAmount, krwNoFee });
    }
  };

  return { rates, lastUpdate, status, exResult, calculate, CURRENCIES };
}
