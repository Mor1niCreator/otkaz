'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import toast from 'react-hot-toast';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  usdTarget: number;
  currency: string;
}

interface CryptoData {
  symbol: string;
  name: string;
  price5YearsAgo: number;
  currentPrice: number;
  multiplier: number;
  yourValue: number;
}

export default function GoalsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showCrypto, setShowCrypto] = useState(false);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loadingCrypto, setLoadingCrypto] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
  });
  
  const { t } = useTranslation(user?.language || 'en');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadGoals(parsedUser.id);
  }, [router]);

  const loadGoals = async (userId: string) => {
    try {
      const res = await fetch(`/api/goals/list?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setGoals(data.goals);
        setTotalSavings(data.totalSavings);
      }
    } catch (error) {
      console.error('Failed to load goals:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/goals/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
          targetAmount: parseFloat(formData.targetAmount),
          currency: user.currency,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t('createGoal') + '! 🎯');
        setShowForm(false);
        setFormData({ name: '', targetAmount: '' });
        loadGoals(user.id);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const loadCryptoROI = async () => {
    setLoadingCrypto(true);
    try {
      const res = await fetch(`/api/crypto/roi?amount=${totalSavings}`);
      const data = await res.json();
      if (res.ok) {
        setCryptoData(data.data);
        setShowCrypto(true);
      }
    } catch (error) {
      toast.error('Failed to load crypto data');
    } finally {
      setLoadingCrypto(false);
    }
  };

  if (!user) return null;

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto">
      <div className="comic-panel mb-6">
        <h1 className="text-4xl font-bold mb-2">🎯 {t('yourGoals')}</h1>
        <div className="bg-comic-yellow rounded-xl border-4 border-black p-4 mt-4">
          <p className="text-sm text-gray-700">{t('totalSavings')}</p>
          <p className="text-3xl font-bold">${totalSavings.toFixed(2)}</p>
        </div>
      </div>

      <div className="comic-panel mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Active Goals</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-comic-lime border-4 border-black rounded-full px-4 py-2 font-bold shadow-comic"
          >
            + New
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t('noGoalsYet')}
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = Math.min((totalSavings / goal.usdTarget) * 100, 100);
              return (
                <div key={goal.id} className="bg-white rounded-xl border-4 border-black p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{goal.name}</h3>
                      <p className="text-sm text-gray-700">
                        {t('target')}: ${goal.usdTarget.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-comic-orange">
                        {progress.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    ${totalSavings.toFixed(2)} / ${goal.usdTarget.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {totalSavings > 0 && (
        <div className="comic-panel mb-6">
          <h2 className="text-2xl font-bold mb-4">{t('cryptoROICalculator')}</h2>
          <p className="text-sm text-gray-700 mb-4">
            {t('cryptoROIDescription')}
          </p>
          
          {!showCrypto ? (
            <button
              onClick={loadCryptoROI}
              disabled={loadingCrypto}
              className="w-full comic-button"
            >
              {loadingCrypto ? 'Loading...' : '🚀 Calculate Crypto ROI'}
            </button>
          ) : (
            <div className="space-y-3">
              {cryptoData.map((crypto) => (
                <div
                  key={crypto.symbol}
                  className="bg-gradient-to-r from-comic-purple to-comic-pink rounded-xl border-4 border-black p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-bold text-lg">{crypto.symbol}</p>
                      <p className="text-xs text-gray-700">{crypto.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {crypto.multiplier.toFixed(1)}x
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600">5Y Ago</p>
                      <p className="font-bold">${crypto.price5YearsAgo.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Now</p>
                      <p className="font-bold">${crypto.currentPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Your Value</p>
                      <p className="font-bold text-green-600">
                        ${crypto.yourValue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-xs text-center text-gray-500 italic mt-4">
                {t('disclaimer')}
              </p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="comic-panel max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{t('createGoal')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={t('goalName')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border-4 border-black rounded-xl"
              />
              <input
                type="number"
                step="0.01"
                placeholder={t('targetAmount')}
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                required
                className="w-full px-4 py-3 border-4 border-black rounded-xl"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 comic-button">
                  {t('save')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 comic-button-secondary"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}