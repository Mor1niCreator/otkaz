import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, TrendingUp, Calendar, Target } from 'lucide-react';
import { useI18nStrict } from '../hooks/useI18nStrict';
import { useFX } from '../hooks/useFX';
import { ComicPanel } from '../components/ComicPanel';
import axios from 'axios';

interface StatsResponse {
  period: string;
  total_saved_usd: number;
  total_saved_currency: number;
  currency: string;
  entries_count: number;
  daily_average_usd: number;
  daily_average_currency: number;
}

interface StatsSummary {
  today: StatsResponse;
  week: StatsResponse;
  month: StatsResponse;
  all_time: StatsResponse;
}

interface Goal {
  id: number;
  title: string;
  target_amount_usd: number;
  icon?: string;
  is_achieved: boolean;
  achieved_at?: string;
  created_at: string;
}

export function Wallet() {
  const { t } = useI18nStrict();
  const { toUI } = useFX();
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsResponse, goalsResponse] = await Promise.all([
        axios.get('/api/stats'),
        axios.get('/api/goals')
      ]);
      
      setStats(statsResponse.data);
      setGoals(goalsResponse.data.goals);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGoalProgress = (goal: Goal, totalSaved: number) => {
    const progress = Math.min(totalSaved / goal.target_amount_usd, 1);
    return {
      progress,
      remaining: Math.max(goal.target_amount_usd - totalSaved, 0),
      isAchieved: goal.is_achieved
    };
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

  if (!stats) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted">{t('common.error')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <WalletIcon size={32} />
        <h1 className="text-3xl font-bold">{t('nav.wallet')}</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ComicPanel>
          <div className="flex items-center gap-3">
            <Calendar size={24} className="text-green-600" />
            <div>
              <div className="text-sm text-muted">{t('stats.today')}</div>
              <div className="font-bold text-lg">
                {formatCurrency(stats.today.total_saved_currency, stats.today.currency)}
              </div>
              <div className="text-xs text-muted">
                {stats.today.entries_count} {t('stats.entries_count')}
              </div>
            </div>
          </div>
        </ComicPanel>

        <ComicPanel>
          <div className="flex items-center gap-3">
            <TrendingUp size={24} className="text-blue-600" />
            <div>
              <div className="text-sm text-muted">{t('stats.week')}</div>
              <div className="font-bold text-lg">
                {formatCurrency(stats.week.total_saved_currency, stats.week.currency)}
              </div>
              <div className="text-xs text-muted">
                {formatCurrency(stats.week.daily_average_currency, stats.week.currency)} {t('stats.daily_average')}
              </div>
            </div>
          </div>
        </ComicPanel>

        <ComicPanel>
          <div className="flex items-center gap-3">
            <Calendar size={24} className="text-purple-600" />
            <div>
              <div className="text-sm text-muted">{t('stats.month')}</div>
              <div className="font-bold text-lg">
                {formatCurrency(stats.month.total_saved_currency, stats.month.currency)}
              </div>
              <div className="text-xs text-muted">
                {formatCurrency(stats.month.daily_average_currency, stats.month.currency)} {t('stats.daily_average')}
              </div>
            </div>
          </div>
        </ComicPanel>

        <ComicPanel>
          <div className="flex items-center gap-3">
            <Target size={24} className="text-orange-600" />
            <div>
              <div className="text-sm text-muted">{t('stats.all_time')}</div>
              <div className="font-bold text-lg">
                {formatCurrency(stats.all_time.total_saved_currency, stats.all_time.currency)}
              </div>
              <div className="text-xs text-muted">
                {stats.all_time.entries_count} {t('stats.entries_count')}
              </div>
            </div>
          </div>
        </ComicPanel>
      </div>

      {/* Goals Progress */}
      {goals.length > 0 && (
        <ComicPanel className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target size={20} />
            {t('goals.progress')}
          </h2>
          
          <div className="space-y-4">
            {goals.map((goal) => {
              const goalData = getGoalProgress(goal, stats.all_time.total_saved_usd);
              const remainingUI = toUI(goalData.remaining, stats.all_time.currency);
              
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{goal.icon || '🎯'}</span>
                      <span className="font-medium">{goal.title}</span>
                      {goal.is_achieved && (
                        <span className="badge badge-success text-xs">✓ {t('goals.achieved')}</span>
                      )}
                    </div>
                    <div className="text-sm text-muted">
                      {formatCurrency(remainingUI, stats.all_time.currency)} {t('common.left')}
                    </div>
                  </div>
                  
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${goalData.progress * 100}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-muted">
                    {Math.round(goalData.progress * 100)}% {t('goals.progress')}
                  </div>
                </div>
              );
            })}
          </div>
        </ComicPanel>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComicPanel>
          <h3 className="font-bold mb-3">{t('stats.daily_average')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted">{t('stats.today')}</span>
              <span className="font-medium">
                {formatCurrency(stats.today.daily_average_currency, stats.today.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted">{t('stats.week')}</span>
              <span className="font-medium">
                {formatCurrency(stats.week.daily_average_currency, stats.week.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted">{t('stats.month')}</span>
              <span className="font-medium">
                {formatCurrency(stats.month.daily_average_currency, stats.month.currency)}
              </span>
            </div>
          </div>
        </ComicPanel>

        <ComicPanel>
          <h3 className="font-bold mb-3">{t('stats.entries_count')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted">{t('stats.today')}</span>
              <span className="font-medium">{stats.today.entries_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted">{t('stats.week')}</span>
              <span className="font-medium">{stats.week.entries_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted">{t('stats.month')}</span>
              <span className="font-medium">{stats.month.entries_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted">{t('stats.all_time')}</span>
              <span className="font-medium">{stats.all_time.entries_count}</span>
            </div>
          </div>
        </ComicPanel>
      </div>
    </div>
  );
}