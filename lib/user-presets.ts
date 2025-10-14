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
  { 
    id: 'harmful', 
    nameEn: 'Harmful', 
    nameRu: 'Вредно', 
    color: 'bg-gradient-to-br from-red-300 to-red-400 text-red-900 border-red-600', 
    icon: '☠️' 
  },
  { 
    id: 'expensive', 
    nameEn: 'Expensive', 
    nameRu: 'Дорого', 
    color: 'bg-gradient-to-br from-orange-300 to-orange-400 text-orange-900 border-orange-600', 
    icon: '💸' 
  },
  { 
    id: 'useless', 
    nameEn: 'Useless', 
    nameRu: 'Бесполезно', 
    color: 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900 border-gray-600', 
    icon: '🗑️' 
  },
  { 
    id: 'unhealthy', 
    nameEn: 'Unhealthy', 
    nameRu: 'Нездорово', 
    color: 'bg-gradient-to-br from-yellow-300 to-yellow-400 text-yellow-900 border-yellow-600', 
    icon: '⚠️' 
  },
  { 
    id: 'addictive', 
    nameEn: 'Addictive', 
    nameRu: 'Вызывает зависимость', 
    color: 'bg-gradient-to-br from-purple-300 to-purple-400 text-purple-900 border-purple-600', 
    icon: '🔗' 
  },
  { 
    id: 'wasteful', 
    nameEn: 'Wasteful', 
    nameRu: 'Расточительно', 
    color: 'bg-gradient-to-br from-pink-300 to-pink-400 text-pink-900 border-pink-600', 
    icon: '💰' 
  },
  { 
    id: 'badHabit', 
    nameEn: 'Bad Habit', 
    nameRu: 'Плохая привычка', 
    color: 'bg-gradient-to-br from-indigo-300 to-indigo-400 text-indigo-900 border-indigo-600', 
    icon: '🚫' 
  },
  { 
    id: 'timeWasting', 
    nameEn: 'Time Wasting', 
    nameRu: 'Трата времени', 
    color: 'bg-gradient-to-br from-blue-300 to-blue-400 text-blue-900 border-blue-600', 
    icon: '⏰' 
  },
  { 
    id: 'unnecessary', 
    nameEn: 'Unnecessary', 
    nameRu: 'Не нужно', 
    color: 'bg-gradient-to-br from-green-300 to-green-400 text-green-900 border-green-600', 
    icon: '🚮' 
  },
  { 
    id: 'impulsive', 
    nameEn: 'Impulsive Buy', 
    nameRu: 'Импульсивная покупка', 
    color: 'bg-gradient-to-br from-rose-300 to-rose-400 text-rose-900 border-rose-600', 
    icon: '⚡' 
  },
];

export function getWhyTagById(id: string): WhyTag | undefined {
  return WHY_TAGS.find(tag => tag.id === id);
}

export function getWhyTagName(id: string, language: 'en' | 'ru'): string {
  const tag = getWhyTagById(id);
  if (!tag) return id;
  return language === 'ru' ? tag.nameRu : tag.nameEn;
}
