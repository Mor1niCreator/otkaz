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

    const goals = await prisma.goal.findMany({
      where: {
        userId: userId as string,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get user's total savings in USD
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      select: { points: true },
    });

    const totalSavings = user?.points || 0;

    return res.status(200).json({ goals, totalSavings });
  } catch (error) {
    console.error('List goals error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}