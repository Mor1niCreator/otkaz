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
    
    if (isNaN(weeklyBeforeUSD) || weeklyBeforeUSD <= 0) {
      return res.status(400).json({ error: 'Invalid weeklyBefore value' });
    }

    // Get all user entries to calculate actual savings
    const entries = await prisma.entry.findMany({
      where: { userId: userId as string },
      select: { 
        usdAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    let weeklySavings = 0;
    let weeklyAfterUSD = weeklyBeforeUSD;
    
    if (entries.length > 0) {
      // Calculate total days since first entry
      const firstEntryDate = new Date(entries[0].createdAt);
      const now = new Date();
      const totalDays = Math.max(
        1,
        Math.ceil((now.getTime() - firstEntryDate.getTime()) / (1000 * 60 * 60 * 24))
      );
      
      // Total amount saved (all refusals)
      const totalSavings = entries.reduce((sum, entry) => sum + entry.usdAmount, 0);
      
      // Daily average savings
      const dailyAverageSavings = totalSavings / totalDays;
      
      // Weekly savings = daily average * 7
      weeklySavings = dailyAverageSavings * 7;
      
      // Weekly spending after = weekly before - weekly savings
      // This represents how much they spend now (less than before)
      weeklyAfterUSD = Math.max(0, weeklyBeforeUSD - weeklySavings);
      
      // Ensure savings don't exceed spending (cap at 95% to be realistic)
      const maxSavings = weeklyBeforeUSD * 0.95;
      if (weeklySavings > maxSavings) {
        weeklySavings = maxSavings;
        weeklyAfterUSD = weeklyBeforeUSD - weeklySavings;
      }
      
      console.log('Comparison calculation:', {
        totalDays,
        totalSavings,
        dailyAverageSavings,
        weeklyBeforeUSD,
        weeklySavings,
        weeklyAfterUSD,
      });
    } else {
      // If no entries yet, show potential savings of 30%
      weeklySavings = weeklyBeforeUSD * 0.3;
      weeklyAfterUSD = weeklyBeforeUSD * 0.7;
    }

    // Calculate savings percentage
    const savingsPercentage = (weeklySavings / weeklyBeforeUSD) * 100;

    // Calculate projections based on weekly savings
    const projections = {
      week: weeklySavings,
      month: weeklySavings * (365.25 / 12 / 7), // More accurate: 4.348 weeks per month
      sixMonths: weeklySavings * 26.09, // 365.25 / 2 / 7
      year: weeklySavings * 52.18, // 365.25 / 7
      threeYears: weeklySavings * 52.18 * 3,
      fiveYears: weeklySavings * 52.18 * 5,
    };

    return res.status(200).json({
      weeklyBefore: weeklyBeforeUSD,
      weeklyAfter: weeklyAfterUSD,
      weeklySavings,
      savingsPercentage,
      projections,
    });
  } catch (error) {
    console.error('Comparison stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
