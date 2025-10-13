'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency, convertCurrency } from '@/lib/currency-utils';
import { getUserFromStorage } from '@/lib/user-sync';

interface WeeklySpending {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

interface ComparisonData {
  weeklyBefore: number;
  weeklyAfter: number;
  weeklySavings: number;
  projections: {
    week: number;
    month: number;
    sixMonths: number;
    year: number;
    threeYears: number;
    fiveYears: number;
  };
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function ComparisonPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [weeklySpending, setWeeklySpending] = useState<WeeklySpending>({
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  });
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { t } = useTranslation(user?.language || 'en');

  useEffect(() => {
    const parsedUser = getUserFromStorage();
    if (!parsedUser) {
      router.push('/');
      return;
    }
    setUser(parsedUser);
    
    // Load saved weekly spending from localStorage
    const saved = localStorage.getItem(`weeklySpending_${parsedUser.id}`);
    if (saved) {
      setWeeklySpending(JSON.parse(saved));
    }
  }, [router]);

  const handleDayChange = (day: keyof WeeklySpending, value: string) => {
    const numValue = parseFloat(value) || 0;
    setWeeklySpending(prev => ({
      ...prev,
      [day]: numValue,
    }));
  };

  const calculateTotal = () => {
    return Object.values(weeklySpending).reduce((sum, val) => sum + val, 0);
  };

  const handleAnalyze = async () => {
    const totalBefore = calculateTotal();
    
    if (totalBefore <= 0) {
      toast.error(t('enterSpending'));
      return;
    }

    setLoading(true);
    
    try {
      // Save to localStorage
      localStorage.setItem(`weeklySpending_${user.id}`, JSON.stringify(weeklySpending));
      
      // Get actual savings from API
      const res = await fetch(`/api/stats/comparison?userId=${user.id}&weeklyBefore=${totalBefore}`);
      const data = await res.json();
      
      if (res.ok) {
        setComparison(data);
        setStep('results');
        toast.success(t('analysisReady'));
      } else {
        toast.error('Failed to analyze');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const getDayIcon = (day: string) => {
    const icons: { [key: string]: string } = {
      monday: '📅',
      tuesday: '📘',
      wednesday: '🐫',
      thursday: '⚡',
      friday: '🎉',
      saturday: '🌟',
      sunday: '🌞',
    };
    return icons[day] || '📅';
  };

  if (!user) return null;

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto">
      <div className="comic-panel mb-6">
        <h1 className="text-4xl font-bold mb-2">📊 {t('beforeAfter')}</h1>
        <p className="text-gray-700">{t('compareSpending')}</p>
      </div>

      {step === 'input' && (
        <>
          <div className="comic-panel mb-6">
            <h2 className="text-2xl font-bold mb-4">{t('weeklySpendingBefore')}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {t('enterDailySpending')}
            </p>

            <div className="space-y-3">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center gap-3 bg-white rounded-xl border-4 border-black p-3">
                  <span className="text-2xl">{getDayIcon(day)}</span>
                  <div className="flex-1">
                    <label className="block text-sm font-bold mb-1">
                      {t(day as any)}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={weeklySpending[day as keyof WeeklySpending] || ''}
                        onChange={(e) => handleDayChange(day as keyof WeeklySpending, e.target.value)}
                        placeholder="0"
                        className="flex-1 px-3 py-2 border-2 border-black rounded-lg"
                      />
                      <span className="text-gray-600 font-bold">{user.currency}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-comic-yellow rounded-xl border-4 border-black p-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">{t('weeklyTotal')}:</span>
                <span className="text-2xl font-bold text-comic-orange">
                  {formatCurrency(calculateTotal(), user.currency)}
                </span>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || calculateTotal() <= 0}
              className="w-full mt-6 comic-button-orange py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ ' + t('analyzing') : '🚀 ' + t('analyzeNow')}
            </button>
          </div>

          <div className="comic-panel bg-comic-cyan">
            <h3 className="font-bold mb-2">💡 {t('tip')}</h3>
            <p className="text-sm text-gray-700">
              {t('comparisonTip')}
            </p>
          </div>
        </>
      )}

      {step === 'results' && comparison && (
        <>
          <div className="comic-panel mb-6">
            <button
              onClick={() => setStep('input')}
              className="comic-button-secondary mb-4"
            >
              ← {t('back')}
            </button>
            
            <h2 className="text-2xl font-bold mb-4">📈 {t('yourResults')}</h2>

            {/* Weekly Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-red-100 rounded-xl border-4 border-black p-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">❌</div>
                  <div className="text-sm text-gray-700 mb-1">{t('before')}</div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(convertCurrency(comparison.weeklyBefore, user.currency), user.currency)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{t('perWeek')}</div>
                </div>
              </div>

              <div className="bg-green-100 rounded-xl border-4 border-black p-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-sm text-gray-700 mb-1">{t('after')}</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(convertCurrency(comparison.weeklyAfter, user.currency), user.currency)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{t('perWeek')}</div>
                </div>
              </div>
            </div>

            <div className="bg-comic-lime rounded-xl border-4 border-black p-6 mb-6 text-center">
              <div className="text-lg font-bold mb-2">💰 {t('weeklySavings')}</div>
              <div className="text-4xl font-bold text-green-700">
                {formatCurrency(convertCurrency(comparison.weeklySavings, user.currency), user.currency)}
              </div>
              <div className="text-sm text-gray-700 mt-2">
                {((comparison.weeklySavings / comparison.weeklyBefore) * 100).toFixed(1)}% {t('reduction')}!
              </div>
            </div>
          </div>

          {/* Projections */}
          <div className="comic-panel mb-6">
            <h2 className="text-2xl font-bold mb-4">🚀 {t('savingsProjections')}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {t('continueSaving')}
            </p>

            <div className="space-y-3">
              {[
                { key: 'week', label: t('oneWeek'), icon: '📅', multiplier: 1 },
                { key: 'month', label: t('oneMonth'), icon: '📆', multiplier: 4.33 },
                { key: 'sixMonths', label: t('sixMonths'), icon: '📊', multiplier: 26 },
                { key: 'year', label: t('oneYear'), icon: '🎯', multiplier: 52 },
                { key: 'threeYears', label: t('threeYears'), icon: '🚀', multiplier: 156 },
                { key: 'fiveYears', label: t('fiveYears'), icon: '💎', multiplier: 260 },
              ].map((period) => (
                <div
                  key={period.key}
                  className="bg-gradient-to-r from-white to-gray-50 rounded-xl border-4 border-black p-4 hover:shadow-comic-lg transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{period.icon}</span>
                      <div>
                        <div className="font-bold text-lg">{period.label}</div>
                        <div className="text-xs text-gray-600">
                          {period.multiplier}x {t('weekly')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-comic-orange">
                        {formatCurrency(
                          convertCurrency(
                            comparison.projections[period.key as keyof typeof comparison.projections],
                            user.currency
                          ),
                          user.currency
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivational message */}
          <div className="comic-panel bg-comic-yellow">
            <div className="text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-2xl font-bold mb-2">{t('amazingProgress')}</h3>
              <p className="text-gray-700">
                {t('keepSavingMessage')}
              </p>
            </div>
          </div>
        </>
      )}

      <Navigation />
    </div>
  );
}
