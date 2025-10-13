'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency, convertCurrency } from '@/lib/currency-utils';
import { getUserFromStorage } from '@/lib/user-sync';
import { convertToUSD } from '@/lib/currency-service';

interface SpendingEntry {
  id: string;
  name: string;
  amount: number;
  category?: string;
}

interface DaySpending {
  entries: SpendingEntry[];
  total: number;
}

interface WeeklySpending {
  monday: DaySpending;
  tuesday: DaySpending;
  wednesday: DaySpending;
  thursday: DaySpending;
  friday: DaySpending;
  saturday: DaySpending;
  sunday: DaySpending;
}

interface ComparisonData {
  weeklyBefore: number;
  weeklyAfter: number;
  weeklySavings: number;
  savingsPercentage: number;
  projections: {
    week: number;
    month: number;
    sixMonths: number;
    year: number;
    threeYears: number;
    fiveYears: number;
  };
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const PRESET_CATEGORIES = [
  { name: 'Coffee', icon: '☕', defaultAmount: 5 },
  { name: 'Cigarettes', icon: '🚬', defaultAmount: 10 },
  { name: 'Fast Food', icon: '🍔', defaultAmount: 15 },
  { name: 'Alcohol', icon: '🍺', defaultAmount: 20 },
  { name: 'Snacks', icon: '🍿', defaultAmount: 8 },
  { name: 'Taxi/Uber', icon: '🚕', defaultAmount: 25 },
  { name: 'Online Shopping', icon: '🛍️', defaultAmount: 50 },
  { name: 'Subscriptions', icon: '📺', defaultAmount: 15 },
];

export default function ComparisonPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [selectedDay, setSelectedDay] = useState<keyof WeeklySpending | null>(null);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [customEntry, setCustomEntry] = useState({ name: '', amount: '' });
  
  const [weeklySpending, setWeeklySpending] = useState<WeeklySpending>({
    monday: { entries: [], total: 0 },
    tuesday: { entries: [], total: 0 },
    wednesday: { entries: [], total: 0 },
    thursday: { entries: [], total: 0 },
    friday: { entries: [], total: 0 },
    saturday: { entries: [], total: 0 },
    sunday: { entries: [], total: 0 },
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
      try {
        setWeeklySpending(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved spending:', e);
      }
    }
  }, [router]);

  const addPresetEntry = (day: keyof WeeklySpending, preset: typeof PRESET_CATEGORIES[0]) => {
    const newEntry: SpendingEntry = {
      id: Date.now().toString() + Math.random(),
      name: preset.name,
      amount: preset.defaultAmount,
      category: preset.name,
    };
    
    const updatedEntries = [...weeklySpending[day].entries, newEntry];
    const total = updatedEntries.reduce((sum, e) => sum + e.amount, 0);
    
    setWeeklySpending(prev => ({
      ...prev,
      [day]: { entries: updatedEntries, total },
    }));
    
    toast.success(`${preset.icon} ${preset.name} added!`);
  };

  const addCustomEntry = (day: keyof WeeklySpending) => {
    if (!customEntry.name || !customEntry.amount) {
      toast.error(t('fillAllFields'));
      return;
    }
    
    const newEntry: SpendingEntry = {
      id: Date.now().toString() + Math.random(),
      name: customEntry.name,
      amount: parseFloat(customEntry.amount),
    };
    
    const updatedEntries = [...weeklySpending[day].entries, newEntry];
    const total = updatedEntries.reduce((sum, e) => sum + e.amount, 0);
    
    setWeeklySpending(prev => ({
      ...prev,
      [day]: { entries: updatedEntries, total },
    }));
    
    setCustomEntry({ name: '', amount: '' });
    setShowAddEntry(false);
    toast.success('Entry added! ✅');
  };

  const removeEntry = (day: keyof WeeklySpending, entryId: string) => {
    const updatedEntries = weeklySpending[day].entries.filter(e => e.id !== entryId);
    const total = updatedEntries.reduce((sum, e) => sum + e.amount, 0);
    
    setWeeklySpending(prev => ({
      ...prev,
      [day]: { entries: updatedEntries, total },
    }));
  };

  const calculateWeeklyTotal = () => {
    return Object.values(weeklySpending).reduce((sum, day) => sum + day.total, 0);
  };

