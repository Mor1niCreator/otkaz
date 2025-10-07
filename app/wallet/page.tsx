'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    month: 0,
    allTime: 0,
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
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

  if (!user) return null;

  const chartData = [
    { name: 'Today', amount: stats.today },
    { name: 'Week', amount: stats.week },
    { name: 'Month', amount: stats.month },
    { name: 'All Time', amount: stats.allTime },
  ];

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto">
      <div className="comic-panel mb-6">
        <h1 className="text-4xl font-bold mb-4">💰 Your Wallet</h1>
        
        <div className="bg-gradient-to-r from-comic-orange to-comic-pink rounded-2xl border-4 border-black p-6 mb-6 shadow-comic-lg">
          <div className="text-center">
            <p className="text-white text-lg mb-2">Total Savings</p>
            <p className="text-6xl font-bold text-white mb-2">
              ${stats.allTime.toFixed(2)}
            </p>
            <p className="text-white text-sm">
              {user.points.toFixed(0)} Points • {user.rank}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-comic-yellow rounded-xl border-4 border-black p-4 text-center">
            <p className="text-xs text-gray-700 mb-1">Today</p>
            <p className="text-2xl font-bold">${stats.today.toFixed(2)}</p>
          </div>
          <div className="bg-comic-lime rounded-xl border-4 border-black p-4 text-center">
            <p className="text-xs text-gray-700 mb-1">This Week</p>
            <p className="text-2xl font-bold">${stats.week.toFixed(2)}</p>
          </div>
          <div className="bg-comic-cyan rounded-xl border-4 border-black p-4 text-center">
            <p className="text-xs text-gray-700 mb-1">This Month</p>
            <p className="text-2xl font-bold">${stats.month.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="comic-panel mb-6">
        <h2 className="text-2xl font-bold mb-4">📊 Savings Chart</h2>
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
          <strong>Keep it up! 🚀</strong><br />
          Every refusal brings you closer to your goals!
        </p>
      </div>

      <Navigation />
    </div>
  );
}