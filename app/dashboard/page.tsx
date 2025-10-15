'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency, getCurrencySymbol, convertCurrency } from '@/lib/currency-utils';
import { getUserFromStorage } from '@/lib/user-sync';
import { getUserPresets, getWhyTagName } from '@/lib/user-presets';
import { getRankForPoints, RANKS } from '@/lib/ranks';

interface Achievement {
  id: string;
  code: string;
  nameEn: string;
  nameRu: string;
  descriptionEn: string;
  descriptionRu: string;
  icon: string;
}

interface UserAchievement {
  id: string;
  achievement: Achievement;
  unlockedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [stats, setStats] = useState({ today: 0, week: 0, month: 0, allTime: 0 });
  const [unlocked, setUnlocked] = useState<UserAchievement[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [topTags, setTopTags] = useState<{ tagId: string; count: number }[]>([]);
  
  const { t } = useTranslation(user?.language || 'en');

  useEffect(() => {
    const parsedUser = getUserFromStorage();
    if (!parsedUser) {
      router.push('/');
      return;
    }
    setUser(parsedUser);
    setUserPoints(Number(parsedUser.points) || 0);
    loadStats(parsedUser.id, parsedUser.currency);
    loadTopTags(parsedUser.id);
    loadAchievements(parsedUser.id);
  }, [router]);

  useEffect(() => {
    const handleStorageChange = () => {
      const parsedUser = getUserFromStorage();
      if (parsedUser) {
        setUser(parsedUser);
        setUserPoints(Number(parsedUser.points) || 0);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadStats = async (userId: string, currency: string) => {
    try {
      const [today, week, month, all] = await Promise.all([
        fetch(`/api/entries/list?userId=${userId}&period=today`).then(r => r.json()),
        fetch(`/api/entries/list?userId=${userId}&period=week`).then(r => r.json()),
        fetch(`/api/entries/list?userId=${userId}&period=month`).then(r => r.json()),
        fetch(`/api/entries/list?userId=${userId}&period=all`).then(r => r.json()),
      ]);

      setStats({
        today: convertCurrency(today.totalUSD || 0, currency),
        week: convertCurrency(week.totalUSD || 0, currency),
        month: convertCurrency(month.totalUSD || 0, currency),
        allTime: convertCurrency(all.totalUSD || 0, currency),
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadTopTags = (userId: string) => {
    try {
      const presets = getUserPresets(userId);
      const tagCounts: Record<string, number> = {};
      
      presets.forEach(preset => {
        if (preset.tags && preset.tags.length > 0) {
          preset.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });
      
      const sorted = Object.entries(tagCounts)
        .map(([tagId, count]) => ({ tagId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      setTopTags(sorted);
    } catch (error) {
      console.error('Failed to load top tags:', error);
    }
  };

  const loadAchievements = async (userId: string) => {
    try {
      const res = await fetch(`/api/achievements/list?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setUnlocked(data.unlocked);
        setAllAchievements(data.all);
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  };

  if (!user) return null;

  const currentRank = getRankForPoints(userPoints);
  const progress = allAchievements.length > 0 ? (unlocked.length / allAchievements.length) * 100 : 0;

  return (
    <div className="pb-24 px-4 py-6 max-w-4xl mx-auto" style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ fontWeight: 900, color: '#212121' }}>
          {t('dashboard')}
        </h1>
        <p className="text-gray-500 text-sm font-medium">Welcome back, {user.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="stat-card"
        >
          <div className="stat-value">{getCurrencySymbol(user.currency)}{formatCurrency(stats.today, user.currency)}</div>
          <div className="stat-label">{t('today')}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="stat-card"
        >
          <div className="stat-value">{getCurrencySymbol(user.currency)}{formatCurrency(stats.week, user.currency)}</div>
          <div className="stat-label">{t('thisWeek')}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card"
        >
          <div className="stat-value">{getCurrencySymbol(user.currency)}{formatCurrency(stats.month, user.currency)}</div>
          <div className="stat-label">{t('thisMonth')}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="stat-card"
        >
          <div className="stat-value">{getCurrencySymbol(user.currency)}{formatCurrency(stats.allTime, user.currency)}</div>
          <div className="stat-label">{t('total')}</div>
        </motion.div>
      </div>

      {/* Rank Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card mb-6"
        style={{ background: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)', border: 'none' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Your Rank</div>
            <div className="text-3xl font-black text-gray-900" style={{ color: currentRank.color }}>
              {user.language === 'ru' ? currentRank.nameRu : currentRank.name}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900 mb-1">{t('points')}</div>
            <div className="text-3xl font-black text-gray-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {userPoints.toLocaleString()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievements Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card mb-6"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-gray-900">{t('achievements')}</h3>
          <Link href="/achievements" className="text-sm font-semibold text-yellow-600 hover:text-yellow-700">
            View All →
          </Link>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-600">{unlocked.length} / {allAchievements.length}</span>
            <span className="font-bold text-gray-900">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {unlocked.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-4">
            {unlocked.slice(0, 6).map((ua) => (
              <div
                key={ua.id}
                className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-2xl"
                title={user.language === 'ru' ? ua.achievement.nameRu : ua.achievement.nameEn}
              >
                {ua.achievement.icon}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Top Reasons */}
      {topTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">{t('yourTopReasons')}</h3>
            <Link href="/why" className="text-sm font-semibold text-yellow-600 hover:text-yellow-700">
              View All →
            </Link>
          </div>
          
          <div className="space-y-2">
            {topTags.map((tag, index) => (
              <div key={tag.tagId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center font-bold text-sm text-gray-900">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">
                    {getWhyTagName(tag.tagId, user.language || 'en')}
                  </span>
                </div>
                <span className="badge-yellow">{tag.count}x</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-2 gap-4"
      >
        <Link href="/goals" className="card text-center hover:shadow-yellow transition-all group">
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🎯</div>
          <div className="font-semibold text-gray-900">{t('goals')}</div>
        </Link>

        <Link href="/leaderboard" className="card text-center hover:shadow-yellow transition-all group">
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
          <div className="font-semibold text-gray-900">{t('leaderboard')}</div>
        </Link>
      </motion.div>

      <Navigation />
    </div>
  );
}
