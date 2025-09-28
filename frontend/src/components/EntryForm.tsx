import React, { useState } from 'react';
import { Calendar, Plus, X } from 'lucide-react';
import { useI18nStrict } from '../hooks/useI18nStrict';
import { ComicPanel } from './ComicPanel';
import { clsx } from 'clsx';

interface EntryFormProps {
  onSubmit: (data: EntryFormData) => void;
  onCancel: () => void;
  initialData?: Partial<EntryFormData>;
  presets?: Preset[];
}

export interface EntryFormData {
  title: string;
  unit_price: number;
  quantity: number;
  currency: string;
  category: string;
  note?: string;
  entry_date: string;
}

export interface Preset {
  id: number;
  title: string;
  unit_price: number;
  currency: string;
  category: string;
  icon?: string;
}

const CATEGORIES = [
  { value: 'food', label: 'categories.food', icon: '🍔' },
  { value: 'drinks', label: 'categories.drinks', icon: '🥤' },
  { value: 'habits', label: 'categories.habits', icon: '🚬' },
  { value: 'entertainment', label: 'categories.entertainment', icon: '🎬' },
  { value: 'transport', label: 'categories.transport', icon: '🚗' },
  { value: 'shopping', label: 'categories.shopping', icon: '🛍️' },
  { value: 'other', label: 'categories.other', icon: '📦' }
];

export function EntryForm({ onSubmit, onCancel, initialData, presets = [] }: EntryFormProps) {
  const { t } = useI18nStrict();
  const [formData, setFormData] = useState<EntryFormData>({
    title: '',
    unit_price: 0,
    quantity: 1,
    currency: 'VND',
    category: 'food',
    note: '',
    entry_date: new Date().toISOString().split('T')[0],
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.unit_price > 0) {
      onSubmit(formData);
    }
  };

  const handlePresetClick = (preset: Preset) => {
    setFormData(prev => ({
      ...prev,
      title: preset.title,
      unit_price: preset.unit_price,
      currency: preset.currency,
      category: preset.category
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <ComicPanel className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {initialData ? t('entry.edit') : t('entry.add')}
          </h2>
          <button
            onClick={onCancel}
            className="btn btn-sm"
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        {presets.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">{t('presets.quick_add')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.slice(0, 4).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className="comic-card text-left p-2 hover:bg-green-50"
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{preset.icon || '📦'}</span>
                    <div>
                      <div className="font-medium text-sm">{preset.title}</div>
                      <div className="text-xs text-muted">
                        {preset.unit_price} {preset.currency}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">{t('entry.title')}</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={t('entry.placeholder_title')}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">{t('entry.unit_price')}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                value={formData.unit_price}
                onChange={(e) => setFormData(prev => ({ ...prev, unit_price: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('entry.quantity')}</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('entry.category')}</label>
            <select
              className="form-input form-select"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {t(cat.label)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('entry.date')}</label>
            <div className="relative">
              <input
                type="date"
                className="form-input pl-10"
                value={formData.entry_date}
                onChange={(e) => setFormData(prev => ({ ...prev, entry_date: e.target.value }))}
                required
              />
              <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('entry.note')}</label>
            <textarea
              className="form-input"
              rows={3}
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              placeholder={t('entry.placeholder_note')}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="btn"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Plus size={16} />
              {initialData ? t('common.save') : t('entry.add')}
            </button>
          </div>
        </form>
      </ComicPanel>
    </div>
  );
}