'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useTranslation } from '@/lib/i18n';
import { getUserFromStorage } from '@/lib/user-sync';
import { getUserPresets, WHY_TAGS, getWhyTagName, UserPreset } from '@/lib/user-presets';
import toast from 'react-hot-toast';

export default function WhyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [presets, setPresets] = useState<UserPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<UserPreset | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const { t } = useTranslation(user?.language || 'en');

  useEffect(() => {
    const parsedUser = getUserFromStorage();
    if (!parsedUser) {
      router.push('/');
      return;
    }
    setUser(parsedUser);
    setPresets(getUserPresets(parsedUser.id));
  }, [router]);

  const openTagModal = (preset: UserPreset) => {
    setSelectedPreset(preset);
    setSelectedTags(preset.tags || []);
  };

  const handleSaveTags = () => {
    if (!selectedPreset || !user) return;

    const updatedPresets = presets.map(p =>
      p.id === selectedPreset.id ? { ...p, tags: selectedTags } : p
    );

    localStorage.setItem(`userPresets_${user.id}`, JSON.stringify(updatedPresets));
    setPresets(updatedPresets);
    setSelectedPreset(null);
    toast.success('Tags saved!');
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  if (!user) return null;

  const tagStats = presets.reduce((acc, preset) => {
    preset.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topTags = Object.entries(tagStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="pb-24 px-4 py-6 max-w-4xl mx-auto" style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ fontWeight: 900, color: '#212121' }}>
          💡 {t('why')}
        </h1>
        <p className="text-gray-500 text-sm font-medium">Understand your saving motivations</p>
      </div>

      {/* Top Reasons */}
      {topTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
          style={{ background: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)', border: 'none' }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t('yourTopReasons')}</h2>
          <div className="space-y-2">
            {topTags.map(([tagId, count], index) => (
              <div key={tagId} className="flex items-center justify-between">
                <span className="font-medium text-gray-900">
                  {getWhyTagName(tagId, user.language || 'en')}
                </span>
                <span className="badge-yellow">{count}x</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Presets with Tags */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Categories</h2>
        <div className="space-y-3">
          {presets.map((preset, index) => (
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{preset.icon}</span>
                  <div>
                    <div className="font-bold text-gray-900">{preset.name}</div>
                    <div className="text-sm text-gray-500">{t(preset.category as any)}</div>
                  </div>
                </div>
                <button
                  onClick={() => openTagModal(preset)}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  {preset.tags && preset.tags.length > 0 ? `${preset.tags.length} tags` : 'Add tags'}
                </button>
              </div>
              
              {preset.tags && preset.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {preset.tags.map(tagId => (
                    <span key={tagId} className="badge-gray">
                      {getWhyTagName(tagId, user.language || 'en')}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tag Selection Modal */}
      {selectedPreset && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Why tags for {selectedPreset.name}?</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-6">
              {WHY_TAGS.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    selectedTags.includes(tag.id)
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{tag.icon}</div>
                  <div className="text-xs font-semibold text-gray-900">
                    {user.language === 'ru' ? tag.nameRu : tag.nameEn}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPreset(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTags}
                className="btn-primary flex-1"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
