'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import AchievementAnimation from '@/components/AchievementAnimation';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { getUserFromStorage } from '@/lib/user-sync';

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

export default function AchievementsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [unlocked, setUnlocked] = useState<UserAchievement[]>([]);
  const [all, setAll] = useState<Achievement[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  
  const { t } = useTranslation(user?.language || 'en');

  useEffect(() => {
    const parsedUser = getUserFromStorage();
    if (!parsedUser) {
      router.push('/');
      return;
    }
    setUser(parsedUser);
    loadAchievements(parsedUser.id);
  }, [router]);

  const loadAchievements = async (userId: string) => {
    try {
      const res = await fetch(`/api/achievements/list?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setUnlocked(data.unlocked);
        setAll(data.all);
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  };

  const showAchievementAnimation = (achievement: Achievement) => {
    setCurrentAchievement(achievement);
    setShowAchievement(true);
  };

  if (!user) return null;

  const unlockedIds = new Set(unlocked.map(u => u.achievement.id));
  const progress = all.length > 0 ? (unlocked.length / all.length) * 100 : 0;

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto relative min-h-screen">
      <AchievementAnimation 
        show={showAchievement} 
        onComplete={() => setShowAchievement(false)}
        achievement={currentAchievement || { icon: '🏅', name: 'Achievement', description: 'Description' }}
      />
      
      <div className="enough-panel mb-6">
        <h1 className="text-4xl font-bold tracking-tight mb-4">🏅 {t('achievementsTitle')}</h1>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-gray-700">{t('progress')}</p>
            <p className="text-2xl font-bold text-gray-900">{unlocked.length}/{all.length}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {all.map((achievement, index) => {
          const isUnlocked = unlockedIds.has(achievement.id);
          const userAchievement = unlocked.find(u => u.achievement.id === achievement.id);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 15 }}
              whileHover={isUnlocked ? { scale: 1.02, y: -3 } : {}}
              whileTap={isUnlocked ? { scale: 0.98 } : {}}
              className={`enough-panel relative overflow-hidden ${
                isUnlocked
                  ? 'bg-white cursor-pointer'
                  : 'bg-gray-100 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isUnlocked && showAchievementAnimation(achievement)}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`text-6xl ${!isUnlocked && 'grayscale opacity-40'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {user.language === 'ru' ? achievement.nameRu : achievement.nameEn}
                    {isUnlocked && <span className="ml-2">✨</span>}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {user.language === 'ru' ? achievement.descriptionRu : achievement.descriptionEn}
                  </p>
                  {isUnlocked && userAchievement && (
                    <p className="text-xs text-gray-600 mt-2">
                      🎉 Unlocked: {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                  {!isUnlocked && (
                    <p className="text-xs text-gray-500 mt-2">
                      🔒 {t('locked')}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {unlocked.length === 0 && (
        <div className="enough-panel text-center mt-6 bg-gray-50">
          <p className="text-lg text-gray-700">
            Start tracking your refusals to unlock achievements! 🚀
          </p>
        </div>
      )}

      <Navigation />
    </div>
  );
}
