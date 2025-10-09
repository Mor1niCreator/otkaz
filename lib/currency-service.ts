// Currency exchange rates: 1 USD = X currency
const MOCK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CHF: 0.88,
  CAD: 1.36,
  AUD: 1.53,
  CNY: 7.24,
  RUB: 92.5,
  UAH: 36.9,
  BYN: 3.27,
  KZT: 460,
  UZS: 12250,
  AMD: 387,
  AZN: 1.7,
  GEL: 2.66,
  KGS: 89,
  TJS: 10.95,
  TMT: 3.5,
  MDL: 17.7,
  VND: 24500,
  THB: 35.8,
  KRW: 1340,
  SGD: 1.35,
  MYR: 4.73,
  IDR: 15700,
  PHP: 56.5,
  INR: 83.2,
  MXN: 17.1,
  BRL: 4.98,
  ZAR: 18.8,
  TRY: 32.5,
  PLN: 4.05,
  CZK: 23.2,
};

export async function convertToUSD(amount: number, currency: string): Promise<number> {
  if (currency === 'USD') return amount;

  const rate = MOCK_RATES[currency] || 1;
  
  // Convert TO USD by dividing
  // Example: 50,000 VND / 24,500 = 2.04 USD
  const usdAmount = amount / rate;
  
  console.log(`[Currency] Converting ${amount} ${currency} to USD: ${usdAmount.toFixed(4)}`);
  
  return usdAmount;
}

export async function convertFromUSD(usdAmount: number, currency: string): Promise<number> {
  if (currency === 'USD') return usdAmount;
  
  const rate = MOCK_RATES[currency] || 1;
  return usdAmount * rate;
}