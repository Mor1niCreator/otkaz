import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, period } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case 'today':
        dateFilter = {
          gte: startOfDay(now),
          lte: endOfDay(now),
        };
        break;
      case 'week':
        dateFilter = {
          gte: startOfWeek(now),
          lte: endOfWeek(now),
        };
        break;
      case 'month':
        dateFilter = {
          gte: startOfMonth(now),
          lte: endOfMonth(now),
        };
        break;
      default:
        // All time - no filter
        break;
    }

    const entries = await prisma.entry.findMany({
      where: {
        userId: userId as string,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
      orderBy: { date: 'desc' },
    });

    const totalUSD = entries.reduce((sum, entry) => sum + entry.usdAmount, 0);

    return res.status(200).json({ entries, totalUSD });
  } catch (error) {
    console.error('List entries error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}