'use client';

import { useState } from 'react';
import { UserPreset, updateUserPreset, resetUserPresets, PRESET_EMOJI_OPTIONS } from '@/lib/user-presets';
import { formatCurrency } from '@/lib/currency-utils';
import toast from 'react-hot-toast';

interface PresetsEditorProps {
  userId: string;
  presets: UserPreset[];
  currency: string;
  onPresetsUpdated: (presets: UserPreset[]) => void;
  onClose: () => void;
  t: (key: string) => string;
}

export default function PresetsEditor({
  userId,
  presets,
  currency,
  onPresetsUpdated,
  onClose,
  t,
}: PresetsEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ icon: '', name: '', price: '' });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEdit = (preset: UserPreset) => {
    setEditingId(preset.id);
    setEditForm({
      icon: preset.icon,
      name: preset.name,
      price: preset.price.toString(),
    });
    setShowEmojiPicker(false);
  };

  const handleSave = (presetId: string) => {
    if (!editForm.name || !editForm.price || parseFloat(editForm.price) <= 0) {
      toast.error(t('fillAllFields'));
      return;
    }

    const updatedPresets = updateUserPreset(userId, presetId, {
      icon: editForm.icon || '💰',
      name: editForm.name,
      price: parseFloat(editForm.price),
    });

    onPresetsUpdated(updatedPresets);
    setEditingId(null);
    toast.success(t('presetUpdated'));
  };

  const handleReset = () => {
    if (confirm(t('confirmResetPresets'))) {
      const defaultPresets = resetUserPresets(userId);
      onPresetsUpdated(defaultPresets);
      toast.success(t('presetsReset'));
    }
  };

  const selectEmoji = (emoji: string) => {
    setEditForm({ ...editForm, icon: emoji });
    setShowEmojiPicker(false);
  };

  return (
    <div className="fixed inset-0 enough-modal-overlay flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="enough-modal max-w-2xl w-full my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold uppercase">⚙️ {t('customizePresets')}</h2>
          <button
            onClick={onClose}
            className="text-3xl hover:text-red-500 font-bold"
          >
            ×
          </button>
        </div>

        <p className="text-sm text-gray-700 mb-4 font-bold">
          {t('customizePresetsDescription')}
        </p>

        <div className="space-y-3 mb-4 max-h-[60vh] overflow-y-auto">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="bg-white border border-gray-200 p-3"
              style={{ boxShadow: '0 2px 0px #000' }}
            >
              {editingId === preset.id ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {/* Emoji picker */}
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="text-3xl border border-gray-200 px-3 py-2 hover:bg-white transition-colors"
                    >
                      {editForm.icon || '💰'}
                    </button>

                    {/* Name input */}
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder={t('presetName')}
                      className="flex-1 px-3 py-2"
                    />

                    {/* Price input */}
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      placeholder={t('price')}
                      className="w-24 px-3 py-2"
                    />
                  </div>

                  {/* Emoji picker grid */}
                  {showEmojiPicker && (
                    <div className="bg-white border-2 border-gray-200 p-2 grid grid-cols-8 gap-1 max-h-40 overflow-y-auto">
                      {PRESET_EMOJI_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => selectEmoji(emoji)}
                          className="text-2xl hover:bg-white transition-colors p-1"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(preset.id)}
                      className="flex-1 enough-button-primary py-2 text-sm"
                    >
                      {t('save')}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setShowEmojiPicker(false);
                      }}
                      className="flex-1 enough-button-secondary py-2 text-sm"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{preset.icon}</span>
                    <div>
                      <div className="font-semibold uppercase tracking-wide">{preset.name}</div>
                      <div className="text-sm font-bold text-gray-700">
                        {formatCurrency(preset.price, currency)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(preset)}
                    className="enough-button-secondary px-4 py-2 text-sm"
                  >
                    ✏️ {t('edit')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 enough-button-secondary py-3"
          >
            🔄 {t('resetToDefaults')}
          </button>
          <button
            onClick={onClose}
            className="flex-1 enough-button-primary py-3"
          >
            ✅ {t('done')}
          </button>
        </div>
      </div>
    </div>
  );
}
