'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import PresetsEditor from '@/components/PresetsEditor';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency, convertCurrency } from '@/lib/currency-utils';
import { getUserFromStorage } from '@/lib/user-sync';
import { getUserPresets, UserPreset } from '@/lib/user-presets';

export default function ComparisonPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [presets, setPresets] = useState<UserPreset[]>([]);
  const [showPresetsEditor, setShowPresetsEditor] = useState(false);
  const [totalSavings, setTotalSavings] = useState(0);
  
  const { t } = useTranslation(user?.language || 'en');

  useEffect(() => {
    const parsedUser = getUserFromStorage();
    if (!parsedUser) {
      router.push('/');
      return;
    }
    setUser(parsedUser);
    setPresets(getUserPresets(parsedUser.id));
    loadStats(parsedUser.id, parsedUser.currency);
  }, [router]);

  const loadStats = async (userId: string, currency: string) => {
    try {
      const res = await fetch(`/api/entries/list?userId=${userId}&period=all`);
      const data = await res.json();
      if (res.ok) {
        setTotalSavings(convertCurrency(data.totalUSD || 0, currency));
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="pb-24 px-4 py-6 max-w-4xl mx-auto" style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ fontWeight: 900, color: '#212121' }}>
          📈 {t('comparison')}
        </h1>
        <p className="text-gray-500 text-sm font-medium">See what you could buy with your savings</p>
      </div>

      {/* Total Saved */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6 text-center"
        style={{ background: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)', border: 'none' }}
      >
        <div className="text-sm font-semibold text-gray-900 mb-1">Total Saved</div>
        <div className="text-5xl font-black text-gray-900">${totalSavings.toFixed(2)}</div>
      </motion.div>

      {/* Comparisons */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">You could buy...</h2>
        <div className="grid grid-cols-2 gap-4">
          {presets.slice(0, 6).map((preset, index) => {
            const quantity = Math.floor(totalSavings / preset.price);
            
            return (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="card text-center"
              >
                <div className="text-4xl mb-2">{preset.icon}</div>
                <div className="font-bold text-gray-900 text-2xl mb-1">{quantity}x</div>
                <div className="text-sm text-gray-500">{preset.name}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

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
