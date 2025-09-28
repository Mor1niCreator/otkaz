import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Edit } from 'lucide-react';
import { useI18nStrict } from '../hooks/useI18nStrict';
import { useFX } from '../hooks/useFX';
import { ComicPanel } from '../components/ComicPanel';
import axios from 'axios';

interface Goal {
  id: number;
  title: string;
  target_amount_usd: number;
  icon?: string;
  is_achieved: boolean;
  achieved_at?: string;
  created_at: string;
}

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

interface CryptoROIResponse {
  saved_total_usd: number;
  currency: string;
  items: CryptoROIItem[];
  disclaimer: string;
}

export function Goals() {
  const { t } = useI18nStrict();
  const { toUI } = useFX();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [cryptoROI, setCryptoROI] = useState<CryptoROIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [goalsResponse, cryptoResponse] = await Promise.all([
        axios.get('/api/goals'),
        axios.get('/api/crypto/roi')
      ]);
      
      setGoals(goalsResponse.data.goals);
      setCryptoROI(cryptoResponse.data);
    } catch (error) {
      console.error('Failed to fetch goals data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (window.confirm(t('common.confirm'))) {
      try {
        await axios.delete(`/api/goals/${goalId}`);
        await fetchData();
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center">
          <div className="loading"></div>
          <span className="ml-2">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target size={32} />
          {t('goals.title')}
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus size={20} />
          {t('goals.add_goal')}
        </button>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {goals.map((goal) => (
          <ComicPanel key={goal.id}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{goal.icon || '🎯'}</span>
                <span className="font-bold">{goal.title}</span>
              </div>
              <div className="flex gap-1">
                <button className="btn btn-sm">
                  <Edit size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="btn btn-sm"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted">
                {t('goals.target_amount')}: {formatCurrency(toUI(goal.target_amount_usd, 'VND'), 'VND')}
              </div>
              
              {goal.is_achieved ? (
                <div className="badge badge-success">
                  ✓ {t('goals.achieved')}
                </div>
              ) : (
                <div className="text-sm text-muted">
                  {t('goals.progress')}: 0%
                </div>
              )}
            </div>
          </ComicPanel>
        ))}
        
        {goals.length === 0 && (
          <ComicPanel className="col-span-full text-center py-8">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-medium mb-2">{t('goals.title')}</h3>
            <p className="text-muted mb-4">{t('goals.add_goal')}</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              <Plus size={20} />
              {t('goals.add_goal')}
            </button>
          </ComicPanel>
        )}
      </div>

      {/* Crypto ROI */}
      {cryptoROI && (
        <ComicPanel>
          <h2 className="text-xl font-bold mb-4">{t('crypto.title')}</h2>
          <p className="text-muted mb-4">{t('crypto.subtitle')}</p>
          
          <div className="overflow-x-auto">
            <table className="w-full">
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
                {cryptoROI.items.slice(0, 5).map((item) => (
                  <tr key={item.coin_id} className="border-b border-border">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.symbol}</span>
                        <span className="text-sm text-muted">{item.name}</span>
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
                        {formatCurrency(item.current_value_currency, cryptoROI.currency)}
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
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">{cryptoROI.disclaimer}</p>
          </div>
        </ComicPanel>
      )}
    </div>
  );
}