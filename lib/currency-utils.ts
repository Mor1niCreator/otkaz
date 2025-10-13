import { CURRENCIES } from './currencies';
import { EXCHANGE_RATES } from './currency-service';

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = CURRENCIES[currencyCode as keyof typeof CURRENCIES];
  if (!currency) return `$${amount.toFixed(2)}`;
  
  // Format with proper decimals
  const decimals = ['JPY', 'KRW', 'VND', 'IDR'].includes(currencyCode) ? 0 : 2;
  
  return `${currency.symbol}${amount.toFixed(decimals)}`;
}

export function convertCurrency(amountInUSD: number, toCurrency: string): number {
  const rate = EXCHANGE_RATES[toCurrency] || 1;
  return amountInUSD * rate;
}

export function getCurrencySymbol(currencyCode: string): string {
  const currency = CURRENCIES[currencyCode as keyof typeof CURRENCIES];
  return currency?.symbol || '$';
}