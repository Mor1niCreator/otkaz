'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { CURRENCIES } from '@/lib/currencies';
import { getRankForPoints } from '@/lib/ranks';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n';
import { getUserFromStorage } from '@/lib/user-sync';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [referralStats, setReferralStats] = useState<any>(null);
  
  const { t } = useTranslation(user?.language || 'en');

  useEffect(() => {
    const parsedUser = getUserFromStorage();
    if (!parsedUser) {
      router.push('/');
      return;
    }
    setUser(parsedUser);
    setCurrency(parsedUser.currency || 'USD');
    setLanguage(parsedUser.language || 'en');
    setUsername(parsedUser.username || '');
    setName(parsedUser.name || '');
    loadReferralStats(parsedUser.id);
  }, [router]);

  const loadReferralStats = async (userId: string) => {
    try {
      const res = await fetch(`/api/referrals/stats?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setReferralStats(data);
      }
    } catch (error) {
      console.error('Failed to load referral stats:', error);
    }
  };

  const handleSave = async () => {
    try {
      const updates: any = { currency, language };
      if (username) updates.username = username;
      if (name) updates.name = name;

      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...updates }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setEditMode(false);
        toast.success('Profile updated!');
        window.location.reload();
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const copyReferralLink = () => {
    if (referralStats?.stats?.referralCode) {
      const link = `${window.location.origin}?ref=${referralStats.stats.referralCode}`;
      navigator.clipboard.writeText(link);
      toast.success('Referral link copied!');
    }
  };

  if (!user) return null;

  const currentRank = getRankForPoints(Number(user.points) || 0);

  return (
    <div className="pb-24 px-4 py-6 max-w-4xl mx-auto" style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ fontWeight: 900, color: '#212121' }}>
          {t('profile')}
        </h1>
        <p className="text-gray-500 text-sm font-medium">Manage your account</p>
      </div>

      {/* Rank Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
        style={{ background: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)', border: 'none' }}
      >
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900 mb-2">Current Rank</div>
          <div className="text-4xl font-black mb-1" style={{ color: currentRank.color }}>
            {user.language === 'ru' ? currentRank.nameRu : currentRank.name}
          </div>
          <div className="text-2xl font-bold text-gray-900">{user.points || 0} points</div>
        </div>
      </motion.div>

      {/* Profile Info */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Account Info</h2>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="text-sm font-semibold text-yellow-600">
              {t('edit')}
            </button>
          )}
        </div>

        {editMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="username"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input">
                  {Object.keys(CURRENCIES).map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input">
                  <option value="en">English</option>
                  <option value="ru">Русский</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setEditMode(false)} className="btn-secondary flex-1">
                {t('cancel')}
              </button>
              <button onClick={handleSave} className="btn-primary flex-1">
                {t('save')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Name</div>
              <div className="font-semibold text-gray-900">{user.name}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Email</div>
              <div className="font-semibold text-gray-900">{user.email}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Currency</div>
                <div className="font-semibold text-gray-900">{user.currency}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Language</div>
                <div className="font-semibold text-gray-900">{user.language === 'ru' ? 'Русский' : 'English'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Referral Card */}
      {referralStats && (
        <div className="card mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Referrals</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">{referralStats.stats.totalReferrals}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">{referralStats.stats.activeReferrals}</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
          </div>

          {referralStats.stats.referralCode && (
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2">Your Code</div>
              <div className="flex gap-2">
                <div className="flex-1 px-4 py-3 bg-gray-50 rounded-xl font-mono font-bold text-gray-900">
                  {referralStats.stats.referralCode}
                </div>
                <button onClick={copyReferralLink} className="btn-primary px-4">
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Logout */}
      <button onClick={handleLogout} className="btn-secondary w-full">
        {t('logout')}
      </button>

      <Navigation />
    </div>
  );
}
