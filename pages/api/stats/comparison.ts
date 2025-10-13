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

    // Get all user entries from wallet to calculate ACTUAL savings
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
    let totalSavingsFromWallet = 0;
    let daysTracking = 0;
    let dailyAverageSavings = 0;
    let hasData = false;
    
    if (entries.length > 0) {
      hasData = true;
      
      // Calculate total days since first entry (how long user is tracking)
      const firstEntryDate = new Date(entries[0].createdAt);
      const now = new Date();
      daysTracking = Math.max(
        1,
        Math.ceil((now.getTime() - firstEntryDate.getTime()) / (1000 * 60 * 60 * 24))
      );
      
      // ACTUAL total amount saved from wallet (sum of all refusals)
      totalSavingsFromWallet = entries.reduce((sum, entry) => sum + entry.usdAmount, 0);
      
      // Daily average savings based on REAL data from wallet
      dailyAverageSavings = totalSavingsFromWallet / daysTracking;
      
      // Weekly savings = ACTUAL daily average * 7
      weeklySavings = dailyAverageSavings * 7;
      
      // Weekly spending AFTER = weekly before - weekly savings
      // This shows: "You used to spend X/week, now you save Y/week, so you spend (X-Y)/week"
      weeklyAfterUSD = Math.max(0, weeklyBeforeUSD - weeklySavings);
      
      // Ensure savings don't exceed spending (cap at 95% to be realistic)
      // User can't save more than they used to spend
      const maxSavings = weeklyBeforeUSD * 0.95;
      if (weeklySavings > maxSavings) {
        weeklySavings = maxSavings;
        weeklyAfterUSD = weeklyBeforeUSD - weeklySavings;
      }
      
      console.log('✅ Comparison with REAL wallet data:', {
        daysTracking,
        totalSavingsFromWallet,
        dailyAverageSavings: dailyAverageSavings.toFixed(2),
        weeklyBeforeUSD,
        weeklySavings: weeklySavings.toFixed(2),
        weeklyAfterUSD: weeklyAfterUSD.toFixed(2),
      });
    } else {
      // If no entries yet, show estimated potential savings (30%)
      weeklySavings = weeklyBeforeUSD * 0.3;
      weeklyAfterUSD = weeklyBeforeUSD * 0.7;
      
      console.log('⚠️ No wallet data yet, showing estimated savings');
    }

    // Calculate savings percentage
    const savingsPercentage = (weeklySavings / weeklyBeforeUSD) * 100;

    // Calculate projections based on ACTUAL weekly savings from wallet
    const projections = {
      week: weeklySavings,
      month: weeklySavings * (365.25 / 12 / 7), // 4.348 weeks per month
      sixMonths: weeklySavings * (365.25 / 2 / 7), // 26.09 weeks
      year: weeklySavings * (365.25 / 7), // 52.18 weeks
      threeYears: weeklySavings * (365.25 / 7) * 3,
      fiveYears: weeklySavings * (365.25 / 7) * 5,
    };

    return res.status(200).json({
      weeklyBefore: weeklyBeforeUSD,
      weeklyAfter: weeklyAfterUSD,
      weeklySavings,
      savingsPercentage,
      projections,
      // Additional wallet statistics
      walletStats: {
        totalSaved: totalSavingsFromWallet,
        daysTracking,
        dailyAverage: dailyAverageSavings,
        entriesCount: entries.length,
        hasData,
      },
    });
  } catch (error) {
    console.error('Comparison stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
