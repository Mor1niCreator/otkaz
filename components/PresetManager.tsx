'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

interface Preset {
  id: string;
  name: string;
  icon: string;
  price: number;
  category: string;
}

interface PresetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (presets: Preset[]) => void;
  initialPresets: Preset[];
}

export default function PresetManager({ isOpen, onClose, onSave, initialPresets }: PresetManagerProps) {
  const [presets, setPresets] = useState<Preset[]>(initialPresets);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  
  // Get language from localStorage or default to 'en'
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{"language": "en"}') : { language: 'en' };
  const { t } = useTranslation(user.language || 'en');

  useEffect(() => {
    setPresets(initialPresets);
  }, [initialPresets]);

  const handleEdit = (preset: Preset) => {
    setEditingId(preset.id);
    setEditPrice(preset.price.toString());
  };

  const handleSaveEdit = (id: string) => {
    const newPrice = parseFloat(editPrice);
    if (isNaN(newPrice) || newPrice < 0) return;

    setPresets(prev => prev.map(p => 
      p.id === id ? { ...p, price: newPrice } : p
    ));
    setEditingId(null);
    setEditPrice('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditPrice('');
  };

  const handleSaveAll = () => {
    onSave(presets);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="comic-panel max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">⚙️ {t('editQuickButtons')}</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="bg-comic-yellow rounded-xl border-4 border-black p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{preset.icon}</div>
                <div>
                  <div className="font-bold text-lg">{preset.name}</div>
                  <div className="text-sm text-gray-700 capitalize">{preset.category}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {editingId === preset.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-20 px-2 py-1 border-2 border-black rounded text-center"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(preset.id)}
                      className="bg-comic-lime border-2 border-black rounded px-2 py-1 text-sm font-bold"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-red-400 border-2 border-black rounded px-2 py-1 text-sm font-bold"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">${preset.price}</span>
                    <button
                      onClick={() => handleEdit(preset)}
                      className="bg-comic-cyan border-2 border-black rounded px-2 py-1 text-sm font-bold"
                    >
                      {t('edit')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSaveAll}
            className="flex-1 comic-button"
          >
            {t('save')} {t('changes')}
          </button>
          <button
            onClick={onClose}
            className="flex-1 comic-button-secondary"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}