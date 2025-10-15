'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isLoadingGoals, setIsLoadingGoals] = useState(false);
  const [formData, setFormData] = useState({ name: '', targetAmount: '' });
  
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
    if (isLoadingGoals) return;
    
    setIsLoadingGoals(true);
    try {
      const res = await fetch(`/api/goals/list?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setGoals(data.goals);
        setTotalSavings(data.totalSavings);
        
        if (data.goals.length === 0 && !localStorage.getItem(`defaultGoalsCreated_${userId}`)) {
          await createDefaultGoals(userId);
          localStorage.setItem(`defaultGoalsCreated_${userId}`, 'true');
        }
      }
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setIsLoadingGoals(false);
    }
  };

  const createDefaultGoals = async (userId: string) => {
    const userCurrency = user?.currency || 'USD';
    
    for (const goal of DEFAULT_GOALS) {
      try {
        await fetch('/api/goals/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            name: goal.name,
            targetAmount: convertCurrency(goal.targetUSD, userCurrency),
            currency: userCurrency,
          }),
        });
      } catch (error) {
        console.error('Failed to create default goal:', error);
      }
    }
    
    setTimeout(() => loadGoals(userId), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch('/api/goals/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: formData.name,
          targetAmount: parseFloat(formData.targetAmount),
          currency: user.currency || 'USD',
        }),
      });

      if (res.ok) {
        toast.success('Goal created!');
        setShowForm(false);
        setFormData({ name: '', targetAmount: '' });
        loadGoals(user.id);
      }
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  const loadCryptoROI = async () => {
    if (!user) return;
    
    setLoadingCrypto(true);
    try {
      const res = await fetch(`/api/crypto/roi?amount=${totalSavings}`);
      const data = await res.json();
      if (res.ok) {
        setCryptoData(data.cryptoData || []);
        setShowCrypto(true);
      }
    } catch (error) {
      console.error('Failed to load crypto ROI:', error);
    } finally {
      setLoadingCrypto(false);
    }
  };

  if (!user) return null;

  return (
    <div className="pb-24 px-4 py-6 max-w-4xl mx-auto" style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ fontWeight: 900, color: '#212121' }}>
          {t('goals')}
        </h1>
        <p className="text-gray-500 text-sm font-medium">Track your financial targets</p>
      </div>

      {/* Total Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
        style={{ background: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)', border: 'none' }}
      >
        <div className="text-sm font-semibold text-gray-900 mb-1">Total Saved</div>
        <div className="text-5xl font-black text-gray-900 mb-4" style={{ fontVariantNumeric: 'tabular-nums' }}>
          ${totalSavings.toFixed(2)}
        </div>
        
        <button
          onClick={loadCryptoROI}
          disabled={loadingCrypto || totalSavings === 0}
          className="btn-secondary w-full"
        >
          {loadingCrypto ? 'Loading...' : '📈 View Crypto ROI'}
        </button>
      </motion.div>

      {/* Goals List */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Your Goals</h2>
          <button
            onClick={() => setShowForm(true)}
            className="text-sm font-semibold text-yellow-600 hover:text-yellow-700"
          >
            + Add Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500 font-medium">No goals yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal, index) => {
              const progress = Math.min((totalSavings / goal.usdTarget) * 100, 100);
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{goal.name}</h3>
                      <p className="text-sm text-gray-500">
                        ${totalSavings.toFixed(2)} / ${goal.usdTarget.toFixed(2)}
                      </p>
                    </div>
                    <span className="badge-yellow">{Math.round(progress)}%</span>
                  </div>
                  
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold mb-6">Create Goal</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Goal Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="e.g., Emergency Fund"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Target Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="input"
                    placeholder="1000"
                    required
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crypto ROI Modal */}
      <AnimatePresence>
        {showCrypto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCrypto(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold mb-2">Crypto ROI Calculator</h3>
              <p className="text-sm text-gray-500 mb-6">If you invested ${totalSavings.toFixed(2)} in crypto 5 years ago</p>
              
              <div className="space-y-4">
                {cryptoData.map((crypto, index) => (
                  <motion.div
                    key={crypto.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="font-bold text-lg">{crypto.name}</h4>
                        <p className="text-xs text-gray-500">{crypto.symbol}</p>
                      </div>
                      <span className="badge-green">{crypto.multiplier.toFixed(1)}x</span>
                    </div>
                    
                    <div className="flex justify-between text-sm mt-3">
                      <span className="text-gray-600">5 years ago: ${crypto.price5YearsAgo.toFixed(2)}</span>
                      <span className="text-gray-600">Now: ${crypto.currentPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600">Your value would be</div>
                      <div className="text-2xl font-bold text-green-600">${crypto.yourValue.toFixed(2)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => setShowCrypto(false)}
                className="btn-primary w-full mt-6"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation />
    </div>
  );
}
