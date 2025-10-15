'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import MathWallBackground from '@/components/MathWallBackground';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency, convertCurrency } from '@/lib/currency-utils';
import { getUserFromStorage } from '@/lib/user-sync';
import { getUserPresets, WHY_TAGS, getWhyTagName } from '@/lib/user-presets';
import { CURRENCIES } from '@/lib/currencies';
import { RANKS, getRankForPoints } from '@/lib/ranks';
import toast from 'react-hot-toast';
import AchievementAnimation from '@/components/AchievementAnimation';

type TabType = 'wallet' | 'achievements' | 'profile';

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
  const [activeTab, setActiveTab] = useState<TabType>('wallet');
  const [userPoints, setUserPoints] = useState(0);
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    month: 0,
    allTime: 0,
  });
  const [topTags, setTopTags] = useState<Array<{tagId: string; count: number}>>([]);
  
  const [unlocked, setUnlocked] = useState<UserAchievement[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  
  const [editMode, setEditMode] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  
  const { t } = useTranslation(user?.language || 'en');

  useEffect(() => {
    const parsedUser = getUserFromStorage();
    if (!parsedUser) {
      router.push('/');
      return;
    }
    setUser(parsedUser);
    setUserPoints(Number(parsedUser.points) || 0);
    setCurrency(parsedUser.currency || 'USD');
    setLanguage(parsedUser.language || 'en');
    setUsername(parsedUser.username || '');
    setName(parsedUser.name || '');
    
    loadStats(parsedUser.id);
    loadTopTags(parsedUser.id);
    loadAchievements(parsedUser.id);
    
    const handleVisibilityChange = () => {
      if (!document.hidden && parsedUser) {
        loadStats(parsedUser.id);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
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
      
      const currentUser = getUserFromStorage();
      if (currentUser) {
        setUserPoints(Number(currentUser.points) || 0);
      }
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

  const showAchievementAnimation = (achievement: Achievement) => {
    setCurrentAchievement(achievement);
    setShowAchievement(true);
  };

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username === user?.username) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const res = await fetch('/api/user/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, userId: user?.id })
      });
      const data = await res.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      setUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updates: any = { currency, language };
      if (name !== user.name) updates.name = name;
      if (username !== user.username) updates.username = username;

      const res = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, updates }),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditMode(false);
        toast.success(t('settingsSaved') + ' ✅');
        window.dispatchEvent(new Event('storage'));
      } else {
        toast.error(data.error || 'Failed to save');
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

  if (!user) return null;

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

  const unlockedIds = new Set(unlocked.map(u => u.achievement.id));
  const progress = allAchievements.length > 0 ? (unlocked.length / allAchievements.length) * 100 : 0;
  
  const currentRank = getRankForPoints(user.points);
  const nextRankIndex = RANKS.findIndex(r => r.name === currentRank.name) + 1;
  const nextRank = nextRankIndex < RANKS.length ? RANKS[nextRankIndex] : null;
  const progressToNext = nextRank
    ? ((user.points - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints)) * 100
    : 100;

  const tabs = [
    { id: 'wallet' as TabType, label: t('wallet'), icon: '💎' },
    { id: 'achievements' as TabType, label: t('achievements'), icon: '🏆' },
    { id: 'profile' as TabType, label: t('profile'), icon: '✋' },
  ];

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto relative min-h-screen">
      <MathWallBackground />
      <AchievementAnimation 
        show={showAchievement} 
        onComplete={() => setShowAchievement(false)}
        achievement={currentAchievement || { icon: '🏅', name: 'Achievement', description: 'Description' }}
      />

      {/* Header */}
      <motion.div 
        className="enough-panel mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">✋</div>
          <div>
            <h1 className="text-3xl font-semibold  tracking-tight">
              ENOUGH DASHBOARD
            </h1>
            <p className="text-sm font-bold text-gray-700">
              Your journey to mindful spending
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 text-center  transition-all hover:shadow-[0_0_20px_rgba(245,198,26,0.6)]" style={{boxShadow: '0 3px 0px #000'}}>
            <p className="text-xs font-medium mb-1 text-gray-700">{t('totalSavings')}</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(convertedStats.allTime, user.currency)}
            </p>
          </div>
          
          <div className="bg-white p-4 text-center  transition-all hover:shadow-[0_0_20px_rgba(245,198,26,0.6)]" style={{boxShadow: '0 3px 0px #000'}}>
            <p className="text-xs font-medium mb-1 text-gray-700">{t('points')}</p>
            <p className="text-2xl font-semibold text-gray-900">{userPoints.toFixed(0)}</p>
          </div>
          
          <div className="bg-white p-4 text-center  transition-all hover:shadow-[0_0_20px_rgba(245,198,26,0.6)]" style={{boxShadow: '0 3px 0px #000'}}>
            <p className="text-xs font-medium mb-1 text-gray-700">{t('rank')}</p>
            <p className="text-lg font-semibold text-gray-900">
              {language === 'ru' ? currentRank.nameRu : currentRank.name}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 font-semibold  tracking-tight  transition-all text-sm bg-white text-gray-900
              ${activeTab === tab.id 
                ? 'shadow-[0_4px_0px_rgba(0,0,0,0.3)]' 
                : 'hover:shadow-[0_0_20px_rgba(245,198,26,0.6)] hover:bg-[rgba(245,198,26,0.08)]'
              }`}
          >
            <span className="text-xl mb-1 block">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'wallet' && (
          <WalletTab key="wallet" stats={convertedStats} chartData={chartData} topTags={topTags} user={user} t={t} />
        )}
        {activeTab === 'achievements' && (
          <AchievementsTab key="achievements" allAchievements={allAchievements} unlocked={unlocked} unlockedIds={unlockedIds} progress={progress} user={user} t={t} onShowAchievement={showAchievementAnimation} />
        )}
        {activeTab === 'profile' && (
          <ProfileTab key="profile" user={user} editMode={editMode} setEditMode={setEditMode} name={name} setName={setName} username={username} setUsername={setUsername} currency={currency} setCurrency={setCurrency} language={language} setLanguage={setLanguage} usernameAvailable={usernameAvailable} isCheckingUsername={isCheckingUsername} currentRank={currentRank} nextRank={nextRank} progressToNext={progressToNext} t={t} onCheckUsername={checkUsernameAvailability} onSave={handleSaveProfile} onLogout={handleLogout} onCopyReferral={copyReferralLink} />
        )}
      </AnimatePresence>

      <Navigation />
    </div>
  );
}

// Wallet Tab
function WalletTab({ stats, chartData, topTags, user, t }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="enough-panel mb-6">
        <h2 className="text-2xl font-semibold  mb-4">💎 {t('savingsOverview')}</h2>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: t('today'), value: stats.today, icon: '☀️' },
            { label: t('thisWeek'), value: stats.week, icon: '📅' },
            { label: t('thisMonth'), value: stats.month, icon: '📊' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white  p-4 text-center transition-all hover:shadow-[0_0_20px_rgba(245,198,26,0.6),0_3px_0px_#000]" style={{boxShadow: '0 2px 0px #000'}}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-xs font-medium mb-1 text-gray-700">{stat.label}</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(stat.value, user.currency)}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold  mb-3">📊 {t('savingsChart')}</h3>
        <div className="bg-white  p-4">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#F5C61A" stroke="#000" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {topTags.length > 0 && (
        <div className="enough-panel">
          <h2 className="text-2xl font-semibold  mb-4">✋ {t('yourTopReasons')}</h2>
          <div className="flex flex-wrap gap-2">
            {topTags.map(({ tagId, count }: any) => {
              const tag = WHY_TAGS.find(t => t.id === tagId);
              if (!tag) return null;
              
              return (
                <div key={tagId} className="enough-tag px-4 py-2 flex items-center gap-2">
                  <span className="text-xl">{tag.icon}</span>
                  <div>
                    <div className="text-xs font-semibold">{getWhyTagName(tagId, user.language)}</div>
                    <div className="text-[10px] opacity-75">{count}x</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Achievements Tab
function AchievementsTab({ allAchievements, unlocked, unlockedIds, progress, user, t, onShowAchievement }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="enough-panel mb-6">
        <h2 className="text-2xl font-semibold  mb-4">🏅 {t('yourProgress')}</h2>
        <div className="bg-white  p-4 transition-all hover:shadow-[0_0_20px_rgba(245,198,26,0.6)]">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold  text-gray-900">{t('progress')}</p>
            <p className="text-2xl font-semibold text-gray-900">{unlocked.length}/{allAchievements.length}</p>
          </div>
          <div className="enough-progress">
            <div className="enough-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {allAchievements.map((achievement: Achievement) => {
          const isUnlocked = unlockedIds.has(achievement.id);
          const userAchievement = unlocked.find((u: any) => u.achievement.id === achievement.id);
          
          return (
            <div
              key={achievement.id}
              onClick={() => isUnlocked && onShowAchievement(achievement)}
              className={`enough-card ${isUnlocked ? 'bg-white cursor-pointer hover:shadow-[0_0_25px_rgba(245,198,26,0.7),0_6px_0px_#000]' : 'bg-gray-200 opacity-60'}`}
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold  flex items-center gap-2">
                    {user.language === 'ru' ? achievement.nameRu : achievement.nameEn}
                    {isUnlocked && <span>✨</span>}
                  </h3>
                  <p className="text-sm font-bold text-gray-700">
                    {user.language === 'ru' ? achievement.descriptionRu : achievement.descriptionEn}
                  </p>
                  {isUnlocked && userAchievement && (
                    <p className="text-xs font-bold text-gray-600 mt-1">
                      🎉 {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                  {!isUnlocked && (
                    <p className="text-xs font-bold text-gray-500 mt-1">🔒 {t('locked')}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Profile Tab
function ProfileTab({ user, editMode, setEditMode, name, setName, username, setUsername, currency, setCurrency, language, setLanguage, usernameAvailable, isCheckingUsername, currentRank, nextRank, progressToNext, t, onCheckUsername, onSave, onLogout, onCopyReferral }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="enough-panel mb-6">
        <h2 className="text-2xl font-semibold  mb-2 text-gray-900">
          👤 {user.name || user.email}
        </h2>
        {user.username && <p className="text-lg font-bold text-gray-900">@{user.username}</p>}
        <p className="text-sm text-gray-700">{user.email}</p>
      </div>

      <div className="enough-panel mb-6">
        <h3 className="text-xl font-semibold  mb-4">🏆 {t('rankProgress')}</h3>
        <div className="bg-white  p-4 mb-4 transition-all hover:shadow-[0_0_20px_rgba(245,198,26,0.6)]">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm font-bold text-gray-700">{t('currentRank')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {language === 'ru' ? currentRank.nameRu : currentRank.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-700">{t('points')}</p>
              <p className="text-3xl font-semibold text-gray-900">{user.points.toFixed(0)}</p>
            </div>
          </div>
        </div>

        {nextRank && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-bold text-gray-700">{t('nextRank')}</p>
              <p className="font-semibold" style={{ color: nextRank.color }}>
                {language === 'ru' ? nextRank.nameRu : nextRank.name}
              </p>
            </div>
            <div className="enough-progress">
              <div className="enough-progress-fill" style={{ width: `${progressToNext}%` }} />
            </div>
            <p className="text-xs text-center text-gray-600 mt-2 font-bold">
              {(nextRank.minPoints - user.points).toFixed(0)} {t('pointsToGo')}
            </p>
          </div>
        )}
      </div>

      <div className="enough-panel mb-6">
        <h3 className="text-xl font-semibold  mb-4 text-gray-900">🎁 {t('referralSystem')}</h3>
        <div className="bg-white  p-4 mb-3 transition-all hover:shadow-[0_0_20px_rgba(245,198,26,0.6)]">
          <p className="text-sm font-bold text-gray-700 mb-2">{t('yourReferralCode')}</p>
          <p className="text-3xl font-semibold text-center mb-2 text-gray-900">{user.referralCode}</p>
          <button onClick={onCopyReferral} className="w-full enough-button text-sm">
            {t('copyLink')}
          </button>
        </div>
      </div>

      <div className="enough-panel mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold ">⚙️ {t('settings')}</h3>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="enough-button-primary px-4 py-2 text-sm">
              ✏️ {t('edit')}
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold  mb-2">Display Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!editMode} className="w-full px-4 py-3" />
          </div>

          <div>
            <label className="block text-sm font-semibold  mb-2">Username</label>
            <div className="relative">
              <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); onCheckUsername(e.target.value); }} disabled={!editMode} className="w-full px-4 py-3 pr-12" />
              {isCheckingUsername && <div className="absolute right-3 top-1/2 transform -translate-y-1/2"><div className="animate-spin border-0 h-4 w-4 border-b-2 border-gray-200"></div></div>}
              {!isCheckingUsername && username && username !== user?.username && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {usernameAvailable === true && <span className="text-green-600 text-xl">✓</span>}
                  {usernameAvailable === false && <span className="text-red-600 text-xl">✗</span>}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold  mb-2">{t('currency')}</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} disabled={!editMode} className="w-full px-4 py-3">
              {Object.entries(CURRENCIES).map(([code, data]) => (
                <option key={code} value={code}>{code} - {data.name} ({data.symbol})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold  mb-2">{t('language')}</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} disabled={!editMode} className="w-full px-4 py-3">
              <option value="en">English 🇬🇧</option>
              <option value="ru">Русский 🇷🇺</option>
            </select>
          </div>

          {editMode && (
            <div className="flex gap-2">
              <button onClick={onSave} className="flex-1 enough-button-primary">💾 {t('save')}</button>
              <button onClick={() => setEditMode(false)} className="flex-1 enough-button-secondary">❌ {t('cancel')}</button>
            </div>
          )}
        </div>
      </div>

      <button onClick={onLogout} className="w-full bg-white text-gray-900 font-semibold py-3 px-6  transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.6),0_5px_0px_#000] hover:bg-red-50" style={{boxShadow: '0 4px 0px #000'}}>
        🚪 {t('logout')}
      </button>
    </motion.div>
  );
}
