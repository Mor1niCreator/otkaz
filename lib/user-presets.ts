// User customizable presets for quick entry buttons

export interface UserPreset {
  id: string;
  icon: string;
  name: string;
  price: number;
  category: string;
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
