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
      toast.error('Please fill all fields');
      return;
    }

    const updatedPresets = updateUserPreset(userId, presetId, {
      icon: editForm.icon || '💰',
      name: editForm.name,
      price: parseFloat(editForm.price),
    });

    onPresetsUpdated(updatedPresets);
    setEditingId(null);
    toast.success('Preset updated!');
  };

  const handleReset = () => {
    if (confirm('Reset all presets to defaults?')) {
      const defaultPresets = resetUserPresets(userId);
      onPresetsUpdated(defaultPresets);
      toast.success('Presets reset!');
    }
  };

  const selectEmoji = (emoji: string) => {
    setEditForm({ ...editForm, icon: emoji });
    setShowEmojiPicker(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customize Presets</h2>
        <button
          onClick={onClose}
          className="text-3xl text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Personalize your quick-add buttons with custom icons and prices
      </p>

      <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto">
        {presets.map((preset) => (
          <div key={preset.id} className="card">
            {editingId === preset.id ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-3xl border-2 border-gray-200 rounded-lg px-3 py-2 hover:border-yellow-500 transition-colors"
                  >
                    {editForm.icon || '💰'}
                  </button>

                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Name"
                    className="flex-1 input"
                  />

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    placeholder="Price"
                    className="w-24 input"
                  />
                </div>

                {showEmojiPicker && (
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 grid grid-cols-8 gap-1 max-h-40 overflow-y-auto">
                    {PRESET_EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => selectEmoji(emoji)}
                        className="text-2xl hover:bg-gray-200 rounded p-1 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={() => handleSave(preset.id)} className="flex-1 btn-primary py-2 text-sm">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setShowEmojiPicker(false);
                    }}
                    className="flex-1 btn-secondary py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{preset.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{preset.name}</div>
                    <div className="text-sm text-gray-500">{formatCurrency(preset.price, currency)}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(preset)}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={handleReset} className="flex-1 btn-secondary">
          Reset to Defaults
        </button>
        <button onClick={onClose} className="flex-1 btn-primary">
          Done
        </button>
      </div>
    </div>
  );
}
