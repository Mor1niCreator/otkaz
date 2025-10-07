'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { CURRENCIES } from '@/lib/currencies';
import { RANKS, getRankForPoints } from '@/lib/ranks';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setCurrency(parsedUser.currency);
    setLanguage(parsedUser.language);
  }, [router]);

  const handleSave = () => {
    const updatedUser = { ...user, currency, language };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditMode(false);
    toast.success('Settings saved! ✅');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/?ref=${user.referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied! 📋');
  };

  if (!user) return null;

  const currentRank = getRankForPoints(user.points);
  const nextRankIndex = RANKS.findIndex(r => r.name === currentRank.name) + 1;
  const nextRank = nextRankIndex < RANKS.length ? RANKS[nextRankIndex] : null;
  const progressToNext = nextRank
    ? ((user.points - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints)) * 100
    : 100;

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto">
      <div className="comic-panel mb-6">
        <h1 className="text-4xl font-bold mb-2">👤 Profile</h1>
        <div className="bg-gradient-to-r from-comic-purple to-comic-pink rounded-2xl border-4 border-black p-6 mt-4 text-white">
          <p className="text-2xl font-bold mb-1">{user.name || user.email}</p>
          <p className="text-sm opacity-90">{user.email}</p>
        </div>
      </div>

      <div className="comic-panel mb-6">
        <h2 className="text-2xl font-bold mb-4">🏆 Rank & Progress</h2>
        <div className="bg-comic-yellow rounded-xl border-4 border-black p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm text-gray-700">Current Rank</p>
              <p className="text-2xl font-bold" style={{ color: currentRank.color }}>
                {language === 'ru' ? currentRank.nameRu : currentRank.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700">Points</p>
              <p className="text-3xl font-bold">{user.points.toFixed(0)}</p>
            </div>
          </div>
        </div>

        {nextRank && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-700">Next Rank</p>
              <p className="font-bold" style={{ color: nextRank.color }}>
                {language === 'ru' ? nextRank.nameRu : nextRank.name}
              </p>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressToNext}%` }} />
            </div>
            <p className="text-xs text-center text-gray-600 mt-2">
              {(nextRank.minPoints - user.points).toFixed(0)} points to go!
            </p>
          </div>
        )}
      </div>

      <div className="comic-panel mb-6">
        <h2 className="text-2xl font-bold mb-4">🤝 Referral System</h2>
        <div className="bg-comic-cyan rounded-xl border-4 border-black p-4 mb-3">
          <p className="text-sm text-gray-700 mb-2">Your Referral Code</p>
          <p className="text-3xl font-bold text-center mb-2">{user.referralCode}</p>
          <button onClick={copyReferralLink} className="w-full comic-button text-sm">
            📋 Copy Link
          </button>
        </div>
        <div className="text-sm text-gray-700 space-y-1">
          <p>• Invite friends and earn bonus points!</p>
          <p>• +50 pts when they make their first entry</p>
          <p>• +20 pts for them when they sign up</p>
          <p>• +25 pts for both when they stay active!</p>
        </div>
      </div>

      <div className="comic-panel mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">⚙️ Settings</h2>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="bg-comic-lime border-4 border-black rounded-full px-4 py-2 font-bold shadow-comic"
            >
              Edit
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={!editMode}
              className="w-full px-4 py-3 border-4 border-black rounded-xl disabled:bg-gray-100"
            >
              {Object.entries(CURRENCIES).map(([code, data]) => (
                <option key={code} value={code}>
                  {code} - {data.name} ({data.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={!editMode}
              className="w-full px-4 py-3 border-4 border-black rounded-xl disabled:bg-gray-100"
            >
              <option value="en">English 🇬🇧</option>
              <option value="ru">Русский 🇷🇺</option>
            </select>
          </div>

          {editMode && (
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 comic-button">
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 comic-button-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white font-bold py-3 px-6 rounded-full border-4 border-black shadow-comic hover:shadow-comic-lg transition-all"
      >
        🚪 Logout
      </button>

      <Navigation />
    </div>
  );
}