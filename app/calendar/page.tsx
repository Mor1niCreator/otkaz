'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import PresetsEditor from '@/components/PresetsEditor';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency, getCurrencySymbol, convertCurrency } from '@/lib/currency-utils';
import { getUserFromStorage } from '@/lib/user-sync';
import { getUserPresets, UserPreset, WHY_TAGS, getWhyTagName } from '@/lib/user-presets';

interface Entry {
  id: string;
  name: string;
  pricePerUnit: number;
  quantity: number;
  category: string;
  currency: string;
  usdAmount: number;
  date: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [presets, setPresets] = useState<UserPreset[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPresetsEditor, setShowPresetsEditor] = useState(false);
  const [todayTotal, setTodayTotal] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    pricePerUnit: '',
    quantity: '1',
    category: 'other',
    note: '',
  });
  
  const { t } = useTranslation(user?.language || 'en');

  useEffect(() => {
    const parsedUser = getUserFromStorage();
    if (!parsedUser) {
      router.push('/');
      return;
    }
    setUser(parsedUser);
    setPresets(getUserPresets(parsedUser.id));
    loadEntries(parsedUser.id);
  }, [router]);

  useEffect(() => {
    const handleStorageChange = () => {
      const parsedUser = getUserFromStorage();
      if (parsedUser) {
        setUser(parsedUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadEntries = async (userId: string) => {
    try {
      const res = await fetch(`/api/entries/list?userId=${userId}&period=today`);
      const data = await res.json();
      if (res.ok) {
        setEntries(data.entries);
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const todayTotalUSD = entries.reduce((sum, e) => sum + (e.usdAmount || 0), 0);
    setTodayTotal(todayTotalUSD);
  }, [entries, user]);

  const handleQuickAdd = async (preset: UserPreset) => {
    if (!user) return;
    
    try {
      const res = await fetch('/api/entries/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: preset.name,
          pricePerUnit: preset.price,
          quantity: 1,
          category: preset.category,
          currency: user.currency || 'USD',
        }),
      });

      if (res.ok) {
        toast.success(`${preset.icon} ${preset.name} added!`);
        loadEntries(user.id);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to add entry');
      }
    } catch (error) {
      toast.error('Failed to add entry');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch('/api/entries/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: formData.name,
          pricePerUnit: parseFloat(formData.pricePerUnit),
          quantity: parseInt(formData.quantity),
          category: formData.category,
          currency: user.currency || 'USD',
        }),
      });

      if (res.ok) {
        toast.success('Entry added!');
        setShowForm(false);
        setFormData({ name: '', pricePerUnit: '', quantity: '1', category: 'other', note: '' });
        loadEntries(user.id);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to add entry');
      }
    } catch (error) {
      toast.error('Failed to add entry');
    }
  };

  if (!user) return null;

  return (
    <div className="pb-24 px-4 py-6 max-w-4xl mx-auto" style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, color: '#212121' }}>
          {t('calendar')}
        </h1>
        <p className="text-gray-500 text-sm font-medium">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Today's Total */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6 text-center"
        style={{ background: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)', border: 'none' }}
      >
        <div className="text-sm font-semibold text-gray-900 mb-1">{t('savedToday')}</div>
        <div className="text-5xl font-black text-gray-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {getCurrencySymbol(user.currency)}{formatCurrency(todayTotal, user.currency)}
        </div>
      </motion.div>

      {/* Quick Add Presets */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">{t('quickAdd')}</h2>
          <button
            onClick={() => setShowPresetsEditor(true)}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t('customize')}
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleQuickAdd(preset)}
              className="card p-4 hover:shadow-yellow transition-all text-left group"
            >
              <div className="text-3xl mb-2">{preset.icon}</div>
              <div className="font-semibold text-gray-900 text-sm mb-1">{preset.name}</div>
              <div className="text-xs text-gray-500">{getCurrencySymbol(user.currency)}{preset.price}</div>
            </button>
          ))}
          
          <button
            onClick={() => setShowForm(true)}
            className="card p-4 hover:shadow-yellow transition-all flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-yellow-500"
          >
            <div className="text-center">
              <div className="text-4xl mb-1">+</div>
              <div className="text-xs font-semibold text-gray-600">{t('customEntryButton')}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Today's Entries */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t('todaysEntries')}</h2>
        
        {entries.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-gray-500 font-medium">{t('noRefusalsYet')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card p-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-gray-900">{entry.name}</div>
                  <div className="text-xs text-gray-500">
                    {entry.quantity}x {t(entry.category as any)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {getCurrencySymbol(user.currency)}{formatCurrency(entry.pricePerUnit * entry.quantity, user.currency)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(entry.date), 'HH:mm')}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Entry Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold mb-6">{t('customEntry')}</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">{t('entryName')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">{t('amount')}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.pricePerUnit}
                      onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">{t('quantity')}</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                    {t('cancel')}
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {t('add')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Presets Editor Modal */}
      {showPresetsEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <PresetsEditor
              userId={user.id}
              presets={presets}
              currency={user.currency || 'USD'}
              onPresetsUpdated={(updatedPresets) => setPresets(updatedPresets)}
              onClose={() => setShowPresetsEditor(false)}
              t={t as (key: string) => string}
            />
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
