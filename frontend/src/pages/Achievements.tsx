import React, { useState, useEffect } from 'react';
import { Award, Trophy, Star } from 'lucide-react';
import { useI18nStrict } from '../hooks/useI18nStrict';
import { ComicPanel } from '../components/ComicPanel';
import axios from 'axios';

interface Achievement {
  key: string;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
  achieved_at?: string;
  progress?: number;
}

export function Achievements() {
  const { t } = useI18nStrict();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/achievements');
      setAchievements(response.data.achievements);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAchievementIcon = (key: string) => {
    const icons: Record<string, string> = {
      coffee_breaker: '☕',
      sugar_free: '🥤',
      smoke_out: '🚭',
      budget_ninja: '🥷',
      momentum: '⚡',
      ref_hero: '👥',
      consistency: '📅',
      iron_will: '💪'
    };
    return icons[key] || '🏆';
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center">
          <div className="loading"></div>
          <span className="ml-2">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  const achievedCount = achievements.filter(a => a.achieved).length;
  const totalCount = achievements.length;

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Award size={32} />
        <h1 className="text-3xl font-bold">{t('achievements.title')}</h1>
      </div>

      {/* Progress Overview */}
      <ComicPanel className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{t('achievements.title')}</h2>
          <div className="text-right">
            <div className="text-2xl font-bold">{achievedCount}/{totalCount}</div>
            <div className="text-sm text-muted">{t('achievements.achieved')}</div>
          </div>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(achievedCount / totalCount) * 100}%` }}
          />
        </div>
      </ComicPanel>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <ComicPanel 
            key={achievement.key}
            className={`transition-all duration-200 ${
              achievement.achieved 
                ? 'ring-2 ring-green-500 bg-green-50' 
                : 'opacity-75'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">
                {achievement.achieved ? (
                  <span className="text-yellow-500">🏆</span>
                ) : (
                  <span className="text-gray-400">{getAchievementIcon(achievement.key)}</span>
                )}
              </div>
              
              <h3 className="font-bold mb-2">{t(`achievements.${achievement.key}`)}</h3>
              
              <p className="text-sm text-muted mb-3">
                {t(`achievements.description.${achievement.key}`)}
              </p>
              
              {achievement.achieved ? (
                <div className="space-y-1">
                  <div className="badge badge-success">
                    ✓ {t('achievements.achieved')}
                  </div>
                  {achievement.achieved_at && (
                    <div className="text-xs text-muted">
                      {new Date(achievement.achieved_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="badge badge-secondary">
                    {t('achievements.locked')}
                  </div>
                  {achievement.progress !== undefined && (
                    <div className="text-xs text-muted">
                      {Math.round(achievement.progress * 100)}% {t('achievements.progress')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </ComicPanel>
        ))}
      </div>

      {/* Achievement Tips */}
      <ComicPanel className="mt-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Star size={20} />
          {t('achievements.tips')}
        </h3>
        <div className="space-y-2 text-sm">
          <p>• {t('achievements.tip_coffee')}</p>
          <p>• {t('achievements.tip_sugar')}</p>
          <p>• {t('achievements.tip_smoke')}</p>
          <p>• {t('achievements.tip_budget')}</p>
          <p>• {t('achievements.tip_momentum')}</p>
        </div>
      </ComicPanel>
    </div>
  );
}