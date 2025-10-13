'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useTranslation } from '@/lib/i18n';
import { getUserFromStorage } from '@/lib/user-sync';

interface LeaderboardEntry {
  id: string;
  user: {
    id: string;
    name: string;
    username?: string;
    points: number;
    rank: string;
  };
  totalPoints: number;
  rank: number;
  period: string;
}

interface DailyTask {
  id: string;
  code: string;
  nameEn: string;
  nameRu: string;
  descriptionEn: string;
  descriptionRu: string;
  points: number;
  type: string;
  target?: number;
  category?: string;
  isCompleted: boolean;
  progress: number;
  maxProgress: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { t } = useTranslation(user?.language || 'en');

  useEffect(() => {
    const parsedUser = getUserFromStorage();
    if (!parsedUser) {
      router.push('/');
      return;
    }
    setUser(parsedUser);
    loadLeaderboard(parsedUser.id);
    loadDailyTasks(parsedUser.id);
  }, [router, selectedPeriod]);

  const loadLeaderboard = async (userId: string) => {
    try {
      const res = await fetch(`/api/leaderboard?period=${selectedPeriod}`);
      const data = await res.json();
      if (res.ok) {
        setLeaderboard(data.leaderboard);
        setUserRank(data.userRank);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  const loadDailyTasks = async (userId: string) => {
    try {
      const res = await fetch(`/api/daily-tasks?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setDailyTasks(data.tasks);
      }
    } catch (error) {
      console.error('Failed to load daily tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/daily-tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, taskId })
      });
      
      const data = await res.json();
      if (res.ok) {
        // Обновляем задачи
        setDailyTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, isCompleted: true, progress: task.maxProgress }
            : task
        ));
        
        // Обновляем очки пользователя
        const updatedUser = { ...user, points: user.points + data.pointsEarned };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Перезагружаем лидерборд
        loadLeaderboard(user.id);
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  if (!user) return null;

  const completedTasks = dailyTasks.filter(task => task.isCompleted).length;
  const totalTasks = dailyTasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto">
      <div className="comic-panel mb-6">
        <h1 className="text-4xl font-bold mb-2">🏆 {t('leaderboard')}</h1>
        <p className="text-gray-700">Compete with other savers and complete daily tasks!</p>
      </div>

      {/* Daily Tasks Section */}
      <div className="comic-panel mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📋 Daily Tasks</h2>
          <div className="text-sm text-gray-600">
            {completedTasks}/{totalTasks} completed
          </div>
        </div>
        
        <div className="mb-4">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-center text-gray-600 mt-2">
            {progressPercentage.toFixed(0)}% complete • {100 - (completedTasks * 100 / totalTasks)} points remaining
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading tasks...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-xl border-4 border-black p-4 ${
                  task.isCompleted 
                    ? 'bg-green-100' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {user.language === 'ru' ? task.nameRu : task.nameEn}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {user.language === 'ru' ? task.descriptionRu : task.descriptionEn}
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-comic-lime h-2 rounded-full transition-all"
                            style={{ width: `${(task.progress / task.maxProgress) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {task.progress}/{task.maxProgress}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-comic-orange">
                      +{task.points}
                    </div>
                    {task.isCompleted ? (
                      <div className="text-green-600 text-sm">✓ Completed</div>
                    ) : task.progress >= task.maxProgress ? (
                      <button
                        onClick={() => completeTask(task.id)}
                        className="comic-button-lime text-sm px-3 py-1"
                      >
                        Claim!
                      </button>
                    ) : (
                      <div className="text-gray-500 text-sm">In Progress</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard Section */}
      <div className="comic-panel mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">🏆 Leaderboard</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border-2 border-black rounded-lg"
          >
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="alltime">All Time</option>
          </select>
        </div>

        {userRank && (
          <div className="bg-comic-yellow rounded-xl border-4 border-black p-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-700">Your Rank</p>
              <p className="text-3xl font-bold">#{userRank}</p>
              <p className="text-lg">{user.points.toFixed(0)} points</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-3 rounded-xl border-2 border-black ${
                index === 0 ? 'bg-yellow-100' :
                index === 1 ? 'bg-gray-100' :
                index === 2 ? 'bg-orange-100' :
                'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div>
                  <div className="font-bold">
                    {entry.user.username ? `@${entry.user.username}` : entry.user.name}
                  </div>
                  <div className="text-sm text-gray-600">{entry.user.rank}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{entry.totalPoints.toFixed(0)}</div>
                <div className="text-sm text-gray-600">points</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Navigation />
    </div>
  );
}