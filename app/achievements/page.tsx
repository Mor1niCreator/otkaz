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
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto">
      <AchievementAnimation 
        show={showAchievement} 
        onComplete={() => setShowAchievement(false)}
        achievement={currentAchievement || { icon: '🏅', name: 'Achievement', description: 'Description' }}
      />
      
      <div className="enough-panel mb-6">
        <h1 className="text-4xl font-bold mb-4">🏅 {t('achievementsTitle')}</h1>
        
        <div className="bg-white border-0 p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold">{t('progress')}</p>
            <p className="text-2xl font-bold">{unlocked.length}/{all.length}</p>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
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
              {/* Shine effect for unlocked achievements */}
              {isUnlocked && (
                <div className="absolute inset-0 bg-white from-transparent via-white to-transparent opacity-20 animate-[shine_3s_ease-in-out_infinite]" />
              )}
              
              {/* Glow effect */}
              {isUnlocked && (
                <motion.div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(245, 198, 26, 0.3) 0%, transparent 70%)',
                  }}
                  animate={{
                    scale: [1, 1.03, 1],
                    opacity: [0.1, 0.25, 0.1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              <div className="flex items-center gap-4 relative z-10">
                <motion.div 
                  className={`text-6xl ${!isUnlocked && 'grayscale opacity-40'}`}
                  animate={isUnlocked ? {
                    scale: [1, 1.05, 1]
                  } : {}}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {achievement.icon}
                  {isUnlocked && (
                    <motion.span
                      className="absolute -top-2 -right-2 text-3xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0, -10, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
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
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
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
                    <motion.p 
                      className="text-xs text-gray-600 mt-1 flex items-center gap-1 elevation-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      🎉 Unlocked: {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                    </motion.p>
                  )}
                  {!isUnlocked && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      🔒 {t('locked')}
                    </p>
                  )}
                  {isUnlocked && (
                    <motion.p 
                      className="text-xs text-purple-600 mt-1 font-bold elevation-2"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      💫 Click to celebrate!
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {unlocked.length === 0 && (
        <div className="speech-bubble text-center mt-6">
          <p className="text-lg">
            Start tracking your refusals to unlock achievements! 🚀
          </p>
        </div>
      )}

      <Navigation />
    </div>
  );
}