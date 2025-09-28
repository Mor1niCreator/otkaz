import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { useI18nStrict } from '../hooks/useI18nStrict';
import { ComicPanel } from './ComicPanel';

interface CryptoROIItem {
  coin_id: string;
  symbol: string;
  name: string;
  price_5y_ago_usd: number;
  price_now_usd: number;
  growth_multiplier: number;
  coins_owned: number;
  current_value_usd: number;
  current_value_currency: number;
}

interface ROIBlockProps {
  savedTotalUsd: number;
  currency: string;
  items: CryptoROIItem[];
  disclaimer: string;
  loading?: boolean;
  error?: string;
}

export function ROIBlock({ 
  savedTotalUsd, 
  currency, 
  items, 
  disclaimer, 
  loading = false,
  error = null 
}: ROIBlockProps) {
  const { t } = useI18nStrict();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <ComicPanel>
        <div className="text-center py-8">
          <div className="loading mx-auto mb-4"></div>
          <p className="text-muted">{t('crypto.loading')}</p>
        </div>
      </ComicPanel>
    );
  }

  if (error) {
    return (
      <ComicPanel>
        <div className="text-center py-8">
          <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-red-600">{t('crypto.error')}</p>
        </div>
      </ComicPanel>
    );
  }

  return (
    <ComicPanel>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={24} className="text-green-600" />
        <h3 className="text-xl font-bold">{t('crypto.title')}</h3>
      </div>
      
      <p className="text-muted mb-4">{t('crypto.subtitle')}</p>
      
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
        <div className="text-sm">
          <span className="font-medium">{t('stats.total_saved')}: </span>
          <span className="text-green-700">{formatCurrency(savedTotalUsd)}</span>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2">{t('crypto.coin')}</th>
                <th className="text-right p-2">{t('crypto.price_5y_ago')}</th>
                <th className="text-right p-2">{t('crypto.price_now')}</th>
                <th className="text-right p-2">{t('crypto.growth')}</th>
                <th className="text-right p-2">{t('crypto.current_value')}</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 5).map((item) => (
                <tr key={item.coin_id} className="border-b border-border">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.symbol}</span>
                      <span className="text-muted text-xs">{item.name}</span>
                    </div>
                  </td>
                  <td className="text-right p-2">
                    ${item.price_5y_ago_usd.toFixed(2)}
                  </td>
                  <td className="text-right p-2">
                    ${item.price_now_usd.toFixed(2)}
                  </td>
                  <td className="text-right p-2">
                    <span className={item.growth_multiplier > 1 ? 'text-green-600' : 'text-red-600'}>
                      {item.growth_multiplier.toFixed(1)}x
                    </span>
                  </td>
                  <td className="text-right p-2">
                    <div className="font-medium">
                      {formatCurrency(item.current_value_currency)}
                    </div>
                    <div className="text-xs text-muted">
                      ${item.current_value_usd.toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted">
          <p>{t('crypto.no_data')}</p>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">{disclaimer}</p>
      </div>
    </ComicPanel>
  );
}