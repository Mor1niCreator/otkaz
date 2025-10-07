'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Entry {
  id: string;
  name: string;
  pricePerUnit: number;
  quantity: number;
  category: string;
  usdAmount: number;
  date: string;
}

const PRESETS = [
  { name: 'Coffee', icon: '☕', price: 3, category: 'drinks' },
  { name: 'Cigarettes', icon: '🚬', price: 8, category: 'habits' },
  { name: 'Soda', icon: '🥤', price: 2, category: 'drinks' },
  { name: 'Fast Food', icon: '🍔', price: 12, category: 'food' },
];

export default function CalendarPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    pricePerUnit: '',
    quantity: '1',
    category: 'other',
    note: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadEntries(parsedUser.id);
  }, [router]);

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

  const handlePreset = (preset: typeof PRESETS[0]) => {
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
          currency: user.currency,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`+${data.pointsEarned.toFixed(1)} points! 🎉`);
        setShowForm(false);
        setFormData({ name: '', pricePerUnit: '', quantity: '1', category: 'other', note: '' });
        loadEntries(user.id);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  if (!user) return null;

  const todayTotal = entries.reduce((sum, e) => sum + e.usdAmount, 0);

  return (
    <div className="pb-24 px-4 py-6 max-w-screen-lg mx-auto">
      <div className="comic-panel mb-6">
        <h1 className="text-4xl font-bold mb-2">📅 Today's Refusals</h1>
        <p className="text-xl text-gray-700">{format(new Date(), 'MMMM d, yyyy')}</p>
        <div className="mt-4 bg-comic-yellow rounded-xl border-4 border-black p-4 text-center">
          <p className="text-sm text-gray-700">Saved Today</p>
          <p className="text-4xl font-bold">${todayTotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="comic-panel mb-6">
        <h2 className="text-2xl font-bold mb-4">⚡ Quick Add</h2>
        <div className="grid grid-cols-2 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="bg-comic-cyan border-4 border-black rounded-xl p-4 shadow-comic hover:shadow-comic-lg transition-all hover:-translate-y-1"
            >
              <div className="text-4xl mb-2">{preset.icon}</div>
              <div className="font-bold">{preset.name}</div>
              <div className="text-sm text-gray-700">${preset.price}</div>
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full mt-4 comic-button"
        >
          + Custom Entry
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="comic-panel max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add Refusal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="What did you refuse?"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border-4 border-black rounded-xl"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={formData.pricePerUnit}
                  onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                  required
                  className="flex-1 px-4 py-3 border-4 border-black rounded-xl"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Qty"
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
                <option value="habits">Habits 🔥 (+20% bonus)</option>
                <option value="food">Food 🍔</option>
                <option value="drinks">Drinks ☕</option>
                <option value="entertainment">Entertainment 🎮</option>
                <option value="shopping">Shopping 🛍️</option>
                <option value="other">Other 📦</option>
              </select>
              <textarea
                placeholder="Note (optional)"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-4 py-3 border-4 border-black rounded-xl"
                rows={2}
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 comic-button">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 comic-button-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="comic-panel">
        <h2 className="text-2xl font-bold mb-4">Today's Entries</h2>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No refusals yet today. Start saving! 💪
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-comic-yellow rounded-xl border-4 border-black p-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-lg">{entry.name}</div>
                  <div className="text-sm text-gray-700">
                    {entry.quantity}x @ ${entry.pricePerUnit.toFixed(2)} • {entry.category}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl">${entry.usdAmount.toFixed(2)}</div>
                  <div className="text-xs text-gray-600">{format(new Date(entry.date), 'HH:mm')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}