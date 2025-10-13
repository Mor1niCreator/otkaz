import { prisma } from './prisma';
import { startOfDay, differenceInDays } from 'date-fns';

export async function calculatePoints(
  usdAmount: number,
  category: string,
  userId: string
): Promise<number> {
  let points = usdAmount; // Base: 1 point = $1

  // Category bonus (+20% for habits)
  if (category === 'habits' || category === 'привычки') {
    points *= 1.2;
  }

  // Streak multiplier (up to 2x)
  const streak = await getUserStreak(userId);
  const streakMultiplier = Math.min(1 + streak / 100, 2);
  points *= streakMultiplier;

  return Math.round(points * 100) / 100;
}

export async function getUserStreak(userId: string): Promise<number> {
  const entries = await prisma.entry.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    select: { date: true },
  });

  if (entries.length === 0) return 0;

  const today = startOfDay(new Date());
  const firstEntryDate = startOfDay(entries[0].date);
  
  // If the most recent entry is not today, streak is 0
  if (differenceInDays(today, firstEntryDate) > 0) {
    return 0;
  }

  let streak = 1;
  const targetDate = startOfDay(entries[0].date);

  for (let i = 1; i < entries.length; i++) {
    const currentEntryDate = startOfDay(entries[i].date);
    const expectedDate = startOfDay(new Date(targetDate.getTime() - (i * 24 * 60 * 60 * 1000)));
    
    if (differenceInDays(currentEntryDate, expectedDate) === 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}