import React, { useState, useEffect } from 'react';
import { Trophy, Star, Target } from 'lucide-react';
import { useI18nStrict } from '../hooks/useI18nStrict';
import { ComicPanel } from '../components/ComicPanel';
import axios from 'axios';

interface RankInfo {
  current_rank: string;
  current_points: number;
  next_rank?: string;
  points_to_next?: number;
  progress: number;
}

const RANKS = [
  { name: 'novice_saver', min: 0, max: 99, icon: '🌱', color: 'text-green-600' },
  { name: 'habit_hacker', min: 100, max: 299, icon: '🔧', color: 'text-blue-600' },
  { name: 'frugal_master', min: 300, max: 799, icon: '💰', color: 'text-purple-600' },
  { name: 'willpower_pro', min: 800, max: 1999, icon: '💪', color: 'text-orange-600' },
  { name: 'discipline_legend', min: 2000, max: Infinity, icon: '👑', color: 'text-yellow-600' }
];

export function Ranks() {
  const { t } = useI18nStrict();
  const [rankInfo, setRankInfo] = useState<RankInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankInfo();
  }, []);

  const fetchRankInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ranks');
      setRankInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch rank info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentRankData = () => {
    if (!rankInfo) return null;
    return RANKS.find(rank => rank.name === rankInfo.current_rank.toLowerCase().replace(/\s+/g, '_'));
  };

  const getNextRankData = () => {
    if (!rankInfo?.next_rank) return null;
    return RANKS.find(rank => rank.name === rankInfo.next_rank.toLowerCase().replace(/\s+/g, '_'));
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

  if (!rankInfo) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted">{t('common.error')}</p>
        </div>
      </div>
    );
  }

  const currentRankData = getCurrentRankData();
  const nextRankData = getNextRankData();

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Trophy size={32} />
        <h1 className="text-3xl font-bold">{t('ranks.title')}</h1>
      </div>

      {/* Current Rank */}
      <ComicPanel className="mb-6">
        <div className="text-center">
          <div className="text-6xl mb-4">
            {currentRankData?.icon || '🏆'}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {t(`ranks.${rankInfo.current_rank.toLowerCase().replace(/\s+/g, '_')}`)}
          </h2>
          <div className="text-lg text-muted mb-4">
            {rankInfo.current_points} {t('ranks.total_points')}
          </div>
          
          {nextRankData && (
            <div className="space-y-3">
              <div className="text-sm text-muted">
                {t('ranks.points_to_next')}: {rankInfo.points_to_next}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${rankInfo.progress * 100}%` }}
                />
              </div>
              <div className="text-sm text-muted">
                {Math.round(rankInfo.progress * 100)}% {t('ranks.progress')}
              </div>
            </div>
          )}
        </div>
      </ComicPanel>

      {/* All Ranks */}
      <ComicPanel>
        <h3 className="text-xl font-bold mb-4">{t('ranks.all_ranks')}</h3>
        <div className="space-y-3">
          {RANKS.map((rank, index) => {
            const isCurrent = rank.name === rankInfo.current_rank.toLowerCase().replace(/\s+/g, '_');
            const isAchieved = rankInfo.current_points >= rank.min;
            
            return (
              <div 
                key={rank.name}
                className={`flex items-center gap-4 p-3 rounded-lg border-2 ${
                  isCurrent 
                    ? 'border-green-500 bg-green-50' 
                    : isAchieved 
                      ? 'border-gray-300 bg-gray-50' 
                      : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-2xl">
                  {isCurrent ? '⭐' : rank.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      {t(`ranks.${rank.name}`)}
                    </h4>
                    {isCurrent && (
                      <span className="badge badge-success text-xs">
                        {t('ranks.current')}
                      </span>
                    )}
                    {isAchieved && !isCurrent && (
                      <span className="badge badge-secondary text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted">
                    {rank.min} - {rank.max === Infinity ? '∞' : rank.max} {t('ranks.points')}
                  </div>
                </div>
                
                <div className="text-right">
                  {isCurrent && (
                    <div className="text-sm font-medium text-green-600">
                      {rankInfo.current_points}/{rank.max === Infinity ? '∞' : rank.max}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ComicPanel>

      {/* Rank Benefits */}
      <ComicPanel className="mt-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Star size={20} />
          {t('ranks.benefits')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">{t('ranks.benefit_points')}</h4>
            <p className="text-muted">{t('ranks.benefit_points_desc')}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">{t('ranks.benefit_streak')}</h4>
            <p className="text-muted">{t('ranks.benefit_streak_desc')}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">{t('ranks.benefit_achievements')}</h4>
            <p className="text-muted">{t('ranks.benefit_achievements_desc')}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">{t('ranks.benefit_referrals')}</h4>
            <p className="text-muted">{t('ranks.benefit_referrals_desc')}</p>
          </div>
        </div>
      </ComicPanel>
    </div>
  );
}