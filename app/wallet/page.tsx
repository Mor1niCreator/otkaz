'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency, convertCurrency } from '@/lib/currency-utils';
import { getUserFromStorage } from '@/lib/user-sync';

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    month: 0,
    allTime: 0,
  });
  
  const { t } = useTranslation(user?.language || 'en');

  useEffect(() => {
    const parsedUser = getUserFromStorage();
    if (!parsedUser) {
      router.push('/');
      return;
    }
    setUser(parsedUser);
    setUserPoints(Number(parsedUser.points) || 0);
    loadStats(parsedUser.id);
  }, [router]);

  const loadStats = async (userId: string) => {
    try {
      const [today, week, month, all] = await Promise.all([
        fetch(`/api/entries/list?userId=${userId}&period=today`).then(r => r.json()),
        fetch(`/api/entries/list?userId=${userId}&period=week`).then(r => r.json()),
        fetch(`/api/entries/list?userId=${userId}&period=month`).then(r => r.json()),
        fetch(`/api/entries/list?userId=${userId}`).then(r => r.json()),
      ]);

      const newStats = {
        today: today.totalUSD || 0,
        week: week.totalUSD || 0,
        month: month.totalUSD || 0,
        allTime: all.totalUSD || 0,
      };
      
      setStats(newStats);
      
      console.log(`Wallet stats loaded: Today ${newStats.today} USD, All time ${newStats.allTime} USD`);
      
      // Update points from user object, not from totalUSD
      const currentUser = getUserFromStorage();
      if (currentUser) {
        setUserPoints(Number(currentUser.points) || 0);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (!user) return null;

  // Convert USD amounts to user's currency
  const convertedStats = {
    today: convertCurrency(stats.today, user.currency),
    week: convertCurrency(stats.week, user.currency),
    month: convertCurrency(stats.month, user.currency),
    allTime: convertCurrency(stats.allTime, user.currency),
  };

  const chartData = [
    { name: t('today'), amount: convertedStats.today },
    { name: t('thisWeek'), amount: convertedStats.week },
    { name: t('thisMonth'), amount: convertedStats.month },
    { name: 'All Time', amount: convertedStats.allTime },
  ];

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto">
      <div className="comic-panel mb-6">
        <h1 className="text-4xl font-bold mb-4">💰 {t('yourWallet')}</h1>
        
        <div className="bg-gradient-to-r from-comic-orange to-comic-pink rounded-2xl border-4 border-black p-6 mb-6 shadow-comic-lg">
          <div className="text-center">
            <p className="text-white text-lg mb-2">{t('totalSavings')}</p>
            <p className="text-6xl font-bold text-white mb-2">
              {formatCurrency(convertedStats.allTime, user.currency)}
            </p>
            <p className="text-white text-sm">
              {userPoints.toFixed(0)} {t('points')} • {user.rank}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-comic-yellow rounded-xl border-4 border-black p-4 text-center">
            <p className="text-xs text-gray-700 mb-1">{t('today')}</p>
            <p className="text-2xl font-bold">{formatCurrency(convertedStats.today, user.currency)}</p>
          </div>
          <div className="bg-comic-lime rounded-xl border-4 border-black p-4 text-center">
            <p className="text-xs text-gray-700 mb-1">{t('thisWeek')}</p>
            <p className="text-2xl font-bold">{formatCurrency(convertedStats.week, user.currency)}</p>
          </div>
          <div className="bg-comic-cyan rounded-xl border-4 border-black p-4 text-center">
            <p className="text-xs text-gray-700 mb-1">{t('thisMonth')}</p>
            <p className="text-2xl font-bold">{formatCurrency(convertedStats.month, user.currency)}</p>
          </div>
        </div>
      </div>

      <div className="comic-panel mb-6">
        <h2 className="text-2xl font-bold mb-4">📊 {t('savingsChart')}</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#FFB74D" stroke="#000" strokeWidth={3} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="speech-bubble mb-6">
        <p className="text-center text-lg">
          <strong>{t('keepItUp')}</strong><br />
          {t('everyRefusal')}
        </p>
      </div>

      <Navigation />
    </div>
  );
} className="text-center text-lg">
          <strong>{t('keepItUp')}</strong><br />
          {t('everyRefusal')}
        </p>
      </div>

      <Navigation />
    </div>
  );
}