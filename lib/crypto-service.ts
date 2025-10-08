export interface CryptoROI {
  symbol: string;
  name: string;
  price5YearsAgo: number;
  currentPrice: number;
  multiplier: number;
  yourValue: number;
}

const TOP_CRYPTOS = [
  'bitcoin',
  'ethereum',
  'binancecoin',
  'cardano',
  'ripple',
  'solana',
  'polkadot',
  'dogecoin',
  'avalanche-2',
  'polygon',
];

export async function getCryptoROI(usdAmount: number): Promise<CryptoROI[]> {
  console.log('getCryptoROI called with amount:', usdAmount);
  
  // For faster response, always return mock data
  // Real API calls take 15-20 seconds due to rate limiting
  return getMockCryptoROI(usdAmount);
  
  /* Uncomment below for real API calls (takes 15-20 seconds):
  
  try {
    const fiveYearsAgo = Math.floor((Date.now() - 5 * 365 * 24 * 60 * 60 * 1000) / 1000);
    const results: CryptoROI[] = [];

    for (const coinId of TOP_CRYPTOS) {
      try {
        // Get historical price (5 years ago)
        const historicalResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${fiveYearsAgo}&to=${fiveYearsAgo + 86400}`
        );
        
        if (!historicalResponse.ok) continue;
        
        const historicalData = await historicalResponse.json();
        const price5YearsAgo = historicalData.prices?.[0]?.[1];
        
        if (!price5YearsAgo) continue;

        // Get current price
        const currentResponse = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
        );
        
        if (!currentResponse.ok) continue;
        
        const currentData = await currentResponse.json();
        const currentPrice = currentData[coinId]?.usd;
        
        if (!currentPrice) continue;

        const multiplier = currentPrice / price5YearsAgo;
        const yourValue = usdAmount * multiplier;

        // Get coin name
        const coinResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const coinData = await coinResponse.json();

        results.push({
          symbol: coinData.symbol?.toUpperCase() || coinId,
          name: coinData.name || coinId,
          price5YearsAgo,
          currentPrice,
          multiplier,
          yourValue,
        });

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`Error fetching data for ${coinId}:`, error);
      }
    }

    return results.sort((a, b) => b.multiplier - a.multiplier);
  } catch (error) {
    console.error('Error calculating crypto ROI:', error);
    return getMockCryptoROI(usdAmount);
  }
  */
}

function getMockCryptoROI(usdAmount: number): CryptoROI[] {
  const mockData = [
    { symbol: 'BTC', name: 'Bitcoin', price5YearsAgo: 3800, currentPrice: 67000, multiplier: 17.6 },
    { symbol: 'ETH', name: 'Ethereum', price5YearsAgo: 150, currentPrice: 3200, multiplier: 21.3 },
    { symbol: 'SOL', name: 'Solana', price5YearsAgo: 2.5, currentPrice: 145, multiplier: 58 },
    { symbol: 'BNB', name: 'Binance Coin', price5YearsAgo: 12, currentPrice: 580, multiplier: 48.3 },
    { symbol: 'ADA', name: 'Cardano', price5YearsAgo: 0.05, currentPrice: 0.62, multiplier: 12.4 },
    { symbol: 'XRP', name: 'Ripple', price5YearsAgo: 0.31, currentPrice: 0.54, multiplier: 1.7 },
    { symbol: 'DOT', name: 'Polkadot', price5YearsAgo: 3, currentPrice: 7.2, multiplier: 2.4 },
    { symbol: 'DOGE', name: 'Dogecoin', price5YearsAgo: 0.002, currentPrice: 0.15, multiplier: 75 },
    { symbol: 'AVAX', name: 'Avalanche', price5YearsAgo: 4, currentPrice: 38, multiplier: 9.5 },
    { symbol: 'MATIC', name: 'Polygon', price5YearsAgo: 0.015, currentPrice: 0.78, multiplier: 52 },
  ];

  return mockData.map(crypto => ({
    ...crypto,
    yourValue: usdAmount * crypto.multiplier,
  }));
}