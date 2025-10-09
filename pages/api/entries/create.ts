import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { convertToUSD } from '@/lib/currency-service';
import { calculatePoints } from '@/lib/points-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, name, pricePerUnit, quantity, category, note, currency } = req.body;

    if (!userId || !name || !pricePerUnit || !category || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const totalAmount = pricePerUnit * (quantity || 1);
    const usdAmount = await convertToUSD(totalAmount, currency);

    console.log(`[API] Entry: ${name} - ${totalAmount} ${currency} = ${usdAmount.toFixed(2)} USD`);

    // Create entry
    const entry = await prisma.entry.create({
      data: {
        userId,
        name,
        pricePerUnit,
        quantity: quantity || 1,
        category,
        note,
        currency,
        usdRate: usdAmount / totalAmount,
        usdAmount,
      },
    });
    
    console.log(`[API] Entry created with ID: ${entry.id}, Date: ${entry.date.toISOString()}`);

    // Calculate and add points
    const points = await calculatePoints(usdAmount, category, userId);
    
    console.log(`[API] Points earned: ${points.toFixed(2)} (from ${usdAmount.toFixed(2)} USD)`);
    
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
    });

    // Check for achievements
    await checkAchievements(userId);

    return res.status(201).json({ entry, pointsEarned: points });
  } catch (error) {
    console.error('Create entry error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function checkAchievements(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { 
      entries: true,
      achievements: { include: { achievement: true } },
    },
  });

  if (!user) return;

  // Coffee Breaker
  const hasCoffee = user.entries.some(e => 
    e.name.toLowerCase().includes('coffee') || e.name.toLowerCase().includes('кофе')
  );
  if (hasCoffee) {
    await grantAchievement(userId, 'coffee_breaker');
  }

  // Budget Ninja - $40+
  if (user.points >= 40) {
    await grantAchievement(userId, 'budget_ninja');
  }

  // Check streak-based achievements
  const { getUserStreak } = await import('@/lib/points-service');
  const streak = await getUserStreak(userId);
  
  if (streak >= 21) await grantAchievement(userId, 'momentum');
  if (streak >= 30) await grantAchievement(userId, 'iron_will');
  if (streak >= 60) await grantAchievement(userId, 'consistency_king');
}

async function grantAchievement(userId: string, code: string) {
  const achievement = await prisma.achievement.findUnique({ where: { code } });
  if (!achievement) return;

  const existing = await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId: achievement.id,
      },
    },
  });

  if (!existing) {
    await prisma.userAchievement.create({
      data: {
        userId,
        achievementId: achievement.id,
      },
    });
  }
}