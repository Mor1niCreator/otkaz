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

  let streak = 1;
  const today = startOfDay(new Date());

  for (let i = 0; i < entries.length - 1; i++) {
    const currentDay = startOfDay(entries[i].date);
    const nextDay = startOfDay(entries[i + 1].date);
    const diff = differenceInDays(currentDay, nextDay);

    if (diff === 1) {
      streak++;
    } else if (diff > 1) {
      break;
    }
  }

  return streak;
}