  const handleAnalyze = async () => {
    const totalBefore = calculateWeeklyTotal();
    
    if (totalBefore <= 0) {
      toast.error(t('enterSpending'));
      return;
    }

    setLoading(true);
    
    try {
      // Save to localStorage
      localStorage.setItem(`weeklySpending_${user.id}`, JSON.stringify(weeklySpending));
      
      // Convert to USD for API
      const totalBeforeUSD = await convertToUSD(totalBefore, user.currency);
      
      // Get actual savings from API
      const res = await fetch(`/api/stats/comparison?userId=${user.id}&weeklyBefore=${totalBeforeUSD}`);
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

  const getCategoryIcon = (category?: string) => {
    const preset = PRESET_CATEGORIES.find(p => p.name === category);
    return preset?.icon || '💰';
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
              {t('addEntriesByDay')}
            </p>

            <div className="space-y-4">
              {DAYS.map((day) => (
                <div key={day} className="bg-white rounded-xl border-4 border-black p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getDayIcon(day)}</span>
                      <span className="font-bold text-lg">{t(day)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">{t('total')}:</div>
                      <div className="text-xl font-bold text-comic-orange">
                        {formatCurrency(weeklySpending[day].total, user.currency)}
                      </div>
                    </div>
                  </div>

                  {/* Entries list */}
                  {weeklySpending[day].entries.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {weeklySpending[day].entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between bg-gray-50 rounded-lg border-2 border-gray-300 p-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getCategoryIcon(entry.category)}</span>
                            <span className="text-sm font-medium">{entry.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">
                              {formatCurrency(entry.amount, user.currency)}
                            </span>
                            <button
                              onClick={() => removeEntry(day, entry.id)}
                              className="text-red-500 hover:text-red-700 font-bold text-lg"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add entry button */}
                  {selectedDay !== day ? (
                    <button
                      onClick={() => setSelectedDay(day)}
                      className="w-full comic-button-secondary py-2 text-sm"
                    >
                      + {t('addEntry')}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {/* Preset categories */}
                      <div className="grid grid-cols-2 gap-2">
                        {PRESET_CATEGORIES.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => addPresetEntry(day, preset)}
                            className="bg-comic-lime hover:bg-green-300 border-2 border-black rounded-lg p-2 text-xs font-bold transition-all"
                          >
                            {preset.icon} {preset.name}
                            <div className="text-[10px] text-gray-600">
                              {formatCurrency(preset.defaultAmount, user.currency)}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Custom entry */}
                      {!showAddEntry ? (
                        <button
                          onClick={() => setShowAddEntry(true)}
                          className="w-full comic-button py-2 text-sm"
                        >
                          💰 {t('customEntry')}
                        </button>
                      ) : (
                        <div className="bg-gray-100 rounded-lg border-2 border-black p-3 space-y-2">
                          <input
                            type="text"
                            placeholder={t('entryName')}
                            value={customEntry.name}
                            onChange={(e) => setCustomEntry({ ...customEntry, name: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm"
                          />
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder={t('amount')}
                            value={customEntry.amount}
                            onChange={(e) => setCustomEntry({ ...customEntry, amount: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => addCustomEntry(day)}
                              className="flex-1 comic-button py-2 text-sm"
                            >
                              {t('add')}
                            </button>
                            <button
                              onClick={() => {
                                setShowAddEntry(false);
                                setCustomEntry({ name: '', amount: '' });
                              }}
                              className="flex-1 comic-button-secondary py-2 text-sm"
                            >
                              {t('cancel')}
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setSelectedDay(null);
                          setShowAddEntry(false);
                          setCustomEntry({ name: '', amount: '' });
                        }}
                        className="w-full text-xs text-gray-600 hover:text-gray-800"
                      >
                        {t('close')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 bg-comic-yellow rounded-xl border-4 border-black p-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">{t('weeklyTotal')}:</span>
                <span className="text-2xl font-bold text-comic-orange">
                  {formatCurrency(calculateWeeklyTotal(), user.currency)}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-2 text-center">
                {t('averagePerDay')}: {formatCurrency(calculateWeeklyTotal() / 7, user.currency)}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || calculateWeeklyTotal() <= 0}
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
                {comparison.savingsPercentage.toFixed(1)}% {t('reduction')}!
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
                          {period.multiplier.toFixed(2)}x {t('weekly')}
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
