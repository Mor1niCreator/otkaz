import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Get user's achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: userId as string },
      include: {
        achievement: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get all available achievements
    const allAchievements = await prisma.achievement.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // Mark which achievements the user has
    const achievements = allAchievements.map(achievement => {
      const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
      return {
        ...achievement,
        isUnlocked: !!userAchievement,
        unlockedAt: userAchievement?.createdAt || null,
      };
    });

    return res.status(200).json({ achievements });
  } catch (error) {
    console.error('Achievements error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}