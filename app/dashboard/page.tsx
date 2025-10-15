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
  
  // Achievements
  const [unlocked, setUnlocked] = useState<UserAchievement[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  
  // Profile
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
    { id: 'wallet' as TabType, label: t('wallet'), icon: '💎', color: 'from-emerald-400 to-teal-500' },
    { id: 'achievements' as TabType, label: t('achievements'), icon: '🏆', color: 'from-amber-400 to-orange-500' },
    { id: 'profile' as TabType, label: t('profile'), icon: '✋', color: 'from-purple-400 to-pink-500' },
  ];

  const transformAchievement = (ach: Achievement | null) => {
    if (!ach) {
      return { icon: '🏅', name: 'Achievement', description: 'Description' };
    }
    const lang = user?.language || 'en';
    return {
      icon: ach.icon,
      name: lang === 'ru' ? ach.nameRu : ach.nameEn,
      description: lang === 'ru' ? ach.descriptionRu : ach.descriptionEn,
    };
  };

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto relative">
      <MathWallBackground />
      <AchievementAnimation 
        show={showAchievement} 
        onComplete={() => setShowAchievement(false)}
        achievement={transformAchievement(currentAchievement)}
      />

      {/* Animated Header */}
      <motion.div 
        className="comic-panel mb-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        }}
        initial={{ scale: 0.9, opacity: 0, y: -50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full opacity-10"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="relative z-10">
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="text-5xl"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✋
            </motion.div>
            <div>
              <motion.h1 
                className="text-4xl font-black text-white"
                style={{
                  fontFamily: "'Bangers', 'Russo One', cursive",
                  textShadow: '3px 3px 0px rgba(0,0,0,0.3)',
                }}
              >
                ENOUGH DASHBOARD
              </motion.h1>
              <p className="text-white/90 text-sm font-bold">
                Your journey to mindful spending
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-3 gap-3">
            <motion.div 
              className="bg-white/20 backdrop-blur-sm rounded-2xl border-3 border-white/40 p-4 text-center"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs text-white/80 font-bold mb-1">{t('totalSavings')}</p>
              <p className="text-2xl font-black text-white">
                {formatCurrency(convertedStats.allTime, user.currency)}
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white/20 backdrop-blur-sm rounded-2xl border-3 border-white/40 p-4 text-center"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xs text-white/80 font-bold mb-1">{t('points')}</p>
              <p className="text-2xl font-black text-white">{userPoints.toFixed(0)}</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/20 backdrop-blur-sm rounded-2xl border-3 border-white/40 p-4 text-center"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xs text-white/80 font-bold mb-1">{t('rank')}</p>
              <p className="text-xl font-black text-white">
                {language === 'ru' ? currentRank.nameRu : currentRank.name}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div 
        className="flex gap-2 mb-6 overflow-x-auto"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 min-w-[100px] px-4 py-3 rounded-xl border-4 border-black font-black
              transition-all relative overflow-hidden
              ${activeTab === tab.id 
                ? `bg-gradient-to-r ${tab.color} shadow-comic-lg scale-105` 
                : 'bg-white hover:shadow-comic'
              }
            `}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {activeTab === tab.id && (
              <motion.div
                className="absolute inset-0 bg-white opacity-20"
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <span className="text-2xl mb-1 block">{tab.icon}</span>
            <span className="text-sm relative z-10">{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'wallet' && (
          <WalletContent
            key="wallet"
            convertedStats={convertedStats}
            chartData={chartData}
            topTags={topTags}
            user={user}
            t={t}
          />
        )}
        
        {activeTab === 'achievements' && (
          <AchievementsContent
            key="achievements"
            allAchievements={allAchievements}
            unlocked={unlocked}
            unlockedIds={unlockedIds}
            progress={progress}
            user={user}
            t={t}
            onShowAchievement={showAchievementAnimation}
          />
        )}
        
        {activeTab === 'profile' && (
          <ProfileContent
            key="profile"
            user={user}
            editMode={editMode}
            setEditMode={setEditMode}
            name={name}
            setName={setName}
            username={username}
            setUsername={setUsername}
            currency={currency}
            setCurrency={setCurrency}
            language={language}
            setLanguage={setLanguage}
            usernameAvailable={usernameAvailable}
            isCheckingUsername={isCheckingUsername}
            currentRank={currentRank}
            nextRank={nextRank}
            progressToNext={progressToNext}
            t={t}
            onCheckUsername={checkUsernameAvailability}
            onSave={handleSaveProfile}
            onLogout={handleLogout}
            onCopyReferral={copyReferralLink}
          />
        )}
      </AnimatePresence>

      <Navigation />
    </div>
  );
}

// Wallet Tab Content
function WalletContent({ convertedStats, chartData, topTags, user, t }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <motion.div 
        className="comic-panel mb-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full opacity-20"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ duration: 2, repeat: Infinity }}
            >
              💎
            </motion.span>
            {t('savingsOverview')}
          </h2>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t('today'), value: convertedStats.today, gradient: 'from-yellow-300 to-amber-400', icon: '☀️' },
              { label: t('thisWeek'), value: convertedStats.week, gradient: 'from-emerald-300 to-teal-400', icon: '📅' },
              { label: t('thisMonth'), value: convertedStats.month, gradient: 'from-blue-300 to-indigo-400', icon: '📊' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`bg-gradient-to-br ${stat.gradient} rounded-xl border-4 border-black p-4 text-center relative overflow-hidden`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.08, y: -5 }}
              >
                <div className="absolute top-1 right-1 text-2xl opacity-30">
                  {stat.icon}
                </div>
                <p className="text-xs text-gray-800 font-bold mb-1">{stat.label}</p>
                <p className="text-xl font-black">{formatCurrency(stat.value, user.currency)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="comic-panel mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
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
      </motion.div>

      {topTags.length > 0 && (
        <motion.div 
          className="comic-panel relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✋
            </motion.span>
            {t('yourTopReasons')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {topTags.map(({ tagId, count }: any, index: number) => {
              const tag = WHY_TAGS.find(t => t.id === tagId);
              if (!tag) return null;
              
              return (
                <motion.div
                  key={tagId}
                  className={`px-4 py-2 rounded-xl border-4 border-black font-black flex items-center gap-2 
                    ${tag.color} transition-all hover:scale-105 hover:rotate-2 hover:shadow-comic-lg`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <motion.span 
                    className="text-2xl"
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {tag.icon}
                  </motion.span>
                  <div>
                    <div className="text-sm">{getWhyTagName(tagId, user.language)}</div>
                    <div className="text-xs opacity-75">{count} {count === 1 ? t('category') : t('categories')}</div>
                  </div>
                  {index < 3 && (
                    <motion.span 
                      className="ml-2 text-2xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1, type: 'spring' }}
                    >
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Achievements Tab Content
function AchievementsContent({ allAchievements, unlocked, unlockedIds, progress, user, t, onShowAchievement }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <motion.div 
        className="comic-panel mb-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h2 className="text-2xl font-bold mb-4">🏅 {t('yourProgress')}</h2>
        <div className="bg-comic-yellow rounded-xl border-4 border-black p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold">{t('progress')}</p>
            <p className="text-2xl font-bold">{unlocked.length}/{allAchievements.length}</p>
          </div>
          <div className="progress-bar">
            <motion.div 
              className="progress-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {allAchievements.map((achievement: Achievement, index: number) => {
          const isUnlocked = unlockedIds.has(achievement.id);
          const userAchievement = unlocked.find((u: UserAchievement) => u.achievement.id === achievement.id);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
              whileHover={isUnlocked ? { scale: 1.03, rotate: 1, y: -5 } : {}}
              whileTap={isUnlocked ? { scale: 0.97 } : {}}
              className={`comic-panel relative overflow-hidden cursor-pointer ${
                isUnlocked
                  ? 'bg-gradient-to-br from-comic-orange via-comic-yellow to-comic-lime'
                  : 'bg-gray-200 opacity-60'
              }`}
              onClick={() => isUnlocked && onShowAchievement(achievement)}
            >
              {isUnlocked && (
                <>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-yellow-300 opacity-20"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </>
              )}

              <div className="flex items-center gap-4 relative z-10">
                <motion.div 
                  className={`text-6xl ${!isUnlocked && 'grayscale'}`}
                  animate={isUnlocked ? {
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {achievement.icon}
                  {isUnlocked && (
                    <motion.span
                      className="absolute -top-2 -right-2 text-3xl"
                      animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ⭐
                    </motion.span>
                  )}
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {user.language === 'ru' ? achievement.nameRu : achievement.nameEn}
                    {isUnlocked && (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-2xl"
                      >
                        ✨
                      </motion.span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {user.language === 'ru' ? achievement.descriptionRu : achievement.descriptionEn}
                  </p>
                  {isUnlocked && userAchievement && (
                    <p className="text-xs text-gray-600 mt-1">
                      🎉 {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                  {!isUnlocked && (
                    <p className="text-xs text-gray-500 mt-1">🔒 {t('locked')}</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Profile Tab Content
function ProfileContent({ user, editMode, setEditMode, name, setName, username, setUsername, 
  currency, setCurrency, language, setLanguage, usernameAvailable, isCheckingUsername,
  currentRank, nextRank, progressToNext, t, onCheckUsername, onSave, onLogout, onCopyReferral }: any) {
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <motion.div 
        className="comic-panel mb-6 bg-gradient-to-r from-comic-purple to-comic-pink"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <motion.h2 
          className="text-2xl font-bold mb-4 text-white flex items-center gap-2"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.span animate={{ rotate: [0, 20, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            👤
          </motion.span>
          {user.name || user.email}
        </motion.h2>
        {user.username && (
          <p className="text-lg font-bold text-white">@{user.username}</p>
        )}
        <p className="text-sm text-white opacity-90">{user.email}</p>
      </motion.div>

      <motion.div 
        className="comic-panel mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-bold mb-4">🏆 {t('rankProgress')}</h3>
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
              <p className="text-3xl font-bold">{user.points.toFixed(0)}</p>
            </div>
          </div>
        </div>

        {nextRank && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-700">{t('nextRank')}</p>
              <p className="font-bold" style={{ color: nextRank.color }}>
                {language === 'ru' ? nextRank.nameRu : nextRank.name}
              </p>
            </div>
            <div className="progress-bar">
              <motion.div 
                className="progress-fill" 
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            <p className="text-xs text-center text-gray-600 mt-2">
              {(nextRank.minPoints - user.points).toFixed(0)} {t('pointsToGo')}
            </p>
          </motion.div>
        )}
      </motion.div>

      <motion.div 
        className="comic-panel mb-6 bg-comic-cyan"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-bold mb-4">🎁 {t('referralSystem')}</h3>
        <div className="bg-white rounded-xl border-4 border-black p-4 mb-3">
          <p className="text-sm text-gray-700 mb-2">{t('yourReferralCode')}</p>
          <p className="text-3xl font-bold text-center mb-2">{user.referralCode}</p>
          <motion.button 
            onClick={onCopyReferral} 
            className="w-full comic-button text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('copyLink')}
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        className="comic-panel mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">⚙️ {t('settings')}</h3>
          {!editMode && (
            <motion.button
              onClick={() => setEditMode(true)}
              className="comic-button-lime rounded-full px-4 py-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✏️ {t('edit')}
            </motion.button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editMode}
              className="w-full px-4 py-3 border-4 border-black rounded-xl disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  onCheckUsername(e.target.value);
                }}
                disabled={!editMode}
                className="w-full px-4 py-3 border-4 border-black rounded-xl disabled:bg-gray-100 pr-12"
              />
              {isCheckingUsername && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                </div>
              )}
              {!isCheckingUsername && username && username !== user?.username && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {usernameAvailable === true && <span className="text-green-600 text-xl">✓</span>}
                  {usernameAvailable === false && <span className="text-red-600 text-xl">✗</span>}
                </div>
              )}
            </div>
          </div>

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
            <motion.div 
              className="flex gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.button 
                onClick={onSave} 
                className="flex-1 comic-button-lime"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                💾 {t('save')}
              </motion.button>
              <motion.button
                onClick={() => setEditMode(false)}
                className="flex-1 comic-button-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ❌ {t('cancel')}
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.button
        onClick={onLogout}
        className="w-full bg-red-500 text-white font-bold py-3 px-6 rounded-full border-4 border-black shadow-comic"
        whileHover={{ scale: 1.02, y: -2, boxShadow: '8px 8px 0px rgba(0,0,0,0.3)' }}
        whileTap={{ scale: 0.98, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        🚪 {t('logout')}
      </motion.button>
    </motion.div>
  );
}
