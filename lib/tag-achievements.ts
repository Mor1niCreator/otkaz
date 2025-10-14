import { getUserPresets } from './user-presets';

export interface TagAchievementCheck {
  code: string;
  condition: (userId: string) => boolean;
}

export const TAG_ACHIEVEMENTS: TagAchievementCheck[] = [
  {
    code: 'reason_seeker',
    condition: (userId: string) => {
      const presets = getUserPresets(userId);
      const totalTags = presets.reduce((sum, p) => sum + (p.tags?.length || 0), 0);
      return totalTags >= 1;
    }
  },
  {
    code: 'self_aware',
    condition: (userId: string) => {
      const presets = getUserPresets(userId);
      const presetsWithTags = presets.filter(p => p.tags && p.tags.length > 0);
      return presetsWithTags.length >= 5;
    }
  },
  {
    code: 'health_warrior',
    condition: (userId: string) => {
      const presets = getUserPresets(userId);
      let count = 0;
      presets.forEach(p => {
        if (p.tags?.some(t => t === 'harmful' || t === 'unhealthy')) {
          count++;
        }
      });
      return count >= 3;
    }
  },
  {
    code: 'money_master',
    condition: (userId: string) => {
      const presets = getUserPresets(userId);
      let count = 0;
      presets.forEach(p => {
        if (p.tags?.some(t => t === 'expensive' || t === 'wasteful')) {
          count++;
        }
      });
      return count >= 3;
    }
  },
  {
    code: 'habit_breaker',
    condition: (userId: string) => {
      const presets = getUserPresets(userId);
      let count = 0;
      presets.forEach(p => {
        if (p.tags?.some(t => t === 'badHabit' || t === 'addictive')) {
          count++;
        }
      });
      return count >= 3;
    }
  },
  {
    code: 'time_lord',
    condition: (userId: string) => {
      const presets = getUserPresets(userId);
      let count = 0;
      presets.forEach(p => {
        if (p.tags?.some(t => t === 'timeWasting')) {
          count++;
        }
      });
      return count >= 3;
    }
  },
  {
    code: 'minimalist',
    condition: (userId: string) => {
      const presets = getUserPresets(userId);
      let count = 0;
      presets.forEach(p => {
        if (p.tags?.some(t => t === 'unnecessary' || t === 'useless')) {
          count++;
        }
      });
      return count >= 3;
    }
  },
  {
    code: 'wisdom_keeper',
    condition: (userId: string) => {
      const presets = getUserPresets(userId);
      const totalTags = presets.reduce((sum, p) => sum + (p.tags?.length || 0), 0);
      return totalTags >= 10;
    }
  },
];

export async function checkTagAchievements(userId: string): Promise<string[]> {
  const unlockedAchievements: string[] = [];
  
  for (const achievement of TAG_ACHIEVEMENTS) {
    try {
      if (achievement.condition(userId)) {
        unlockedAchievements.push(achievement.code);
      }
    } catch (error) {
      console.error(`Error checking achievement ${achievement.code}:`, error);
    }
  }
  
  return unlockedAchievements;
}
