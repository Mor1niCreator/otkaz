import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { period = 'weekly', userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Получаем пользователей с их очками
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        points: true,
        rank: true,
        createdAt: true
      },
      orderBy: { points: 'desc' }
    });

    // Создаем лидерборд
    const leaderboard = users.map((user, index) => ({
      id: user.id,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        points: user.points,
        rank: user.rank
      },
      totalPoints: user.points,
      rank: index + 1,
      period
    }));

    // Находим ранг текущего пользователя
    const userRank = leaderboard.findIndex(entry => entry.user.id === userId) + 1;

    return res.status(200).json({
      leaderboard: leaderboard.slice(0, 50), // Топ 50
      userRank: userRank || null,
      totalUsers: users.length
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}