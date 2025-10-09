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

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: userId as string },
      include: { achievement: true },
    });

    const allAchievements = await prisma.achievement.findMany();

    return res.status(200).json({
      unlocked: userAchievements,
      all: allAchievements,
    });
  } catch (error) {
    console.error('List achievements error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}