import { CURRENCIES } from './currencies';

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = CURRENCIES[currencyCode as keyof typeof CURRENCIES];
  if (!currency) return `$${amount.toFixed(2)}`;
  
  // Format with proper decimals
  const decimals = ['JPY', 'KRW', 'VND', 'IDR'].includes(currencyCode) ? 0 : 2;
  
  return `${currency.symbol}${amount.toFixed(decimals)}`;
}

export function convertCurrency(amountInUSD: number, toCurrency: string): number {
  const rates: Record<string, number> = {
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

  const rate = rates[toCurrency] || 1;
  return amountInUSD * rate;
}

export function getCurrencySymbol(currencyCode: string): string {
  const currency = CURRENCIES[currencyCode as keyof typeof CURRENCIES];
  return currency?.symbol || '$';
}