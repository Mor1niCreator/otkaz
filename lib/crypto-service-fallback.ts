// Fallback mock data if CoinGecko API fails
export interface CryptoROI {
  symbol: string;
  name: string;
  price5YearsAgo: number;
  currentPrice: number;
  multiplier: number;
  yourValue: number;
}

export function getMockCryptoROI(usdAmount: number): CryptoROI[] {
  const mockData = [
    { symbol: 'DOGE', name: 'Dogecoin', price5YearsAgo: 0.002, currentPrice: 0.15, multiplier: 75 },
    { symbol: 'SOL', name: 'Solana', price5YearsAgo: 2.5, currentPrice: 145, multiplier: 58 },
    { symbol: 'MATIC', name: 'Polygon', price5YearsAgo: 0.015, currentPrice: 0.78, multiplier: 52 },
    { symbol: 'BNB', name: 'Binance Coin', price5YearsAgo: 12, currentPrice: 580, multiplier: 48.3 },
    { symbol: 'ETH', name: 'Ethereum', price5YearsAgo: 150, currentPrice: 3200, multiplier: 21.3 },
    { symbol: 'BTC', name: 'Bitcoin', price5YearsAgo: 3800, currentPrice: 67000, multiplier: 17.6 },
    { symbol: 'ADA', name: 'Cardano', price5YearsAgo: 0.05, currentPrice: 0.62, multiplier: 12.4 },
    { symbol: 'AVAX', name: 'Avalanche', price5YearsAgo: 4, currentPrice: 38, multiplier: 9.5 },
    { symbol: 'DOT', name: 'Polkadot', price5YearsAgo: 3, currentPrice: 7.2, multiplier: 2.4 },
    { symbol: 'XRP', name: 'Ripple', price5YearsAgo: 0.31, currentPrice: 0.54, multiplier: 1.7 },
  ];

  return mockData.map(crypto => ({
    ...crypto,
    yourValue: usdAmount * crypto.multiplier,
  }));
}