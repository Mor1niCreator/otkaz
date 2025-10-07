'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';

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

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
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

  const unlockedIds = new Set(unlocked.map(u => u.achievement.id));
  const progress = all.length > 0 ? (unlocked.length / all.length) * 100 : 0;

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto">
      <div className="comic-panel mb-6">
        <h1 className="text-4xl font-bold mb-4">🏅 Achievements</h1>
        
        <div className="bg-comic-yellow rounded-xl border-4 border-black p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold">Progress</p>
            <p className="text-2xl font-bold">{unlocked.length}/{all.length}</p>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {all.map((achievement) => {
          const isUnlocked = unlockedIds.has(achievement.id);
          const userAchievement = unlocked.find(u => u.achievement.id === achievement.id);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={isUnlocked ? { scale: 1.02 } : {}}
              className={`comic-panel ${
                isUnlocked
                  ? 'bg-gradient-to-r from-comic-orange to-comic-yellow'
                  : 'bg-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`text-6xl ${!isUnlocked && 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">
                    {user.language === 'ru' ? achievement.nameRu : achievement.nameEn}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {user.language === 'ru' ? achievement.descriptionRu : achievement.descriptionEn}
                  </p>
                  {isUnlocked && userAchievement && (
                    <p className="text-xs text-gray-600 mt-1">
                      Unlocked: {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                  {!isUnlocked && (
                    <p className="text-xs text-gray-500 mt-1">🔒 Locked</p>
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