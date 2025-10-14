'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n';
import { getUserFromStorage } from '@/lib/user-sync';
import { getUserPresets, saveUserPresets, UserPreset, WHY_TAGS, getWhyTagName } from '@/lib/user-presets';

export default function WhyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [presets, setPresets] = useState<UserPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<UserPreset | null>(null);
  const [showTagModal, setShowTagModal] = useState(false);
  
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

  const toggleTag = (presetId: string, tagId: string) => {
    const updatedPresets = presets.map(preset => {
      if (preset.id === presetId) {
        const currentTags = preset.tags || [];
        const hasTag = currentTags.includes(tagId);
        
        return {
          ...preset,
          tags: hasTag 
            ? currentTags.filter(t => t !== tagId)
            : [...currentTags, tagId]
        };
      }
      return preset;
    });
    
    setPresets(updatedPresets);
    saveUserPresets(user.id, updatedPresets);
    
    // Update selected preset if it's the one being modified
    if (selectedPreset && selectedPreset.id === presetId) {
      const updated = updatedPresets.find(p => p.id === presetId);
      if (updated) setSelectedPreset(updated);
    }
  };

  const openTagModal = (preset: UserPreset) => {
    setSelectedPreset(preset);
    setShowTagModal(true);
  };

  const getPresetTags = (preset: UserPreset) => {
    return preset.tags || [];
  };

  if (!user) return null;

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto">
      <div className="comic-panel mb-6">
        <h1 className="text-4xl font-bold mb-2">🤔 {t('whyTitle')}</h1>
        <p className="text-gray-700">{t('whyDescription')}</p>
      </div>

      <div className="comic-panel mb-6 bg-comic-cyan">
        <h3 className="font-bold mb-2">💡 {t('tip')}</h3>
        <p className="text-sm text-gray-700">
          {t('whyTip')}
        </p>
      </div>

      <div className="space-y-4">
        {presets.map((preset) => {
          const tags = getPresetTags(preset);
          
          return (
            <div
              key={preset.id}
              className="comic-panel bg-white hover:shadow-comic-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{preset.icon}</span>
                  <div>
                    <h3 className="font-bold text-xl">{preset.name}</h3>
                    <p className="text-sm text-gray-600">{t(preset.category)}</p>
                  </div>
                </div>
                <button
                  onClick={() => openTagModal(preset)}
                  className="comic-button-secondary px-4 py-2 text-sm"
                >
                  {tags.length > 0 ? `✏️ ${t('edit')}` : `➕ ${t('addTags')}`}
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map(tagId => {
                    const tag = WHY_TAGS.find(t => t.id === tagId);
                    if (!tag) return null;
                    
                    return (
                      <div
                        key={tagId}
                        className={`px-3 py-1 rounded-full border-2 text-sm font-bold flex items-center gap-1 ${tag.color}`}
                      >
                        <span>{tag.icon}</span>
                        <span>{getWhyTagName(tagId, user.language)}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {tags.length === 0 && (
                <div className="text-center py-2 text-gray-500 text-sm">
                  {t('noTagsYet')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tag Selection Modal */}
      {showTagModal && selectedPreset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="comic-panel max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedPreset.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold">{selectedPreset.name}</h2>
                  <p className="text-sm text-gray-600">{t('selectWhyTags')}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowTagModal(false);
                  setSelectedPreset(null);
                }}
                className="text-3xl hover:scale-110 transition-transform"
              >
                ✖️
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WHY_TAGS.map(tag => {
                const isSelected = (selectedPreset.tags || []).includes(tag.id);
                
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(selectedPreset.id, tag.id)}
                    className={`p-4 rounded-xl border-4 transition-all text-left ${
                      isSelected
                        ? `${tag.color} border-black shadow-comic`
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{tag.icon}</span>
                      <span className="font-bold">
                        {user.language === 'ru' ? tag.nameRu : tag.nameEn}
                      </span>
                      {isSelected && <span className="ml-auto text-xl">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  setShowTagModal(false);
                  setSelectedPreset(null);
                  toast.success(t('tagsSaved') + ' ✅');
                }}
                className="flex-1 comic-button-lime py-3"
              >
                💾 {t('done')}
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
