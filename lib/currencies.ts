export const CURRENCIES = {
  // Major currencies
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  CHF: { symbol: 'Fr', name: 'Swiss Franc' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  
  // CIS currencies
  RUB: { symbol: '₽', name: 'Russian Ruble' },
  UAH: { symbol: '₴', name: 'Ukrainian Hryvnia' },
  BYN: { symbol: 'Br', name: 'Belarusian Ruble' },
  KZT: { symbol: '₸', name: 'Kazakhstani Tenge' },
  UZS: { symbol: 'soʻm', name: 'Uzbekistani Som' },
  AMD: { symbol: '֏', name: 'Armenian Dram' },
  AZN: { symbol: '₼', name: 'Azerbaijani Manat' },
  GEL: { symbol: '₾', name: 'Georgian Lari' },
  KGS: { symbol: 'с', name: 'Kyrgyzstani Som' },
  TJS: { symbol: 'ЅМ', name: 'Tajikistani Somoni' },
  TMT: { symbol: 'm', name: 'Turkmenistani Manat' },
  MDL: { symbol: 'L', name: 'Moldovan Leu' },
  
  // Asian currencies
  VND: { symbol: '₫', name: 'Vietnamese Dong' },
  THB: { symbol: '฿', name: 'Thai Baht' },
  KRW: { symbol: '₩', name: 'South Korean Won' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar' },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit' },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah' },
  PHP: { symbol: '₱', name: 'Philippine Peso' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  
  // Other
  MXN: { symbol: 'Mex$', name: 'Mexican Peso' },
  BRL: { symbol: 'R$', name: 'Brazilian Real' },
  ZAR: { symbol: 'R', name: 'South African Rand' },
  TRY: { symbol: '₺', name: 'Turkish Lira' },
  PLN: { symbol: 'zł', name: 'Polish Zloty' },
  CZK: { symbol: 'Kč', name: 'Czech Koruna' },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

// Array version for select dropdowns
export const CURRENCIES_ARRAY = Object.entries(CURRENCIES).map(([code, data]) => ({
  code,
  symbol: data.symbol,
  name: data.name,
}));