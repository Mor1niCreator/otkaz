import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, weeklyBefore } = req.query;

    if (!userId || !weeklyBefore) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const weeklyBeforeUSD = parseFloat(weeklyBefore as string);

    // Get all user entries to calculate actual weekly spending
    const entries = await prisma.entry.findMany({
      where: { userId: userId as string },
      select: { 
        usdAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate average weekly spending based on actual data
    let weeklyAfterUSD = 0;
    
    if (entries.length > 0) {
      const totalDays = Math.max(
        1,
        Math.ceil(
          (new Date().getTime() - new Date(entries[entries.length - 1].createdAt).getTime()) / 
          (1000 * 60 * 60 * 24)
        )
      );
      
      const totalSavings = entries.reduce((sum, entry) => sum + entry.usdAmount, 0);
      const dailyAverage = totalSavings / totalDays;
      
      // Weekly after = weekly before - (daily average saved * 7)
      weeklyAfterUSD = Math.max(0, weeklyBeforeUSD - (dailyAverage * 7));
    } else {
      // If no entries yet, assume they're saving 30% (optimistic estimate)
      weeklyAfterUSD = weeklyBeforeUSD * 0.7;
    }

    const weeklySavings = weeklyBeforeUSD - weeklyAfterUSD;

    // Calculate projections
    const projections = {
      week: weeklySavings,
      month: weeklySavings * 4.33, // Average weeks per month
      sixMonths: weeklySavings * 26,
      year: weeklySavings * 52,
      threeYears: weeklySavings * 52 * 3,
      fiveYears: weeklySavings * 52 * 5,
    };

    return res.status(200).json({
      weeklyBefore: weeklyBeforeUSD,
      weeklyAfter: weeklyAfterUSD,
      weeklySavings,
      projections,
    });
  } catch (error) {
    console.error('Comparison stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
