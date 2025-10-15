'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import PresetsEditor from '@/components/PresetsEditor';
import MathWallBackground from '@/components/MathWallBackground';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency, convertCurrency } from '@/lib/currency-utils';
import { getUserFromStorage } from '@/lib/user-sync';
import { convertToUSD } from '@/lib/currency-service';
import { getUserPresets, UserPreset } from '@/lib/user-presets';

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
  walletStats: {
    totalSaved: number;
    daysTracking: number;
    dailyAverage: number;
    entriesCount: number;
    hasData: boolean;
  };
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export default function ComparisonPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [presets, setPresets] = useState<UserPreset[]>([]);
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [selectedDay, setSelectedDay] = useState<keyof WeeklySpending | null>(null);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showPresetsEditor, setShowPresetsEditor] = useState(false);
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
    setPresets(getUserPresets(parsedUser.id));
    
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

  const addPresetEntry = (day: keyof WeeklySpending, preset: UserPreset) => {
    const newEntry: SpendingEntry = {
      id: Date.now().toString() + Math.random(),
      name: preset.name,
      amount: preset.price,
      category: preset.category,
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

  const getCategoryIcon = (categoryOrName?: string) => {
    const preset = presets.find(p => p.name === categoryOrName || p.category === categoryOrName);
    return preset?.icon || '💰';
  };

  if (!user) return null;

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto relative">
      <MathWallBackground />
      <motion.div 
        className="enough-panel mb-6 relative overflow-hidden elevation-2"
        initial={{ scale: 0.9, opacity: 0, y: -30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-blue-300 border-0 opacity-5 elevation-2"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <motion.h1 
          className="text-4xl font-bold mb-2 flex items-center gap-3 relative z-10 elevation-2"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
            📊
          </motion.span>
          {t('beforeAfter')}
        </motion.h1>
        <p className="text-gray-700 relative z-10">{t('compareSpending')}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <motion.div 
              className="enough-panel mb-6 elevation-2"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h2 
                className="text-2xl font-bold mb-4 elevation-2"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {t('weeklySpendingBefore')}
              </motion.h2>
            <p className="text-sm text-gray-600 mb-4">
              {t('addEntriesByDay')}
            </p>

            <div className="space-y-4">
              {DAYS.map((day) => (
                <div key={day} className="bg-white border-0 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getDayIcon(day)}</span>
                      <span className="font-bold text-lg">{t(day)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">{t('total')}:</div>
                      <div className="text-xl font-bold text-gray-900">
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
                          className="flex items-center justify-between bg-gray-50 border-0 border-2 border-gray-300 p-2 elevation-2"
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
                              className="text-red-500 hover:text-red-700 font-bold text-lg elevation-2"
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
                      className="w-full enough-button-secondary py-2 text-sm elevation-2"
                    >
                      + {t('addEntry')}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {/* Quick settings button */}
                      <button
                        onClick={() => setShowPresetsEditor(true)}
                        className="w-full enough-button-secondary py-2 text-xs elevation-2"
                      >
                        ⚙️ {t('customizePresets')}
                      </button>
                      
                      {/* Preset categories */}
                      <div className="grid grid-cols-2 gap-2">
                        {presets.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => addPresetEntry(day, preset)}
                            className="bg-white hover:bg-green-300 border-0 p-2 text-xs font-bold transition-all elevation-2"
                          >
                            {preset.icon} {preset.name}
                            <div className="text-[10px] text-gray-600">
                              {formatCurrency(preset.price, user.currency)}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Custom entry */}
                      {!showAddEntry ? (
                        <button
                          onClick={() => setShowAddEntry(true)}
                          className="w-full enough-button py-2 text-sm elevation-2"
                        >
                          💰 {t('customEntry')}
                        </button>
                      ) : (
                        <div className="bg-gray-100 border-0 p-3 space-y-2">
                          <input
                            type="text"
                            placeholder={t('entryName')}
                            value={customEntry.name}
                            onChange={(e) => setCustomEntry({ ...customEntry, name: e.target.value })}
                            className="w-full px-3 py-2 border-0 text-sm elevation-2"
                          />
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder={t('amount')}
                            value={customEntry.amount}
                            onChange={(e) => setCustomEntry({ ...customEntry, amount: e.target.value })}
                            className="w-full px-3 py-2 border-0 text-sm elevation-2"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => addCustomEntry(day)}
                              className="flex-1 enough-button py-2 text-sm elevation-2"
                            >
                              {t('add')}
                            </button>
                            <button
                              onClick={() => {
                                setShowAddEntry(false);
                                setCustomEntry({ name: '', amount: '' });
                              }}
                              className="flex-1 enough-button-secondary py-2 text-sm elevation-2"
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
                        className="w-full text-xs text-gray-600 hover:text-gray-800 elevation-2"
                      >
                        {t('close')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white border-0 p-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">{t('weeklyTotal')}:</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(calculateWeeklyTotal(), user.currency)}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-2 text-center">
                {t('averagePerDay')}: {formatCurrency(calculateWeeklyTotal() / 7, user.currency)}
              </div>
            </div>

            <motion.button
              onClick={handleAnalyze}
              disabled={loading || calculateWeeklyTotal() <= 0}
              className="w-full mt-6 enough-button py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed elevation-2"
              whileHover={!loading && calculateWeeklyTotal() > 0 ? { scale: 1.02, y: -3 } : {}}
              whileTap={!loading && calculateWeeklyTotal() > 0 ? { scale: 0.98 } : {}}
            >
              {loading ? '⏳ ' + t('analyzing') : '🚀 ' + t('analyzeNow')}
            </motion.button>
            </motion.div>

            <motion.div 
              className="enough-panel bg-white elevation-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  💡
                </motion.span>
                {t('tip')}
              </h3>
              <p className="text-sm text-gray-700">
                {t('comparisonTip')}
              </p>
            </motion.div>
          </motion.div>
        )}

        {step === 'results' && comparison && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <motion.div 
              className="enough-panel mb-6 elevation-2"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <motion.button
                onClick={() => setStep('input')}
                className="enough-button-secondary mb-4 elevation-2"
                whileHover={{ scale: 1.02, x: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                ← {t('back')}
              </motion.button>
            
            <h2 className="text-2xl font-bold mb-4">📈 {t('yourResults')}</h2>

            {/* Wallet Statistics Banner */}
            {comparison.walletStats.hasData && (
              <div className="bg-white from-blue-100 to-purple-100 border-0 p-4 mb-6">
                <div className="text-center mb-3">
                  <div className="text-sm font-bold text-gray-700 mb-2">
                    💰 {t('dataFromWallet')}
                  </div>
                  <div className="text-3xl font-bold text-purple-700">
                    {formatCurrency(convertCurrency(comparison.walletStats.totalSaved, user.currency), user.currency)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {t('totalSavedInWallet')}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white border-0 p-2">
                    <div className="font-bold text-lg">{comparison.walletStats.daysTracking}</div>
                    <div className="text-gray-600">{t('daysTracking')}</div>
                  </div>
                  <div className="bg-white border-0 p-2">
                    <div className="font-bold text-lg">{comparison.walletStats.entriesCount}</div>
                    <div className="text-gray-600">{t('refusals')}</div>
                  </div>
                  <div className="bg-white border-0 p-2">
                    <div className="font-bold text-lg">
                      {formatCurrency(convertCurrency(comparison.walletStats.dailyAverage, user.currency), user.currency)}
                    </div>
                    <div className="text-gray-600">{t('perDay')}</div>
                  </div>
                </div>
              </div>
            )}

            {!comparison.walletStats.hasData && (
              <div className="bg-white border-0 p-4 mb-6 text-center">
                <div className="text-2xl mb-2">⚠️</div>
                <div className="font-bold mb-1">{t('noWalletData')}</div>
                <div className="text-sm text-gray-700">
                  {t('noWalletDataDescription')}
                </div>
              </div>
            )}

            {/* Weekly Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div 
                className="bg-white border-0 p-4 elevation-2"
                initial={{ opacity: 0, x: -30, rotate: -5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <div className="text-center">
                  <motion.div 
                    className="text-3xl mb-2 elevation-2"
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ❌
                  </motion.div>
                  <div className="text-sm text-gray-700 mb-1">{t('before')}</div>
                  <motion.div 
                    className="text-2xl font-bold text-red-600 elevation-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                  >
                    {formatCurrency(convertCurrency(comparison.weeklyBefore, user.currency), user.currency)}
                  </motion.div>
                  <div className="text-xs text-gray-600 mt-1">{t('perWeek')}</div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white border-0 p-4 elevation-2"
                initial={{ opacity: 0, x: 30, rotate: 5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring' }}
                whileHover={{ scale: 1.05, rotate: -2 }}
              >
                <div className="text-center">
                  <motion.div 
                    className="text-3xl mb-2 elevation-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✅
                  </motion.div>
                  <div className="text-sm text-gray-700 mb-1">{t('after')}</div>
                  <motion.div 
                    className="text-2xl font-bold text-green-600 elevation-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: 'spring' }}
                  >
                    {formatCurrency(convertCurrency(comparison.weeklyAfter, user.currency), user.currency)}
                  </motion.div>
                  <div className="text-xs text-gray-600 mt-1">{t('perWeek')}</div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="bg-white border-0 p-6 mb-6 text-center relative overflow-hidden elevation-2"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 300 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="absolute inset-0 bg-white from-green-300 to-lime-300 opacity-30 elevation-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <motion.div 
                className="text-lg font-bold mb-2 relative z-10 elevation-2"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                💰 {t('weeklySavings')}
              </motion.div>
              <motion.div 
                className="text-4xl font-bold text-green-700 relative z-10 elevation-2"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
              >
                {formatCurrency(convertCurrency(comparison.weeklySavings, user.currency), user.currency)}
              </motion.div>
              <div className="text-sm text-gray-700 mt-2 relative z-10">
                {comparison.savingsPercentage.toFixed(1)}% {t('reduction')}!
              </div>
              {comparison.walletStats.hasData && (
                <motion.div 
                  className="mt-3 pt-3 border-t-2 border-green-500 relative z-10 elevation-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <div className="text-xs text-gray-600">
                    📊 {t('calculatedFromWallet')}
                  </div>
                </motion.div>
              )}
            </motion.div>
            </motion.div>

          {/* Projections */}
          <motion.div 
            className="enough-panel mb-6 elevation-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.h2 
              className="text-2xl font-bold mb-4 flex items-center gap-2 elevation-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                🚀
              </motion.span>
              {t('savingsProjections')}
            </motion.h2>
            <p className="text-sm text-gray-600 mb-2">
              {comparison.walletStats.hasData 
                ? t('projectionsBasedOnWallet')
                : t('continueSaving')}
            </p>
            {comparison.walletStats.hasData && (
              <div className="bg-white border-0 border-2 border-blue-300 p-2 mb-4 text-xs text-gray-700">
                💡 {t('projectionsFormula')}: {formatCurrency(convertCurrency(comparison.walletStats.dailyAverage, user.currency), user.currency)}/{t('perDay')} × 7 = {formatCurrency(convertCurrency(comparison.weeklySavings, user.currency), user.currency)}/{t('perWeek')}
              </div>
            )}

            <div className="space-y-3">
              {              [
                { key: 'week', label: t('oneWeek'), icon: '📅', multiplier: 1 },
                { key: 'month', label: t('oneMonth'), icon: '📆', multiplier: 4.348 },
                { key: 'sixMonths', label: t('sixMonths'), icon: '📊', multiplier: 26.09 },
                { key: 'year', label: t('oneYear'), icon: '🎯', multiplier: 52.18 },
                { key: 'threeYears', label: t('threeYears'), icon: '🚀', multiplier: 156.54 },
                { key: 'fiveYears', label: t('fiveYears'), icon: '💎', multiplier: 260.89 },
              ].map((period, index) => (
                <motion.div
                  key={period.key}
                  className="bg-white from-white to-gray-50 border-0 p-4 elevation-2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.02, boxShadow: '8px 8px 0px rgba(0,0,0,0.3)' }}
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
                      <div className="text-2xl font-bold text-gray-900">
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
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Motivational message */}
          <motion.div 
            className="enough-panel bg-white relative overflow-hidden elevation-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="absolute top-0 right-0 text-8xl opacity-10 elevation-2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              🎉
            </motion.div>
            
            <div className="text-center relative z-10">
              <motion.div 
                className="text-5xl mb-3 elevation-2"
                animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">{t('amazingProgress')}</h3>
              <p className="text-gray-700">
                {t('keepSavingMessage')}
              </p>
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showPresetsEditor && (
        <PresetsEditor
          userId={user.id}
          presets={presets}
          currency={user.currency || 'USD'}
          onPresetsUpdated={(updatedPresets) => setPresets(updatedPresets)}
          onClose={() => setShowPresetsEditor(false)}
          t={t}
        />
      )}

      <Navigation />
    </div>
  );
}
