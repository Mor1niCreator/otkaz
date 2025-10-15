'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
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

  if (!user) return null;

  const progress = all.length > 0 ? (unlocked.length / all.length) * 100 : 0;

  return (
    <div className="pb-24 px-4 py-6 max-w-4xl mx-auto" style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ fontWeight: 900, color: '#212121' }}>
          🏅 {t('achievements')}
        </h1>
        <p className="text-gray-500 text-sm font-medium">Unlock achievements as you save</p>
      </div>

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
        style={{ background: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)', border: 'none' }}
      >
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-sm font-semibold text-gray-900">Progress</div>
            <div className="text-3xl font-black text-gray-900">{unlocked.length} / {all.length}</div>
          </div>
          <div className="text-5xl">{Math.round(progress)}%</div>
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </motion.div>

      {/* Unlocked Achievements */}
      {unlocked.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Unlocked</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {unlocked.map((ua, index) => (
              <motion.div
                key={ua.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:shadow-yellow transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{ua.achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">
                      {user.language === 'ru' ? ua.achievement.nameRu : ua.achievement.nameEn}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {user.language === 'ru' ? ua.achievement.descriptionRu : ua.achievement.descriptionEn}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(ua.unlockedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Locked</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {all
            .filter(a => !unlocked.find(ua => ua.achievement.id === a.id))
            .map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="card opacity-60"
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl grayscale">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-700">
                      {user.language === 'ru' ? achievement.nameRu : achievement.nameEn}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {user.language === 'ru' ? achievement.descriptionRu : achievement.descriptionEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      <Navigation />
    </div>
  );
}
