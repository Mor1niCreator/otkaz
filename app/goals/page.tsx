'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency, convertCurrency } from '@/lib/currency-utils';
import { DEFAULT_GOALS } from '@/lib/default-goals';
import { getUserFromStorage } from '@/lib/user-sync';

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
    const parsedUser = getUserFromStorage();
    if (!parsedUser) {
      router.push('/');
      return;
    }
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
        
        console.log(`Goals loaded: ${data.goals.length} goals, Total savings: ${data.totalSavings} USD`);
        
        // Create default goals if none exist (only once!)
        if (data.goals.length === 0 && !localStorage.getItem(`defaultGoalsCreated_${userId}`)) {
          await createDefaultGoals(userId);
          localStorage.setItem(`defaultGoalsCreated_${userId}`, 'true');
        }
      }
    } catch (error) {
      console.error('Failed to load goals:', error);
    }
  };

  const createDefaultGoals = async (userId: string) => {
    console.log('Creating default goals...');
    
    // Check if goals already exist to prevent duplicates
    try {
      const checkRes = await fetch(`/api/goals/check-exists?userId=${userId}`);
      const checkData = await checkRes.json();
      
      if (checkData.exists) {
        console.log('Goals already exist, skipping creation');
        return;
      }
    } catch (error) {
      console.error('Failed to check existing goals:', error);
    }
    
    const createdGoals = [];
    for (const goal of DEFAULT_GOALS) {
      try {
        const res = await fetch('/api/goals/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            name: `${goal.icon} ${goal.name}`,
            targetAmount: goal.targetUSD,
            currency: 'USD',
          }),
        });
        if (res.ok) {
          const data = await res.json();
          createdGoals.push(data.goal);
        }
      } catch (error) {
        console.error('Failed to create default goal:', error);
      }
    }
    
    console.log(`Created ${createdGoals.length} default goals`);
    
    // Reload goals from database to get the complete data
    await loadGoals(userId);
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
    if (totalSavings <= 0) {
      toast.error('Add some refusals first to see Crypto ROI!');
      return;
    }
    
    setLoadingCrypto(true);
    
    try {
      const res = await fetch(`/api/crypto/roi?amount=${totalSavings}`);
      const data = await res.json();
      if (res.ok && data.data && data.data.length > 0) {
        setCryptoData(data.data);
        setShowCrypto(true);
        toast.success('Crypto ROI calculated! 🚀');
      } else {
        toast.error('Failed to calculate Crypto ROI');
      }
    } catch (error) {
      console.error('Crypto ROI error:', error);
      toast.error('Network error');
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
          <p className="text-3xl font-bold">{formatCurrency(convertCurrency(totalSavings, user.currency), user.currency)}</p>
        </div>
      </div>

      <div className="comic-panel mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Active Goals</h2>
          <button
            onClick={() => setShowForm(true)}
            className="comic-button-lime rounded-full px-4 py-2"
          >
            ➕ New
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
              const convertedSavings = convertCurrency(totalSavings, user.currency);
              const convertedTarget = convertCurrency(goal.usdTarget, user.currency);
              
              return (
                <div key={goal.id} className="bg-white rounded-xl border-4 border-black p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{goal.name}</h3>
                      <p className="text-sm text-gray-700">
                        {t('target')}: {formatCurrency(convertedTarget, user.currency)}
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
                    {formatCurrency(convertedSavings, user.currency)} / {formatCurrency(convertedTarget, user.currency)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {totalSavings > 0 && (
        <div className="comic-panel mb-6">
          <h2 className="text-2xl font-bold mb-4">🚀 {t('cryptoROICalculator')}</h2>
          <div className="bg-comic-yellow rounded-xl border-4 border-black p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              {t('yourSavings')}: <span className="font-bold">{formatCurrency(convertCurrency(totalSavings, user.currency), user.currency)}</span>
            </p>
            <p className="text-xs text-gray-600">
              See what this would be worth if you invested in top cryptocurrencies 5 years ago!
            </p>
          </div>
          
          {!showCrypto ? (
            <button
              onClick={loadCryptoROI}
              disabled={loadingCrypto}
              className="comic-button-orange w-full py-4 text-lg"
            >
              {loadingCrypto ? '⏳ Calculating...' : '🚀 Calculate Crypto ROI'}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-gray-700 mb-3 text-center">
                💡 Click on any crypto to see detailed breakdown
              </div>
              {cryptoData.map((crypto) => (
                <div
                  key={crypto.symbol}
                  className="bg-gradient-to-r from-white to-gray-50 rounded-xl border-4 border-black p-4 hover:shadow-comic-lg transition-all cursor-pointer hover:-translate-y-1"
                  onClick={() => {
                    const convertedYourValue = convertCurrency(crypto.yourValue, user.currency);
                    const convertedOriginal = convertCurrency(totalSavings, user.currency);
                    const profit = convertedYourValue - convertedOriginal;
                    const roiPercent = ((crypto.multiplier - 1) * 100).toFixed(0);
                    
                    alert(`🔥 ${crypto.name} (${crypto.symbol})

📊 Performance:
• 5 years ago: $${crypto.price5YearsAgo.toFixed(2)}
• Today: $${crypto.currentPrice.toFixed(2)}
• Growth: ${crypto.multiplier.toFixed(1)}x

💰 Your Investment:
• Original: ${formatCurrency(convertedOriginal, user.currency)}
• Would be: ${formatCurrency(convertedYourValue, user.currency)}
• Profit: ${formatCurrency(profit, user.currency)}

🎯 Return on Investment: +${roiPercent}%`);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold text-xl">{crypto.symbol}</div>
                        <div className="text-xs bg-comic-lime px-2 py-1 rounded-full border-2 border-black font-bold">
                          {crypto.multiplier.toFixed(1)}x
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">{crypto.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        ${crypto.price5YearsAgo.toFixed(2)} → ${crypto.currentPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-comic-orange">
                        {formatCurrency(convertCurrency(crypto.yourValue, user.currency), user.currency)}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        +{formatCurrency(convertCurrency(crypto.yourValue - totalSavings, user.currency), user.currency)} profit
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-comic-cyan rounded-xl border-4 border-black p-4 mt-4">
                <div className="text-sm text-gray-700 text-center">
                  💎 Best performer: <span className="font-bold">{cryptoData[0]?.symbol}</span> ({cryptoData[0]?.multiplier.toFixed(1)}x)
                </div>
              </div>
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