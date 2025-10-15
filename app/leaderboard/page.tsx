'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useTranslation } from '@/lib/i18n';
import { getUserFromStorage } from '@/lib/user-sync';

interface LeaderboardEntry {
  userId: string;
  username: string;
  name: string;
  totalSavings: number;
  rank: number;
  points: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');
  
  const { t } = useTranslation(user?.language || 'en');

  useEffect(() => {
    const parsedUser = getUserFromStorage();
    if (!parsedUser) {
      router.push('/');
      return;
    }
    setUser(parsedUser);
    loadLeaderboard(parsedUser.id, period);
  }, [router, period]);

  const loadLeaderboard = async (userId: string, periodParam: string) => {
    try {
      const res = await fetch(`/api/leaderboard?userId=${userId}&period=${periodParam}`);
      const data = await res.json();
      if (res.ok) {
        setLeaderboard(data.leaderboard || []);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  if (!user) return null;

  const userRank = leaderboard.find(e => e.userId === user.id);

  return (
    <div className="pb-24 px-4 py-6 max-w-4xl mx-auto" style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ fontWeight: 900, color: '#212121' }}>
          🏆 {t('leaderboard')}
        </h1>
        <p className="text-gray-500 text-sm font-medium">Compete with other savers</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6 bg-gray-100 rounded-2xl p-1.5">
        {(['week', 'month', 'all'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
              period === p
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {p === 'week' ? t('thisWeek') : p === 'month' ? t('thisMonth') : t('total')}
          </button>
        ))}
      </div>

      {/* Your Rank */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
          style={{ background: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)', border: 'none' }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-semibold text-gray-900">Your Rank</div>
              <div className="text-4xl font-black text-gray-900">#{userRank.rank}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">Saved</div>
              <div className="text-2xl font-bold text-gray-900">${userRank.totalSavings.toFixed(2)}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-3">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`card ${entry.userId === user.id ? 'ring-2 ring-yellow-500' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <span className="text-xl font-black text-gray-900">#{entry.rank}</span>
              </div>
              
              <div className="flex-1">
                <div className="font-bold text-gray-900">{entry.name}</div>
                <div className="text-sm text-gray-500">@{entry.username || 'user'}</div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-gray-900">${entry.totalSavings.toFixed(2)}</div>
                <div className="text-xs text-gray-500">{entry.points} pts</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Navigation />
    </div>
  );
}
