'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import BoomAnimation from '@/components/BoomAnimation';
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
  const [showBoom, setShowBoom] = useState(false);
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

  // Listen for storage changes to update user data
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
      console.log(`[Calendar] Loading entries for user ${userId}...`);
      const res = await fetch(`/api/entries/list?userId=${userId}&period=today`);
      const data = await res.json();
      if (res.ok) {
        console.log(`[Calendar] Loaded ${data.entries.length} entries, Total USD: ${data.totalUSD}`);
        if (data.entries.length > 0) {
          console.log(`[Calendar] Entries:`, data.entries.map((e: Entry) => ({ 
            name: e.name, 
            amount: e.pricePerUnit * e.quantity, 
            currency: e.currency,
            usdAmount: e.usdAmount,
            date: e.date
          })));
        }
        setEntries(data.entries);
      } else {
        console.error(`[Calendar] Failed to load entries:`, data);
      }
    } catch (error) {
      console.error('[Calendar] Failed to load entries:', error);
    }
  };

  // Update todayTotal whenever entries change
  useEffect(() => {
    if (!user) return;
    
    const todayTotalUSD = entries.reduce((sum, e) => sum + (e.usdAmount || 0), 0);
    const converted = convertCurrency(todayTotalUSD, user.currency || 'USD');
    setTodayTotal(converted);
    
    console.log(`[Calendar] Today total: ${todayTotalUSD.toFixed(2)} USD = ${formatCurrency(converted, user.currency)}`);
  }, [entries, user?.currency]);

  const handlePreset = (preset: UserPreset) => {
    setFormData({
      name: preset.name,
      pricePerUnit: preset.price.toString(),
      quantity: '1',
      category: preset.category,
      note: '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/entries/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
          pricePerUnit: parseFloat(formData.pricePerUnit),
          quantity: parseFloat(formData.quantity),
          currency: user.currency || 'USD',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(`[Calendar] Entry created successfully, reloading entries...`);
        
        // Show BOOM animation
        setShowBoom(true);
        
        toast.success(`+${data.pointsEarned.toFixed(1)} ${t('pointsEarned')} 🎉`);
        
        const updatedUser = { ...user, points: (Number(user.points) || 0) + data.pointsEarned };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Force reload entries
        await loadEntries(user.id);
        
        setShowForm(false);
        setFormData({ name: '', pricePerUnit: '', quantity: '1', category: 'other', note: '' });
      } else {
        toast.error(data.error || 'Failed to create entry');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  if (!user) return null;

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto">
      <BoomAnimation 
        show={showBoom} 
        onComplete={() => setShowBoom(false)}
        text="SAVED!"
        emoji="💰"
        type="pow"
      />

      <motion.div 
        className="comic-panel mb-6 relative overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: -30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-orange-300 rounded-full opacity-20"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <motion.h1 
          className="text-4xl font-bold mb-2 flex items-center gap-3 relative z-10"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
            📅
          </motion.span>
          {t('todaysRefusals')}
        </motion.h1>
        <p className="text-xl font-bold text-gray-700 relative z-10">{format(new Date(), 'MMMM d, yyyy')}</p>
        
        <motion.div 
          className="mt-4 bg-gradient-to-br from-comic-yellow via-comic-orange to-comic-pink rounded-2xl border-4 border-black p-6 text-center relative overflow-hidden"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          whileHover={{ scale: 1.02, y: -3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_3s_ease-in-out_infinite]" />
          <p className="text-sm font-black text-white relative z-10" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
            {t('savedToday')}
          </p>
          <motion.p 
            className="text-5xl font-black text-white relative z-10"
            style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.5)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {formatCurrency(todayTotal, user?.currency || 'USD')}
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div 
        className="comic-panel mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        <div className="flex justify-between items-center mb-4">
          <motion.h2 
            className="text-2xl font-bold flex items-center gap-2"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span 
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ⚡
            </motion.span>
            {t('quickAdd')}
          </motion.h2>
          <motion.button
            onClick={() => setShowPresetsEditor(true)}
            className="px-4 py-2 text-sm font-black rounded-xl border-4 border-black bg-white shadow-comic
              hover:shadow-comic-lg transition-all"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚙️ {t('customize')}
          </motion.button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {presets.map((preset, index) => {
            const presetTags = preset.tags || [];
            
            return (
              <motion.button
                key={preset.id}
                onClick={() => handlePreset(preset)}
                className="p-5 rounded-2xl font-black border-4 border-black shadow-comic
                  bg-gradient-to-br from-comic-cyan via-comic-blue to-comic-indigo text-white
                  relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.4 + index * 0.05, type: 'spring', stiffness: 200 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5, 
                  boxShadow: '10px 10px 0px #000',
                  rotate: 2
                }}
                whileTap={{ scale: 0.95, rotate: -2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_3s_ease-in-out_infinite]" />
                
                <motion.div 
                  className="text-5xl mb-2 relative z-10"
                  style={{ filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.5))' }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {preset.icon}
                </motion.div>
                <div className="font-black text-lg relative z-10" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>
                  {preset.name}
                </div>
                <div className="text-sm font-bold text-white/90 relative z-10">
                  {getCurrencySymbol(user?.currency || 'USD')}{preset.price}
                </div>
                
                {/* Show tags if any */}
                {presetTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {presetTags.slice(0, 2).map((tagId, tagIndex) => {
                      const tag = WHY_TAGS.find(t => t.id === tagId);
                      if (!tag) return null;
                      
                      return (
                        <div
                          key={tagId}
                          className={`px-2 py-0.5 rounded-full border-2 text-[10px] font-black ${tag.color} 
                            transition-all hover:scale-110 hover:rotate-3 animate-[popIn_0.3s_ease-out]`}
                          style={{ animationDelay: `${tagIndex * 0.1}s` }}
                          title={getWhyTagName(tagId, user?.language || 'en')}
                        >
                          {tag.icon}
                        </div>
                      );
                    })}
                    {presetTags.length > 2 && (
                      <div className="px-2 py-0.5 rounded-full border-2 text-[10px] font-black bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900 border-gray-600 
                        transition-all hover:scale-110 animate-[popIn_0.3s_ease-out]"
                        style={{ animationDelay: '0.2s' }}
                      >
                        +{presetTags.length - 2}
                      </div>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
        <motion.button
          onClick={() => setShowForm(true)}
          className="w-full mt-4 py-4 rounded-2xl font-black text-lg border-4 border-black shadow-comic-lg
            bg-gradient-to-br from-comic-lime via-comic-cyan to-comic-blue text-white
            hover:shadow-comic-xl hover:scale-102 hover:-translate-y-2
            relative overflow-hidden"
          style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_3s_ease-in-out_infinite]" />
          <span className="relative z-10">
            {t('customEntry')}
          </span>
        </motion.button>
      </motion.div>

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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="comic-panel max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{t('addRefusal')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={t('whatDidYouRefuse')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border-4 border-black rounded-xl"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder={t('price')}
                  value={formData.pricePerUnit}
                  onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                  required
                  className="flex-1 px-4 py-3 border-4 border-black rounded-xl"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder={t('quantity')}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-20 px-4 py-3 border-4 border-black rounded-xl"
                />
              </div>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border-4 border-black rounded-xl"
              >
                <option value="habits">{t('habits')}</option>
                <option value="food">{t('food')}</option>
                <option value="drinks">{t('drinks')}</option>
                <option value="entertainment">{t('entertainment')}</option>
                <option value="shopping">{t('shopping')}</option>
                <option value="other">{t('other')}</option>
              </select>
              <textarea
                placeholder={t('note')}
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-4 py-3 border-4 border-black rounded-xl"
                rows={2}
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 comic-button-lime">
                  💾 {t('save')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 comic-button-secondary"
                >
                  ❌ {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <motion.div 
        className="comic-panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <motion.h2 
          className="text-2xl font-bold mb-4"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {t('todaysEntries')}
        </motion.h2>
        {entries.length === 0 ? (
          <motion.div 
            className="text-center py-12 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💪
            </motion.div>
            <p className="text-xl font-bold text-gray-600">
              {t('noRefusalsYet')}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                className="bg-gradient-to-br from-comic-yellow via-comic-orange to-comic-pink rounded-2xl border-4 border-black p-4 
                  flex justify-between items-center shadow-comic relative overflow-hidden"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.02, boxShadow: '10px 10px 0px #000' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_4s_ease-in-out_infinite]" />
                
                <div className="relative z-10">
                  <div className="font-black text-xl text-white" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                    {entry.name}
                  </div>
                  <div className="text-sm font-bold text-white/90">
                    {entry.quantity}x @ {formatCurrency(entry.pricePerUnit, entry.currency)} • {entry.category}
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <motion.div 
                    className="font-black text-2xl text-white"
                    style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.5)' }}
                  >
                    {formatCurrency(entry.pricePerUnit * entry.quantity, entry.currency)}
                  </motion.div>
                  <div className="text-xs font-bold text-white/80">{format(new Date(entry.date), 'HH:mm')}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <Navigation />
    </div>
  );
}