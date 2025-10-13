'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import PresetManager from '@/components/PresetManager';
import { CURRENCIES } from '@/lib/currencies';
import { RANKS, getRankForPoints } from '@/lib/ranks';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n';
import { getUserFromStorage } from '@/lib/user-sync';
import { formatCurrency, convertCurrency, getCurrencySymbol } from '@/lib/currency-utils';

interface Preset {
  id: string;
  name: string;
  icon: string;
  price: number;
  category: string;
}

const getDefaultPresets = (t: any): Preset[] => [
  { id: 'coffee', name: t('coffee'), icon: '☕', price: 3, category: 'drinks' },
  { id: 'cigarettes', name: t('cigarettes'), icon: '🚬', price: 8, category: 'habits' },
  { id: 'soda', name: t('soda'), icon: '🥤', price: 2, category: 'drinks' },
  { id: 'fastFood', name: t('fastFood'), icon: '🍔', price: 12, category: 'food' },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [showPresetManager, setShowPresetManager] = useState(false);
  const [presets, setPresets] = useState<Preset[]>([]);
  
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
    
    // Load presets from localStorage or use defaults
    const savedPresets = localStorage.getItem('userPresets');
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    } else {
      const defaultPresets = getDefaultPresets(t);
      setPresets(defaultPresets);
    }
  }, [router, t]);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currency,
          language,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = { ...user, currency, language };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditMode(false);
        toast.success(t('settingsSaved') + ' ✅');
        
        // Reload page to apply changes
        setTimeout(() => window.location.reload(), 500);
      } else {
        toast.error(data.error || 'Failed to save settings');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/?ref=${user.referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success(t('referralLinkCopied') + ' 📋');
  };

  const handlePresetSave = (newPresets: Preset[]) => {
    setPresets(newPresets);
    localStorage.setItem('userPresets', JSON.stringify(newPresets));
    toast.success(t('settingsSaved'));
  };

  const handlePresetClick = async (preset: Preset) => {
    try {
      const res = await fetch('/api/entries/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: preset.name,
          pricePerUnit: preset.price,
          quantity: 1,
          category: preset.category,
          currency: user.currency || 'USD',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`+${(data.pointsEarned || 0).toFixed(1)} ${t('pointsEarned')} 🎉`);
        
        const updatedUser = { ...user, points: (Number(user.points) || 0) + data.pointsEarned };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        toast.error(data.error || 'Failed to create entry');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  if (!user) return null;

  const currentRank = getRankForPoints(user.points);
  const nextRankIndex = RANKS.findIndex(r => r.name === currentRank.name) + 1;
  const nextRank = nextRankIndex < RANKS.length ? RANKS[nextRankIndex] : null;
  const progressToNext = nextRank
    ? Math.min(Math.max(((user.points - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints)) * 100, 0), 100)
    : 100;

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto">
      <div className="comic-panel mb-6">
        <h1 className="text-4xl font-bold mb-2">👤 {t('yourProfile')}</h1>
        <div className="bg-gradient-to-r from-comic-purple to-comic-pink rounded-2xl border-4 border-black p-6 mt-4 text-white">
          <p className="text-2xl font-bold mb-1">{user.name || user.email}</p>
          <p className="text-sm opacity-90">{user.email}</p>
        </div>
      </div>

      <div className="comic-panel mb-6">
        <h2 className="text-2xl font-bold mb-4">{t('rankProgress')}</h2>
        <div className="bg-comic-yellow rounded-xl border-4 border-black p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm text-gray-700">{t('currentRank')}</p>
              <p className="text-2xl font-bold" style={{ color: currentRank.color }}>
                {language === 'ru' ? currentRank.nameRu : currentRank.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700">{t('points')}</p>
              <p className="text-3xl font-bold">{(user.points || 0).toFixed(0)}</p>
            </div>
          </div>
        </div>

        {nextRank && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-700">{t('nextRank')}</p>
              <p className="font-bold" style={{ color: nextRank.color }}>
                {language === 'ru' ? nextRank.nameRu : nextRank.name}
              </p>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressToNext}%` }} />
            </div>
            <p className="text-xs text-center text-gray-600 mt-2">
              {(nextRank.minPoints - (user.points || 0)).toFixed(0)} {t('pointsToGo')}
            </p>
          </div>
        )}
      </div>

      <div className="comic-panel mb-6">
        <h2 className="text-2xl font-bold mb-4">{t('referralSystem')}</h2>
        <div className="bg-comic-cyan rounded-xl border-4 border-black p-4 mb-3">
          <p className="text-sm text-gray-700 mb-2">{t('yourReferralCode')}</p>
          <p className="text-3xl font-bold text-center mb-2">{user.referralCode}</p>
          <button onClick={copyReferralLink} className="w-full comic-button text-sm">
            {t('copyLink')}
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
          <h2 className="text-2xl font-bold">{t('settings')}</h2>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="bg-comic-lime border-4 border-black rounded-full px-4 py-2 font-bold shadow-comic"
            >
              {t('edit')}
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">{t('currency')}</label>
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
            <label className="block text-sm font-bold mb-2">{t('language')}</label>
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
                {t('save')}
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 comic-button-secondary"
              >
                {t('cancel')}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="comic-panel mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">⚡ {t('quickAdd')}</h2>
          <button
            onClick={() => setShowPresetManager(true)}
            className="bg-comic-lime border-4 border-black rounded-full px-4 py-2 font-bold shadow-comic text-sm"
          >
            ⚙️ {t('edit')}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              className="bg-comic-cyan border-4 border-black rounded-xl p-4 shadow-comic hover:shadow-comic-lg transition-all hover:-translate-y-1"
            >
              <div className="text-4xl mb-2">{preset.icon}</div>
              <div className="font-bold">{preset.name}</div>
              <div className="text-sm text-gray-700">{getCurrencySymbol(user?.currency || 'USD')}{preset.price}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white font-bold py-3 px-6 rounded-full border-4 border-black shadow-comic hover:shadow-comic-lg transition-all"
      >
        🚪 {t('logout')}
      </button>

      <PresetManager
        isOpen={showPresetManager}
        onClose={() => setShowPresetManager(false)}
        onSave={handlePresetSave}
        initialPresets={presets}
      />

      <Navigation />
    </div>
  );
}