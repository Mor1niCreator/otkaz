import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { checkTagAchievements } from '@/lib/tag-achievements';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Check which tag achievements should be unlocked
    const achievementCodes = await checkTagAchievements(userId);
    
    const newAchievements = [];

    for (const code of achievementCodes) {
      const achievement = await prisma.achievement.findUnique({ where: { code } });
      if (!achievement) continue;

      // Check if user already has this achievement
      const existing = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
      });

      // Grant if not already unlocked
      if (!existing) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });
        newAchievements.push({
          code: achievement.code,
          nameEn: achievement.nameEn,
          nameRu: achievement.nameRu,
          icon: achievement.icon,
        });
      }
    }

    return res.status(200).json({ 
      newAchievements,
      message: `${newAchievements.length} new achievements unlocked!`
    });
  } catch (error) {
    console.error('Check tag achievements error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
