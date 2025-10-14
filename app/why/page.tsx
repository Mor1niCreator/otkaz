'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ComicTag from '@/components/ComicTag';
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

  const toggleTag = async (presetId: string, tagId: string) => {
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
    
    // Check for tag-related achievements
    try {
      const res = await fetch('/api/achievements/check-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      
      const data = await res.json();
      if (res.ok && data.newAchievements?.length > 0) {
        data.newAchievements.forEach((achievement: any) => {
          toast.success(`🏅 Achievement Unlocked: ${user.language === 'ru' ? achievement.nameRu : achievement.nameEn}!`, {
            duration: 5000,
            icon: achievement.icon,
          });
        });
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
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
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto relative">
      <motion.div 
        className="comic-panel mb-6 relative overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {/* Animated background effect */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-300 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-300 rounded-full opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="relative z-10">
          <motion.h1 
            className="text-4xl font-bold mb-2 flex items-center gap-3"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🤔
            </motion.span>
            {t('whyTitle')}
          </motion.h1>
          <p className="text-gray-700">{t('whyDescription')}</p>
        </div>
      </motion.div>

      <motion.div 
        className="comic-panel mb-6 bg-gradient-to-r from-comic-cyan to-comic-lime relative overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="absolute top-0 right-0 text-6xl opacity-10"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          💡
        </motion.div>
        <h3 className="font-bold mb-2 flex items-center gap-2 relative z-10">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            💡
          </motion.span>
          {t('tip')}
        </h3>
        <p className="text-sm text-gray-700 relative z-10">
          {t('whyTip')}
        </p>
      </motion.div>

      <div className="space-y-4">
        {presets.map((preset, index) => {
          const tags = getPresetTags(preset);
          
          return (
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 150 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="comic-panel bg-white relative overflow-hidden"
            >
              {/* Decorative elements */}
              {tags.length > 0 && (
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
              )}
              
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="flex items-center gap-3">
                  <motion.span 
                    className="text-4xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {preset.icon}
                  </motion.span>
                  <div>
                    <h3 className="font-bold text-xl">{preset.name}</h3>
                    <p className="text-sm text-gray-600">{t(preset.category)}</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => openTagModal(preset)}
                  className="comic-button-secondary px-4 py-2 text-sm"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tags.length > 0 ? `✏️ ${t('edit')}` : `➕ ${t('addTags')}`}
                </motion.button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tagId, index) => {
                    const tag = WHY_TAGS.find(t => t.id === tagId);
                    if (!tag) return null;
                    
                    return (
                      <motion.div
                        key={tagId}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                      >
                        <ComicTag
                          icon={tag.icon}
                          name={getWhyTagName(tagId, user.language)}
                          color={tag.color}
                          size="sm"
                          animate={false}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {tags.length === 0 && (
                <div className="text-center py-2 text-gray-500 text-sm">
                  {t('noTagsYet')}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Tag Selection Modal */}
      {showTagModal && selectedPreset && (
        <div className="fixed inset-0 comic-modal-overlay flex items-center justify-center p-4 z-50">
          <motion.div 
            className="comic-modal max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 250 }}
          >
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
              {WHY_TAGS.map((tag, index) => {
                const isSelected = (selectedPreset.tags || []).includes(tag.id);
                
                return (
                  <motion.div
                    key={tag.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
                  >
                    <div onClick={() => toggleTag(selectedPreset.id, tag.id)}>
                      <ComicTag
                        icon={tag.icon}
                        name={user.language === 'ru' ? tag.nameRu : tag.nameEn}
                        color={isSelected ? tag.color : 'bg-white'}
                        size="lg"
                        isSelected={isSelected}
                        animate={true}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 flex gap-2">
              <motion.button
                onClick={async () => {
                  setShowTagModal(false);
                  setSelectedPreset(null);
                  toast.success(t('tagsSaved') + ' ✅');
                  
                  // Check for achievements after closing modal
                  try {
                    const res = await fetch('/api/achievements/check-tags', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId: user.id }),
                    });
                    
                    const data = await res.json();
                    if (res.ok && data.newAchievements?.length > 0) {
                      setTimeout(() => {
                        data.newAchievements.forEach((achievement: any, index: number) => {
                          setTimeout(() => {
                            toast.success(`🏅 ${user.language === 'ru' ? achievement.nameRu : achievement.nameEn}!`, {
                              duration: 5000,
                              icon: achievement.icon,
                            });
                          }, index * 1000);
                        });
                      }, 500);
                    }
                  } catch (error) {
                    console.error('Failed to check achievements:', error);
                  }
                }}
                className="flex-1 comic-button-lime py-3"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                💾 {t('done')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
