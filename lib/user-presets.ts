// User customizable presets for quick entry buttons

export interface UserPreset {
  id: string;
  icon: string;
  name: string;
  price: number;
  category: string;
  tags?: string[]; // Why tags: harmful, expensive, useless, etc.
}

const DEFAULT_PRESETS: UserPreset[] = [
  { id: '1', icon: '☕', name: 'Coffee', price: 5, category: 'drinks' },
  { id: '2', icon: '🚬', name: 'Cigarettes', price: 10, category: 'habits' },
  { id: '3', icon: '🍔', name: 'Fast Food', price: 15, category: 'food' },
  { id: '4', icon: '🍺', name: 'Alcohol', price: 20, category: 'drinks' },
  { id: '5', icon: '🍿', name: 'Snacks', price: 8, category: 'food' },
  { id: '6', icon: '🚕', name: 'Taxi/Uber', price: 25, category: 'other' },
  { id: '7', icon: '🛍️', name: 'Shopping', price: 50, category: 'shopping' },
  { id: '8', icon: '📺', name: 'Streaming', price: 15, category: 'entertainment' },
];

export function getUserPresets(userId: string): UserPreset[] {
  if (typeof window === 'undefined') return DEFAULT_PRESETS;
  
  try {
    const saved = localStorage.getItem(`userPresets_${userId}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load user presets:', error);
  }
  
  return DEFAULT_PRESETS;
}

export function saveUserPresets(userId: string, presets: UserPreset[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`userPresets_${userId}`, JSON.stringify(presets));
  } catch (error) {
    console.error('Failed to save user presets:', error);
  }
}

export function updateUserPreset(
  userId: string,
  presetId: string,
  updates: Partial<UserPreset>
): UserPreset[] {
  const presets = getUserPresets(userId);
  const updatedPresets = presets.map(preset =>
    preset.id === presetId ? { ...preset, ...updates } : preset
  );
  saveUserPresets(userId, updatedPresets);
  return updatedPresets;
}

export function resetUserPresets(userId: string): UserPreset[] {
  saveUserPresets(userId, DEFAULT_PRESETS);
  return DEFAULT_PRESETS;
}

// Common emoji options for presets
export const PRESET_EMOJI_OPTIONS = [
  '☕', '🚬', '🍔', '🍺', '🍿', '🚕', '🛍️', '📺',
  '🥤', '🍕', '🍩', '🍰', '🍦', '🌭', '🥓', '🥪',
  '🎮', '🎬', '🎵', '📱', '💻', '⚽', '🏋️', '🚗',
  '✈️', '🏠', '💊', '💇', '🎓', '📚', '🎨', '🎸',
];

// Available tags for why you refuse something
export interface WhyTag {
  id: string;
  nameEn: string;
  nameRu: string;
  color: string;
  icon: string;
}

export const WHY_TAGS: WhyTag[] = [
  { id: 'harmful', nameEn: 'Harmful', nameRu: 'Вредно', color: 'bg-red-200 text-red-800 border-red-400', icon: '☠️' },
  { id: 'expensive', nameEn: 'Expensive', nameRu: 'Дорого', color: 'bg-orange-200 text-orange-800 border-orange-400', icon: '💸' },
  { id: 'useless', nameEn: 'Useless', nameRu: 'Бесполезно', color: 'bg-gray-200 text-gray-800 border-gray-400', icon: '🗑️' },
  { id: 'unhealthy', nameEn: 'Unhealthy', nameRu: 'Нездорово', color: 'bg-yellow-200 text-yellow-800 border-yellow-400', icon: '⚠️' },
  { id: 'addictive', nameEn: 'Addictive', nameRu: 'Вызывает зависимость', color: 'bg-purple-200 text-purple-800 border-purple-400', icon: '🔗' },
  { id: 'wasteful', nameEn: 'Wasteful', nameRu: 'Расточительно', color: 'bg-pink-200 text-pink-800 border-pink-400', icon: '💰' },
  { id: 'badHabit', nameEn: 'Bad Habit', nameRu: 'Плохая привычка', color: 'bg-indigo-200 text-indigo-800 border-indigo-400', icon: '🚫' },
  { id: 'timeWasting', nameEn: 'Time Wasting', nameRu: 'Трата времени', color: 'bg-blue-200 text-blue-800 border-blue-400', icon: '⏰' },
  { id: 'unnecessary', nameEn: 'Unnecessary', nameRu: 'Не нужно', color: 'bg-green-200 text-green-800 border-green-400', icon: '🚮' },
  { id: 'impulsive', nameEn: 'Impulsive Buy', nameRu: 'Импульсивная покупка', color: 'bg-rose-200 text-rose-800 border-rose-400', icon: '⚡' },
];

export function getWhyTagById(id: string): WhyTag | undefined {
  return WHY_TAGS.find(tag => tag.id === id);
}

export function getWhyTagName(id: string, language: 'en' | 'ru'): string {
  const tag = getWhyTagById(id);
  if (!tag) return id;
  return language === 'ru' ? tag.nameRu : tag.nameEn;
}
