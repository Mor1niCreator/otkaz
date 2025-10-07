export const RANKS = [
  { name: 'Novice Saver', nameRu: 'Новичок', minPoints: 0, color: '#9E9E9E' },
  { name: 'Habit Hacker', nameRu: 'Взломщик привычек', minPoints: 50, color: '#4CAF50' },
  { name: 'Frugal Master', nameRu: 'Мастер экономии', minPoints: 150, color: '#2196F3' },
  { name: 'Willpower Pro', nameRu: 'Профи силы воли', minPoints: 300, color: '#9C27B0' },
  { name: 'Discipline Legend', nameRu: 'Легенда дисциплины', minPoints: 500, color: '#FF9800' },
];

export function getRankForPoints(points: number): typeof RANKS[0] {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (points >= RANKS[i].minPoints) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}