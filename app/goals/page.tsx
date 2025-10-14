'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import MathWallBackground from '@/components/MathWallBackground';
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
    if (isLoadingGoals) return; // Prevent multiple simultaneous calls
    
    setIsLoadingGoals(true);
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
    } finally {
      setIsLoadingGoals(false);
    }
  };

  const createDefaultGoals = async (userId: string) => {
    console.log('Creating default goals...');
    
    // Double-check if goals already exist to prevent duplicates
    try {
      const checkRes = await fetch(`/api/goals/check-exists?userId=${userId}`);
      const checkData = await checkRes.json();
      
      if (checkData.exists) {
        console.log('Goals already exist, skipping creation');
        // Reload goals to get the existing ones
        const res = await fetch(`/api/goals/list?userId=${userId}`);
        const data = await res.json();
        if (res.ok) {
          setGoals(data.goals);
          setTotalSavings(data.totalSavings);
        }
        return;
      }
    } catch (error) {
      console.error('Failed to check existing goals:', error);
      return; // Don't create goals if we can't check
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
    
    // Update state directly with created goals to avoid reload
    setGoals(createdGoals);
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
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto relative">
      <MathWallBackground />
      <motion.div 
        className="comic-panel mb-6 relative overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-orange-300 rounded-full opacity-20"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <motion.h1 
          className="text-4xl font-bold mb-2 flex items-center gap-3 relative z-10"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.span animate={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            🎯
          </motion.span>
          {t('yourGoals')}
        </motion.h1>
        <motion.div 
          className="bg-comic-yellow rounded-xl border-4 border-black p-4 mt-4 relative z-10"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          whileHover={{ scale: 1.02, rotate: 1 }}
        >
          <p className="text-sm text-gray-700">{t('totalSavings')}</p>
          <motion.p 
            className="text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {formatCurrency(convertCurrency(totalSavings, user.currency), user.currency)}
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div 
        className="comic-panel mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <motion.h2 
            className="text-2xl font-bold"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Active Goals
          </motion.h2>
          <motion.button
            onClick={() => setShowForm(true)}
            className="comic-button-lime rounded-full px-4 py-2"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            ➕ New
          </motion.button>
        </div>

        {goals.length === 0 ? (
          <motion.div 
            className="text-center py-8 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t('noGoalsYet')}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal, index) => {
              const progress = Math.min((totalSavings / goal.usdTarget) * 100, 100);
              const convertedSavings = convertCurrency(totalSavings, user.currency);
              const convertedTarget = convertCurrency(goal.usdTarget, user.currency);
              
              return (
                <motion.div 
                  key={goal.id} 
                  className="bg-white rounded-xl border-4 border-black p-4 relative overflow-hidden"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.02, y: -3, boxShadow: '8px 8px 0px rgba(0,0,0,0.3)' }}
                >
                  {progress >= 100 && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-300 to-lime-300 opacity-20"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div>
                      <h3 className="font-bold text-lg">{goal.name}</h3>
                      <p className="text-sm text-gray-700">
                        {t('target')}: {formatCurrency(convertedTarget, user.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <motion.p 
                        className="text-2xl font-bold text-comic-orange"
                        animate={progress >= 100 ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        {progress.toFixed(0)}%
                        {progress >= 100 && (
                          <motion.span
                            className="ml-2 text-3xl"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                          >
                            🎉
                          </motion.span>
                        )}
                      </motion.p>
                    </div>
                  </div>
                  <div className="progress-bar relative z-10">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center relative z-10">
                    {formatCurrency(convertedSavings, user.currency)} / {formatCurrency(convertedTarget, user.currency)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {totalSavings > 0 && (
        <motion.div 
          className="comic-panel mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h2 
            className="text-2xl font-bold mb-4 flex items-center gap-2"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
              🚀
            </motion.span>
            {t('cryptoROICalculator')}
          </motion.h2>
          <div className="bg-comic-yellow rounded-xl border-4 border-black p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              {t('yourSavings')}: <span className="font-bold">{formatCurrency(convertCurrency(totalSavings, user.currency), user.currency)}</span>
            </p>
            <p className="text-xs text-gray-600">
              See what this would be worth if you invested in top cryptocurrencies 5 years ago!
            </p>
          </div>
          
          {!showCrypto ? (
            <motion.button
              onClick={loadCryptoROI}
              disabled={loadingCrypto}
              className="comic-button-orange w-full py-4 text-lg"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {loadingCrypto ? '⏳ Calculating...' : '🚀 Calculate Crypto ROI'}
            </motion.button>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-gray-700 mb-3 text-center">
                💡 Click on any crypto to see detailed breakdown
              </div>
              {cryptoData.map((crypto, index) => (
                <motion.div
                  key={crypto.symbol}
                  className="bg-gradient-to-r from-white to-gray-50 rounded-xl border-4 border-black p-4 cursor-pointer"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.02, y: -5, boxShadow: '8px 8px 0px rgba(0,0,0,0.3)' }}
                  whileTap={{ scale: 0.98 }}
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
                </motion.div>
              ))}
              
              <motion.div 
                className="bg-comic-cyan rounded-xl border-4 border-black p-4 mt-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: cryptoData.length * 0.1 + 0.2 }}
              >
                <div className="text-sm text-gray-700 text-center">
                  💎 Best performer: <span className="font-bold">{cryptoData[0]?.symbol}</span> ({cryptoData[0]?.multiplier.toFixed(1)}x)
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="comic-panel max-w-md w-full"
              initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.8, rotate: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
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
                <motion.button 
                  type="submit" 
                  className="flex-1 comic-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('save')}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 comic-button-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('cancel')}
                </motion.button>
              </div>
            </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation />
    </div>
  );
}