'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency, convertCurrency } from '@/lib/currency-utils';
import { getUserFromStorage } from '@/lib/user-sync';
import { getUserPresets, getWhyTagName } from '@/lib/user-presets';

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ today: 0, week: 0, month: 0, allTime: 0 });
  const [topTags, setTopTags] = useState<Array<{tagId: string; count: number}>>([]);
  
  const { t } = useTranslation(user?.language || 'en');

  useEffect(() => {
    const parsedUser = getUserFromStorage();
    if (!parsedUser) {
      router.push('/');
      return;
    }
    setUser(parsedUser);
    loadStats(parsedUser.id);
    loadTopTags(parsedUser.id);
  }, [router]);

  const loadStats = async (userId: string) => {
    try {
      const [today, week, month, all] = await Promise.all([
        fetch(`/api/entries/list?userId=${userId}&period=today`).then(r => r.json()),
        fetch(`/api/entries/list?userId=${userId}&period=week`).then(r => r.json()),
        fetch(`/api/entries/list?userId=${userId}&period=month`).then(r => r.json()),
        fetch(`/api/entries/list?userId=${userId}&period=all`).then(r => r.json()),
      ]);

      setStats({
        today: today.totalUSD || 0,
        week: week.totalUSD || 0,
        month: month.totalUSD || 0,
        allTime: all.totalUSD || 0,
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
        preset.tags?.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      
      const sorted = Object.entries(tagCounts)
        .map(([tagId, count]) => ({ tagId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      
      setTopTags(sorted);
    } catch (error) {
      console.error('Failed to load top tags:', error);
    }
  };

  if (!user) return null;

  const chartData = [
    { name: 'Today', value: stats.today },
    { name: 'Week', value: stats.week },
    { name: 'Month', value: stats.month },
    { name: 'All Time', value: stats.allTime },
  ];

  return (
    <div className="pb-24 px-4 py-6 max-w-4xl mx-auto" style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ fontWeight: 900, color: '#212121' }}>
          {t('wallet')}
        </h1>
        <p className="text-gray-500 text-sm font-medium">Your savings analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="stat-card"
        >
          <div className="stat-value">${stats.today.toFixed(2)}</div>
          <div className="stat-label">Today</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="stat-card"
        >
          <div className="stat-value">${stats.week.toFixed(2)}</div>
          <div className="stat-label">This Week</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card"
        >
          <div className="stat-value">${stats.month.toFixed(2)}</div>
          <div className="stat-label">This Month</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="stat-card"
          style={{ background: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)', border: 'none' }}
        >
          <div className="stat-value">${stats.allTime.toFixed(2)}</div>
          <div className="stat-label">All Time</div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card mb-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">Savings Overview</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#757575' }} />
            <YAxis tick={{ fontSize: 12, fill: '#757575' }} />
            <Tooltip 
              contentStyle={{ 
                background: '#FFFFFF',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 3 ? '#FFC107' : '#E0E0E0'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Motivations */}
      {topTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Motivations</h2>
          <div className="space-y-2">
            {topTags.map((tag, index) => (
              <div key={tag.tagId} className="flex items-center justify-between">
                <span className="font-medium text-gray-900">
                  {getWhyTagName(tag.tagId, user.language || 'en')}
                </span>
                <span className="badge-yellow">{tag.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <Navigation />
    </div>
  );
}
