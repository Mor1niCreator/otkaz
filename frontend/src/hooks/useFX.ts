import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface FXRate {
  currency: string;
  rate_to_usd: number;
  provider: string;
  cached_at: string;
}

interface FXRatesResponse {
  base: string;
  rates: FXRate[];
  cached_at: string;
}

interface UseFXReturn {
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
  convertToUSD: (amount: number, fromCurrency: string) => number;
  convertFromUSD: (amountUSD: number, toCurrency: string) => number;
  convertCurrency: (amount: number, fromCurrency: string, toCurrency: string) => number;
  toUI: (amountUSD: number, userCurrency: string) => number;
  refreshRates: () => Promise<void>;
}

export function useFX(): UseFXReturn {
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1.0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get<FXRatesResponse>('/api/fx/rates');
      const ratesMap: Record<string, number> = { USD: 1.0 };
      
      response.data.rates.forEach(rate => {
        ratesMap[rate.currency] = rate.rate_to_usd;
      });
      
      setRates(ratesMap);
    } catch (err) {
      console.error('Failed to fetch FX rates:', err);
      setError('Failed to load exchange rates');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRates = useCallback(async () => {
    try {
      setError(null);
      await axios.post('/api/fx/refresh');
      await fetchRates();
    } catch (err) {
      console.error('Failed to refresh FX rates:', err);
      setError('Failed to refresh exchange rates');
    }
  }, [fetchRates]);

  const convertToUSD = useCallback((amount: number, fromCurrency: string): number => {
    if (fromCurrency === 'USD') return amount;
    const rate = rates[fromCurrency];
    return rate ? amount * rate : amount;
  }, [rates]);

  const convertFromUSD = useCallback((amountUSD: number, toCurrency: string): number => {
    if (toCurrency === 'USD') return amountUSD;
    const rate = rates[toCurrency];
    return rate ? amountUSD / rate : amountUSD;
  }, [rates]);

  const convertCurrency = useCallback((amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    const amountUSD = convertToUSD(amount, fromCurrency);
    return convertFromUSD(amountUSD, toCurrency);
  }, [convertToUSD, convertFromUSD]);

  const toUI = useCallback((amountUSD: number, userCurrency: string): number => {
    return convertFromUSD(amountUSD, userCurrency);
  }, [convertFromUSD]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return {
    rates,
    loading,
    error,
    convertToUSD,
    convertFromUSD,
    convertCurrency,
    toUI,
    refreshRates
  };
}